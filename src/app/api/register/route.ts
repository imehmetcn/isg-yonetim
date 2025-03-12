import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Tüm alanlar gereklidir" }, { status: 400 });
    }

    // Email kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Bu email adresi zaten kullanılıyor" }, { status: 400 });
    }

    // Şifreyi hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcı oluşturma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN", // İlk kullanıcı admin olsun
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json({ error: "Kayıt sırasında bir hata oluştu" }, { status: 500 });
  }
}
