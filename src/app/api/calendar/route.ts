import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

// Takvim etkinlikleri
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const url = new URL(req.url);
    const startDate = url.searchParams.get("start");
    const endDate = url.searchParams.get("end");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Başlangıç ve bitiş tarihleri gereklidir" },
        { status: 400 }
      );
    }

    // Görevleri getir
    const tasks = await prisma.task.findMany({
      where: {
        dueDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        status: true,
      },
    });

    // Eğitimleri getir
    const trainings = await prisma.training.findMany({
      where: {
        startDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        status: true,
      },
    });

    // Denetimleri getir
    const audits = await prisma.audit.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        id: true,
        title: true,
        date: true,
        status: true,
      },
    });

    // Ekipman bakımlarını getir
    const equipment = await prisma.equipment.findMany({
      where: {
        nextMaintenanceDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        id: true,
        name: true,
        nextMaintenanceDate: true,
        status: true,
      },
    });

    // Tüm etkinlikleri birleştir ve formatla
    const events = [
      ...tasks.map(task => ({
        id: task.id,
        title: task.title,
        type: "TASK",
        date: task.dueDate.toISOString(),
        status: task.status,
        category: "task",
      })),
      ...trainings.map(training => ({
        id: training.id,
        title: training.title,
        type: "TRAINING",
        date: training.startDate.toISOString(),
        status: training.status,
        category: "training",
      })),
      ...audits.map(audit => ({
        id: audit.id,
        title: audit.title,
        type: "AUDIT",
        date: audit.date.toISOString(),
        status: audit.status,
        category: "audit",
      })),
      ...equipment.map(item => ({
        id: item.id,
        title: `${item.name} Bakımı`,
        type: "MAINTENANCE",
        date: item.nextMaintenanceDate ? item.nextMaintenanceDate.toISOString() : null,
        status: item.status,
        category: "equipment",
      })),
    ];

    return NextResponse.json(events);
  } catch (error) {
    console.error("Takvim etkinlikleri getirme hatası:", error);
    return NextResponse.json(
      { error: "Takvim etkinlikleri getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
