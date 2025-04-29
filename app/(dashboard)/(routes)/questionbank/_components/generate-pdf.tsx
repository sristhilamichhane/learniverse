import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateResultPDF = (
  mcqs: any[],
  answers: string[],
  score: number
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Software Engineering Exam Result", 105, 20, { align: "center" });
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Score: ${score} / ${mcqs.length}`, 20, 35);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 35);

  const tableData = mcqs.map((q, index) => [
    index + 1,
    q.question,
    answers[index] || "Not Attempted",
    q.correctAnswer,
  ]);

  autoTable(doc, {
    startY: 45,
    head: [["S.N", "Question", "Your Answer", "Correct Answer"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    styles: {
      cellPadding: 2,
      overflow: "linebreak",
      valign: "middle",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40 },
    },
  });

  // 📄 Save
  const fileName = `Exam_Result_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};
