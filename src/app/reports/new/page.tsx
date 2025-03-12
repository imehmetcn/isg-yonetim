"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title") as string,
      type: reportType,
      period: `${new Date(startDate).toLocaleDateString("tr-TR")} - ${new Date(endDate).toLocaleDateString("tr-TR")}`,
      startDate,
      endDate,
      parameters: {
        type: reportType,
        startDate,
        endDate,
        ...(reportType === "INCIDENT" && {
          severity: formData.get("severity") as string,
        }),
        ...(reportType === "TRAINING" && {
          status: formData.get("trainingStatus") as string,
        }),
        ...(reportType === "PERSONNEL" && {
          department: formData.get("department") as string,
          trainingStatus: formData.get("personnelTrainingStatus") as string,
        }),
      },
      status: "GENERATING",
    };

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Rapor oluşturulamadı");
      }

      router.push("/reports");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Rapor Oluştur</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Rapor Adı
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Rapor Türü
          </label>
          <select
            name="type"
            id="type"
            required
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Seçiniz...</option>
            <option value="INCIDENT">Olay Raporu</option>
            <option value="TRAINING">Eğitim Raporu</option>
            <option value="RISK">Risk Değerlendirme Raporu</option>
            <option value="AUDIT">Denetim Raporu</option>
            <option value="EQUIPMENT">Ekipman Raporu</option>
            <option value="PERSONNEL">Personel Raporu</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              required
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              required
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        {reportType === "INCIDENT" && (
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
              Olay Şiddeti
            </label>
            <select
              name="severity"
              id="severity"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Tümü</option>
              <option value="LOW">Düşük</option>
              <option value="MEDIUM">Orta</option>
              <option value="HIGH">Yüksek</option>
              <option value="CRITICAL">Kritik</option>
            </select>
          </div>
        )}

        {reportType === "TRAINING" && (
          <div>
            <label htmlFor="trainingStatus" className="block text-sm font-medium text-gray-700">
              Eğitim Durumu
            </label>
            <select
              name="trainingStatus"
              id="trainingStatus"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Tümü</option>
              <option value="PLANNED">Planlandı</option>
              <option value="IN_PROGRESS">Devam Ediyor</option>
              <option value="COMPLETED">Tamamlandı</option>
              <option value="CANCELLED">İptal Edildi</option>
            </select>
          </div>
        )}

        {reportType === "PERSONNEL" && (
          <>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Departman
              </label>
              <input
                type="text"
                name="department"
                id="department"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Tüm departmanlar için boş bırakın"
              />
            </div>
            <div>
              <label
                htmlFor="personnelTrainingStatus"
                className="block text-sm font-medium text-gray-700"
              >
                Eğitim Durumu
              </label>
              <select
                name="personnelTrainingStatus"
                id="personnelTrainingStatus"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Tümü</option>
                <option value="COMPLETED">Tamamlandı</option>
                <option value="PENDING">Beklemede</option>
                <option value="EXPIRED">Süresi Doldu</option>
              </select>
            </div>
          </>
        )}

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
            {loading ? "Oluşturuluyor..." : "Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
}
