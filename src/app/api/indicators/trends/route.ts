import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { indicators } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq, and, between, sql } from "drizzle-orm";

// Performans göstergeleri trend analizi
export async function GET(req: Request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // URL parametrelerini al
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const name = searchParams.get("name");
    const startYear = searchParams.get("startYear");
    const endYear = searchParams.get("endYear");
    const trendType = searchParams.get("trendType") || "monthly"; // monthly, quarterly, yearly

    // Gerekli parametreleri kontrol et
    if (!name && !category) {
      return NextResponse.json(
        { error: "Gösterge adı veya kategori belirtilmelidir" },
        { status: 400 }
      );
    }

    if (!startYear || !endYear) {
      return NextResponse.json(
        { error: "Başlangıç ve bitiş yılı belirtilmelidir" },
        { status: 400 }
      );
    }

    // Sorgu koşullarını hazırla
    const conditions = [];

    // İsim veya kategori filtresi
    if (name) {
      conditions.push(eq(indicators.name, name));
    }

    if (category) {
      conditions.push(eq(indicators.category, category));
    }

    // Tarih aralığı filtresi
    const startYearInt = parseInt(startYear);
    const endYearInt = parseInt(endYear);
    conditions.push(between(indicators.year, startYearInt, endYearInt));

    // Performans göstergelerini getir
    let indicatorList = [];
    if (conditions.length > 0) {
      indicatorList = await db.query.indicators.findMany({
        where: and(...conditions),
        orderBy: [
          sql`${indicators.year} ASC`,
          sql`${indicators.month} ASC`,
        ],
      });
    } else {
      indicatorList = await db.query.indicators.findMany({
        orderBy: [
          sql`${indicators.year} ASC`,
          sql`${indicators.month} ASC`,
        ],
      });
    }

    // Trend analizi için veri hazırla
    let trendData: any[] = [];
    const trendAnalysis: {
      overallTrend: string;
      averageChange: number;
      percentageChange: number;
      minValue: number;
      maxValue: number;
      dataPoints: any[];
    } = {
      overallTrend: "no_data",
      averageChange: 0,
      percentageChange: 0,
      minValue: 0,
      maxValue: 0,
      dataPoints: [],
    };

    if (indicatorList.length === 0) {
      return NextResponse.json({
        trendData: [],
        trendAnalysis: {
          overallTrend: "no_data",
          averageChange: 0,
          percentageChange: 0,
          minValue: 0,
          maxValue: 0,
          dataPoints: [],
        },
      });
    }

    if (trendType === "monthly") {
      // Aylık trend analizi
      trendData = indicatorList.map(indicator => ({
        period: `${indicator.year}-${indicator.month.toString().padStart(2, "0")}`,
        year: indicator.year,
        month: indicator.month,
        target: indicator.target,
        actual: indicator.actual,
        unit: indicator.unit,
        status: indicator.status,
        difference: indicator.actual - indicator.target,
        percentageOfTarget: (indicator.actual / indicator.target) * 100,
      }));
    } else if (trendType === "quarterly") {
      // Çeyreklik trend analizi
      const groupedByQuarter = indicatorList.reduce(
        (acc, indicator) => {
          const quarter = Math.ceil(indicator.month / 3);
          const period = `${indicator.year}-Q${quarter}`;

          if (!acc[period]) {
            acc[period] = {
              items: [],
              totalTarget: 0,
              totalActual: 0,
              count: 0,
            };
          }

          acc[period].items.push(indicator);
          acc[period].totalTarget += indicator.target;
          acc[period].totalActual += indicator.actual;
          acc[period].count += 1;

          return acc;
        },
        {} as Record<string, any>
      );

      trendData = Object.entries(groupedByQuarter).map(([period, data]) => {
        const avgTarget = data.totalTarget / data.count;
        const avgActual = data.totalActual / data.count;

        return {
          period,
          year: parseInt(period.split("-")[0]),
          quarter: parseInt(period.split("Q")[1]),
          target: avgTarget,
          actual: avgActual,
          unit: data.items[0]?.unit || "N/A",
          difference: avgActual - avgTarget,
          percentageOfTarget: (avgActual / avgTarget) * 100,
        };
      });
    } else {
      // Yıllık trend analizi
      const groupedByYear = indicatorList.reduce(
        (acc, indicator) => {
          const period = `${indicator.year}`;

          if (!acc[period]) {
            acc[period] = {
              items: [],
              totalTarget: 0,
              totalActual: 0,
              count: 0,
            };
          }

          acc[period].items.push(indicator);
          acc[period].totalTarget += indicator.target;
          acc[period].totalActual += indicator.actual;
          acc[period].count += 1;

          return acc;
        },
        {} as Record<string, any>
      );

      trendData = Object.entries(groupedByYear).map(([period, data]) => {
        const avgTarget = data.totalTarget / data.count;
        const avgActual = data.totalActual / data.count;

        return {
          period,
          year: parseInt(period),
          target: avgTarget,
          actual: avgActual,
          unit: data.items[0]?.unit || "N/A",
          difference: avgActual - avgTarget,
          percentageOfTarget: (avgActual / avgTarget) * 100,
        };
      });
    }

    // Trend analizi hesapla
    if (trendData.length > 0) {
      // Minimum ve maksimum değerleri bul
      const actualValues = trendData.map(item => item.actual);
      trendAnalysis.minValue = Math.min(...actualValues);
      trendAnalysis.maxValue = Math.max(...actualValues);

      // Değişim hesapla
      if (trendData.length > 1) {
        const firstValue = trendData[0].actual;
        const lastValue = trendData[trendData.length - 1].actual;

        // Toplam değişim
        const totalChange = lastValue - firstValue;
        trendAnalysis.percentageChange = (totalChange / firstValue) * 100;

        // Ortalama değişim
        let totalChanges = 0;
        for (let i = 1; i < trendData.length; i++) {
          totalChanges += trendData[i].actual - trendData[i - 1].actual;
        }
        trendAnalysis.averageChange = totalChanges / (trendData.length - 1);

        // Genel trend
        if (trendAnalysis.percentageChange > 5) {
          trendAnalysis.overallTrend = "improving";
        } else if (trendAnalysis.percentageChange < -5) {
          trendAnalysis.overallTrend = "declining";
        } else {
          trendAnalysis.overallTrend = "stable";
        }
      }

      trendAnalysis.dataPoints = trendData;
    }

    return NextResponse.json({
      trendData,
      trendAnalysis,
    });
  } catch (error) {
    console.error("Performans göstergeleri trend analizi hatası:", error);
    return NextResponse.json(
      { error: "Performans göstergeleri trend analizi yapılamadı" },
      { status: 500 }
    );
  }
}
