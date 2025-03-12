"use client";

import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
}

type SortField = "dueDate" | "priority" | "createdAt" | "status";
type SortOrder = "asc" | "desc";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Görevler yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setLoading(false);
    }
  }, []);

  const filterAndSortTasks = useCallback(() => {
    let filtered = [...tasks];

    // Arama filtresi
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.assignedTo.toLowerCase().includes(searchLower)
      );
    }

    // Durum filtresi
    if (statusFilter && statusFilter !== "ALL") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Öncelik filtresi
    if (priorityFilter && priorityFilter !== "ALL") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Sıralama
    filtered.sort((a, b) => {
      if (sortField === "dueDate") {
        return sortOrder === "asc"
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      if (sortField === "priority") {
        const priorityOrder = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };
        return sortOrder === "asc"
          ? priorityOrder[a.priority as keyof typeof priorityOrder] -
              priorityOrder[b.priority as keyof typeof priorityOrder]
          : priorityOrder[b.priority as keyof typeof priorityOrder] -
              priorityOrder[a.priority as keyof typeof priorityOrder];
      }
      if (sortField === "createdAt") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortField === "status") {
        const statusOrder = { TODO: 0, IN_PROGRESS: 1, REVIEW: 2, COMPLETED: 3, CANCELLED: 4 };
        return sortOrder === "asc"
          ? statusOrder[a.status as keyof typeof statusOrder] -
              statusOrder[b.status as keyof typeof statusOrder]
          : statusOrder[b.status as keyof typeof statusOrder] -
              statusOrder[a.status as keyof typeof statusOrder];
      }
      return 0;
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    filterAndSortTasks();
  }, [filterAndSortTasks]);

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: "bg-gray-500",
      MEDIUM: "bg-yellow-500",
      HIGH: "bg-orange-500",
      CRITICAL: "bg-red-500",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      TODO: "bg-gray-500",
      IN_PROGRESS: "bg-blue-500",
      REVIEW: "bg-yellow-500",
      COMPLETED: "bg-green-500",
      CANCELLED: "bg-red-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-96 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Görevler</h1>
        <Button onClick={() => router.push("/tasks/new")}>Yeni Görev Ekle</Button>
      </div>

      <div className="grid gap-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Görev ara..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Durum filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tümü</SelectItem>
                <SelectItem value="TODO">Yapılacak</SelectItem>
                <SelectItem value="IN_PROGRESS">Devam Ediyor</SelectItem>
                <SelectItem value="REVIEW">İncelemede</SelectItem>
                <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Öncelik filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tümü</SelectItem>
                <SelectItem value="LOW">Düşük</SelectItem>
                <SelectItem value="MEDIUM">Orta</SelectItem>
                <SelectItem value="HIGH">Yüksek</SelectItem>
                <SelectItem value="CRITICAL">Kritik</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead onClick={() => toggleSort("priority")} className="cursor-pointer">
                  Öncelik {getSortIcon("priority")}
                </TableHead>
                <TableHead onClick={() => toggleSort("status")} className="cursor-pointer">
                  Durum {getSortIcon("status")}
                </TableHead>
                <TableHead>Atanan Kişi</TableHead>
                <TableHead onClick={() => toggleSort("dueDate")} className="cursor-pointer">
                  Son Tarih {getSortIcon("dueDate")}
                </TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map(task => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>
                      {format(new Date(task.dueDate), "dd MMMM yyyy", { locale: tr })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" onClick={() => router.push(`/tasks/${task.id}`)}>
                        Detay
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sayfalama */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Toplam {filteredTasks.length} görev, Sayfa {currentPage} /{" "}
          {Math.ceil(filteredTasks.length / itemsPerPage)}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Önceki
          </Button>
          {Array.from(
            { length: Math.min(5, Math.ceil(filteredTasks.length / itemsPerPage)) },
            (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            }
          )}
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage(prev =>
                Math.min(prev + 1, Math.ceil(filteredTasks.length / itemsPerPage))
              )
            }
            disabled={currentPage === Math.ceil(filteredTasks.length / itemsPerPage)}
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  );
}
