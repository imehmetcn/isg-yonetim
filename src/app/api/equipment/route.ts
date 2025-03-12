import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

// Ekipman listesi
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock data for equipment
    const mockEquipment = [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
    ];

    return NextResponse.json(mockEquipment);
  } catch (error) {
    console.error("Ekipman getirme hatası:", error);
    return NextResponse.json({ error: "Ekipmanlar getirilirken bir hata oluştu" }, { status: 500 });
  }
}

// Yeni ekipman oluştur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, serialNumber, location, lastMaintenanceDate, nextMaintenanceDate } = body;

    if (!name || !type || !serialNumber) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Mock response - just return the body with an id
    return NextResponse.json({
      id: Math.floor(Math.random() * 1000).toString(),
      name,
      type,
      serialNumber,
      location: location || "",
      status: "ACTIVE",
      lastMaintenanceDate: lastMaintenanceDate || new Date().toISOString(),
      nextMaintenanceDate:
        nextMaintenanceDate || new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      userId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Ekipman oluşturma hatası:", error);
    return NextResponse.json({ error: "Ekipman oluşturulurken bir hata oluştu" }, { status: 500 });
  }
}
