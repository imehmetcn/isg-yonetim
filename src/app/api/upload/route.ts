import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    // Dosya uzantısını kontrol et
    const allowedTypes = ["pdf", "doc", "docx", "xls", "xlsx"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return NextResponse.json({ error: "Geçersiz dosya formatı" }, { status: 400 });
    }

    // Dosya boyutunu kontrol et (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Dosya boyutu çok büyük (max 10MB)" }, { status: 400 });
    }

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${file.name}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosyayı kaydet
    await writeFile(join(uploadDir, uniqueFileName), buffer);

    // Dosya URL'ini döndür
    const fileUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    return NextResponse.json({ error: "Dosya yüklenirken bir hata oluştu" }, { status: 500 });
  }
}
