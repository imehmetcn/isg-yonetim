import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';

// Personel detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock personnel data
    const mockPersonnel: Record<string, any> = {
      "1": {
        id: "1",
        name: "Ahmet Yılmaz",
        position: "İSG Uzmanı",
        department: "İSG",
        email: "ahmet.yilmaz@example.com",
        phone: "+90 555 123 4567",
        status: "ACTIVE",
        employeeId: "EMP001",
        safetyTrainingStatus: "COMPLETED",
        lastTrainingDate: "2024-01-15T10:00:00Z",
        nextTrainingDate: "2024-07-15T10:00:00Z",
        createdAt: "2023-05-10T09:00:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        address: "Ankara, Çankaya",
        birthDate: "1985-05-15",
        emergencyContact: "Mehmet Yılmaz - +90 555 987 6543",
        bloodType: "A Rh+",
        certifications: [
          { name: "A Sınıfı İSG Uzmanı", issueDate: "2020-03-10", expiryDate: "2025-03-10" },
          { name: "İlk Yardım Eğitmeni", issueDate: "2021-06-15", expiryDate: "2024-06-15" },
        ],
        trainingHistory: [
          {
            name: "İSG Temel Eğitimi",
            date: "2023-01-15",
            duration: "8 saat",
            instructor: "Prof. Dr. Ayşe Demir",
          },
          {
            name: "Acil Durum Eğitimi",
            date: "2023-07-20",
            duration: "4 saat",
            instructor: "Mehmet Kaya",
          },
          {
            name: "Yangın Güvenliği",
            date: "2024-01-15",
            duration: "4 saat",
            instructor: "Ali Can",
          },
        ],
      },
      "2": {
        id: "2",
        name: "Ayşe Demir",
        position: "İK Uzmanı",
        department: "İnsan Kaynakları",
        email: "ayse.demir@example.com",
        phone: "+90 555 234 5678",
        status: "ACTIVE",
        employeeId: "EMP002",
        safetyTrainingStatus: "COMPLETED",
        lastTrainingDate: "2024-02-10T14:00:00Z",
        nextTrainingDate: "2024-08-10T14:00:00Z",
        createdAt: "2023-06-15T11:00:00Z",
        updatedAt: "2024-02-10T14:30:00Z",
        address: "İstanbul, Kadıköy",
        birthDate: "1990-08-20",
        emergencyContact: "Hasan Demir - +90 555 876 5432",
        bloodType: "B Rh+",
        certifications: [
          { name: "İnsan Kaynakları Yönetimi", issueDate: "2019-05-20", expiryDate: "2024-05-20" },
        ],
        trainingHistory: [
          {
            name: "İSG Temel Eğitimi",
            date: "2023-06-20",
            duration: "8 saat",
            instructor: "Ahmet Yılmaz",
          },
          {
            name: "İletişim Becerileri",
            date: "2023-09-15",
            duration: "16 saat",
            instructor: "Prof. Dr. Zeynep Kara",
          },
          {
            name: "Acil Durum Eğitimi",
            date: "2024-02-10",
            duration: "4 saat",
            instructor: "Mehmet Kaya",
          },
        ],
      },
      "3": {
        id: "3",
        name: "Mehmet Kaya",
        position: "Üretim Müdürü",
        department: "Üretim",
        email: "mehmet.kaya@example.com",
        phone: "+90 555 345 6789",
        status: "ACTIVE",
        employeeId: "EMP003",
        safetyTrainingStatus: "PENDING",
        lastTrainingDate: null,
        nextTrainingDate: "2024-04-20T09:00:00Z",
        createdAt: "2023-07-20T10:00:00Z",
        updatedAt: "2024-03-01T09:30:00Z",
        address: "İzmir, Bornova",
        birthDate: "1982-03-10",
        emergencyContact: "Fatma Kaya - +90 555 765 4321",
        bloodType: "0 Rh-",
        certifications: [
          { name: "Üretim Yönetimi", issueDate: "2018-10-15", expiryDate: "2023-10-15" },
          { name: "Kalite Kontrol", issueDate: "2020-11-20", expiryDate: "2025-11-20" },
        ],
        trainingHistory: [
          {
            name: "Makine Güvenliği",
            date: "2023-08-10",
            duration: "8 saat",
            instructor: "Ali Can",
          },
        ],
      },
      "4": {
        id: "4",
        name: "Zeynep Şahin",
        position: "Muhasebe Uzmanı",
        department: "Finans",
        email: "zeynep.sahin@example.com",
        phone: "+90 555 456 7890",
        status: "INACTIVE",
        employeeId: "EMP004",
        safetyTrainingStatus: "EXPIRED",
        lastTrainingDate: "2023-06-10T10:00:00Z",
        nextTrainingDate: "2023-12-10T10:00:00Z",
        createdAt: "2023-03-15T09:00:00Z",
        updatedAt: "2024-01-05T11:30:00Z",
        address: "Ankara, Keçiören",
        birthDate: "1988-11-25",
        emergencyContact: "Mustafa Şahin - +90 555 654 3210",
        bloodType: "AB Rh+",
        certifications: [{ name: "SMMM", issueDate: "2017-07-10", expiryDate: null }],
        trainingHistory: [
          {
            name: "İSG Temel Eğitimi",
            date: "2023-03-20",
            duration: "8 saat",
            instructor: "Ahmet Yılmaz",
          },
          {
            name: "Acil Durum Eğitimi",
            date: "2023-06-10",
            duration: "4 saat",
            instructor: "Mehmet Kaya",
          },
        ],
      },
      "5": {
        id: "5",
        name: "Ali Can",
        position: "Bakım Teknisyeni",
        department: "Teknik",
        email: "ali.can@example.com",
        phone: "+90 555 567 8901",
        status: "ACTIVE",
        employeeId: "EMP005",
        safetyTrainingStatus: "COMPLETED",
        lastTrainingDate: "2024-02-25T10:30:00Z",
        nextTrainingDate: "2024-08-25T10:30:00Z",
        createdAt: "2024-01-10T14:00:00Z",
        updatedAt: "2024-02-25T11:00:00Z",
        address: "İstanbul, Beşiktaş",
        birthDate: "1992-06-30",
        emergencyContact: "Ayşe Can - +90 555 543 2109",
        bloodType: "A Rh-",
        certifications: [
          { name: "Elektrik Tesisatçısı", issueDate: "2020-02-15", expiryDate: "2025-02-15" },
          { name: "Yüksekte Çalışma", issueDate: "2023-05-10", expiryDate: "2025-05-10" },
        ],
        trainingHistory: [
          {
            name: "İSG Temel Eğitimi",
            date: "2024-01-15",
            duration: "8 saat",
            instructor: "Ahmet Yılmaz",
          },
          {
            name: "Elektrik Güvenliği",
            date: "2024-02-10",
            duration: "8 saat",
            instructor: "Mehmet Kaya",
          },
          {
            name: "Yüksekte Çalışma",
            date: "2024-02-25",
            duration: "8 saat",
            instructor: "Ahmet Yılmaz",
          },
        ],
      },
      "6": {
        id: "6",
        name: "Fatma Yıldız",
        position: "Laboratuvar Teknisyeni",
        department: "AR-GE",
        email: "fatma.yildiz@example.com",
        phone: "+90 555 678 9012",
        status: "ACTIVE",
        employeeId: "EMP006",
        safetyTrainingStatus: "COMPLETED",
        lastTrainingDate: "2024-03-01T09:00:00Z",
        nextTrainingDate: "2024-09-01T09:00:00Z",
        createdAt: "2024-02-15T10:00:00Z",
        updatedAt: "2024-03-01T09:30:00Z",
        address: "İzmir, Karşıyaka",
        birthDate: "1995-09-12",
        emergencyContact: "Hasan Yıldız - +90 555 432 1098",
        bloodType: "0 Rh+",
        certifications: [
          { name: "Laboratuvar Teknisyeni", issueDate: "2022-01-20", expiryDate: "2027-01-20" },
        ],
        trainingHistory: [
          {
            name: "İSG Temel Eğitimi",
            date: "2024-02-20",
            duration: "8 saat",
            instructor: "Ahmet Yılmaz",
          },
          {
            name: "Kimyasal Güvenliği",
            date: "2024-03-01",
            duration: "8 saat",
            instructor: "Prof. Dr. Mehmet Demir",
          },
        ],
      },
    };

    const { id } = params;
    const person = mockPersonnel[id];

    if (!person) {
      return NextResponse.json({ error: "Personel bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(person);
  } catch (error) {
    console.error("Personel detayları hatası:", error);
    return NextResponse.json({ error: "Personel detayları alınamadı" }, { status: 500 });
  }
}

// Personel güncelle
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
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Personel güncelleme hatası:", error);
    return NextResponse.json({ error: "Personel güncellenemedi" }, { status: 500 });
  }
}

// Personel sil
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Log the ID being deleted
    console.log(`Deleting personnel with ID: ${params.id}`);

    // Mock delete - just return success message
    return NextResponse.json({ message: "Personel başarıyla silindi" });
  } catch (error) {
    console.error("Personel silme hatası:", error);
    return NextResponse.json({ error: "Personel silinemedi" }, { status: 500 });
  }
}
