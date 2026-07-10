import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";

/**
 * Hàm hỗ trợ đọc vùng HTML và chuyển đổi thành file Word (.docx) trực tiếp tại local người dùng
 * @param elementId 
 * @param fileName 
 */
export const exportHtmlToWord = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Không tìm thấy thẻ HTML có id là: ${elementId}`);
    return;
  }

  const htmlContent = element.innerHTML;

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: 'Times New Roman', Serif; 
            font-size: 14pt; 
            line-height: 1.5; 
          }
          .header-table { width: 100%; margin-bottom: 30px; }
          .question-block { margin-bottom: 15px; }
          .answers-grid { width: 100%; margin-left: 15px; }
          .answer-item { width: 50%; float: left; font-size: 12pt; padding: 3px 0; }
          .clear { clear: both; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  try {
    const blob = await asBlob(fullHtml);
    
    saveAs(blob as Blob, fileName);
  } catch (error) {
    console.error("Lỗi hệ thống khi sinh file Word từ local:", error);
  }
};