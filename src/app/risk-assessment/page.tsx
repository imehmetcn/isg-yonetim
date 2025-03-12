"use client";

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { SectionTransition } from "@/components/animations/SectionTransition";
import { CardHover } from "@/components/animations/CardHover";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Search,
  SortAsc,
  SortDesc,
  Plus,
  AlertOctagon,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface RiskAssessment {
  id: string;
  title: string;
  description: string;
  location: string;
  severity: number;
  likelihood: number;
  createdAt: string;
}

type SortField = "title" | "createdAt" | "risk";
type SortOrder = "asc" | "desc";

export default function RiskAssessmentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAssessments = useCallback(async () => {
    try {
      // API çağrısı burada yapılacak
      // const response = await fetch("/api/risk-assessment");
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.error || "Risk değerlendirmeleri yüklenemedi");
      // }
      // setAssessments(data);
      // setFilteredAssessments(data);
      setAssessments([]);
      setFilteredAssessments([]);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
      setLoading(false);
    }
  }, []);

  const filterAndSortAssessments = useCallback(() => {
    let filtered = [...assessments];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        assessment =>
          assessment.title.toLowerCase().includes(searchLower) ||
          assessment.description.toLowerCase().includes(searchLower) ||
          assessment.location.toLowerCase().includes(searchLower)
      );
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter(
        assessment => getRiskLevel(assessment.severity, assessment.likelihood) === riskFilter
      );
    }

    filtered.sort((a, b) => {
      if (sortField === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (sortField === "createdAt") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortField === "risk") {
        const riskA = a.severity * a.likelihood;
        const riskB = b.severity * b.likelihood;
        return sortOrder === "asc" ? riskA - riskB : riskB - riskA;
      }
      return 0;
    });

    setFilteredAssessments(filtered);
  }, [assessments, searchTerm, sortField, sortOrder, riskFilter]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  useEffect(() => {
    filterAndSortAssessments();
  }, [filterAndSortAssessments]);

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

  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAssessments.slice(startIndex, endIndex);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortOrder, riskFilter]);

  const stats = [
    {
      title: "Toplam Değerlendirme",
      value: "0",
      icon: AlertTriangle,
      color: "blue",
    },
    {
      title: "Çok Yüksek Risk",
      value: "0",
      icon: AlertOctagon,
      color: "red",
    },
    {
      title: "Yüksek Risk",
      value: "0",
      icon: AlertCircle,
      color: "orange",
    },
    {
      title: "Orta/Düşük Risk",
      value: "0",
      icon: CheckCircle,
      color: "green",
    },
  ];

  const handleExportExcel = async () => {
    try {
      const response = await fetch("/api/risk-assessment/export/excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assessments: filteredAssessments }),
      });

      if (!response.ok) {
        throw new Error("Excel export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `risk-assessments-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Excel dosyası başarıyla indirildi");
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Excel dosyası oluşturulurken bir hata oluştu");
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/risk-assessment/export/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assessments: filteredAssessments }),
      });

      if (!response.ok) {
        throw new Error("PDF export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `risk-assessments-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF dosyası başarıyla indirildi");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("PDF dosyası oluşturulurken bir hata oluştu");
    }
  };

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Değerlendirme</h1>
              <p className="text-gray-600">Risk değerlendirmelerini görüntüleyin ve yönetin</p>
            </div>
            <Button onClick={() => router.push("/risk-assessment/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Değerlendirme
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
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="all">Tüm Riskler</option>
                <option value="Çok Yüksek">Çok Yüksek</option>
                <option value="Yüksek">Yüksek</option>
                <option value="Orta">Orta</option>
                <option value="Düşük">Düşük</option>
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

        {/* Assessment List */}
        <div className="bg-white rounded-lg border shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 text-red-600">{error}</div>
          ) : filteredAssessments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <AlertTriangle className="h-8 w-8 mb-4" />
              <p className="text-lg font-medium">Henüz risk değerlendirmesi bulunmuyor</p>
              <p className="text-sm mt-2">Yeni bir değerlendirme eklemek için butona tıklayın</p>
              <Button
                onClick={() => router.push("/risk-assessment/new")}
                className="mt-4"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Değerlendirme
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => {
                            if (sortField === "title") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                            } else {
                              setSortField("title");
                              setSortOrder("asc");
                            }
                          }}
                          className="flex items-center gap-1"
                        >
                          Başlık
                          {sortField === "title" && (
                            sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lokasyon
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => {
                            if (sortField === "risk") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                            } else {
                              setSortField("risk");
                              setSortOrder("desc");
                            }
                          }}
                          className="flex items-center gap-1"
                        >
                          Risk Seviyesi
                          {sortField === "risk" && (
                            sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => {
                            if (sortField === "createdAt") {
                              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                            } else {
                              setSortField("createdAt");
                              setSortOrder("desc");
                            }
                          }}
                          className="flex items-center gap-1"
                        >
                          Tarih
                          {sortField === "createdAt" && (
                            sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((assessment) => (
                      <tr
                        key={assessment.id}
                        className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/risk-assessment/${assessment.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{assessment.title}</div>
                          <div className="text-sm text-gray-500">{assessment.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{assessment.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(
                              assessment.severity,
                              assessment.likelihood
                            )}`}
                          >
                            {getRiskLevel(assessment.severity, assessment.likelihood)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(assessment.createdAt).toLocaleDateString("tr-TR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      Sayfa {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Toplam {filteredAssessments.length} kayıt
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
