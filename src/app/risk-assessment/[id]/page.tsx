"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface RiskAssessment {
  id: string;
  title: string;
  description: string;
  location: string;
  severity: number;
  likelihood: number;
  createdAt: string;
  updatedAt: string;
}

export default function RiskAssessmentDetailPage({ params }: { params: { id: string } }) {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessment = useCallback(async () => {
    try {
      const response = await fetch(`/api/risk-assessment/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Risk değerlendirmesi yüklenemedi");
      }

      setAssessment(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  function getRiskLevel(severity: number, likelihood: number): string {
    const riskScore = severity * likelihood;
    if (riskScore >= 15) return "Çok Yüksek";
    if (riskScore >= 10) return "Yüksek";
    if (riskScore >= 5) return "Orta";
    return "Düşük";
  }

  function getRiskColor(severity: number, likelihood: number): string {
    const level = getRiskLevel(severity, likelihood);
    switch (level) {
      case "Çok Yüksek":
        return "bg-red-100 text-red-800";
      case "Yüksek":
        return "bg-orange-100 text-orange-800";
      case "Orta":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
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

  if (!assessment) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">Risk değerlendirmesi bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
        <Link href="/risk-assessment" className="text-primary-600 hover:text-primary-700">
          ← Listeye Dön
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Risk Değerlendirme Detayları
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {new Date(assessment.createdAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(
                assessment.severity,
                assessment.likelihood
              )}`}
            >
              {getRiskLevel(assessment.severity, assessment.likelihood)}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Konum</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {assessment.location}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Açıklama</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {assessment.description}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Risk Faktörleri</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">Şiddet:</span> {assessment.severity}/5
                  </li>
                  <li>
                    <span className="font-medium">Olasılık:</span> {assessment.likelihood}/5
                  </li>
                  <li>
                    <span className="font-medium">Risk Skoru:</span>{" "}
                    {assessment.severity * assessment.likelihood}/25
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
