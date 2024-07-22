import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini API key");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { courseId, chapterId, level } = await req.json();

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

    const levelInstructions: { [key: string]: string } = {
      beginner: "Generate straightforward questions covering basic concepts.",
      intermediate: "Generate questions that require understanding and application of concepts.",
      advanced: "Generate questions that require analysis and synthesis of the content."
    };

    if (!levelInstructions[level]) {
      return NextResponse.json({ message: "Invalid level" }, { status: 400 });
    }

    const prompt = `${chapterDescription}
      \n\n
      ${levelInstructions[level]}
      Generate multiple choice questions with 3 options and correct answers based on the provided text. 
      Return the result strictly following the structure as a JSON array of objects, where each object has the following structure:
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C"],
        "correctAnswer": "The correct option"
      }`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    console.log("Raw response:", JSON.stringify(response, null, 2));

    const response_string = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!response_string) {
      throw new Error("Response string is undefined.");
    }

    console.log("Response string:", response_string);

    // Try to directly parse the JSON response if it's valid JSON
    try {
      const mcqs = JSON.parse(response_string);
      return NextResponse.json(mcqs);
    } catch (jsonParseError) {
      console.error("Error parsing JSON directly:", jsonParseError);
    }

    // If direct parsing fails, look for JSON within code fences
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
