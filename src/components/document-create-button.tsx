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

interface DocumentCreateButtonProps {
  variant?: "default" | "outline";
}

export function DocumentCreateButton({ variant = "default" }: DocumentCreateButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewDocumentDialog, setShowNewDocumentDialog] = useState(false);

  async function onClick() {
    setIsLoading(true);

    const response = await fetch("/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: (document.getElementById("title") as HTMLInputElement)?.value,
        description: (document.getElementById("description") as HTMLTextAreaElement)?.value,
        category: (document.getElementById("category") as HTMLInputElement)?.value,
        fileUrl: (document.getElementById("fileUrl") as HTMLInputElement)?.value,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast({
        title: "Bir şeyler yanlış gitti.",
        description: "Belge oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }

    toast({
      description: "Belge başarıyla oluşturuldu.",
    });

    setShowNewDocumentDialog(false);
    router.refresh();
    return true;
  }

  return (
    <Dialog open={showNewDocumentDialog} onOpenChange={setShowNewDocumentDialog}>
      <DialogTrigger asChild>
        <Button variant={variant}>Yeni Belge</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Belge</DialogTitle>
          <DialogDescription>
            Yeni bir belge kaydı oluşturun. Tüm alanları doldurun.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input id="title" placeholder="Belge başlığı" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" placeholder="Belge açıklaması" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input id="category" placeholder="Belge kategorisi" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileUrl">Dosya URL</Label>
            <Input id="fileUrl" placeholder="Belge dosya URL'i" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewDocumentDialog(false)}>
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
