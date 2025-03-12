import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { indicators } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";

// Performans göstergesi gerçekleşen değerlerini güncelle
export async function POST(req: Request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Admin kontrolü
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Bu işlem için admin yetkisi gerekli" }, { status: 403 });
    }

    const requestData = await req.json();
    const id = requestData.id;
    const actual = requestData.actual;
    const status = requestData.status;

    // Gerekli alanları kontrol et
    if (!id || actual === undefined) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Performans göstergesinin var olup olmadığını kontrol et
    const existingIndicator = await db.query.indicators.findFirst({
      where: eq(indicators.id, id),
    });

    if (!existingIndicator) {
      return NextResponse.json({ error: "Performans göstergesi bulunamadı" }, { status: 404 });
    }

    // Otomatik durum belirleme
    let calculatedStatus = status;
    if (!calculatedStatus) {
      const targetValue = existingIndicator.target;
      const actualValue = actual;
      const ratio = actualValue / targetValue;

      // Hedefin %90'ından az ise off_track
      // Hedefin %90-95 arası ise at_risk
      // Hedefin %95-100 arası ise on_track
      // Hedefin %100 ve üzeri ise completed
      if (ratio < 0.9) {
        calculatedStatus = "off_track";
      } else if (ratio < 0.95) {
        calculatedStatus = "at_risk";
      } else if (ratio < 1) {
        calculatedStatus = "on_track";
      } else {
        calculatedStatus = "completed";
      }
    }

    // Performans göstergesini güncelle
    await db
      .update(indicators)
      .set({
        actual,
        status: calculatedStatus,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(indicators.id, id));

    // Güncellenmiş performans göstergesini getir
    const updatedIndicator = await db.query.indicators.findFirst({
      where: eq(indicators.id, id),
      with: {
        createdByUser: true,
      },
    });

    return NextResponse.json({
      ...updatedIndicator,
      message: "Performans göstergesi gerçekleşen değeri güncellendi",
    });
  } catch (error) {
    console.error("Performans göstergesi gerçekleşen değer güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Performans göstergesi gerçekleşen değeri güncellenemedi" },
      { status: 500 }
    );
  }
}

// Toplu performans göstergesi gerçekleşen değerlerini güncelle
export async function PUT(req: Request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Admin kontrolü
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Bu işlem için admin yetkisi gerekli" }, { status: 403 });
    }

    const { indicators: indicatorUpdates } = await req.json();

    // Gerekli alanları kontrol et
    if (!indicatorUpdates || !Array.isArray(indicatorUpdates) || indicatorUpdates.length === 0) {
      return NextResponse.json(
        { error: "Geçerli gösterge güncellemeleri gerekli" },
        { status: 400 }
      );
    }

    // Her bir gösterge için güncelleme yap
    const updateResults = [];
    const errors = [];

    for (const update of indicatorUpdates) {
      const updateId = update.id;
      const updateActual = update.actual;
      const updateStatus = update.status;

      if (!updateId || updateActual === undefined) {
        errors.push({ id: updateId, error: "Gerekli alanlar eksik" });
        continue;
      }

      try {
        // Performans göstergesinin var olup olmadığını kontrol et
        const existingIndicator = await db.query.indicators.findFirst({
          where: eq(indicators.id, updateId),
        });

        if (!existingIndicator) {
          errors.push({ id: updateId, error: "Performans göstergesi bulunamadı" });
          continue;
        }

        // Otomatik durum belirleme
        let calculatedStatus = updateStatus;
        if (!calculatedStatus) {
          const targetValue = existingIndicator.target;
          const actualValue = updateActual;
          const ratio = actualValue / targetValue;

          if (ratio < 0.9) {
            calculatedStatus = "off_track";
          } else if (ratio < 0.95) {
            calculatedStatus = "at_risk";
          } else if (ratio < 1) {
            calculatedStatus = "on_track";
          } else {
            calculatedStatus = "completed";
          }
        }

        // Performans göstergesini güncelle
        await db
          .update(indicators)
          .set({
            actual: updateActual,
            status: calculatedStatus,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(indicators.id, updateId));

        // Güncellenmiş performans göstergesini getir
        const updatedIndicator = await db.query.indicators.findFirst({
          where: eq(indicators.id, updateId),
        });

        updateResults.push({
          id: updateId,
          success: true,
          data: updatedIndicator,
        });
      } catch (error) {
        console.error(`ID ${updateId} için güncelleme hatası:`, error);
        errors.push({ id: updateId, error: "Güncelleme işlemi başarısız" });
      }
    }

    return NextResponse.json({
      results: updateResults,
      errors,
      message: `${updateResults.length} gösterge güncellendi, ${errors.length} hata oluştu`,
    });
  } catch (error) {
    console.error("Toplu performans göstergesi güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Toplu performans göstergesi güncellemesi başarısız oldu" },
      { status: 500 }
    );
  }
}
