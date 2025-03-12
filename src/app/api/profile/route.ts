import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

// Profil bilgilerini getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mock user data
    const mockUser = {
      id: "1",
      name: session.user.name || "Kullanıcı",
      email: session.user.email,
      emailNotifications: true,
      pushNotifications: true,
      notificationPreferences: {
        email: true,
        push: true,
        sms: false,
        inApp: true,
      },
    };

    return NextResponse.json(mockUser);
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Profil bilgilerini güncelle
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Mock update - just return the updated data
    const updatedUser = {
      id: "1",
      name: data.name || session.user.name || "Kullanıcı",
      email: session.user.email,
      emailNotifications: data.notificationPreferences?.email ?? true,
      pushNotifications: data.notificationPreferences?.push ?? true,
      notificationPreferences: {
        email: data.notificationPreferences?.email ?? true,
        push: data.notificationPreferences?.push ?? true,
        sms: data.notificationPreferences?.sms ?? false,
        inApp: data.notificationPreferences?.inApp ?? true,
      },
    };

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile PUT Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
