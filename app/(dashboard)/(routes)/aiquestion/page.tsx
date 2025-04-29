"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";

const OldQuestionPage = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push("/questionbank");
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 bg-gradient-to-br from-white to-slate-50">
      <Card className="w-full max-w-3xl shadow-xl border border-gray-200 rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2 text-blue-600">
            <BadgeCheck className="w-6 h-6" />
            <span className="uppercase tracking-wider text-sm font-semibold">
              AI-Driven Practice
            </span>
          </div>
          <CardTitle className="text-3xl font-extrabold text-gray-900">
            Practice Smart. Practice Now.
          </CardTitle>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Take a full-length 100-mark model test covering the entire Software
            Engineering syllabus. Powered by AI to simulate real exam questions
            — with detailed feedback and result analysis.
          </p>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6 pt-4">
          <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
            <span>📝 80 Questions</span>
            <span>🎯 100 Marks</span>
            <span>⏱ 3 Hours</span>
          </div>

          <Button
            size="lg"
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
            onClick={handleStart}
          >
            Start Practice Test
          </Button>

          <p className="text-xs text-muted-foreground">
            *New question set every time you practice
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OldQuestionPage;
