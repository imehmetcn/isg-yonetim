"use client";

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { SectionTransition } from "@/components/animations/SectionTransition";
import { CardHover } from "@/components/animations/CardHover";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Search,
  FileDown,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Training {
  id: string;
  title: string;
  description: string | null;
  status: string;
  startDate: Date;
  endDate: Date;
  attendees: string;
}

export default function TrainingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        // API çağrısı burada yapılacak
        // const response = await fetch("/api/trainings");
        // const data = await response.json();
        // setTrainings(data);
        setTrainings([]);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Bir hata oluştu");
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  const stats = [
    {
      title: "Toplam Eğitim",
      value: "0",
      icon: GraduationCap,
      color: "blue",
    },
    {
      title: "Planlanan",
      value: "0",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Devam Eden",
      value: "0",
      icon: AlertCircle,
      color: "orange",
    },
    {
      title: "Tamamlanan",
      value: "0",
      icon: CheckCircle,
      color: "green",
    },
  ];

  const handleNewTraining = () => {
    router.push("/trainings/new");
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch("/api/trainings/export/excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trainings }),
      });

      if (!response.ok) {
        throw new Error("Excel export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trainings-${new Date().toISOString().split("T")[0]}.xlsx`;
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
      const response = await fetch("/api/trainings/export/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trainings }),
      });

      if (!response.ok) {
        throw new Error("PDF export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trainings-${new Date().toISOString().split("T")[0]}.pdf`;
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Eğitimler</h1>
              <p className="text-gray-600">Personel eğitimlerini planlayın ve takip edin</p>
            </div>
            <Button onClick={handleNewTraining}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Eğitim
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
                <option value="PENDING">Planlanan</option>
                <option value="IN_PROGRESS">Devam Eden</option>
                <option value="COMPLETED">Tamamlanan</option>
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

        {/* Trainings List */}
        <div className="bg-white rounded-lg border shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 text-red-600">{error}</div>
          ) : trainings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <GraduationCap className="h-8 w-8 mb-4" />
              <p className="text-lg font-medium">Henüz eğitim kaydı bulunmuyor</p>
              <p className="text-sm mt-2">Yeni bir eğitim eklemek için butona tıklayın</p>
              <Button
                onClick={handleNewTraining}
                className="mt-4"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Eğitim
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Başlık
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Katılımcı Sayısı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.map((training) => (
                    <tr
                      key={training.id}
                      className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/trainings/${training.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{training.title}</div>
                        <div className="text-sm text-gray-500">{training.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(training.startDate).toLocaleDateString("tr-TR")} -{" "}
                        {new Date(training.endDate).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {JSON.parse(training.attendees).length} Katılımcı
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            training.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : training.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {training.status === "COMPLETED"
                            ? "Tamamlandı"
                            : training.status === "IN_PROGRESS"
                            ? "Devam Ediyor"
                            : "Planlandı"}
                        </span>
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
