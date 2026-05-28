import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}

/**
 * Strip Windows-incompatible tlsCAFile parameter from the connection URL.
 * The Lyzr/Architect-hosted DB used /tmp/docdb-ca-bundle.pem (Linux-only).
 * When running locally on Windows we remove it and rely on tlsAllowInvalidHostnames.
 */
function sanitizeMongoUrl(url: string): string {
  try {
    // Remove the tlsCAFile param regardless of OS — the CA file isn't present locally
    return url.replace(/&?tlsCAFile=[^&]*/g, "").replace(/\?&/, "?");
  } catch {
    return url;
  }
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const globalCache = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached: MongooseCache =
  globalCache.mongooseCache ?? { conn: null, promise: null };

if (!globalCache.mongooseCache) {
  globalCache.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const cleanUrl = sanitizeMongoUrl(DATABASE_URL);
    cached.promise = mongoose.connect(cleanUrl, {
      // Allow connection without verifying server certificate locally
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 8000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
