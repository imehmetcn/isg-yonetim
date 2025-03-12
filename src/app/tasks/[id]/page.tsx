"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  updatedAt: string;
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchTask = useCallback(async () => {
    try {
      const response = await fetch(`/api/tasks/${params.id}`);
      if (!response.ok) {
        throw new Error("Görev detayları yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setTask(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const updateTaskStatus = async (newStatus: string) => {
    if (!task) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Görev durumu güncellenirken bir hata oluştu");
      }

      const updatedTask = await response.json();
      setTask(updatedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setUpdating(false);
    }
  };

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

  if (loading) {
    return <div className="flex justify-center items-center h-96">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-96 text-red-500">{error}</div>;
  }

  if (!task) {
    return <div className="flex justify-center items-center h-96">Görev bulunamadı</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Görev Detayı</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Geri Dön
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Öncelik</div>
              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500">Durum</div>
              <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500">Atanan Kişi</div>
              <div>{task.assignedTo}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500">Son Tarih</div>
              <div>{format(new Date(task.dueDate), "dd MMMM yyyy", { locale: tr })}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500">Oluşturan</div>
              <div>{task.createdBy}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500">Oluşturulma Tarihi</div>
              <div>{format(new Date(task.createdAt), "dd MMMM yyyy HH:mm", { locale: tr })}</div>
            </div>
          </div>

          {task.description && (
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Açıklama</div>
              <div className="whitespace-pre-wrap">{task.description}</div>
            </div>
          )}

          <div className="border-t pt-6">
            <div className="text-sm text-gray-500 mb-4">Durum Güncelle</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={task.status === "TODO" ? "default" : "outline"}
                onClick={() => updateTaskStatus("TODO")}
                disabled={updating || task.status === "TODO"}
              >
                Yapılacak
              </Button>
              <Button
                variant={task.status === "IN_PROGRESS" ? "default" : "outline"}
                onClick={() => updateTaskStatus("IN_PROGRESS")}
                disabled={updating || task.status === "IN_PROGRESS"}
              >
                Devam Ediyor
              </Button>
              <Button
                variant={task.status === "REVIEW" ? "default" : "outline"}
                onClick={() => updateTaskStatus("REVIEW")}
                disabled={updating || task.status === "REVIEW"}
              >
                İncelemede
              </Button>
              <Button
                variant={task.status === "COMPLETED" ? "default" : "outline"}
                onClick={() => updateTaskStatus("COMPLETED")}
                disabled={updating || task.status === "COMPLETED"}
              >
                Tamamlandı
              </Button>
              <Button
                variant={task.status === "CANCELLED" ? "default" : "outline"}
                onClick={() => updateTaskStatus("CANCELLED")}
                disabled={updating || task.status === "CANCELLED"}
              >
                İptal Edildi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
