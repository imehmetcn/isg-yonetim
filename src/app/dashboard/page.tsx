"use client";

import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import {
  Clock,
  AlertTriangle,
  FileText,
  Bell,
  Calendar,
  Users,
  CheckCircle,
  ChevronRight,
  Building,
  FileDown,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { PageTransition } from "@/components/animations/PageTransition";
import { SectionTransition } from "@/components/animations/SectionTransition";
import { CardHover } from "@/components/animations/CardHover";
import { Input } from "@/components/ui/input";

interface DashboardStats {
  tasks: number;
  tasksChange: number;
  risks: number;
  risksChange: number;
  documents: number;
  documentsChange: number;
  audits: number;
  trainings: number;
  equipment: number;
  personnel: number;
  personnelChange: number;
  reports: number;
  pendingTasks: Array<{
    id: string;
    title: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
  }>;
  notifications: Array<{
    id: string;
    title: string;
    time: string;
    type: "success" | "warning" | "info";
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    company: string;
  }>;
  monthlyStats: Array<{
    month: string;
    risks: number;
    tasks: number;
    audits: number;
  }>;
  taskCompletion: {
    completed: number;
    inProgress: number;
    pending: number;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const email = session?.user?.email || "Kullanıcı";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>({
    tasks: 0,
    tasksChange: 0,
    risks: 0,
    risksChange: 0,
    documents: 0,
    documentsChange: 0,
    audits: 0,
    trainings: 0,
    equipment: 0,
    personnel: 0,
    personnelChange: 0,
    reports: 0,
    pendingTasks: [],
    notifications: [],
    upcomingEvents: [],
    monthlyStats: [],
    taskCompletion: {
      completed: 0,
      inProgress: 0,
      pending: 0
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // API çağrısı burada yapılacak
        // const response = await fetch("/api/dashboard/stats");
        // if (!response.ok) {
        //   throw new Error("İstatistikler yüklenemedi");
        // }
        // const data = await response.json();
        
        // Mock veri kullanarak stats'i güncelliyoruz
        setStats({
          tasks: 12,
          tasksChange: 2,
          risks: 8,
          risksChange: -1,
          documents: 24,
          documentsChange: 5,
          audits: 6,
          trainings: 4,
          equipment: 15,
          personnel: 32,
          personnelChange: 3,
          reports: 9,
          pendingTasks: [
            { id: "1", title: "Risk değerlendirmesi tamamla", dueDate: "2023-06-15", priority: "high" },
            { id: "2", title: "Acil durum tatbikatı planla", dueDate: "2023-06-20", priority: "medium" },
            { id: "3", title: "Eğitim dokümanlarını güncelle", dueDate: "2023-06-25", priority: "low" },
          ],
          notifications: [
            { id: "1", title: "Risk değerlendirmesi tamamlandı", time: "2 saat önce", type: "success" },
            { id: "2", title: "Yeni bir denetim planlandı", time: "1 gün önce", type: "info" },
            { id: "3", title: "Ekipman bakımı gecikti", time: "3 gün önce", type: "warning" },
          ],
          upcomingEvents: [
            { id: "1", title: "İSG Kurulu Toplantısı", date: "15 Haziran", company: "ABC Ltd." },
            { id: "2", title: "Yangın Tatbikatı", date: "20 Haziran", company: "ABC Ltd." },
            { id: "3", title: "İlk Yardım Eğitimi", date: "25 Haziran", company: "ABC Ltd." },
          ],
          monthlyStats: [
            { month: "Ocak", risks: 5, tasks: 8, audits: 2 },
            { month: "Şubat", risks: 3, tasks: 10, audits: 3 },
            { month: "Mart", risks: 7, tasks: 12, audits: 1 },
            { month: "Nisan", risks: 4, tasks: 9, audits: 4 },
            { month: "Mayıs", risks: 6, tasks: 11, audits: 2 },
            { month: "Haziran", risks: 8, tasks: 7, audits: 3 },
          ],
          taskCompletion: {
            completed: 24,
            inProgress: 12,
            pending: 8,
          },
        });
        
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Bir hata oluştu");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardStats = [
    {
      title: "Aktif Firmalar",
      value: "0",
      change: "0 bu ay",
      icon: Building,
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Bekleyen Görevler",
      value: "0",
      change: "0 bu ay",
      icon: Clock,
      color: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      title: "Risk Değerlendirmeleri",
      value: "0",
      change: "0 bu ay",
      icon: AlertTriangle,
      color: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Toplam Belgeler",
      value: "0",
      change: "0 bu ay",
      icon: FileText,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-50 text-red-700 hover:bg-red-100">Yüksek</Badge>;
      case "medium":
        return <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">Orta</Badge>;
      case "low":
        return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">Düşük</Badge>;
      default:
        return null;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <div className="p-2 bg-green-50 rounded-full">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        );
      case "warning":
        return (
          <div className="p-2 bg-yellow-50 rounded-full">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </div>
        );
      case "info":
        return (
          <div className="p-2 bg-blue-50 rounded-full">
            <Bell className="h-4 w-4 text-blue-600" />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Hoş Geldiniz, {email}</h1>
              <p className="text-gray-600">İSG süreçlerinizi takip edin ve yönetin</p>
            </div>
            <select className="h-10 rounded-md border border-input bg-background px-4 py-2 text-sm">
              <option value="all">Tüm Şirketler</option>
            </select>
          </div>
        </motion.div>

        {/* Statistics */}
        <SectionTransition>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <CardHover key={index}>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-600 mb-1">{stat.title}</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </div>
                </CardHover>
              );
            })}
          </div>
        </SectionTransition>

        {/* Charts */}
        <SectionTransition>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Activity Trend */}
            <CardHover>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Aylık Aktivite Trendi</h3>
                  <select className="h-8 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="6">Son 6 Ay</option>
                    <option value="12">Son 1 Yıl</option>
                  </select>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[]}>
                      <defs>
                        <linearGradient id="colorRisks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="risks"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorRisks)"
                      />
                      <Area
                        type="monotone"
                        dataKey="tasks"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorTasks)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardHover>

            {/* Task Completion */}
            <CardHover>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Görev Tamamlanma Durumu</h3>
                  <Button variant="outline" size="sm">
                    <FileDown className="h-4 w-4 mr-2" />
                    Rapor
                  </Button>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={[{ completed: 0, inProgress: 0, pending: 0 }]}>
                      <XAxis />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill="#22c55e" name="Tamamlandı" />
                      <Bar dataKey="inProgress" fill="#3b82f6" name="Devam Ediyor" />
                      <Bar dataKey="pending" fill="#f59e0b" name="Beklemede" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardHover>
          </div>
        </SectionTransition>

        {/* Quick Links with Search */}
        <SectionTransition>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Hızlı Erişim</h3>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input placeholder="Ara..." className="pl-9" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrele
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/risk-assessment">
                <CardHover className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Risk Değerlendirme</h3>
                      <p className="text-sm text-muted-foreground">Yeni değerlendirme oluştur</p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHover>
              </Link>

              <Link href="/audits">
                <CardHover className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Denetimler</h3>
                      <p className="text-sm text-muted-foreground">Denetim planla ve yönet</p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHover>
              </Link>

              <Link href="/trainings">
                <CardHover className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Eğitimler</h3>
                      <p className="text-sm text-muted-foreground">Eğitim planla ve takip et</p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHover>
              </Link>

              <Link href="/documents">
                <CardHover className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <FileText className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Belgeler</h3>
                      <p className="text-sm text-muted-foreground">Belgeleri yönet</p>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHover>
              </Link>
            </div>
          </div>
        </SectionTransition>

        {/* Tasks and Notifications with Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tasks */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Bekleyen Görevler</h3>
                <div className="flex items-center gap-2">
                  <select className="h-8 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="all">Tüm Öncelikler</option>
                    <option value="high">Yüksek</option>
                    <option value="medium">Orta</option>
                    <option value="low">Düşük</option>
                  </select>
                  <Button variant="ghost" size="sm">
                    Tümünü Gör
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {stats?.pendingTasks && stats.pendingTasks.length > 0 ? (
                  stats.pendingTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{task.dueDate}</p>
                        </div>
                      </div>
                      {getPriorityBadge(task.priority)}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Bekleyen görev bulunmuyor
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Bildirimler</h3>
                <Button variant="ghost" size="sm">
                  Tümünü Gör
                </Button>
              </div>
              <div className="space-y-4">
                {stats?.notifications && stats.notifications.length > 0 ? (
                  stats.notifications.map(notification => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-all cursor-pointer"
                    >
                      {getNotificationIcon(notification.type)}
                      <div>
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Yeni bildirim bulunmuyor
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Yaklaşan Etkinlikler</h3>
            <Button variant="ghost" size="sm">
              Takvimi Aç
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
              stats.upcomingEvents.map(event => (
                <CardHover key={event.id} className="cursor-pointer">
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">{event.date}</p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">{event.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHover>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-muted-foreground bg-white rounded-lg border">
                Yaklaşan etkinlik bulunmuyor
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
