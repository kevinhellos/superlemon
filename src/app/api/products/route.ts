import { auth } from "@/lib/auth/firebase-admin";
import { products } from "@/data";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split("Bearer ")[1];

  if (!token) {
    // console.log("❌ No token provided");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    // console.log("✅ Authenticated user:", decodedToken.uid);
    return NextResponse.json({ products, uid: decodedToken.uid });
  } 
  catch (error) {
    // console.error("🚨 Token verification failed:", error);
    return NextResponse.json({ error: "Invalid access token" }, { status: 403 });
  }
}