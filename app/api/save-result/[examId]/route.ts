import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
  params: { examId: string };
}

// Handle GET /api/save-result/:examId
export async function GET(req: Request, { params }: Params) {
  try {
    const exam = await db.examResult.findUnique({
      where: {
        id: params.examId,
      },
    });

    if (!exam) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error("Failed to fetch exam:", error);
    return NextResponse.json(
      { message: "Error fetching exam" },
      { status: 500 }
    );
  }
}
