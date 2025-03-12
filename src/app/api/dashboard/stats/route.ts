import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock data for dashboard stats
    const mockData = {
      tasks: 12,
      tasksChange: 3,
      risks: 8,
      risksChange: -2,
      documents: 45,
      documentsChange: 5,
      audits: 15,
      trainings: 6,
      equipment: 24,
      personnel: 8,
      personnelChange: 2,
      reports: 32,
      pendingTasks: [
        {
          id: "1",
          title: "Risk değerlendirmesi güncelleme",
          dueDate: "2024-03-25",
          priority: "high",
        },
        {
          id: "2",
          title: "Acil durum tatbikatı",
          dueDate: "2024-03-28",
          priority: "medium",
        },
        {
          id: "3",
          title: "İSG eğitimi planlaması",
          dueDate: "2024-03-30",
          priority: "low",
        },
      ],
      notifications: [
        {
          id: "1",
          title: "Risk değerlendirmesi tamamlandı",
          time: "2 saat önce",
          type: "success",
        },
        {
          id: "2",
          title: "Yaklaşan denetim hatırlatması",
          time: "3 saat önce",
          type: "warning",
        },
        {
          id: "3",
          title: "Yeni belge yüklendi",
          time: "5 saat önce",
          type: "info",
        },
      ],
      upcomingEvents: [
        {
          id: "1",
          title: "İSG Kurulu Toplantısı",
          date: "25 Mart 2024",
          company: "ABC Ltd.",
        },
        {
          id: "2",
          title: "Yangın Tatbikatı",
          date: "28 Mart 2024",
          company: "XYZ A.Ş.",
        },
        {
          id: "3",
          title: "Risk Değerlendirme Toplantısı",
          date: "30 Mart 2024",
          company: "ABC Ltd.",
        },
      ],
      monthlyStats: [
        { month: "Ekim", risks: 5, tasks: 8, audits: 3 },
        { month: "Kasım", risks: 7, tasks: 12, audits: 4 },
        { month: "Aralık", risks: 4, tasks: 10, audits: 2 },
        { month: "Ocak", risks: 6, tasks: 15, audits: 5 },
        { month: "Şubat", risks: 8, tasks: 11, audits: 3 },
        { month: "Mart", risks: 5, tasks: 13, audits: 4 },
      ],
      taskCompletion: {
        completed: 45,
        inProgress: 28,
        pending: 12,
      },
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "İstatistikler alınamadı" }, { status: 500 });
  }
}
