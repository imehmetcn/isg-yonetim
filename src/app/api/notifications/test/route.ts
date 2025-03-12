import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Örnek bildirimler oluştur
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          title: "Yeni Eğitim Planlandı",
          message: "İş Güvenliği Temel Eğitimi 1 Mart 2024 tarihinde başlayacak",
          type: "INFO",
          category: "TRAINING",
          link: "/trainings",
          userId: session.user.email,
        },
      }),
      prisma.notification.create({
        data: {
          title: "Ekipman Bakımı Gerekiyor",
          message: "Forklift bakım tarihi yaklaşıyor",
          type: "WARNING",
          category: "EQUIPMENT",
          link: "/equipment",
          userId: session.user.email,
        },
      }),
      prisma.notification.create({
        data: {
          title: "Yeni İş Kazası Bildirimi",
          message: "Depo alanında yeni bir iş kazası rapor edildi",
          type: "DANGER",
          category: "INCIDENT",
          link: "/incidents",
          userId: session.user.email,
        },
      }),
    ]);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Test bildirimleri oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Test bildirimleri oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
