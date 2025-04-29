"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ExamResult {
  id: string;
  score: number;
  createdAt: string;
  mcqs: MCQ[];
}

const LastExamList = () => {
  const { user } = useUser();
  const router = useRouter();
  const [results, setResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`/api/save-result?userId=${user.id}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.error("Failed to fetch exams:", err));
    }
  }, [user?.id]);

  const handleStartExam = (id: string) => {
    router.push(`/oldquestion/${id}`); // 👈 Redirect to individual exam page
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📚 Your Saved Exam Sets
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((exam, index) => (
          <Card key={exam.id} className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>Set #{results.length - index}</CardTitle>
              <p className="text-muted-foreground text-sm">
                Score: {exam.score} / {exam.mcqs.length}
              </p>
              <p className="text-gray-400 text-xs">
                Date: {new Date(exam.createdAt).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => handleStartExam(exam.id)}
              >
                Start this Set
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <p className="text-center mt-6 text-muted-foreground">
          No exam sets found yet.
        </p>
      )}
    </div>
  );
};

export default LastExamList;
