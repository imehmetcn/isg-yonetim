import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Kullanıcı listesini getir
export async function GET() {
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

    // Kullanıcıları getir
    const userList = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Hassas bilgileri çıkar
    const safeUsers = userList.map(({ password, ...user }) => user);

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error("Kullanıcı listesi hatası:", error);
    return NextResponse.json({ error: "Kullanıcı listesi alınamadı" }, { status: 500 });
  }
}

// Yeni kullanıcı oluştur
export async function POST(req: Request) {
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

    const { name, email, password, role } = await req.json();

    // Gerekli alanları kontrol et
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Tüm alanlar gerekli" }, { status: 400 });
    }

    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Geçersiz email formatı" }, { status: 400 });
    }

    // Email kullanımda mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Bu email adresi zaten kullanımda" }, { status: 400 });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Hassas bilgileri çıkar
    const { password: _, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Kullanıcı oluşturma hatası:", error);
    return NextResponse.json({ error: "Kullanıcı oluşturulamadı" }, { status: 500 });
  }
}
