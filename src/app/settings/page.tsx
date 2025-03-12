"use client";

import { useState, useEffect } from "react";
import PageTransition from "@/components/animations/PageTransition";
import CardHover from "@/components/animations/CardHover";
import SectionTransition from "@/components/animations/SectionTransition";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Bell,
  User,
  Shield,
  Save,
  AlertCircle,
  Clock,
  Moon,
  Sun,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface UserSettings {
  name: string;
  email: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  displayPreferences: {
    theme: string;
    language: string;
    timezone: string;
  };
  securitySettings: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
      inApp: true,
    },
    displayPreferences: {
      theme: "system",
      language: "tr",
      timezone: "Europe/Istanbul",
    },
    securitySettings: {
      twoFactorAuth: false,
      sessionTimeout: 30,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          throw new Error("Ayarlar yüklenemedi");
        }
        const data = await response.json();

        // Merge fetched data with default settings
        setSettings({
          name: data.name || "",
          email: data.email || "",
          notificationPreferences: {
            email: data.notificationPreferences?.email ?? true,
            push: data.notificationPreferences?.push ?? true,
            sms: data.notificationPreferences?.sms ?? false,
            inApp: data.notificationPreferences?.inApp ?? true,
          },
          displayPreferences: {
            theme: "system",
            language: "tr",
            timezone: "Europe/Istanbul",
          },
          securitySettings: {
            twoFactorAuth: false,
            sessionTimeout: 30,
          },
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : "Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: settings.name,
          notificationPreferences: {
            email: settings.notificationPreferences.email,
            push: settings.notificationPreferences.push,
            // Other preferences will be added when API supports them
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Ayarlar güncellenirken bir hata oluştu");
      }

      toast.success("Ayarlar başarıyla güncellendi");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (
    type: keyof UserSettings["notificationPreferences"],
    value: boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: value,
      },
    }));
  };

  const handleDisplayPreferenceChange = (
    type: keyof UserSettings["displayPreferences"],
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      displayPreferences: {
        ...prev.displayPreferences,
        [type]: value,
      },
    }));
  };

  const handleSecuritySettingChange = (
    type: keyof UserSettings["securitySettings"],
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      securitySettings: {
        ...prev.securitySettings,
        [type]: value,
      },
    }));
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
            <h1 className="text-3xl font-bold mb-3">Ayarlar</h1>
            <p className="text-muted-foreground text-lg">
              Hesap ayarlarınızı ve tercihlerinizi yönetin
            </p>
          </div>
          <Button onClick={handleSaveSettings} disabled={saving} className="px-6 py-2 h-auto">
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

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="account" className="text-base py-2 px-4">
              <User className="h-4 w-4 mr-2" />
              Hesap Bilgileri
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-base py-2 px-4">
              <Bell className="h-4 w-4 mr-2" />
              Bildirim Ayarları
            </TabsTrigger>
            <TabsTrigger value="display" className="text-base py-2 px-4">
              <Sun className="h-4 w-4 mr-2" />
              Görünüm Ayarları
            </TabsTrigger>
            <TabsTrigger value="security" className="text-base py-2 px-4">
              <Shield className="h-4 w-4 mr-2" />
              Güvenlik
            </TabsTrigger>
          </TabsList>

          <SectionTransition>
            <TabsContent value="account" className="mt-0">
              <CardHover className="p-8">
                <h2 className="text-xl font-semibold mb-6">Hesap Bilgileri</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input
                        id="name"
                        value={settings.name}
                        onChange={e => setSettings({ ...settings, name: e.target.value })}
                        className="py-2 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        value={settings.email}
                        disabled
                        className="py-2 text-base bg-muted"
                      />
                      <p className="text-sm text-muted-foreground">
                        E-posta adresiniz değiştirilemez
                      </p>
                    </div>
                  </div>
                </div>
              </CardHover>
            </TabsContent>
          </SectionTransition>

          <SectionTransition>
            <TabsContent value="notifications" className="mt-0">
              <CardHover className="p-8">
                <h2 className="text-xl font-semibold mb-6">Bildirim Ayarları</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">E-posta Bildirimleri</Label>
                      <p className="text-sm text-muted-foreground">
                        Önemli güncellemeler ve bildirimler için e-posta alın
                      </p>
                    </div>
                    <Switch
                      checked={settings.notificationPreferences.email}
                      onCheckedChange={checked => handleNotificationChange("email", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Push Bildirimleri</Label>
                      <p className="text-sm text-muted-foreground">Tarayıcı bildirimleri alın</p>
                    </div>
                    <Switch
                      checked={settings.notificationPreferences.push}
                      onCheckedChange={checked => handleNotificationChange("push", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">SMS Bildirimleri</Label>
                      <p className="text-sm text-muted-foreground">
                        Acil durumlar için SMS bildirimleri alın
                      </p>
                    </div>
                    <Switch
                      checked={settings.notificationPreferences.sms}
                      onCheckedChange={checked => handleNotificationChange("sms", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Uygulama İçi Bildirimler</Label>
                      <p className="text-sm text-muted-foreground">
                        Uygulama içi bildirim merkezi güncellemeleri
                      </p>
                    </div>
                    <Switch
                      checked={settings.notificationPreferences.inApp}
                      onCheckedChange={checked => handleNotificationChange("inApp", checked)}
                    />
                  </div>
                </div>
              </CardHover>
            </TabsContent>
          </SectionTransition>

          <SectionTransition>
            <TabsContent value="display" className="mt-0">
              <CardHover className="p-8">
                <h2 className="text-xl font-semibold mb-6">Görünüm Ayarları</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Tema</Label>
                      <Select
                        value={settings.displayPreferences.theme}
                        onValueChange={value => handleDisplayPreferenceChange("theme", value)}
                      >
                        <SelectTrigger className="py-2 text-base">
                          <SelectValue placeholder="Tema seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center">
                              <Sun className="h-4 w-4 mr-2" />
                              Açık
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center">
                              <Moon className="h-4 w-4 mr-2" />
                              Koyu
                            </div>
                          </SelectItem>
                          <SelectItem value="system">
                            <div className="flex items-center">
                              <Settings className="h-4 w-4 mr-2" />
                              Sistem
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Dil</Label>
                      <Select
                        value={settings.displayPreferences.language}
                        onValueChange={value => handleDisplayPreferenceChange("language", value)}
                      >
                        <SelectTrigger className="py-2 text-base">
                          <SelectValue placeholder="Dil seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tr">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2" />
                              Türkçe
                            </div>
                          </SelectItem>
                          <SelectItem value="en">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2" />
                              English
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Saat Dilimi</Label>
                      <Select
                        value={settings.displayPreferences.timezone}
                        onValueChange={value => handleDisplayPreferenceChange("timezone", value)}
                      >
                        <SelectTrigger className="py-2 text-base">
                          <SelectValue placeholder="Saat dilimi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Istanbul">Europe/Istanbul (UTC+3)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (UTC+0/+1)</SelectItem>
                          <SelectItem value="America/New_York">
                            America/New_York (UTC-5/-4)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHover>
            </TabsContent>
          </SectionTransition>

          <SectionTransition>
            <TabsContent value="security" className="mt-0">
              <CardHover className="p-8">
                <h2 className="text-xl font-semibold mb-6">Güvenlik Ayarları</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">İki Faktörlü Doğrulama</Label>
                      <p className="text-sm text-muted-foreground">
                        Hesabınıza ekstra güvenlik katmanı ekleyin
                      </p>
                    </div>
                    <Switch
                      checked={settings.securitySettings.twoFactorAuth}
                      onCheckedChange={checked =>
                        handleSecuritySettingChange("twoFactorAuth", checked)
                      }
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (dakika)</Label>
                    <Select
                      value={settings.securitySettings.sessionTimeout.toString()}
                      onValueChange={value =>
                        handleSecuritySettingChange("sessionTimeout", parseInt(value))
                      }
                    >
                      <SelectTrigger className="py-2 text-base">
                        <SelectValue placeholder="Zaman aşımı seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 dakika</SelectItem>
                        <SelectItem value="30">30 dakika</SelectItem>
                        <SelectItem value="60">1 saat</SelectItem>
                        <SelectItem value="120">2 saat</SelectItem>
                        <SelectItem value="240">4 saat</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Belirtilen süre boyunca işlem yapılmazsa oturumunuz otomatik olarak
                      sonlandırılır
                    </p>
                  </div>
                </div>
              </CardHover>
            </TabsContent>
          </SectionTransition>
        </Tabs>
      </div>
    </PageTransition>
  );
}
