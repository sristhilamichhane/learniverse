"use client";
import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { generateResultPDF } from "./_components/generate-pdf";

interface GenerateMCQButtonProps {
  courseId: string;
}

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

const AIExam = () => {
  const [loading, setLoading] = useState(false);
  const [generatedMCQs, setGeneratedMCQs] = useState<MCQ[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const handleGenerateMCQs = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/generate-set-mcq");
      setGeneratedMCQs(response.data);
      setUserAnswers(Array(response.data.length).fill(""));
      setShowResults(false);
    } catch (error) {
      console.error("Error generating MCQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[index] = answer;
    setUserAnswers(newUserAnswers);
  };

  const handleShowResults = async () => {
    let totalScore = 0;
    generatedMCQs.forEach((mcq, index) => {
      const isCorrect = mcq.correctAnswer === userAnswers[index];
      const weight = index < 60 ? 1 : 2;
      if (isCorrect) totalScore += weight;
    });
    setScore(totalScore);
    setShowResults(true);
    const trimmedMCQs = generatedMCQs.map((q) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    }));
    const payload = {
      userId: userId,
      score: totalScore,
      answers: userAnswers,
      mcqs: trimmedMCQs,
    };
    try {
      await axios.post("/api/save-result", payload);
      console.log("Result saved successfully!");
    } catch (err) {
      console.error(" Failed to save result:", err);
    }
  };

  const handleRestart = () => {
    setGeneratedMCQs([]);
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between">
        <button
          onClick={handleGenerateMCQs}
          disabled={loading}
          className="mb-4 p-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Generating MCQs..." : "Practice 1001"}
        </button>
        <button
          onClick={() =>
            generateResultPDF(generatedMCQs, userAnswers, score)
          }
          className="mb-4 p-2 bg-blue-500 text-white rounded"
        >
          Download PDF
        </button>
      </div>

      {generatedMCQs.length > 0 && !showResults && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Exam Questions:</h3>
          <ul>
            {generatedMCQs.map((mcq, index) => (
              <li key={index} className="mb-4">
                <p className="font-medium">
                  {index + 1}. {mcq.question}
                </p>
                <ul>
                  {mcq.options.map((option, i) => (
                    <li key={i} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`question-${index}-option-${i}`}
                        name={`question-${index}`}
                        value={option}
                        checked={userAnswers[index] === option}
                        onChange={() => handleAnswerChange(index, option)}
                        className="mr-2"
                      />
                      <label htmlFor={`question-${index}-option-${i}`}>
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button
            onClick={handleShowResults}
            className="mt-4 p-2 bg-green-500 text-white rounded"
          >
            Submit & Show Result
          </button>
        </div>
      )}

      {showResults && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-4">Results:</h3>
          <p className="mb-4">
            Your score: <strong>{score}</strong> out of <strong>100</strong>
          </p>
          <ul>
            {generatedMCQs.map((mcq, index) => (
              <li key={index} className="mb-4">
                <p className="font-medium">
                  {index + 1}. {mcq.question}
                </p>
                <ul>
                  {mcq.options.map((option, i) => (
                    <li key={i} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`result-question-${index}-option-${i}`}
                        name={`result-question-${index}`}
                        value={option}
                        checked={userAnswers[index] === option}
                        readOnly
                        className="mr-2"
                      />
                      <label
                        htmlFor={`result-question-${index}-option-${i}`}
                        className={
                          option === mcq.correctAnswer
                            ? "text-green-500"
                            : userAnswers[index] === option
                            ? "text-red-500"
                            : ""
                        }
                      >
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
                <p>
                  Correct Answer:{" "}
                  <span className="font-bold text-green-500">
                    {mcq.correctAnswer}
                  </span>
                </p>
              </li>
            ))}
          </ul>

          <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogTrigger asChild>
              <button className="mt-4 p-2 bg-gray-500 text-white rounded">
                Final Score
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Exam Finished</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                Your final score: {score} / 100
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <button className="mt-2 sm:mt-0">Close</button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <button onClick={handleRestart}>Restart</button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default AIExam;
