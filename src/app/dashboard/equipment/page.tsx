import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardShell } from "@/components/dashboard-shell";
import { EquipmentCreateButton } from "@/components/equipment-create-button";
import { EquipmentItem } from "@/components/equipment-item";
import { EmptyPlaceholder, EmptyPlaceholderIcon, EmptyPlaceholderTitle, EmptyPlaceholderDescription } from "@/components/empty-placeholder";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Ekipmanlar",
  description: "Ekipman kayıtlarını görüntüle ve yönet.",
};

export default async function EquipmentPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const equipment = await prisma.equipment.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const activeCount = await prisma.equipment.count({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
  });

  const maintenanceCount = await prisma.equipment.count({
    where: {
      userId: session.user.id,
      status: "MAINTENANCE",
    },
  });

  const outOfServiceCount = await prisma.equipment.count({
    where: {
      userId: session.user.id,
      status: "OUT_OF_SERVICE",
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Ekipmanlar" text="Ekipman kayıtlarını görüntüle ve yönet.">
        <EquipmentCreateButton />
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Toplam Ekipman</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{equipment.length}</p>
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
              <h3 className="text-sm font-medium">Bakımda</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-orange-500">{maintenanceCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Hizmet Dışı</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-destructive">{outOfServiceCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {equipment.length > 0 ? (
          <div className="divide-y divide-border rounded-md border">
            {equipment.map(item => (
              <EquipmentItem key={item.id} equipment={item} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholderIcon>
              <FileText className="h-10 w-10 text-muted-foreground" />
            </EmptyPlaceholderIcon>
            <EmptyPlaceholderTitle>Henüz ekipman kaydı yok</EmptyPlaceholderTitle>
            <EmptyPlaceholderDescription>
              Henüz bir ekipman kaydı oluşturmadınız. Hemen yeni bir ekipman oluşturun.
            </EmptyPlaceholderDescription>
            <EquipmentCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
}
