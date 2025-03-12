import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { assessments } = await req.json();

    // PDF dosyası oluştur
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      info: {
        Title: "Risk Değerlendirme Raporu",
        Author: session.user?.name || "ISG Yazılımı",
      },
    });

    // Başlık
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("Risk Değerlendirme Raporu", { align: "center" })
      .moveDown();

    // Tarih
    doc
      .font("Helvetica")
      .fontSize(12)
      .text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString("tr-TR")}`, { align: "right" })
      .moveDown();

    // Tablo başlıkları
    const headers = ["Başlık", "Konum", "Risk Seviyesi", "Tarih"];
    const columnWidths = [200, 150, 100, 80];
    let y = doc.y;

    // Başlık arka planı
    doc.rect(50, y, 495, 20).fill("#E0E0E0");

    // Başlık metinleri
    doc.fill("#000000").font("Helvetica-Bold").fontSize(10);

    let x = 50;
    headers.forEach((header, i) => {
      doc.text(header, x, y + 5, {
        width: columnWidths[i],
        align: "left",
      });
      x += columnWidths[i];
    });

    // Veriler
    doc.font("Helvetica");
    y += 25;

    assessments.forEach((assessment: any) => {
      // Sayfa sınırını kontrol et
      if (y > 750) {
        doc.addPage();
        y = 50;
      }

      const riskScore = assessment.severity * assessment.likelihood;
      let riskLevel = "Düşük";
      let riskColor = "#E7FDEA";

      if (riskScore >= 15) {
        riskLevel = "Çok Yüksek";
        riskColor = "#FDE7E7";
      } else if (riskScore >= 10) {
        riskLevel = "Yüksek";
        riskColor = "#FDF1E7";
      } else if (riskScore >= 5) {
        riskLevel = "Orta";
        riskColor = "#FDF7E7";
      }

      // Risk seviyesi arka planı
      doc.rect(400, y - 5, 100, 20).fill(riskColor);

      // Veri satırı
      x = 50;
      doc.fill("#000000").text(assessment.title, x, y, {
        width: columnWidths[0],
        align: "left",
      });

      x += columnWidths[0];
      doc.text(assessment.location, x, y, {
        width: columnWidths[1],
        align: "left",
      });

      x += columnWidths[1];
      doc.text(riskLevel, x, y, {
        width: columnWidths[2],
        align: "left",
      });

      x += columnWidths[2];
      doc.text(new Date(assessment.createdAt).toLocaleDateString("tr-TR"), x, y, {
        width: columnWidths[3],
        align: "left",
      });

      y += 25;
    });

    // Sayfa numarası
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(`Sayfa ${i + 1} / ${pages.count}`, 50, doc.page.height - 50, { align: "center" });
    }

    // PDF'i buffer olarak oluştur
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));

    return new Promise<Response>((resolve, reject) => {
      doc.on("end", () => {
        const buffer = Buffer.concat(chunks);
        const headers = new Headers();
        headers.append("Content-Type", "application/pdf");
        headers.append(
          "Content-Disposition",
          `attachment; filename=risk-assessments-${new Date().toISOString().split("T")[0]}.pdf`
        );
        resolve(new NextResponse(buffer, { headers }));
      });

      doc.on("error", reject);
      doc.end();
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
