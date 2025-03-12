"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Personnel {
  id: string;
  employeeId: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  safetyTrainingStatus: string;
  lastTrainingDate: string;
  nextTrainingDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function PersonnelDetailPage({ params }: { params: { id: string } }) {
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchPersonnel = useCallback(async () => {
    try {
      const response = await fetch(`/api/personnel/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Personel detayları yüklenemedi");
      }

      setPersonnel(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchPersonnel();
  }, [fetchPersonnel]);

  async function updateTrainingStatus(newStatus: string) {
    if (!personnel) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/personnel/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...personnel,
          safetyTrainingStatus: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Durum güncellenemedi");
      }

      setPersonnel(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setUpdating(false);
    }
  }

  function getTrainingStatusColor(status: string): string {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "EXPIRED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getTrainingStatusText(status: string): string {
    switch (status) {
      case "COMPLETED":
        return "Tamamlandı";
      case "PENDING":
        return "Beklemede";
      case "EXPIRED":
        return "Süresi Doldu";
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

  if (!personnel) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">Personel bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{personnel.name}</h1>
        <Link href="/personnel" className="text-primary-600 hover:text-primary-700">
          ← Listeye Dön
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Personel Detayları</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Sicil No: {personnel.employeeId}
              </p>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTrainingStatusColor(
                  personnel.safetyTrainingStatus
                )}`}
              >
                {getTrainingStatusText(personnel.safetyTrainingStatus)}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Pozisyon</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {personnel.position}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Departman</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {personnel.department}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">E-posta</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {personnel.email}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Telefon</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {personnel.phone}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Son İSG Eğitimi</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(personnel.lastTrainingDate).toLocaleDateString("tr-TR")}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Sonraki İSG Eğitimi</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(personnel.nextTrainingDate).toLocaleDateString("tr-TR")}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Eğitim Durumu</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex space-x-3">
                  <button
                    onClick={() => updateTrainingStatus("COMPLETED")}
                    disabled={updating || personnel.safetyTrainingStatus === "COMPLETED"}
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Tamamlandı
                  </button>
                  <button
                    onClick={() => updateTrainingStatus("PENDING")}
                    disabled={updating || personnel.safetyTrainingStatus === "PENDING"}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Beklemede
                  </button>
                  <button
                    onClick={() => updateTrainingStatus("EXPIRED")}
                    disabled={updating || personnel.safetyTrainingStatus === "EXPIRED"}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    Süresi Doldu
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
