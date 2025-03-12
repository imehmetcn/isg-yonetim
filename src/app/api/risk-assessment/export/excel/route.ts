import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { assessments } = await req.json();

    // Excel dosyası oluştur
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Risk Değerlendirmeleri");

    // Başlıkları ayarla
    worksheet.columns = [
      { header: "Başlık", key: "title", width: 30 },
      { header: "Açıklama", key: "description", width: 40 },
      { header: "Konum", key: "location", width: 20 },
      { header: "Şiddet", key: "severity", width: 10 },
      { header: "Olasılık", key: "likelihood", width: 10 },
      { header: "Risk Seviyesi", key: "riskLevel", width: 15 },
      { header: "Oluşturulma Tarihi", key: "createdAt", width: 20 },
    ];

    // Başlık stilini ayarla
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Verileri ekle
    assessments.forEach((assessment: any) => {
      const riskScore = assessment.severity * assessment.likelihood;
      let riskLevel = "Düşük";
      if (riskScore >= 15) riskLevel = "Çok Yüksek";
      else if (riskScore >= 10) riskLevel = "Yüksek";
      else if (riskScore >= 5) riskLevel = "Orta";

      worksheet.addRow({
        title: assessment.title,
        description: assessment.description,
        location: assessment.location,
        severity: assessment.severity,
        likelihood: assessment.likelihood,
        riskLevel: riskLevel,
        createdAt: new Date(assessment.createdAt).toLocaleDateString("tr-TR"),
      });
    });

    // Risk seviyesine göre hücre renklerini ayarla
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Başlık satırını atla
        const riskCell = row.getCell("riskLevel");
        switch (riskCell.value) {
          case "Çok Yüksek":
            riskCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFDE7E7" },
            };
            break;
          case "Yüksek":
            riskCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFDF1E7" },
            };
            break;
          case "Orta":
            riskCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFDF7E7" },
            };
            break;
          default:
            riskCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFE7FDEA" },
            };
        }
      }
    });

    // Kenarlıkları ayarla
    worksheet.eachRow(row => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Excel dosyasını buffer olarak oluştur
    const buffer = await workbook.xlsx.writeBuffer();

    // Response header'larını ayarla
    const headers = new Headers();
    headers.append(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    headers.append(
      "Content-Disposition",
      `attachment; filename=risk-assessments-${new Date().toISOString().split("T")[0]}.xlsx`
    );

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error("Excel export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
