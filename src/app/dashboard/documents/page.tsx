import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { DocumentCreateButton } from "@/components/document-create-button";
import { DocumentItem } from "@/components/document-item";
import { EmptyPlaceholder, EmptyPlaceholderIcon, EmptyPlaceholderTitle, EmptyPlaceholderDescription } from "@/components/empty-placeholder";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Belgeler",
  description: "Belge kayıtlarını görüntüle ve yönet.",
};

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const documents = await prisma.document.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const activeCount = await prisma.document.count({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
  });

  const expiredCount = await prisma.document.count({
    where: {
      userId: session.user.id,
      status: "EXPIRED",
    },
  });

  const draftCount = await prisma.document.count({
    where: {
      userId: session.user.id,
      status: "DRAFT",
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader heading="Belgeler" text="Belge kayıtlarını görüntüle ve yönet.">
        <DocumentCreateButton />
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Toplam Belge</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{documents.length}</p>
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
              <h3 className="text-sm font-medium">Süresi Dolmuş</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-destructive">{expiredCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Taslak</h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-orange-500">{draftCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {documents.length > 0 ? (
          <div className="divide-y divide-border rounded-md border">
            {documents.map(document => (
              <DocumentItem key={document.id} document={document} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholderIcon>
              <FileText className="h-10 w-10 text-muted-foreground" />
            </EmptyPlaceholderIcon>
            <EmptyPlaceholderTitle>Henüz belge kaydı yok</EmptyPlaceholderTitle>
            <EmptyPlaceholderDescription>
              Henüz bir belge kaydı oluşturmadınız. Hemen yeni bir belge oluşturun.
            </EmptyPlaceholderDescription>
            <DocumentCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
}
