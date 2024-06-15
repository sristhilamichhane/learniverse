import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini API key");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { courseId } = await req.json();

    // Fetch the attachment for the course
    const attachment = await db.attachment.findFirst({
      where: { courseId },
    });

    if (!attachment) {
      return NextResponse.json({ message: "Attachment not found" }, { status: 404 });
    }

    // Fetch the attachment data
    const attachmentResponse = await axios.get(attachment.url);
    const attachmentData = attachmentResponse.data;

    // Generate MCQs using the Gemini API
    const prompt = `From the provided text, generate 5 multiple choice questions with options and a correct answer in JSON format.\n${attachmentData}`;
    const result = await model.generateContent(prompt);
    let generatedMCQs = result.response.text(); // Parse the response

    // Clean the response text to ensure it's valid JSON
    generatedMCQs = generatedMCQs.replace(/```json|```/g, '').trim();

    // Parse the cleaned JSON
    const mcqs = JSON.parse(generatedMCQs);

    console.log(mcqs)

    // Save the generated MCQs to the database
    // const savedMCQs = [];
    // for (const mcq of mcqs) {
    //   const savedMCQ = await db.mCQ.createMany({
    //     data: {
    //       question: mcq.question,
    //       options: mcq.options,
    //       correctAnswer: mcq.correctAnswer,
    //       courseId,
    //     },
    //   });
    //   savedMCQs.push(savedMCQ);
    // }

    return NextResponse.json(mcqs);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
