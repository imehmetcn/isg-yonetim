import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trainings, trainingParticipants } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { eq } from "drizzle-orm";

// Katılımcı detaylarını getir
export async function GET(
  _req: Request,
  { params }: { params: { id: string; participantId: string } }
) {
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

    // Katılımcıyı getir
    const participant = await db.query.trainingParticipants.findFirst({
      where: eq(trainingParticipants.id, params.participantId),
    });

    if (!participant) {
      return NextResponse.json({ error: "Katılımcı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(participant);
  } catch (error) {
    console.error("Katılımcı detayları hatası:", error);
    return NextResponse.json({ error: "Katılımcı detayları alınamadı" }, { status: 500 });
  }
}

// Katılımcı güncelle
export async function PUT(
  req: Request,
  { params }: { params: { id: string; participantId: string } }
) {
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

    const { status, completionDate, score, feedback } = await req.json();

    // Eğitimi kontrol et
    const training = await db.query.trainings.findFirst({
      where: eq(trainings.id, params.id),
    });

    if (!training) {
      return NextResponse.json({ error: "Eğitim bulunamadı" }, { status: 404 });
    }

    // Katılımcıyı kontrol et
    const existingParticipant = await db.query.trainingParticipants.findFirst({
      where: eq(trainingParticipants.id, params.participantId),
    });

    if (!existingParticipant) {
      return NextResponse.json({ error: "Katılımcı bulunamadı" }, { status: 404 });
    }

    // Güncellenecek alanları hazırla
    const updates: any = {};
    if (status) updates.status = status;
    if (completionDate !== undefined)
      updates.completionDate = completionDate
        ? Math.floor(new Date(completionDate).getTime() / 1000)
        : null;
    if (score !== undefined) updates.score = score;
    if (feedback !== undefined) updates.feedback = feedback;

    // Katılımcıyı güncelle
    const [updatedParticipant] = await db
      .update(trainingParticipants)
      .set(updates)
      .where(eq(trainingParticipants.id, params.participantId))
      .returning();

    return NextResponse.json(updatedParticipant);
  } catch (error) {
    console.error("Katılımcı güncelleme hatası:", error);
    return NextResponse.json({ error: "Katılımcı güncellenemedi" }, { status: 500 });
  }
}

// Katılımcı sil
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; participantId: string } }
) {
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

    // Eğitimi kontrol et
    const training = await db.query.trainings.findFirst({
      where: eq(trainings.id, params.id),
    });

    if (!training) {
      return NextResponse.json({ error: "Eğitim bulunamadı" }, { status: 404 });
    }

    // Katılımcıyı kontrol et
    const participant = await db.query.trainingParticipants.findFirst({
      where: eq(trainingParticipants.id, params.participantId),
    });

    if (!participant) {
      return NextResponse.json({ error: "Katılımcı bulunamadı" }, { status: 404 });
    }

    // Katılımcıyı sil
    await db
      .delete(trainingParticipants)
      .where(eq(trainingParticipants.id, params.participantId));

    return NextResponse.json({ message: "Katılımcı başarıyla silindi" });
  } catch (error) {
    console.error("Katılımcı silme hatası:", error);
    return NextResponse.json({ error: "Katılımcı silinemedi" }, { status: 500 });
  }
}
