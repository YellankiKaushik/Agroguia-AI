import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "auth_token";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.APP_JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
  return secret;
}

export type AuthTokenPayload = JwtPayload & {
  userId: string;
};

export function signAuthToken(
  payload: AuthTokenPayload,
  options: SignOptions = { expiresIn: "7d" }
): string {
  return jwt.sign(payload, getJwtSecret(), options);
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === "string") {
      return null;
    }
    if (!decoded.userId || typeof decoded.userId !== "string") {
      return null;
    }
    return decoded as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export function getCurrentUserIdFromRequest(request: NextRequest): string | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  const payload = verifyAuthToken(token);
  return payload?.userId ?? null;
}
