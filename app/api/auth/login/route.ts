import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import getUserModel from "@/models/User";
import { signAuthToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if ((!email && !username) || !password) {
      return NextResponse.json(
        { success: false, error: "Email or username and password are required" },
        { status: 400 }
      );
    }

    const User = await getUserModel();
    const query = email ? { email } : { username };
    const user = await User.findOne(query);

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAuthToken({ userId: user._id.toString() });
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name ?? "",
        email: user.email,
        username: user.username ?? "",
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Login failed" },
      { status: 500 }
    );
  }
}
