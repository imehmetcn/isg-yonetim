"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/animations/PageTransition";
import CardHover from "@/components/animations/CardHover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Save,
  Clock,
  AlertCircle,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  department: string;
  startDate: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    department: "",
    startDate: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          throw new Error("Profil bilgileri yüklenemedi");
        }
        const data = await response.json();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          department: data.department || "",
          startDate: data.startDate || "",
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Profil güncellenirken bir hata oluştu");
      }

      toast.success("Profil başarıyla güncellendi");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Yükleniyor...</div>;
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-3">Profil</h1>
            <p className="text-muted-foreground text-lg">
              Kişisel bilgilerinizi görüntüleyin ve düzenleyin
            </p>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} className="px-6 py-2 h-auto">
            {saving ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Değişiklikleri Kaydet
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-lg mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <CardHover className="p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center text-base">
                  <User className="h-4 w-4 mr-2" />
                  Ad Soyad
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="py-2 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center text-base">
                  <Mail className="h-4 w-4 mr-2" />
                  E-posta
                </Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="py-2 text-base bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  E-posta adresiniz değiştirilemez
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center text-base">
                  <Phone className="h-4 w-4 mr-2" />
                  Telefon
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="py-2 text-base"
                  placeholder="(5XX) XXX XX XX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center text-base">
                  <Building className="h-4 w-4 mr-2" />
                  Departman
                </Label>
                <Input
                  id="department"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  className="py-2 text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center text-base">
                  <Calendar className="h-4 w-4 mr-2" />
                  İşe Başlama Tarihi
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={profile.startDate}
                  onChange={(e) => setProfile({ ...profile, startDate: e.target.value })}
                  className="py-2 text-base"
                />
              </div>
            </div>
          </div>
        </CardHover>
      </div>
    </PageTransition>
  );
}
