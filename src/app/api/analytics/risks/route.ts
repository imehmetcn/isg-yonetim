import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // URL'den zaman aralığını al
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "month";

    // Zaman aralığına göre başlangıç tarihini belirle
    const startDate = new Date();
    if (timeRange === "month") {
      startDate.setMonth(startDate.getMonth() - 6); // Son 6 ay
    } else if (timeRange === "quarter") {
      startDate.setMonth(startDate.getMonth() - 12); // Son 12 ay
    } else if (timeRange === "year") {
      startDate.setFullYear(startDate.getFullYear() - 3); // Son 3 yıl
    }

    // Risk değerlendirmelerini getir
    const riskAssessments = await prisma.riskAssessment.findMany({
      where: {
        assessorId: session.user.id,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Aylara göre grupla
    const months = [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ];
    const monthlyData: { [key: string]: number } = {};

    // Tüm ayları başlat
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[monthKey] = 0;
    }

    // Risk değerlendirmelerini aylara göre say
    riskAssessments.forEach(assessment => {
      const date = new Date(assessment.createdAt);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyData[monthKey] !== undefined) {
        monthlyData[monthKey]++;
      }
    });

    // Risk seviyelerine göre dağılım
    const riskLevels = await prisma.risk.groupBy({
      by: ["riskLevel"],
      where: {
        assessment: {
          assessorId: session.user.id,
        },
      },
      _count: {
        id: true,
      },
    });

    const riskLevelData = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    riskLevels.forEach(level => {
      if (level.riskLevel in riskLevelData) {
        riskLevelData[level.riskLevel as keyof typeof riskLevelData] = level._count.id;
      }
    });

    // Chart.js formatında veri döndür
    const labels = Object.keys(monthlyData).reverse();
    const data = Object.values(monthlyData).reverse();

    return NextResponse.json({
      labels,
      datasets: [
        {
          label: "Risk Değerlendirmeleri",
          data,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
      riskLevels: {
        labels: ["Düşük", "Orta", "Yüksek", "Kritik"],
        datasets: [
          {
            label: "Risk Seviyesi Dağılımı",
            data: [
              riskLevelData.LOW,
              riskLevelData.MEDIUM,
              riskLevelData.HIGH,
              riskLevelData.CRITICAL,
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.5)",
              "rgba(255, 206, 86, 0.5)",
              "rgba(255, 159, 64, 0.5)",
              "rgba(255, 99, 132, 0.5)",
            ],
          },
        ],
      },
    });
  } catch (error) {
    console.error("Risk analitik verisi getirme hatası:", error);
    return NextResponse.json(
      { error: "Risk analitik verisi getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
