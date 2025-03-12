import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { AuditCreateButton } from "@/components/audit-create-button";
import { AuditItem } from "@/components/audit-item";
import { EmptyPlaceholder, EmptyPlaceholderIcon, EmptyPlaceholderTitle, EmptyPlaceholderDescription } from "@/components/empty-placeholder";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Denetimler",
  description: "Denetim kayıtlarını görüntüle ve yönet.",
};

export default async function AuditsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const audits = await prisma.audit.findMany({
    where: {
      auditorId: session.user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  const completedCount = await prisma.audit.count({
    where: {
      auditorId: session.user.id,
      status: "COMPLETED",
    },
  });

  const inProgressCount = await prisma.audit.count({
    where: {
      auditorId: session.user.id,
      status: "IN_PROGRESS",
    },
  });

  const plannedCount = await prisma.audit.count({
    where: {
      auditorId: session.user.id,
      status: "PLANNED",
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Denetimler" text="Denetim kayıtlarını görüntüle ve yönet.">
        <AuditCreateButton />
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Toplam Denetim</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{audits.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Tamamlanan</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-green-500">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Devam Eden</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-orange-500">{inProgressCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Planlanan</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-blue-500">{plannedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {audits.length > 0 ? (
          <div className="divide-y divide-border rounded-md border">
            {audits.map(audit => (
              <AuditItem key={audit.id} audit={audit} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholderIcon>
              <FileText className="h-10 w-10 text-muted-foreground" />
            </EmptyPlaceholderIcon>
            <EmptyPlaceholderTitle>Henüz denetim kaydı yok</EmptyPlaceholderTitle>
            <EmptyPlaceholderDescription>
              Henüz bir denetim kaydı oluşturmadınız. Hemen yeni bir denetim oluşturun.
            </EmptyPlaceholderDescription>
            <AuditCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
}
