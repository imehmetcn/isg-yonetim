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

    // Eğitimleri getir
    const trainings = await prisma.training.findMany({
      where: {
        instructorId: session.user.id,
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

    // Eğitimleri aylara göre say
    trainings.forEach(training => {
      const date = new Date(training.createdAt);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      if (monthlyData[monthKey] !== undefined) {
        monthlyData[monthKey]++;
      }
    });

    // Eğitim durumlarına göre dağılım
    const trainingStatuses = await prisma.training.groupBy({
      by: ["status"],
      where: {
        instructorId: session.user.id,
      },
      _count: {
        id: true,
      },
    });

    const statusData = {
      PLANNED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    trainingStatuses.forEach(status => {
      if (status.status in statusData) {
        statusData[status.status as keyof typeof statusData] = status._count.id;
      }
    });

    // Katılımcı sayılarını hesapla
    let totalAttendees = 0;
    let totalCapacity = 0;

    trainings.forEach(training => {
      try {
        // attendees alanı JSON string olarak saklanıyor olabilir
        if (typeof training.attendees === "string") {
          const attendeesData = JSON.parse(training.attendees);
          if (attendeesData.count) {
            totalAttendees += attendeesData.count;
          }
          if (attendeesData.capacity) {
            totalCapacity += attendeesData.capacity;
          }
        }
      } catch (e) {
        console.error("Katılımcı verisi parse hatası:", e);
      }
    });

    // Chart.js formatında veri döndür
    const labels = Object.keys(monthlyData).reverse();
    const data = Object.values(monthlyData).reverse();

    return NextResponse.json({
      labels,
      datasets: [
        {
          label: "Eğitimler",
          data,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      ],
      statusDistribution: {
        labels: ["Planlandı", "Devam Ediyor", "Tamamlandı", "İptal Edildi"],
        datasets: [
          {
            label: "Eğitim Durumu",
            data: [
              statusData.PLANNED,
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
      attendeeStats: {
        totalAttendees,
        totalCapacity,
        completionRate: totalCapacity > 0 ? Math.round((totalAttendees / totalCapacity) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Eğitim analitik verisi getirme hatası:", error);
    return NextResponse.json(
      { error: "Eğitim analitik verisi getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
