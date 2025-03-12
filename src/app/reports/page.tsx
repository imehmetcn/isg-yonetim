"use client";

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { SectionTransition } from "@/components/animations/SectionTransition";
import { CardHover } from "@/components/animations/CardHover";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  FileBarChart,
  Plus,
  Search,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Report {
  id: string;
  title: string;
  type: string;
  content: string;
  status: string;
  createdAt: Date;
}

export default function ReportsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // API çağrısı burada yapılacak
        // const response = await fetch("/api/reports");
        // const data = await response.json();
        // setReports(data);
        setReports([]);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Bir hata oluştu");
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const stats = [
    {
      title: "Toplam Rapor",
      value: "0",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Yayınlanan",
      value: "0",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Taslak",
      value: "0",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Aylık Rapor",
      value: "0",
      icon: FileBarChart,
      color: "purple",
    },
  ];

  const handleNewReport = () => {
    router.push("/reports/new");
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch("/api/reports/export/excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reports }),
      });

      if (!response.ok) {
        throw new Error("Excel export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reports-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Excel export error:", error);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/reports/export/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reports }),
      });

      if (!response.ok) {
        throw new Error("PDF export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reports-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("PDF export error:", error);
    }
  };

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Raporlar</h1>
              <p className="text-gray-600">İSG raporlarını yönetin ve takip edin</p>
            </div>
            <Button onClick={handleNewReport}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Rapor
            </Button>
          </div>
        </motion.div>

        {/* Statistics */}
        <SectionTransition>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <CardHover key={index}>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-600 mb-1">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                      </div>
                      <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                        <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                  </div>
                </CardHover>
              );
            })}
          </div>
        </SectionTransition>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="PUBLISHED">Yayınlanan</option>
                <option value="DRAFT">Taslak</option>
              </select>
              <Button variant="outline" onClick={handleExportExcel}>
                <FileText className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <FileDown className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg border shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 text-red-600">{error}</div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FileText className="h-8 w-8 mb-4" />
              <p className="text-lg font-medium">Henüz rapor kaydı bulunmuyor</p>
              <p className="text-sm mt-2">Yeni bir rapor eklemek için butona tıklayın</p>
              <Button
                onClick={handleNewReport}
                className="mt-4"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Rapor
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rapor Başlığı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tür
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oluşturulma Tarihi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            report.status === "PUBLISHED"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {report.status === "PUBLISHED" ? "Yayınlandı" : "Taslak"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/reports/${report.id}`)}
                        >
                          Görüntüle
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
