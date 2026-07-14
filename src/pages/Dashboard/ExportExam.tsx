import { useEffect, useState } from "react";
import type { QuestionAI, ContentBlock } from "../../types/exam.type";
import { exportExamToWordFile } from "../../utils/exportWord";

export default function ExportExam() {
  const [questionsList, setQuestionsList] = useState<QuestionAI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/exam-data.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể tải file dữ liệu cấu trúc đề thi");
        }
        return res.json();
      })
      .then((data: QuestionAI[]) => {
        setQuestionsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi đọc dữ liệu JSON:", err);
        setLoading(false);
      });
  }, []);

  const renderBlocks = (blocks: ContentBlock[], isInsideOption = false) => {
    return blocks.map((block, idx) => {
      switch (block.type) {
        case "text":
        case "formula":
          return <span key={idx} style={{ margin: "0 4px",whiteSpace: "pre-wrap" }}>{block.value as string}</span>;
          
        case "code": {
          const codeText = block.value as string;
          const isInlineCode = isInsideOption && codeText.length < 85 && !codeText.includes("\n");

          if (isInlineCode) {
            return (
              <code 
                key={idx} 
                style={{ 
                  padding: "2px 6px", 
                  borderRadius: "4px",
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: "12pt",
                  marginLeft: "4px"
                }}
              >
                {codeText}
              </code>
            );
          }

          const lines = codeText.split("\n");
          return <div key={idx} className="code-box">{codeText}{lines.map((line, lIdx) => (
                <span key={lIdx} style={{ display: "block", minHeight: "1.2em" }}>
                  {line || "\u00A0"} {}
                </span>
              ))}</div>;
        }
          
        case "table": {
          // Lấy mảng hàng từ block.value
          const rows = block.value as ContentBlock[][];
          
          // Giả định hàng đầu tiên chứa danh sách các ngôn ngữ để render tiêu đề cột
          // Ví dụ: rows[0] sẽ chứa code Python và code C++
          const firstRow = rows[0] || [];
          
          return (
            <table key={idx} className="table-block" style={{ width: "100%", borderCollapse: "collapse", margin: "10px 0" }}>
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <td style={{ width: "10%", border: "1px solid #000000", textAlign: "center", padding: "5px" }}>Dòng</td>
                  {firstRow.map((cell, cIdx) => (
                    <td key={cIdx} style={{ width: `${90 / firstRow.length}%`, border: "1px solid #000000", textAlign: "center", padding: "5px" }}>
                      {cell.language ? cell.language.toUpperCase() : `Cột ${cIdx + 1}`}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => {
                  // Phân rã đống code theo từng dòng dựa trên ký tự xuống dòng \n
                  // Để tạo ra cột số thứ tự "Dòng 1, 2, 3" bên tay trái
                  const cellCodeLines = row.map(cell => (cell.value as string).split("\n"));
                  const maxLines = Math.max(...cellCodeLines.map(lines => lines.length));
                  
                  // Vòng lặp vẽ từng dòng code nhỏ kèm số thứ tự
                  return Array.from({ length: maxLines }).map((_, lineIdx) => (
                    <tr key={`${rIdx}-${lineIdx}`}>
                      {/* Cột số thứ tự dòng */}
                      <td style={{ border: "1px solid #000000", textAlign: "center", padding: "4px", fontFamily: "monospace", fontSize: "11pt" }}>
                        {lineIdx + 1}
                      </td>
                      {/* Các cột chứa nội dung mã code từng dòng */}
                      {row.map((_, cellIdx) => {
                        const lineContent = cellCodeLines[cellIdx][lineIdx] || "";
                        return (
                          <td 
                            key={cellIdx} 
                            style={{ 
                              border: "1px solid #000000", 
                              padding: "4px 8px", 
                              fontFamily: "'Courier New', Courier, monospace", 
                              fontSize: "11pt",
                              whiteSpace: "pre" // Giữ nguyên khoảng cách thụt đầu dòng của code
                            }}
                          >
                            {lineContent}
                          </td>
                        );
                      })}
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          );
        }
        case "image":
          return (
            <div key={idx} style={{ margin: "10px 0" }}>
              <img 
                src={`/${block.value as string}`} 
                alt="Hình ảnh minh họa câu hỏi" 
                style={{ maxWidth: "100%", height: "auto", border: "1px solid #ddd", padding: "4px" }} 
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  const handleTriggerExport = async () => {
    await exportExamToWordFile(questionsList, "de-thi-tot-nghiep-ai.docx");
  };

  if (loading) {
    return (
      <div style={{ padding: "30px", textAlign: "center", fontFamily: "Arial" }}>
        <p>🔄 Đang tải cấu trúc dữ liệu đề thi từ hệ thống local...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", background: "#f4f7fb", minHeight: "100vh" }}>
      <button 
        onClick={handleTriggerExport} 
        className="btn-primary-shared" 
        style={{ width: "240px", marginBottom: "20px" }}
      >
        📝 Xuất đề chuẩn mẫu (Word)
      </button>

      <div 
        id="exam-print-area" 
        style={{ 
          width: "210mm", 
          minHeight: "297mm", 
          padding: "20mm", 
          background: "#ffffff", 
          margin: "0 auto", 
          boxShadow: "0 0 10px rgba(0,0,0,0.1)" 
        }}
      >
        <table className="header-table">
          <tbody>
            <tr>
              <td style={{ textAlign: "center", width: "40%", verticalAlign: "top" }}>
                <p style={{ fontWeight: "bold", margin: 0 }}>HỆ THỐNG GIÁO DỤC ETECHS</p>
                <p style={{ fontSize: "11pt", margin: "5px 0 0 0" }}>Mã định danh: AI-2026</p>
              </td>
              <td style={{ textAlign: "center", width: "60%", verticalAlign: "top" }}>
                <h3 style={{ margin: 0, fontSize: "14pt" }}>ĐỀ THI TỔNG HỢP CÁC DẠNG CÂU HỎI AI</h3>
                <p style={{ margin: "5px 0 0 0", fontSize: "12pt", fontStyle: "italic" }}>
                  Số lượng câu hỏi: {questionsList.length} câu
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        <hr style={{ border: "1px dashed #000", marginBottom: "25px" }} />

        <div>
          {questionsList.map((question, index) => (
            <div key={index} className="question-block">
              <div style={{ fontWeight: "bold", display: "inline" }}>Câu {index + 1}: </div>
              <div style={{ display: "inline" }}>{renderBlocks(question.content)}</div>
              
              {question.options && (
                <div className="answers-grid">
                  {question.options.map((option) => (
                    <div key={option.id} className="answer-item">
                      <span style={{ fontWeight: "bold" }}>{option.id}. </span>
                      {renderBlocks(option.content, true)}
                    </div>
                  ))}
                  <div className="clear"></div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}