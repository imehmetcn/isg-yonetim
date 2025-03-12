import { db } from ".";
import {
  users,
  equipment,
  maintenanceLogs,
  personnel,
  trainings,
  trainingParticipants,
  audits,
  auditFindings,
  riskAssessments,
  risks,
} from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    // Örnek kullanıcılar
    await db
      .insert(users)
      .values({
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    await db
      .insert(users)
      .values({
        id: "2",
        name: "Test User",
        email: "user@example.com",
        password: await bcrypt.hash("user123", 10),
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    // Örnek ekipmanlar
    const [forklift] = await db
      .insert(equipment)
      .values({
        id: "1",
        name: "Forklift 1",
        type: "Forklift",
        location: "Depo A",
        status: "active",
        lastMaintenance: new Date().toISOString(),
        nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Operatör: Ahmet Yılmaz",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    const [crane] = await db
      .insert(equipment)
      .values({
        id: "2",
        name: "Vinç 1",
        type: "Vinç",
        location: "Saha B",
        status: "maintenance",
        lastMaintenance: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        nextMaintenance: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Operatör: Mehmet Demir",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    // Örnek bakım kayıtları
    await db.insert(maintenanceLogs).values([
      {
        id: "1",
        equipmentId: forklift.id,
        type: "Periyodik Bakım",
        description: "Yağ değişimi yapıldı, frenler kontrol edildi",
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        technician: "Ali Teknik",
        notes: "Bir sonraki bakım 3 ay sonra",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        equipmentId: crane.id,
        type: "Arıza Bakımı",
        description: "Hidrolik sistem arızası tespit edildi",
        date: new Date().toISOString(),
        status: "in_progress",
        technician: "Veli Usta",
        notes: "Yedek parça bekleniyor",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    // Örnek personel
    await db
      .insert(personnel)
      .values([{
        id: "1",
        name: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        phone: "5551234567",
        department: "Üretim",
        position: "Operatör",
        status: "active",
        startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Mehmet Demir",
        email: "mehmet@example.com",
        phone: "5557654321",
        department: "Lojistik",
        position: "Vinç Operatörü",
        status: "active",
        startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }]);

    // Örnek eğitimler
    await db
      .insert(trainings)
      .values({
        id: "1",
        title: "İş Güvenliği Temel Eğitimi",
        description: "Temel iş güvenliği kuralları ve uygulamaları",
        instructor: "Dr. Güvenli",
        type: "Zorunlu",
        status: "completed",
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    // Eğitim katılımcıları
    await db.insert(trainingParticipants).values({
      id: "1",
      trainingId: "1",
      userId: "1",
      status: "completed",
      completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
    });

    await db.insert(trainingParticipants).values({
      id: "2",
      trainingId: "1",
      userId: "2",
      status: "completed",
      completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Örnek denetim
    await db
      .insert(audits)
      .values({
        id: "1",
        title: "Yıllık İSG Denetimi",
        description: "Yıllık rutin İSG denetimi",
        date: new Date().toISOString(),
        location: "Üretim",
        type: "Yıllık",
        status: "in_progress",
        auditor: "İSG Uzmanı",
        department: "Üretim",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    // Denetim bulguları
    await db.insert(auditFindings).values([
      {
        id: "1",
        auditId: "1",
        title: "KKD Kullanımı Eksikliği",
        description: "Üretim alanında çalışanların %30'u uygun KKD kullanmıyor",
        severity: "high",
        status: "open",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Üretim Müdürü",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        auditId: "1",
        title: "Acil Çıkış İşaretleri",
        description: "Depo alanındaki acil çıkış işaretleri standartlara uygun değil",
        severity: "medium",
        status: "in_progress",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Bakım Sorumlusu",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    // Örnek risk değerlendirmesi
    await db
      .insert(riskAssessments)
      .values({
        id: "1",
        title: "Üretim Alanı Risk Değerlendirmesi",
        department: "Üretim",
        assessor: "Risk Değerlendirme Ekibi",
        status: "active",
        date: new Date().toISOString(),
        nextAssessmentDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    // Örnek riskler
    await db.insert(risks).values([
      {
        id: "1",
        assessmentId: "1",
        hazard: "Yüksekte Çalışma",
        description: "Bakım işlemleri sırasında yüksekte çalışma riskleri",
        likelihood: 3,
        severity: 4,
        riskLevel: "high",
        controls: JSON.stringify([
          "Emniyet kemeri kullanımı",
          "Çalışma platformu kurulumu",
          "Düzenli eğitim",
        ]),
        status: "active",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        assessmentId: "1",
        hazard: "Kimyasal Maruziyet",
        description: "Temizlik işlemleri sırasında kimyasal maruziyeti",
        likelihood: 2,
        severity: 3,
        riskLevel: "medium",
        controls: JSON.stringify(["KKD kullanımı", "Havalandırma sistemi", "MSDS eğitimi"]),
        status: "active",
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    console.log("✅ Örnek veriler başarıyla oluşturuldu");
  } catch (error) {
    console.error("❌ Hata:", error);
  }
}

seed();
