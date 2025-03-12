import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trainings, trainingParticipants } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Katılımcı listesini getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Eğitimi kontrol et
    const training = await db.query.trainings.findFirst({
      where: eq(trainings.id, params.id),
    });

    if (!training) {
      return NextResponse.json({ error: "Eğitim bulunamadı" }, { status: 404 });
    }

    // Katılımcıları getir
    const participants = await db.query.trainingParticipants.findMany({
      where: eq(trainingParticipants.trainingId, params.id),
      orderBy: (trainingParticipants, { desc }) => [desc(trainingParticipants.status)],
    });

    return NextResponse.json(participants);
  } catch (error) {
    console.error("Katılımcı listesi hatası:", error);
    return NextResponse.json({ error: "Katılımcı listesi alınamadı" }, { status: 500 });
  }
}

// Yeni katılımcı ekle
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Sadece admin kullanıcılar erişebilir
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const { personnelId, status, completionDate } = await _req.json();

    // Gerekli alanları kontrol et
    if (!personnelId) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Eğitimi kontrol et
    const training = await db.query.trainings.findFirst({
      where: eq(trainings.id, params.id),
    });

    if (!training) {
      return NextResponse.json({ error: "Eğitim bulunamadı" }, { status: 404 });
    }

    // Yeni katılımcı oluştur
    const [participant] = await db
      .insert(trainingParticipants)
      .values({
        id: crypto.randomUUID(),
        trainingId: params.id,
        userId: personnelId,
        status: status || "PENDING",
        completedAt: completionDate ? new Date(completionDate).toISOString() : null,
      })
      .returning();

    return NextResponse.json(participant);
  } catch (error) {
    console.error("Katılımcı ekleme hatası:", error);
    return NextResponse.json({ error: "Katılımcı eklenemedi" }, { status: 500 });
  }
}
