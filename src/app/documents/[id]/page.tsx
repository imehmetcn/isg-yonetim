"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Document {
  id: string;
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  version: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Doküman detayları yüklenemedi");
      }

      setDocument(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, []);

  async function updateStatus(newStatus: string) {
    if (!document) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/documents/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...document,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Durum güncellenemedi");
      }

      setDocument(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setUpdating(false);
    }
  }

  function getCategoryText(category: string): string {
    switch (category) {
      case "PROCEDURE":
        return "Prosedür";
      case "INSTRUCTION":
        return "Talimat";
      case "FORM":
        return "Form";
      case "PLAN":
        return "Plan";
      case "REPORT":
        return "Rapor";
      default:
        return "Diğer";
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case "DRAFT":
        return "Taslak";
      case "PUBLISHED":
        return "Yayında";
      case "ARCHIVED":
        return "Arşivlenmiş";
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

  if (!document) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">Doküman bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
        <Link href="/documents" className="text-primary-600 hover:text-primary-700">
          ← Listeye Dön
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Doküman Detayları</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Son Güncelleme: {new Date(document.updatedAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  document.status
                )}`}
              >
                {getStatusText(document.status)}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Kategori</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {getCategoryText(document.category)}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Versiyon</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {document.version}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Açıklama</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {document.description}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Dosya</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-900"
                >
                  İndir
                </a>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Durum Güncelle</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex space-x-3">
                  <button
                    onClick={() => updateStatus("DRAFT")}
                    disabled={updating || document.status === "DRAFT"}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Taslak
                  </button>
                  <button
                    onClick={() => updateStatus("PUBLISHED")}
                    disabled={updating || document.status === "PUBLISHED"}
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Yayınla
                  </button>
                  <button
                    onClick={() => updateStatus("ARCHIVED")}
                    disabled={updating || document.status === "ARCHIVED"}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 disabled:opacity-50"
                  >
                    Arşivle
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
