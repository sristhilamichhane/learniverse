import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) throw new Error("No Gemini API key");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Full syllabus as a multi-line string
const syllabus = `
1. Fundamentals of Information Technology: Computer basics, storage systems, networking, data communication, and software types.
2. Software Engineering & OOAD: SDLC, software processes, testing, cost estimation, UML, object-oriented design.
3. Programming Languages: Procedural and OOP, exception handling, templates, file handling.
4. Data Structures, Algorithms, DBMS, OS: Linked lists, trees, graphs, sorting, normalization, SQL, transaction processing, memory management.
5. Microprocessors & Architecture: 8085/8086 programming, interrupts, CPU architecture, memory systems.
6. Algorithms & Network Programming: Divide and conquer, DP, load/linker/macro processors, socket programming.
7. AI & Neural Networks: Intelligent agents, search, logic, machine learning, NLP, ANN.
8. Java & Web: Java OOP, Swing, JDBC, Servlets/JSP, HTML/CSS/JS, PHP, web security.
9. Real-time, Distributed & Cloud Systems: Scheduling, communication protocols, CORBA, virtualization, cloud architecture, security.
10. Project Planning & Management: Engineering drawing, economics, scheduling, risk analysis, ethics, NEC regulations.
`;

export async function POST() {
  try {
    const prompt = `
The following is the syllabus for a Software Engineering Registration Examination:

${syllabus}

Your task is to generate a complete 100-mark question paper in two sections:

**Section A: 60 multiple-choice questions (1 mark each)**  
**Section B: 20 multiple-choice questions (2 marks each)**  

Each question must follow this structure:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "The correct option"
}

Ensure:
- All syllabus topics are fairly covered.
- Questions are diverse, non-repetitive, and clearly worded.
- Return the result as a **single JSON array** of 80 question objects.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const response_string =
      response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!response_string) {
      throw new Error("Response string is undefined.");
    }

    // Try direct JSON parsing
    try {
      const questions = JSON.parse(response_string);
      return NextResponse.json(questions);
    } catch (err) {
      console.error("Direct JSON parsing failed:", err);
    }

    // Fallback: extract from ```json code block
    const match = response_string.match(/```json([\s\S]*?)```/);
    if (!match) {
      throw new Error("Failed to extract JSON from Gemini response.");
    }

    const parsed = JSON.parse(match[1].trim());
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error generating question set:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
