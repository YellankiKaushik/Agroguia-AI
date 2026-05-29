import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import getUserModel from "@/models/User";
import { signAuthToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const User = await getUserModel();

    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
      return NextResponse.json({ success: false, error: "Email already in use" }, { status: 409 });
    }

    if (username) {
      const existingByUsername = await User.findOne({ username });
      if (existingByUsername) {
        return NextResponse.json({ success: false, error: "Username already in use" }, { status: 409 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      name,
      email,
      username: username || undefined,
      password: hashedPassword,
    });

    const token = signAuthToken({ userId: createdUser._id.toString() });
    const response = NextResponse.json({
      success: true,
      user: {
        id: createdUser._id.toString(),
        name: createdUser.name ?? "",
        email: createdUser.email,
        username: createdUser.username ?? "",
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
      { success: false, error: error?.message || "Registration failed" },
      { status: 500 }
    );
  }
}
