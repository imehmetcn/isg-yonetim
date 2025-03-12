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

    // Olayları getir
    const incidents = await prisma.incident.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: "asc",
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

    // Olayları aylara göre say
    incidents.forEach(incident => {
      const date = new Date(incident.date);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyData[monthKey] !== undefined) {
        monthlyData[monthKey]++;
      }
    });

    // Olay şiddetlerine göre dağılım
    const incidentSeverities = await prisma.incident.groupBy({
      by: ["severity"],
      _count: {
        id: true,
      },
    });

    const severityData = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    incidentSeverities.forEach(severity => {
      if (severity.severity in severityData) {
        severityData[severity.severity as keyof typeof severityData] = severity._count.id;
      }
    });

    // Olay durumlarına göre dağılım
    const incidentStatuses = await prisma.incident.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const statusData = {
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    incidentStatuses.forEach(status => {
      if (status.status in statusData) {
        statusData[status.status as keyof typeof statusData] = status._count.id;
      }
    });

    // Chart.js formatında veri döndür
    return NextResponse.json({
      labels: ["Düşük", "Orta", "Yüksek", "Kritik"],
      datasets: [
        {
          label: "Olaylar",
          data: [severityData.LOW, severityData.MEDIUM, severityData.HIGH, severityData.CRITICAL],
          backgroundColor: [
            "rgba(75, 192, 192, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(255, 159, 64, 0.5)",
            "rgba(255, 99, 132, 0.5)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 99, 132, 1)",
          ],
          borderWidth: 1,
        },
      ],
      monthlyTrend: {
        labels: Object.keys(monthlyData).reverse(),
        datasets: [
          {
            label: "Aylık Olay Trendi",
            data: Object.values(monthlyData).reverse(),
            borderColor: "rgb(255, 159, 64)",
            backgroundColor: "rgba(255, 159, 64, 0.5)",
          },
        ],
      },
      statusDistribution: {
        labels: ["Beklemede", "İşlemde", "Tamamlandı", "İptal Edildi"],
        datasets: [
          {
            label: "Olay Durumu",
            data: [
              statusData.PENDING,
              statusData.IN_PROGRESS,
              statusData.COMPLETED,
              statusData.CANCELLED,
            ],
            backgroundColor: [
              "rgba(255, 206, 86, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(255, 99, 132, 0.5)",
            ],
          },
        ],
      },
    });
  } catch (error) {
    console.error("Olay analitik verisi getirme hatası:", error);
    return NextResponse.json(
      { error: "Olay analitik verisi getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
