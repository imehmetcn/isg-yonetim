import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface QueryResult {
  month?: Date;
  severity?: string;
  department?: string;
  count: string;
}

export async function GET() {
  try {
    // Olaylar için istatistikler
    const incidentsTotal = await prisma.incident.count();
    const incidentsByMonth: QueryResult[] = await prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "createdAt") as month,
             COUNT(*) as count
      FROM "Incident"
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
      LIMIT 12
    `;
    const incidentsBySeverity: QueryResult[] = await prisma.$queryRaw`
      SELECT severity,
             COUNT(*) as count
      FROM "Incident"
      GROUP BY severity
    `;
    const incidentsByDepartment: QueryResult[] = await prisma.$queryRaw`
      SELECT department,
             COUNT(*) as count
      FROM "Incident"
      GROUP BY department
    `;

    // Eğitimler için istatistikler
    const trainingsTotal = await prisma.training.count();
    const trainingsCompleted = await prisma.training.count({
      where: { status: "COMPLETED" },
    });
    const trainingsInProgress = await prisma.training.count({
      where: { status: "IN_PROGRESS" },
    });
    const trainingsByDepartment: QueryResult[] = await prisma.$queryRaw`
      SELECT department,
             COUNT(*) as count
      FROM "Training"
      GROUP BY department
    `;

    // Riskler için istatistikler
    const risksTotal = await prisma.riskAssessment.count();
    const risksByLevel: QueryResult[] = await prisma.$queryRaw`
      SELECT severity,
             COUNT(*) as count
      FROM "RiskAssessment"
      GROUP BY severity
    `;
    const risksByDepartment: QueryResult[] = await prisma.$queryRaw`
      SELECT department,
             COUNT(*) as count
      FROM "RiskAssessment"
      GROUP BY department
    `;
    const openRisks = await prisma.riskAssessment.count({
      where: { status: "OPEN" },
    });

    // Denetimler için istatistikler
    const auditsTotal = await prisma.audit.count();
    const auditsCompleted = await prisma.audit.count({
      where: { status: "COMPLETED" },
    });
    const auditFindings = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM "AuditFinding"
    `;
    const auditsByDepartment: QueryResult[] = await prisma.$queryRaw`
      SELECT department,
             COUNT(*) as count
      FROM "Audit"
      GROUP BY department
    `;

    const analyticsData = {
      incidents: {
        total: incidentsTotal,
        byMonth: incidentsByMonth.map((item) => ({
          month: item.month?.toISOString().slice(0, 7) ?? "",
          count: Number(item.count),
        })),
        bySeverity: incidentsBySeverity.map((item) => ({
          severity: item.severity ?? "",
          count: Number(item.count),
        })),
        byDepartment: incidentsByDepartment.map((item) => ({
          department: item.department ?? "",
          count: Number(item.count),
        })),
      },
      trainings: {
        total: trainingsTotal,
        completed: trainingsCompleted,
        inProgress: trainingsInProgress,
        completionRate: trainingsTotal > 0 ? (trainingsCompleted / trainingsTotal) * 100 : 0,
        byDepartment: trainingsByDepartment.map((item) => ({
          department: item.department ?? "",
          count: Number(item.count),
        })),
      },
      risks: {
        total: risksTotal,
        byLevel: risksByLevel.map((item) => ({
          level: item.severity?.toString() ?? "",
          count: Number(item.count),
        })),
        byDepartment: risksByDepartment.map((item) => ({
          department: item.department ?? "",
          count: Number(item.count),
        })),
        openRisks,
      },
      audits: {
        total: auditsTotal,
        completed: auditsCompleted,
        findings: Number((auditFindings as any[])[0]?.count ?? 0),
        byDepartment: auditsByDepartment.map((item) => ({
          department: item.department ?? "",
          count: Number(item.count),
        })),
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      { error: "Analitik verileri alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
} 