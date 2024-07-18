import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini API key");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { courseId,chapterId,level } = await req.json();

    
    // Fetch the chapter for the course
    const chapter = await db.chapter.findFirst({
      where: { courseId, id: chapterId },
    });

    if (!chapter) {
      return NextResponse.json({ message: "Chapter not found" }, { status: 404 });
    }

    const chapterDescription = chapter.description;

    if (!chapterDescription) {
      return NextResponse.json({ message: "Chapter description not found" }, { status: 404 });
    }

    const option_number =
      level === "advanced" ? 4 : level === "intermediate" ? 3 : 2;

    const prompt = `${chapterDescription}
      \n\n
      Generate multiple choice questions with ${option_number} options and correct answers based on the provided text. 
      Return the result strictly following the structure with ${option_number} options as a JSON array of objects, where each object has the following structure:
      {
        "question": "The question text",
        "options": ${option_number === 4
        ? `["Option A", "Option B", "Option C", "Option D"]`
        : option_number === 3
          ? `["Option A", "Option B", "Option C"]`
          : `["Option A", "Option B"]`},
        "correctAnswer": "The correct option"
      }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    console.log(response);
    const response_string = response?.candidates?.[0]?.content?.parts?.[0]?.text;


    if (!response_string) {
      throw new Error("Response string is undefined.");
    }

    const match = response_string.match(/```json([\s\S]*?)```/);

    if (!match) {
      throw new Error("Invalid Gemini response format.");
    }

    const parsed_data = match[1].trim();
    const mcqs = JSON.parse(parsed_data);
       
    return NextResponse.json(mcqs);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
