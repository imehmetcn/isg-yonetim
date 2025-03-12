"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEquipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      serialNumber: formData.get("serialNumber") as string,
      location: formData.get("location") as string,
      status: "ACTIVE",
      lastMaintenanceDate: formData.get("lastMaintenanceDate") as string,
      nextMaintenanceDate: formData.get("nextMaintenanceDate") as string,
    };

    try {
      const response = await fetch("/api/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ekipman kaydı oluşturulamadı");
      }

      router.push("/equipment");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Ekipman Ekle</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Ekipman Adı
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Ekipman Türü
          </label>
          <select
            name="type"
            id="type"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Seçiniz...</option>
            <option value="PROTECTIVE">Koruyucu Ekipman</option>
            <option value="EMERGENCY">Acil Durum Ekipmanı</option>
            <option value="FIRST_AID">İlk Yardım Ekipmanı</option>
            <option value="FIRE">Yangın Ekipmanı</option>
            <option value="OTHER">Diğer</option>
          </select>
        </div>

        <div>
          <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
            Seri Numarası
          </label>
          <input
            type="text"
            name="serialNumber"
            id="serialNumber"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Konum
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="lastMaintenanceDate" className="block text-sm font-medium text-gray-700">
            Son Bakım Tarihi
          </label>
          <input
            type="date"
            name="lastMaintenanceDate"
            id="lastMaintenanceDate"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="nextMaintenanceDate" className="block text-sm font-medium text-gray-700">
            Sonraki Bakım Tarihi
          </label>
          <input
            type="date"
            name="nextMaintenanceDate"
            id="nextMaintenanceDate"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
