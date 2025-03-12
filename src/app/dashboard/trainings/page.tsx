import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { EmptyPlaceholder, EmptyPlaceholderIcon, EmptyPlaceholderTitle, EmptyPlaceholderDescription } from "@/components/empty-placeholder";
import { TrainingCreateButton } from "@/components/training-create-button";
import { TrainingItem } from "@/components/training-item";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Eğitimler",
  description: "Eğitim kayıtlarını görüntüle ve yönet.",
};

export default async function TrainingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const trainings = await prisma.training.findMany({
    where: {
      instructorId: session.user.id,
    },
    orderBy: {
      startDate: "desc",
    },
  });

  const completedCount = await prisma.training.count({
    where: {
      instructorId: session.user.id,
      status: "COMPLETED",
    },
  });

  const upcomingCount = await prisma.training.count({
    where: {
      instructorId: session.user.id,
      status: "UPCOMING",
    },
  });

  const inProgressCount = await prisma.training.count({
    where: {
      instructorId: session.user.id,
      status: "IN_PROGRESS",
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Eğitimler" text="Eğitim kayıtlarını görüntüle ve yönet.">
        <TrainingCreateButton />
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Toplam Eğitim</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{trainings.length}</p>
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
              <h3 className="text-sm font-medium">Yaklaşan</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-blue-500">{upcomingCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {trainings.length > 0 ? (
          <div className="divide-y divide-border rounded-md border">
            {trainings.map(training => (
              <TrainingItem key={training.id} training={training} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholderIcon>
              <GraduationCap className="h-10 w-10 text-muted-foreground" />
            </EmptyPlaceholderIcon>
            <EmptyPlaceholderTitle>Henüz eğitim kaydı yok</EmptyPlaceholderTitle>
            <EmptyPlaceholderDescription>
              Henüz bir eğitim kaydı oluşturmadınız. Hemen yeni bir eğitim oluşturun.
            </EmptyPlaceholderDescription>
            <TrainingCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
}
