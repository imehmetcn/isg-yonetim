"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function NewRiskAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      severity: parseInt(formData.get("severity") as string),
      likelihood: parseInt(formData.get("likelihood") as string),
    };

    try {
      const response = await fetch("/api/risk-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Risk değerlendirmesi oluşturulamadı");
      }

      toast.success("Risk değerlendirmesi başarıyla oluşturuldu");
      router.push("/risk-assessment");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Risk Değerlendirmesi</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-900">
              Başlık
            </label>
            <Input
              type="text"
              name="title"
              id="title"
              required
              placeholder="Risk değerlendirmesi başlığı"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-900">
              Açıklama
            </label>
            <Textarea
              name="description"
              id="description"
              rows={3}
              required
              placeholder="Risk değerlendirmesi açıklaması"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-gray-900">
              Departman
            </label>
            <Input
              type="text"
              name="location"
              id="location"
              required
              placeholder="Departman adı"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="severity" className="text-sm font-medium text-gray-900">
                Şiddet (1-5)
              </label>
              <select
                name="severity"
                id="severity"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                defaultValue=""
              >
                <option value="" disabled>Seçiniz</option>
                <option value="1">1 - Çok Düşük</option>
                <option value="2">2 - Düşük</option>
                <option value="3">3 - Orta</option>
                <option value="4">4 - Yüksek</option>
                <option value="5">5 - Çok Yüksek</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="likelihood" className="text-sm font-medium text-gray-900">
                Olasılık (1-5)
              </label>
              <select
                name="likelihood"
                id="likelihood"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                defaultValue=""
              >
                <option value="" disabled>Seçiniz</option>
                <option value="1">1 - Çok Nadir</option>
                <option value="2">2 - Nadir</option>
                <option value="3">3 - Olası</option>
                <option value="4">4 - Sık</option>
                <option value="5">5 - Çok Sık</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
