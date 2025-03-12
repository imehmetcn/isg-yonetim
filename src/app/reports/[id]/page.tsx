"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Report {
  id: string;
  title: string;
  type: string;
  period: string;
  status: string;
  generatedAt: string;
  fileUrl: string | null;
  parameters: {
    type: string;
    startDate: string;
    endDate: string;
    severity?: string;
    status?: string;
    department?: string;
    trainingStatus?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      const response = await fetch(`/api/reports/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Rapor detayları yüklenemedi");
      }

      if (data.parameters && typeof data.parameters === "string") {
        try {
          data.parameters = JSON.parse(data.parameters);
        } catch (e) {
          console.error("Failed to parse report parameters:", e);
        }
      }

      setReport(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  function getReportTypeText(type: string): string {
    switch (type) {
      case "INCIDENT":
        return "Olay Raporu";
      case "TRAINING":
        return "Eğitim Raporu";
      case "RISK":
        return "Risk Değerlendirme Raporu";
      case "AUDIT":
        return "Denetim Raporu";
      case "EQUIPMENT":
        return "Ekipman Raporu";
      case "PERSONNEL":
        return "Personel Raporu";
      default:
        return "Diğer";
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "GENERATING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case "COMPLETED":
        return "Tamamlandı";
      case "GENERATING":
        return "Hazırlanıyor";
      case "FAILED":
        return "Başarısız";
      default:
        return "Bilinmiyor";
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">Rapor bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
        <Link href="/reports" className="text-primary-600 hover:text-primary-700">
          ← Listeye Dön
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Rapor Detayları</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Oluşturulma: {new Date(report.createdAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  report.status
                )}`}
              >
                {getStatusText(report.status)}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Rapor Türü</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {getReportTypeText(report.type)}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Dönem</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {report.period || "-"}
              </dd>
            </div>
            {report.parameters && report.parameters.severity && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Olay Şiddeti</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {report.parameters.severity || "Tümü"}
                </dd>
              </div>
            )}
            {report.parameters && report.parameters.status && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Eğitim Durumu</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {report.parameters.status || "Tümü"}
                </dd>
              </div>
            )}
            {report.parameters && report.parameters.department && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Departman</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {report.parameters.department || "Tümü"}
                </dd>
              </div>
            )}
            {report.parameters && report.parameters.trainingStatus && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Eğitim Durumu</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {report.parameters.trainingStatus || "Tümü"}
                </dd>
              </div>
            )}
            {report.status === "COMPLETED" && report.fileUrl && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Rapor Dosyası</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a
                    href={report.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-900"
                  >
                    İndir
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
