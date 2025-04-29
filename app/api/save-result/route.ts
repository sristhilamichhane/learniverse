import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, score, answers, mcqs } = body;

    const result = await db.examResult.create({
      data: {
        userId,
        score,
        answers,
        mcqs,
      },
    });

    return NextResponse.json({ message: "Result saved" });
  } catch (error: any) {
    console.error(" Error saving result:", error.message);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  try {
    const results = await db.examResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to fetch results:", error);
    return NextResponse.json(
      { message: "Error fetching results" },
      { status: 500 }
    );
  }
}

