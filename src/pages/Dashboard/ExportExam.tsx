import { useState } from "react";
import type { ExamJsonData, BackendQuestion } from "../../types/exam.type";
import { exportHtmlToWord } from "../../utils/exportWord";

export default function ExportExam() {
  const [examData] = useState<ExamJsonData>({
    id_exam: 15,
    user_id: 9,
    soluongcauhoi: 40,
    danhsachcauhoi: [
      {
        sample_q_id: 1,
        id_question: 101,
        question_order: 1,
        allocated_score: 0.25,
        media_url: "uploads/user_9/co_cau_html.png",
        content_edited: "Đâu là kí hiệu cặp thẻ đóng mở của một văn bản HTML chuẩn?",
        correct_answer_edited: "<html> và </html>",
        generated_distractors_edited: [
          "<body> và </body>",
          "<head> và </head>",
          "<script> và </script>"
        ]
      }
    ]
  });

  // Hàm trộn đáp án đúng và đáp án sai thành danh sách A, B, C, D cố định để in ra Word
  const renderAnswers = (question: BackendQuestion) => {
    // Gom đáp án đúng và 3 đáp án sai lại thành mảng 4 phần tử
    // Lưu ý: Nếu muốn trắc nghiệm hoán vị vị trí, có thể viết hàm shuffle mảng này. 
    // xếp đáp án đúng lên đầu và các đáp án sai tiếp theo để test nhanh.
    const allAnswers = [
      question.correct_answer_edited,
      ...question.generated_distractors_edited
    ];

    const prefixes = ["A. ", "B. ", "C. ", "D. "];

    return (
      <div className="answers-grid">
        {allAnswers.map((answer, index) => (
          <div key={index} className="answer-item">
            {prefixes[index]}{answer}
          </div>
        ))}
        <div className="clear"></div>
      </div>
    );
  };

  const handleTriggerExport = async () => {
    const formattedFileName = `de-thi-id-${examData.id_exam}.docx`;
    await exportHtmlToWord("exam-print-area", formattedFileName);
  };

  return (
    <div style={{ padding: "20px", background: "#f4f7fb", minHeight: "100vh" }}>
      
      <button 
        onClick={handleTriggerExport} 
        className="btn-primary-shared"
        style={{ width: "240px", marginBottom: "20px" }}
      >
        📝 Xuất đề chuẩn mẫu (Word)
      </button>

      {/* VÙNG IN ĐỀ THI */}
      <div 
        id="exam-print-area" 
        style={{ 
          width: "210mm", 
          minHeight: "297mm", 
          padding: "20mm", 
          background: "#ffffff", 
          margin: "0 auto",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          color: "#000000"
        }}
      >
        {/* Tiêu đề */}
        <table className="header-table" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ textAlign: "center", width: "40%", verticalAlign: "top" }}>
                <p style={{ fontWeight: "bold", margin: 0 }}>HỆ THỐNG GIÁO DỤC ETECHS</p>
                <p style={{ fontSize: "11pt", margin: "5px 0 0 0" }}>Mã số đề: {examData.id_exam}</p>
              </td>
              <td style={{ textAlign: "center", width: "60%", verticalAlign: "top" }}>
                <h3 style={{ margin: 0, fontSize: "14pt" }}>ĐỀ THI TRẮC NGHIỆM ĐỊNH KỲ</h3>
                <p style={{ margin: "5px 0 0 0", fontSize: "12pt", fontStyle: "italic" }}>
                  Số lượng: {examData.soluongcauhoi} câu hỏi trắc nghiệm
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        <hr style={{ border: "1px dashed #000", marginBottom: "25px" }} />

        {/* Nội dung danh sách câu hỏi */}
        <div>
          {examData.danhsachcauhoi.map((question) => (
            <div key={question.sample_q_id} className="question-block" style={{ marginBottom: "20px" }}>
              <p style={{ fontWeight: "bold", margin: "0 0 8px 0" }}>
                Câu {question.question_order}: {question.content_edited}
              </p>
              
              {/* Gọi hàm rải đáp án A, B, C, D */}
              {renderAnswers(question)}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}