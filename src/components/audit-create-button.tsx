"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AuditCreateButtonProps {
  variant?: "default" | "outline";
}

export function AuditCreateButton({ variant = "default" }: AuditCreateButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewAuditDialog, setShowNewAuditDialog] = useState(false);

  async function onClick() {
    setIsLoading(true);

    const response = await fetch("/api/audits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: (document.getElementById("title") as HTMLInputElement)?.value,
        description: (document.getElementById("description") as HTMLTextAreaElement)?.value,
        department: (document.getElementById("department") as HTMLInputElement)?.value,
        date: (document.getElementById("date") as HTMLInputElement)?.value,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast({
        title: "Bir şeyler yanlış gitti.",
        description: "Denetim oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }

    toast({
      description: "Denetim başarıyla oluşturuldu.",
    });

    setShowNewAuditDialog(false);
    router.refresh();
    return true;
  }

  return (
    <Dialog open={showNewAuditDialog} onOpenChange={setShowNewAuditDialog}>
      <DialogTrigger asChild>
        <Button variant={variant}>Yeni Denetim</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Denetim</DialogTitle>
          <DialogDescription>
            Yeni bir denetim kaydı oluşturun. Tüm alanları doldurun.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input id="title" placeholder="Denetim başlığı" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" placeholder="Denetim açıklaması" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Departman</Label>
            <Input id="department" placeholder="Departman" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Tarih</Label>
            <Input id="date" type="date" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewAuditDialog(false)}>
            İptal
          </Button>
          <Button onClick={onClick} disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>Oluştur</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
