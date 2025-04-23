import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🛠 Saving Exam Result Payload:", body);

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
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // 🧠 Get the most recent result
    const result = await db.examResult.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }, // latest one
    });

    if (!result) {
      return NextResponse.json({ message: "No result found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Error fetching result:", error.message);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}
