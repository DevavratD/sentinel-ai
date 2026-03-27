import { NextResponse } from "next/server";
import { getSuspicionScore } from "@/lib/suspicion-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Incoming request:", body); // debug log

    const { email, password } = body;

    // Basic safety check
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const score = getSuspicionScore(email);

    const route = score > 0.5 ? "decoy" : "real";

    return NextResponse.json({
      route,
      score,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong in API" },
      { status: 500 }
    );
  }
}