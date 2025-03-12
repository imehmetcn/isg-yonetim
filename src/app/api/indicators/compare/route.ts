import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { indicators } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq, and, or, between, sql } from "drizzle-orm";

// Performans göstergelerini karşılaştır
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
    const startMonth = searchParams.get("startMonth");
    const endYear = searchParams.get("endYear");
    const endMonth = searchParams.get("endMonth");
    const compareType = searchParams.get("compareType") || "monthly"; // monthly, quarterly, yearly

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

    if (compareType === "monthly" && startMonth && endMonth) {
      // Aylık karşılaştırma
      const startMonthInt = parseInt(startMonth);
      const endMonthInt = parseInt(endMonth);

      // Yıl ve ay kombinasyonlarını kontrol et
      if (startYearInt === endYearInt) {
        // Aynı yıl içinde
        conditions.push(
          and(
            eq(indicators.year, startYearInt),
            between(indicators.month, startMonthInt, endMonthInt)
          )
        );
      } else {
        // Farklı yıllar arasında
        conditions.push(
          or(
            and(eq(indicators.year, startYearInt), between(indicators.month, startMonthInt, 12)),
            and(eq(indicators.year, endYearInt), between(indicators.month, 1, endMonthInt)),
            and(between(indicators.year, startYearInt + 1, endYearInt - 1))
          )
        );
      }
    } else if (compareType === "quarterly") {
      // Çeyreklik karşılaştırma
      conditions.push(between(indicators.year, startYearInt, endYearInt));
    } else {
      // Yıllık karşılaştırma
      conditions.push(between(indicators.year, startYearInt, endYearInt));
    }

    // Performans göstergelerini getir
    const indicatorList = await db.query.indicators.findMany({
      where: and(...conditions),
      orderBy: [sql`${indicators.year} ASC`, sql`${indicators.month} ASC`],
      with: {
        createdByUser: true,
      },
    });

    // Sonuçları formatla
    let formattedResults = [];

    if (compareType === "monthly") {
      // Aylık karşılaştırma için sonuçları formatla
      formattedResults = indicatorList.map(indicator => ({
        ...indicator,
        period: `${indicator.year}-${indicator.month.toString().padStart(2, "0")}`,
      }));
    } else if (compareType === "quarterly") {
      // Çeyreklik karşılaştırma için sonuçları grupla
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

      formattedResults = Object.entries(groupedByQuarter).map(([period, data]) => ({
        period,
        category: category || data.items[0]?.category || "N/A",
        name: name || "Multiple",
        year: parseInt(period.split("-")[0]),
        quarter: parseInt(period.split("Q")[1]),
        target: data.totalTarget / data.count,
        actual: data.totalActual / data.count,
        unit: data.items[0]?.unit || "N/A",
        items: data.items,
      }));
    } else {
      // Yıllık karşılaştırma için sonuçları grupla
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

      formattedResults = Object.entries(groupedByYear).map(([period, data]) => ({
        period,
        category: category || data.items[0]?.category || "N/A",
        name: name || "Multiple",
        year: parseInt(period),
        target: data.totalTarget / data.count,
        actual: data.totalActual / data.count,
        unit: data.items[0]?.unit || "N/A",
        items: data.items,
      }));
    }

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error("Performans göstergeleri karşılaştırma hatası:", error);
    return NextResponse.json(
      { error: "Performans göstergeleri karşılaştırılamadı" },
      { status: 500 }
    );
  }
}
