import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Risk değerlendirmeleri listesi
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const assessments = await prisma.riskAssessment.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        assessor: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("Risk değerlendirmeleri getirme hatası:", error);
    return NextResponse.json(
      { error: "Risk değerlendirmeleri getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni risk değerlendirmesi oluştur
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, location, severity, likelihood } = body;

    if (!title || !location) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Log the severity level
    console.log(`Risk assessment severity level: ${severity || 'Not specified'}`);
    console.log(`Risk assessment likelihood level: ${likelihood || 'Not specified'}`);

    const assessment = await prisma.riskAssessment.create({
      data: {
        title,
        description: description || "",
        department: location,
        status: "IN_PROGRESS",
        date: new Date(),
        assessor: {
          connect: {
            id: session.user.id
          }
        }
      }
    });

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Risk değerlendirmesi oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Risk değerlendirmesi oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
