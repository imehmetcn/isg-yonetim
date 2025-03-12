"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  severity: string;
  status: string;
  createdAt: string;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  async function fetchIncidents() {
    try {
      const response = await fetch("/api/incidents");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Olaylar yüklenemedi");
      }

      setIncidents(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  function getSeverityColor(severity: string): string {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
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

  function getSeverityText(severity: string): string {
    switch (severity) {
      case "CRITICAL":
        return "Kritik";
      case "HIGH":
        return "Yüksek";
      case "MEDIUM":
        return "Orta";
      default:
        return "Düşük";
    }
  }

  function getStatusText(status: string): string {
    switch (status) {
      case "PENDING":
        return "Beklemede";
      case "IN_PROGRESS":
        return "İşlemde";
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Olay Takibi</h1>
        <Link
          href="/incidents/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          Yeni Olay Kaydı
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {incidents.map(incident => (
            <li key={incident.id}>
              <Link href={`/incidents/${incident.id}`}>
                <div className="block hover:bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-medium text-gray-900">{incident.title}</p>
                      <p className="mt-1 text-sm text-gray-500">{incident.description}</p>
                      <p className="mt-1 text-sm text-gray-500">Konum: {incident.location}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Tarih: {new Date(incident.date).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(
                          incident.severity
                        )}`}
                      >
                        {getSeverityText(incident.severity)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          incident.status
                        )}`}
                      >
                        {getStatusText(incident.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          {incidents.length === 0 && (
            <li className="p-4 text-center text-gray-500">Henüz kayıtlı olay bulunmuyor.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
