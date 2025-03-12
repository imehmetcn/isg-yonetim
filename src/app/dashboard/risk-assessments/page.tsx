import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { EmptyPlaceholder, EmptyPlaceholderIcon, EmptyPlaceholderTitle, EmptyPlaceholderDescription } from "@/components/empty-placeholder";
import { RiskAssessmentCreateButton } from "@/components/risk-assessment-create-button";
import { RiskAssessmentItem } from "@/components/risk-assessment-item";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Risk Değerlendirme",
  description: "Risk değerlendirme kayıtlarını görüntüle ve yönet.",
};

export default async function RiskAssessmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const riskAssessments = await prisma.riskAssessment.findMany({
    where: {
      assessorId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      risks: true,
    },
  });

  const highRiskCount = await prisma.risk.count({
    where: {
      assessment: {
        assessorId: session.user.id,
      },
      riskLevel: "HIGH",
    },
  });

  const mediumRiskCount = await prisma.risk.count({
    where: {
      assessment: {
        assessorId: session.user.id,
      },
      riskLevel: "MEDIUM",
    },
  });

  const lowRiskCount = await prisma.risk.count({
    where: {
      assessment: {
        assessorId: session.user.id,
      },
      riskLevel: "LOW",
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Risk Değerlendirme"
        text="Risk değerlendirme kayıtlarını görüntüle ve yönet."
      >
        <RiskAssessmentCreateButton />
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Toplam Değerlendirme</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{riskAssessments.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Yüksek Risk</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-destructive">{highRiskCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Orta Risk</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-orange-500">{mediumRiskCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Düşük Risk</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-green-500">{lowRiskCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {riskAssessments.length > 0 ? (
          <div className="divide-y divide-border rounded-md border">
            {riskAssessments.map(assessment => (
              <RiskAssessmentItem key={assessment.id} assessment={assessment} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholderIcon>
              <AlertTriangle className="h-10 w-10 text-muted-foreground" />
            </EmptyPlaceholderIcon>
            <EmptyPlaceholderTitle>Henüz risk değerlendirme kaydı yok</EmptyPlaceholderTitle>
            <EmptyPlaceholderDescription>
              Henüz bir risk değerlendirme kaydı oluşturmadınız. Hemen yeni bir değerlendirme oluşturun.
            </EmptyPlaceholderDescription>
            <RiskAssessmentCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
}
