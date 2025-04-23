import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateResultPDF = (
  mcqs: any[],
  answers: string[],
  score: number
) => {
  const doc = new jsPDF();

  doc.setFontSize(10);
  doc.text("Software Engineering Exam Result", 20, 20);
  doc.setFontSize(12);
  doc.text(`Score: ${score}/100`, 20, 30);

  const tableData = mcqs.map((q, index) => [
    index + 1,
    q.question,
    answers[index],
    q.correctAnswer,
    answers[index] === q.correctAnswer ? "✔" : "✘",
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["#", "Question", "Your Answer", "Correct Answer", "Result"]],
    body: tableData,
    styles: { cellWidth: "wrap" },
    columnStyles: { 1: { cellWidth: 60 } },
  });

  doc.save("exam-result.pdf");
};
