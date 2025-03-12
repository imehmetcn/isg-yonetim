import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';

// Bildirimi okundu olarak işaretle
export async function PUT(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Bildirim ID'si gerekli" }, { status: 400 });
    }

    // Gerçek bir veritabanı olmadığı için sadece başarılı yanıt döndür
    return NextResponse.json({
      success: true,
      message: "Bildirim okundu olarak işaretlendi",
      id,
    });
  } catch (error) {
    console.error("Bildirim güncelleme hatası:", error);
    return NextResponse.json({ error: "Bildirim güncellenirken bir hata oluştu" }, { status: 500 });
  }
}
