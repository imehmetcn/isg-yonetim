import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { PersonnelCreateButton } from "@/components/personnel-create-button";
import { PersonnelItem } from "@/components/personnel-item";
import { EmptyPlaceholder, EmptyPlaceholderIcon, EmptyPlaceholderTitle, EmptyPlaceholderDescription } from "@/components/empty-placeholder";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Personel",
  description: "Personel kayıtlarını görüntüle ve yönet.",
};

export default async function PersonnelPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const personnel = await prisma.personnel.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  const activeCount = await prisma.personnel.count({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
  });

  const inactiveCount = await prisma.personnel.count({
    where: {
      userId: session.user.id,
      status: "INACTIVE",
    },
  });

  const onLeaveCount = await prisma.personnel.count({
    where: {
      userId: session.user.id,
      status: "ON_LEAVE",
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Personel" text="Personel kayıtlarını görüntüle ve yönet.">
        <PersonnelCreateButton />
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Toplam Personel</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{personnel.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Aktif</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-green-500">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">İzinli</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-orange-500">{onLeaveCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">İnaktif</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-destructive">{inactiveCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {personnel.length > 0 ? (
          <div className="divide-y divide-border rounded-md border">
            {personnel.map(person => (
              <PersonnelItem key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholderIcon>
              <Users className="h-10 w-10 text-muted-foreground" />
            </EmptyPlaceholderIcon>
            <EmptyPlaceholderTitle>Henüz personel kaydı yok</EmptyPlaceholderTitle>
            <EmptyPlaceholderDescription>
              Henüz bir personel kaydı oluşturmadınız. Hemen yeni bir personel oluşturun.
            </EmptyPlaceholderDescription>
            <PersonnelCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
}
