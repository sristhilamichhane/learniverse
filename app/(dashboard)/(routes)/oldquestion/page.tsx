"use client";
import React from "react";
import DataCard from "../teacher/analytics/_components/data-card";
import { useRouter } from "next/navigation";
const OldQuestionPage = () => {
  const router = useRouter();

  const onclick = () => {
    router.push("/questionbank");
  };
  return (
    <div
      onClick={onclick}
      className="cursor-pointer max-w-[200px] max-h-[200px] m-5"
    >
      <DataCard value={1001} label="Model question set-1" />
    </div>
  );
};

export default OldQuestionPage;
