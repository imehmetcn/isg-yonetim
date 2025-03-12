import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Kullanıcı detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Sadece admin kullanıcılar veya kendisi erişebilir
    if (session.user.role !== "admin" && session.user.id !== params.id) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    // Kullanıcıyı getir
    const user = await db.query.users.findFirst({
      where: eq(users.id, params.id),
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Hassas bilgileri çıkar
    const { password, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Kullanıcı detayları hatası:", error);
    return NextResponse.json({ error: "Kullanıcı detayları alınamadı" }, { status: 500 });
  }
}

// Kullanıcı güncelle
export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Sadece admin kullanıcılar veya kendisi erişebilir
    if (session.user.role !== "admin" && session.user.id !== params.id) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    const { name, email, password, role } = await _req.json();

    // Kullanıcıyı kontrol et
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, params.id),
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Email değişiyorsa, yeni email kullanımda mı kontrol et
    if (email && email !== existingUser.email) {
      const emailExists = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (emailExists) {
        return NextResponse.json({ error: "Bu email adresi zaten kullanımda" }, { status: 400 });
      }
    }

    // Güncellenecek alanları hazırla
    const updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (role && session.user.role === "admin") updates.role = role;

    // Kullanıcıyı güncelle
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, params.id))
      .returning();

    // Hassas bilgileri çıkar
    const { password: _, ...safeUser } = updatedUser;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    return NextResponse.json({ error: "Kullanıcı güncellenemedi" }, { status: 500 });
  }
}

// Kullanıcı sil
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
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

    // Kullanıcıyı kontrol et
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, params.id),
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Admin kullanıcıyı silmeye çalışıyorsa engelle
    if (existingUser.role === "admin") {
      return NextResponse.json({ error: "Admin kullanıcı silinemez" }, { status: 400 });
    }

    // Kullanıcıyı sil
    await db.delete(users).where(eq(users.id, params.id));

    return NextResponse.json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    console.error("Kullanıcı silme hatası:", error);
    return NextResponse.json({ error: "Kullanıcı silinemedi" }, { status: 500 });
  }
}
