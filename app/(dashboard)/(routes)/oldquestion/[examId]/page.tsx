"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { generateResultPDF } from "../../questionbank/_components/generate-pdf";
import Confetti from "react-confetti";

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ExamResult {
  mcqs: MCQ[];
  answers: string[];
  score: number;
}

const SingleExamPage = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState<ExamResult | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // 3 hours timer

  useEffect(() => {
    if (examId) {
      axios
        .get(`/api/save-result/${examId}`)
        .then((res) => {
          setExam(res.data);
          setUserAnswers(Array(res.data.mcqs.length).fill(""));
          setTimeLeft(res.data.mcqs.length * 90);
        })
        .catch((err) => console.error("Error loading exam:", err));
    }
  }, [examId]);

  // ⏳ Timer Countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      if (timeLeft === 0) {
        handleSubmit(); // Auto submit when time ends
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!exam) {
    return <p className="p-6 text-center">Loading exam...</p>;
  }

  const handleAnswerChange = (index: number, answer: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = answer;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    let total = 0;
    exam.mcqs.forEach((mcq, index) => {
      const isCorrect = mcq.correctAnswer === userAnswers[index];
      const weight = index < 60 ? 1 : 2;
      if (isCorrect) total += weight;
    });
    setScore(total);
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold mb-4">Exam Attempt</h2>
      <p className="text-gray-500 my-2 fixed top-[75px] right-3 bg-white p-2 rounded shadow">
        Total Questions: {exam.mcqs.length} | Time Left:{" "}
        {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
      </p>

      {showResults && score >= 60 && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <div className="space-y-6">
        {exam.mcqs.map((mcq, index) => (
          <div key={index}>
            <p className="font-semibold">
              {index + 1}. {mcq.question}
            </p>
            <ul className="space-y-2 mt-2">
              {mcq.options.map((option, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={userAnswers[index] === option}
                    disabled={showResults}
                    onChange={() => handleAnswerChange(index, option)}
                  />
                  <label>{option}</label>
                </li>
              ))}
            </ul>

            {showResults && (
              <p className="text-sm mt-2">
                Correct Answer:{" "}
                <span className="text-green-600 font-bold">
                  {mcq.correctAnswer}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>

      {!showResults && (
        <button
          onClick={handleSubmit}
          className="mt-6 p-2 bg-green-600 text-white rounded"
        >
          Submit & Show Result
        </button>
      )}

      {showResults && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold">
            Final Score: {score}/{exam.mcqs.length}
          </h3>

          <button
            className="mt-4 p-2 bg-blue-600 text-white rounded"
            onClick={() => generateResultPDF(exam.mcqs, userAnswers, score)}
          >
            Download Result PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default SingleExamPage;
