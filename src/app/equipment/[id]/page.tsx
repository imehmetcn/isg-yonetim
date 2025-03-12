"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  location: string;
  status: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function EquipmentDetailPage({ params }: { params: { id: string } }) {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`/api/equipment/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ekipman detayları yüklenemedi");
      }

      setEquipment(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  async function updateStatus(newStatus: string) {
    if (!equipment) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/equipment/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...equipment,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Durum güncellenemedi");
      }

      setEquipment(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setUpdating(false);
    }
  }

  function getTypeText(type: string): string {
    switch (type) {
      case "PROTECTIVE":
        return "Koruyucu Ekipman";
      case "EMERGENCY":
        return "Acil Durum Ekipmanı";
      case "FIRST_AID":
        return "İlk Yardım Ekipmanı";
      case "FIRE":
        return "Yangın Ekipmanı";
      default:
        return "Diğer";
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      case "REPAIR":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case "ACTIVE":
        return "Aktif";
      case "MAINTENANCE":
        return "Bakımda";
      case "REPAIR":
        return "Onarımda";
      default:
        return "Kullanım Dışı";
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

  if (!equipment) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">Ekipman kaydı bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{equipment.name}</h1>
        <Link href="/equipment" className="text-primary-600 hover:text-primary-700">
          ← Listeye Dön
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Ekipman Detayları</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Kayıt: {new Date(equipment.createdAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  equipment.status
                )}`}
              >
                {getStatusText(equipment.status)}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Ekipman Türü</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {getTypeText(equipment.type)}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Seri Numarası</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {equipment.serialNumber}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Konum</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {equipment.location}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Son Bakım Tarihi</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(equipment.lastMaintenanceDate).toLocaleDateString("tr-TR")}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Sonraki Bakım Tarihi</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(equipment.nextMaintenanceDate).toLocaleDateString("tr-TR")}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Durum Güncelle</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex space-x-3">
                  <button
                    onClick={() => updateStatus("ACTIVE")}
                    disabled={updating || equipment.status === "ACTIVE"}
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Aktif
                  </button>
                  <button
                    onClick={() => updateStatus("MAINTENANCE")}
                    disabled={updating || equipment.status === "MAINTENANCE"}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Bakıma Al
                  </button>
                  <button
                    onClick={() => updateStatus("REPAIR")}
                    disabled={updating || equipment.status === "REPAIR"}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    Onarıma Al
                  </button>
                  <button
                    onClick={() => updateStatus("INACTIVE")}
                    disabled={updating || equipment.status === "INACTIVE"}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 disabled:opacity-50"
                  >
                    Kullanım Dışı
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
