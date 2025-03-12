"use client";

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react";
import { PageTransition } from "@/components/animations/PageTransition";
import { SectionTransition } from "@/components/animations/SectionTransition";
import { CardHover } from "@/components/animations/CardHover";
import { motion } from "framer-motion";
import {
  Users,
  Clock,
  CheckCircle,
  UserPlus,
  Plus,
  Search,
  FileDown,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Personnel {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string | null;
  phone: string | null;
  status: string;
  createdAt: Date;
}

export default function PersonnelPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        // API çağrısı burada yapılacak
        // const response = await fetch("/api/personnel");
        // const data = await response.json();
        // setPersonnel(data);
        setPersonnel([]);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Bir hata oluştu");
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, []);

  const stats = [
    {
      title: "Toplam Personel",
      value: "0",
      icon: Users,
      color: "blue",
    },
    {
      title: "Aktif",
      value: "0",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Yeni Başlayan",
      value: "0",
      icon: UserPlus,
      color: "yellow",
    },
    {
      title: "İnaktif",
      value: "0",
      icon: Clock,
      color: "gray",
    },
  ];

  const handleNewPersonnel = () => {
    router.push("/personnel/new");
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch("/api/personnel/export/excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ personnel }),
      });

      if (!response.ok) {
        throw new Error("Excel export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `personnel-${new Date().toISOString().split("T")[0]}.xlsx`;
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
      const response = await fetch("/api/personnel/export/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ personnel }),
      });

      if (!response.ok) {
        throw new Error("PDF export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `personnel-${new Date().toISOString().split("T")[0]}.pdf`;
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Personel</h1>
              <p className="text-gray-600">Personel kayıtlarını yönetin ve takip edin</p>
            </div>
            <Button onClick={handleNewPersonnel}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Personel
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
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">İnaktif</option>
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

        {/* Personnel List */}
        <div className="bg-white rounded-lg border shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 text-red-600">{error}</div>
          ) : personnel.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Users className="h-8 w-8 mb-4" />
              <p className="text-lg font-medium">Henüz personel kaydı bulunmuyor</p>
              <p className="text-sm mt-2">Yeni bir personel eklemek için butona tıklayın</p>
              <Button
                onClick={handleNewPersonnel}
                className="mt-4"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Personel
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ad Soyad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pozisyon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departman
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İletişim
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {personnel.map((person) => (
                    <tr
                      key={person.id}
                      className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/personnel/${person.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{person.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {person.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {person.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {person.email && <div>{person.email}</div>}
                        {person.phone && <div>{person.phone}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            person.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {person.status === "ACTIVE" ? "Aktif" : "İnaktif"}
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
