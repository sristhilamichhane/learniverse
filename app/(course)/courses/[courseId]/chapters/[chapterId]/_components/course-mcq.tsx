"use client";

import { useState } from "react";
import axios from "axios";
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

interface GenerateMCQButtonProps {
  courseId: string;
}

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

const GenerateMCQButton = ({ courseId }: GenerateMCQButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [generatedMCQs, setGeneratedMCQs] = useState<MCQ[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("beginner");
  const [showDialog, setShowDialog] = useState(false);

  const handleGenerateMCQs = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/generate-mcq", {
        courseId,
        level,
      });
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

  const handleShowResults = () => {
    const correctAnswers = generatedMCQs.reduce((acc, mcq, index) => {
      if (mcq.correctAnswer === userAnswers[index]) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const userScore = (correctAnswers / generatedMCQs.length) * 100;
    setScore(userScore);

    setShowResults(true);
  };

  const handleRestart = () => {
    setGeneratedMCQs([]);
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const handleNextLevel = () => {
    if (level === "beginner") {
      setLevel("intermediate");
    } else if (level === "intermediate") {
      setLevel("advanced");
    } else {
      setShowDialog(true);
    }

    setGeneratedMCQs([]);
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className="p-4">
      <button
        onClick={handleGenerateMCQs}
        disabled={loading}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Generating MCQs..." : "Generate MCQs"}
      </button>
      {generatedMCQs.length > 0 && !showResults && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Generated MCQs ({level}):
          </h3>
          <ul>
            {generatedMCQs.map((mcq, index) => (
              <li key={index} className="mb-4">
                <p className="font-medium">{mcq.question}</p>
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
            Show Results
          </button>
        </div>
      )}
      {showResults && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-4">Results:</h3>
          <p className="mb-4">Your score: {score.toFixed(2)}%</p>
          <ul>
            {generatedMCQs.map((mcq, index) => (
              <li key={index} className="mb-4">
                <p className="font-medium">{mcq.question}</p>
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
          {level === "advanced" ? (
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
              <AlertDialogTrigger asChild>
                <button className="mt-4 p-2 bg-gray-500 text-white rounded">
                  Show Final Results
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Final Results</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  Your final score: {score.toFixed(2)}%
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
          ) : score >= 60 ? (
            <button
              onClick={handleNextLevel}
              className="mt-4 p-2 bg-green-500 text-white rounded"
            >
              Next Level
            </button>
          ) : (
            <button
              onClick={handleRestart}
              className="mt-4 p-2 bg-gray-500 text-white rounded"
            >
              Restart
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerateMCQButton;
