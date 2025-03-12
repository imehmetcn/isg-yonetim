"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/animations/PageTransition";
import CardHover from "@/components/animations/CardHover";
import {
  Bell,
  AlertCircle,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  createdAt: string;
  read: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // API entegrasyonu tamamlanana kadar yükleme durumunu simüle ediyoruz
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotifications([]);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) {
    return <div className="flex justify-center items-center h-96">Yükleniyor...</div>;
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <PageTransition>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-3">Bildirimler</h1>
            <p className="text-muted-foreground text-lg">
              {unreadCount > 0
                ? `${unreadCount} okunmamış bildiriminiz var`
                : "Tüm bildirimleri okudunuz"}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-lg mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <CardHover className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Bildiriminiz Bulunmuyor</h3>
            <p className="text-muted-foreground">
              Şu anda görüntülenecek bildirim bulunmuyor.
            </p>
          </div>
        </CardHover>
      </div>
    </PageTransition>
  );
}
