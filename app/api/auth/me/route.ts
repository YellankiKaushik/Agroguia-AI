import { NextRequest, NextResponse } from "next/server";
import getUserModel from "@/models/User";
import { getCurrentUserIdFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const User = await getUserModel();
    const user = await User.findById(userId).select("_id name email username");

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name ?? "",
        email: user.email,
        username: user.username ?? "",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load user" },
      { status: 500 }
    );
  }
}
