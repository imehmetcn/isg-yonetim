import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accidents } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

// Tip tanımlamaları
interface Personnel {
  id: string;
  name: string;
  [key: string]: any;
}

interface InvolvedPersonnel {
  id: string;
  personnel: Personnel;
  [key: string]: any;
}

interface User {
  id: string;
  name: string;
  [key: string]: any;
}

interface Accident {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  severity: string;
  status: string;
  department?: string | null;
  createdByUser?: User | null;
  involvedPersonnel?: InvolvedPersonnel[] | null;
  [key: string]: any;
}

// Kaza raporları oluştur
export async function GET(req: Request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // URL parametrelerini al
    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get("type") || "summary"; // summary, detailed, department, severity, trend
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const department = searchParams.get("department");
    const severity = searchParams.get("severity") as
      | "minor"
      | "moderate"
      | "major"
      | "fatal"
      | null;

    // Tarih aralığı kontrolü
    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Başlangıç ve bitiş tarihleri gerekli" }, { status: 400 });
    }

    // Tarih dönüşümleri
    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    // Sorgu koşullarını hazırla
    const conditions = [
      sql`${accidents.date} >= ${startTimestamp}`,
      sql`${accidents.date} <= ${endTimestamp}`,
    ];

    // Departman filtresi
    if (department) {
      conditions.push(eq(accidents.department, department));
    }

    // Şiddet filtresi
    if (severity) {
      conditions.push(eq(accidents.severity, severity));
    }

    // Tüm kazaları getir
    const allAccidents = await db.query.accidents.findMany({
      where: and(...conditions),
      with: {
        createdByUser: true,
        involvedPersonnel: {
          with: {
            personnel: true,
          },
        },
      },
    }) as unknown as Accident[];

    // Rapor tipine göre veri hazırla
    let reportData: any = {};

    if (reportType === "summary") {
      // Özet rapor
      reportData = {
        totalAccidents: allAccidents.length,
        byStatus: {
          open: allAccidents.filter(a => a.status === "open").length,
          inProgress: allAccidents.filter(a => a.status === "in-progress").length,
          closed: allAccidents.filter(a => a.status === "closed").length,
        },
        bySeverity: {
          minor: allAccidents.filter(a => a.severity === "minor").length,
          moderate: allAccidents.filter(a => a.severity === "moderate").length,
          major: allAccidents.filter(a => a.severity === "major").length,
          fatal: allAccidents.filter(a => a.severity === "fatal").length,
        },
      };
    } else if (reportType === "department") {
      // Departman bazlı rapor
      const departmentStats: Record<string, number> = {};
      allAccidents.forEach(accident => {
        const dept = accident.department || "Bilinmeyen";
        if (!departmentStats[dept]) {
          departmentStats[dept] = 0;
        }
        departmentStats[dept]++;
      });
      reportData = { byDepartment: departmentStats };
    } else if (reportType === "severity") {
      // Şiddet bazlı rapor
      const severityStats = {
        minor: {
          count: allAccidents.filter(a => a.severity === "minor").length,
          openCount: allAccidents.filter(a => a.severity === "minor" && a.status === "open").length,
          closedCount: allAccidents.filter(a => a.severity === "minor" && a.status === "closed").length,
        },
        moderate: {
          count: allAccidents.filter(a => a.severity === "moderate").length,
          openCount: allAccidents.filter(a => a.severity === "moderate" && a.status === "open").length,
          closedCount: allAccidents.filter(a => a.severity === "moderate" && a.status === "closed").length,
        },
        major: {
          count: allAccidents.filter(a => a.severity === "major").length,
          openCount: allAccidents.filter(a => a.severity === "major" && a.status === "open").length,
          closedCount: allAccidents.filter(a => a.severity === "major" && a.status === "closed").length,
        },
        fatal: {
          count: allAccidents.filter(a => a.severity === "fatal").length,
          openCount: allAccidents.filter(a => a.severity === "fatal" && a.status === "open").length,
          closedCount: allAccidents.filter(a => a.severity === "fatal" && a.status === "closed").length,
        },
      };
      reportData = { bySeverity: severityStats };
    } else if (reportType === "trend") {
      // Trend raporu
      const monthlyStats: Record<string, number> = {};
      allAccidents.forEach(accident => {
        const date = new Date(parseInt(accident.date) * 1000);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!monthlyStats[monthYear]) {
          monthlyStats[monthYear] = 0;
        }
        monthlyStats[monthYear]++;
      });
      reportData = { monthlyTrend: monthlyStats };
    } else if (reportType === "detailed") {
      // Detaylı rapor
      reportData = {
        accidents: allAccidents.map(accident => {
          // Tip güvenliği için null kontrolü
          const involvedPersonnel = accident.involvedPersonnel || [];
          const personnel = involvedPersonnel.map((ip: InvolvedPersonnel) => {
            return ip.personnel ? ip.personnel.name || "Bilinmeyen" : "Bilinmeyen";
          });
          
          return {
            id: accident.id,
            title: accident.title,
            description: accident.description,
            date: new Date(parseInt(accident.date) * 1000).toISOString(),
            location: accident.location,
            severity: accident.severity,
            status: accident.status,
            department: accident.department || "Bilinmeyen",
            reportedBy: accident.createdByUser ? accident.createdByUser.name || "Bilinmeyen" : "Bilinmeyen",
            involvedPersonnel: personnel,
          };
        }),
      };
    }

    // Rapor meta verileri
    const reportMeta = {
      generatedAt: new Date().toISOString(),
      dateRange: {
        start: new Date(startTimestamp * 1000).toISOString(),
        end: new Date(endTimestamp * 1000).toISOString(),
      },
      filters: {
        department: department || undefined,
        severity: severity || undefined,
      },
    };

    return NextResponse.json({
      meta: reportMeta,
      data: reportData,
    });
  } catch (error) {
    console.error("Kaza raporu hatası:", error);
    return NextResponse.json({ error: "Kaza raporu oluşturulamadı" }, { status: 500 });
  }
}
