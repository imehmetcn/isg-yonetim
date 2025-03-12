"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Audit {
  id: string;
  title: string;
  description: string;
  date: string;
  findings: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AuditDetailPage({ params }: { params: { id: string } }) {
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchAudit = useCallback(async () => {
    try {
      const response = await fetch(`/api/audits/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Denetim detayları yüklenemedi");
      }

      setAudit(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  async function updateStatus(newStatus: string) {
    if (!audit) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/audits/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...audit,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Durum güncellenemedi");
      }

      setAudit(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setUpdating(false);
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case "PENDING":
        return "Beklemede";
      case "IN_PROGRESS":
        return "Devam Ediyor";
      case "COMPLETED":
        return "Tamamlandı";
      default:
        return "İptal Edildi";
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

  if (!audit) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">Denetim kaydı bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{audit.title}</h1>
        <Link href="/audits" className="text-primary-600 hover:text-primary-700">
          ← Listeye Dön
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Denetim Detayları</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Kayıt: {new Date(audit.createdAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  audit.status
                )}`}
              >
                {getStatusText(audit.status)}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Denetim Tarihi</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(audit.date).toLocaleString("tr-TR")}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Açıklama</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {audit.description}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Bulgular</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {audit.findings}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Durum Güncelle</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex space-x-3">
                  <button
                    onClick={() => updateStatus("IN_PROGRESS")}
                    disabled={updating || audit.status === "IN_PROGRESS"}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    Başlat
                  </button>
                  <button
                    onClick={() => updateStatus("COMPLETED")}
                    disabled={updating || audit.status === "COMPLETED"}
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Tamamla
                  </button>
                  <button
                    onClick={() => updateStatus("CANCELLED")}
                    disabled={updating || audit.status === "CANCELLED"}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 disabled:opacity-50"
                  >
                    İptal Et
                  </button>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
