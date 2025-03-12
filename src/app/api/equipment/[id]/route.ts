import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';

// Ekipman detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock equipment data
    const mockEquipment: Record<string, any> = {
      "1": {
        id: "1",
        name: "Yangın Söndürücü A-1",
        type: "FIRE",
        serialNumber: "FS-2024-001",
        location: "Üretim Alanı - Giriş",
        status: "ACTIVE",
        lastMaintenanceDate: "2024-01-15T10:00:00Z",
        nextMaintenanceDate: "2024-07-15T10:00:00Z",
        createdAt: "2023-07-10T09:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        manufacturer: "ABC Yangın Sistemleri",
        model: "ABC-5000",
        purchaseDate: "2023-01-10T00:00:00Z",
        warrantyExpiration: "2026-01-10T00:00:00Z",
        responsiblePerson: "Mehmet Yılmaz",
        notes: "Son bakımda tüp basıncı kontrol edildi.",
        maintenanceHistory: [
          {
            date: "2023-07-15T10:00:00Z",
            type: "Rutin Kontrol",
            technician: "Ali Kaya",
            notes: "Basınç normal, fiziksel hasar yok.",
          },
          {
            date: "2024-01-15T10:00:00Z",
            type: "Yıllık Bakım",
            technician: "Ahmet Demir",
            notes: "Tüp basıncı kontrol edildi, etiket yenilendi.",
          },
        ],
      },
      "2": {
        id: "2",
        name: "İlk Yardım Dolabı B-2",
        type: "FIRST_AID",
        serialNumber: "FA-2024-002",
        location: "Ofis - Mutfak",
        status: "ACTIVE",
        lastMaintenanceDate: "2024-02-10T14:00:00Z",
        nextMaintenanceDate: "2024-08-10T14:00:00Z",
        createdAt: "2023-08-15T11:20:00Z",
        updatedAt: "2024-02-10T14:30:00Z",
        manufacturer: "Sağlık Medikal",
        model: "SM-100",
        purchaseDate: "2023-02-15T00:00:00Z",
        warrantyExpiration: "2025-02-15T00:00:00Z",
        responsiblePerson: "Ayşe Demir",
        notes: "Son kontrolde eksik malzemeler tamamlandı.",
        maintenanceHistory: [
          {
            date: "2023-08-10T14:00:00Z",
            type: "İçerik Kontrolü",
            technician: "Zeynep Kara",
            notes: "Bandajlar ve antiseptik solüsyon yenilendi.",
          },
          {
            date: "2024-02-10T14:00:00Z",
            type: "Periyodik Kontrol",
            technician: "Zeynep Kara",
            notes: "Tüm malzemeler kontrol edildi, son kullanma tarihleri güncellendi.",
          },
        ],
      },
      "3": {
        id: "3",
        name: "Baret Seti C-10",
        type: "PROTECTIVE",
        serialNumber: "PS-2024-010",
        location: "Depo - Raf 3",
        status: "ACTIVE",
        lastMaintenanceDate: "2024-01-20T09:00:00Z",
        nextMaintenanceDate: "2024-07-20T09:00:00Z",
        createdAt: "2023-09-05T10:15:00Z",
        updatedAt: "2024-01-20T09:45:00Z",
        manufacturer: "Güvenli İş",
        model: "GI-500",
        purchaseDate: "2023-03-20T00:00:00Z",
        warrantyExpiration: "2025-03-20T00:00:00Z",
        responsiblePerson: "Mustafa Şahin",
        notes: "Toplam 10 adet baret, tümü iyi durumda.",
        maintenanceHistory: [
          {
            date: "2023-07-20T09:00:00Z",
            type: "Görsel Kontrol",
            technician: "Mustafa Şahin",
            notes: "Baretlerde çatlak veya hasar yok.",
          },
          {
            date: "2024-01-20T09:00:00Z",
            type: "Periyodik Kontrol",
            technician: "Mustafa Şahin",
            notes: "Tüm baretler temizlendi ve kontrol edildi.",
          },
        ],
      },
      "4": {
        id: "4",
        name: "Acil Durum Aydınlatması D-5",
        type: "EMERGENCY",
        serialNumber: "EM-2024-005",
        location: "Koridor - Çıkış",
        status: "BROKEN",
        lastMaintenanceDate: "2023-12-05T11:00:00Z",
        nextMaintenanceDate: "2024-06-05T11:00:00Z",
        createdAt: "2023-06-20T13:30:00Z",
        updatedAt: "2024-02-15T09:10:00Z",
        manufacturer: "Elektrik Plus",
        model: "EP-200",
        purchaseDate: "2023-04-05T00:00:00Z",
        warrantyExpiration: "2025-04-05T00:00:00Z",
        responsiblePerson: "Ali Kaya",
        notes: "Batarya arızası nedeniyle çalışmıyor, değişim planlandı.",
        maintenanceHistory: [
          {
            date: "2023-06-05T11:00:00Z",
            type: "Kurulum",
            technician: "Emre Can",
            notes: "Cihaz kuruldu ve test edildi.",
          },
          {
            date: "2023-12-05T11:00:00Z",
            type: "Periyodik Kontrol",
            technician: "Emre Can",
            notes: "Batarya şarj seviyesi düşük, izlemeye alındı.",
          },
          {
            date: "2024-02-15T09:00:00Z",
            type: "Arıza Tespiti",
            technician: "Emre Can",
            notes: "Batarya tamamen arızalı, değişim gerekiyor.",
          },
        ],
      },
      "5": {
        id: "5",
        name: "Gaz Maskesi E-3",
        type: "PROTECTIVE",
        serialNumber: "PM-2024-003",
        location: "Laboratuvar - Dolap 2",
        status: "ACTIVE",
        lastMaintenanceDate: "2024-02-25T10:30:00Z",
        nextMaintenanceDate: "2024-08-25T10:30:00Z",
        createdAt: "2023-10-10T14:45:00Z",
        updatedAt: "2024-02-25T11:00:00Z",
        manufacturer: "Kimya Koruma",
        model: "KK-300",
        purchaseDate: "2023-05-15T00:00:00Z",
        warrantyExpiration: "2026-05-15T00:00:00Z",
        responsiblePerson: "Fatma Yıldız",
        notes: "Filtreler yeni değiştirildi.",
        maintenanceHistory: [
          {
            date: "2023-08-25T10:30:00Z",
            type: "Filtre Kontrolü",
            technician: "Fatma Yıldız",
            notes: "Filtreler iyi durumda.",
          },
          {
            date: "2024-02-25T10:30:00Z",
            type: "Filtre Değişimi",
            technician: "Fatma Yıldız",
            notes: "Filtreler değiştirildi, maske temizlendi.",
          },
        ],
      },
      "6": {
        id: "6",
        name: "Yangın Alarmı F-7",
        type: "FIRE",
        serialNumber: "FA-2024-007",
        location: "Üretim Alanı - Duvar",
        status: "MAINTENANCE",
        lastMaintenanceDate: "2024-03-01T09:00:00Z",
        nextMaintenanceDate: "2024-09-01T09:00:00Z",
        createdAt: "2023-05-15T10:00:00Z",
        updatedAt: "2024-03-01T09:30:00Z",
        manufacturer: "Alarm Sistemleri",
        model: "AS-700",
        purchaseDate: "2023-01-05T00:00:00Z",
        warrantyExpiration: "2026-01-05T00:00:00Z",
        responsiblePerson: "Mehmet Yılmaz",
        notes: "Sensör değişimi için bakımda.",
        maintenanceHistory: [
          {
            date: "2023-09-01T09:00:00Z",
            type: "Periyodik Kontrol",
            technician: "Ahmet Demir",
            notes: "Sistem test edildi, çalışıyor.",
          },
          {
            date: "2024-03-01T09:00:00Z",
            type: "Sensör Değişimi",
            technician: "Ahmet Demir",
            notes: "Sensör arızası tespit edildi, değişim için söküldü.",
          },
        ],
      },
    };

    const { id } = params;
    const equipmentItem = mockEquipment[id];

    if (!equipmentItem) {
      return NextResponse.json({ error: "Ekipman bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(equipmentItem);
  } catch (error) {
    console.error("Ekipman detayları hatası:", error);
    return NextResponse.json({ error: "Ekipman detayları alınamadı" }, { status: 500 });
  }
}

// Ekipmanı güncelle
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    // Mock update - just return the body with the id
    return NextResponse.json({
      ...body,
      id,
    });
  } catch (error) {
    console.error("Ekipman güncelleme hatası:", error);
    return NextResponse.json({ error: "Ekipman güncellenemedi" }, { status: 500 });
  }
}

// Ekipmanı sil
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id } = params;
    
    // Admin kontrolü
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Bu işlem için admin yetkisi gerekli" }, { status: 403 });
    }

    // Mock delete - just return success message
    return NextResponse.json({ message: `${id} ID'li ekipman başarıyla silindi` });
  } catch (error) {
    console.error("Ekipman silme hatası:", error);
    return NextResponse.json({ error: "Ekipman silinemedi" }, { status: 500 });
  }
}
