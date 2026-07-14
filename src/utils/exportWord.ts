import { Document, Packer, Paragraph, TextRun, Table, TableRow,MathRadical, TableCell, AlignmentType, FileChild, WidthType, ImageRun, BorderStyle, Math as DocxMath, MathFraction } from "docx";
import { saveAs } from "file-saver";
import type { QuestionAI, ContentBlock } from "../types/exam.type";

const convertUrlToBuffer = async (url: string): Promise<ArrayBuffer> => {
  const response = await fetch(url);
  return await response.arrayBuffer();
};

export const exportExamToWordFile = async (questionsList: QuestionAI[], fileName: string): Promise<void> => {
  const docChildren: FileChild[] = [];


  docChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "auto" },
        bottom: { style: BorderStyle.SINGLE, size: 12, color: "000000" }, // Đường kẻ ngang dưới tiêu đề
        left: { style: BorderStyle.NONE, size: 0, color: "auto" },
        right: { style: BorderStyle.NONE, size: 0, color: "auto" },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 60 },
                  children: [
                    new TextRun({ text: "HỆ THỐNG GIÁO DỤC ETECHS", bold: true, size: 28, font: "Times New Roman" }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "Mã định danh: AI-2026", size: 22, font: "Times New Roman" }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 55, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 60 },
                  children: [
                    new TextRun({ text: "ĐỀ THI TỔNG HỢP CÁC DẠNG CÂU HỎI AI", bold: true, size: 24, font: "Times New Roman" }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: `Số lượng câu hỏi: ${questionsList.length} câu`, italics: true, size: 22, font: "Times New Roman" }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  docChildren.push(new Paragraph({ spacing: { before: 200 } }));

  const processTextAndCodeBlocks = (blocks: ContentBlock[], isInsideOption = false): (TextRun | DocxMath)[] => {
    const runs: (TextRun | DocxMath)[] = [];
    
// --- HÀM 1: Xử lý riêng cho block FORMULA nguyên khối (Ví dụ: Câu 29) ---
    const parsePureFormula = (text: string): (TextRun | DocxMath)[] => {
      const formulaRuns: (TextRun | DocxMath)[] = [];
      
      // Chuẩn hóa ký tự Hy Lạp nếu có
      const formattedText = text
        .replace(/alpha/g, "α")
        .replace(/beta/g, "β")
        .replace(/delta/g, "Δ");

      // THUẬT TOÁN QUÉT CĂN THỨC TỰ CO GIÃN ĐỘNG
      // Regex tìm cụm dạng: sqrt( nội_dung_bên_trong )
      const sqrtRegex = /sqrt\(([^)]+)\)/g;

      if (sqrtRegex.test(formattedText)) {
        sqrtRegex.lastIndex = 0; // Reset index
        let lastIndex = 0;
        let match;

        // Tạo một vùng DocxMath bọc toàn bộ phương trình chứa căn thức cho đồng bộ font
        const mathChildren: (TextRun | MathRadical)[] = [];

        while ((match = sqrtRegex.exec(formattedText)) !== null) {
          // A. Ăn phần text/ngoặc nằm TRƯỚC dấu căn (ví dụ: (x^2 + 1) )
          if (match.index > lastIndex) {
            const beforeText = formattedText.substring(lastIndex, match.index);
            // Cắt bẻ số mũ ^ cho phần chữ trước căn
            const parts = beforeText.split(/\^([0-9a-zA-Z+-]+)/g);
            for (let i = 0; i < parts.length; i++) {
              mathChildren.push(new TextRun({
                text: parts[i], font: "Cambria Math", size: 24, italics: i % 2 === 0, superScript: i % 2 !== 0
              }));
            }
          }

          // B. BÓC RUỘT CỦA CĂN THỨC (ví dụ: bốc được "(x - 1)^3")
          const insideSqrt = match[1];
          const sqrtContentRuns: TextRun[] = [];
          
          // Xử lý bẻ số mũ nội bộ bên trong căn thức (biến ^3 thành số mũ nằm trong căn)
          const insideParts = insideSqrt.split(/\^([0-9a-zA-Z+-]+)/g);
          for (let i = 0; i < insideParts.length; i++) {
            sqrtContentRuns.push(new TextRun({
              text: insideParts[i],
              font: "Cambria Math",
              size: 24,
              italics: i % 2 === 0,
              superScript: i % 2 !== 0
            }));
          }

          // KÍCH HOẠT KHỐI CĂN THỨC XỊN: Tự động kéo dài mái nhà bọc lấy children
          mathChildren.push(
            new MathRadical({
              degree: [], // Để trống mảng này để ngầm hiểu là căn bậc 2 (không hiện số 2 nhỏ ở trên)
              children: sqrtContentRuns,
            })
          );

          lastIndex = sqrtRegex.lastIndex;
        }

        // C. Ăn nốt phần text/trị tuyệt đối còn sót lại ở CUỐI công thức (ví dụ:  - |x + 1| )
        if (lastIndex < formattedText.length) {
          const afterText = formattedText.substring(lastIndex);
          const parts = afterText.split(/\^([0-9a-zA-Z+-]+)/g);
          for (let i = 0; i < parts.length; i++) {
            mathChildren.push(new TextRun({
              text: parts[i], font: "Cambria Math", size: 24, italics: i % 2 === 0, superScript: i % 2 !== 0
            }));
          }
        }

        // Ném nguyên khối bọc toán học chứa căn thức kéo dài vào runs chung
        formulaRuns.push(new DocxMath({ children: mathChildren }));

      } else {
        // NẾU CÔNG THỨC KHÔNG CHỨA CĂN: Chạy bộ rẽ nhánh số mũ ^ bình thường như cũ
        const parts = formattedText.split(/\^([0-9a-zA-Z+-]+)/g);
        for (let i = 0; i < parts.length; i++) {
          formulaRuns.push(new TextRun({
            text: parts[i],
            font: "Cambria Math",
            size: 24,
            italics: i % 2 === 0,
            superScript: i % 2 !== 0
          }));
        }
      }

      return formulaRuns;
    };

    // --- HÀM 2: Quét hỗn hợp áp dụng cho block TEXT (Ví dụ: Câu 31) ---
    const parseMixedTextToElements = (text: string): (TextRun | DocxMath)[] => {
      const elements: (TextRun | DocxMath)[] = [];
      const mathRegex = /((\([^)]+\)|[a-zA-Z0-9.]+)\/(\([^)]+\)|[a-zA-Z0-9.]+)|[a-zA-Z0-9]+\^[0-9a-zA-Z+-]+)/g;
      
      let lastIndex = 0;
      let match;

      while ((match = mathRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          elements.push(new TextRun({
            text: text.substring(lastIndex, match.index),
            font: "Times New Roman",
            size: 24,
          }));
        }

        const mathPart = match[0];

        if (mathPart.includes("/")) {
          const rawParts = mathPart.split("/");
          const numerator = rawParts[0].replace(/^\((.*)\)$/, "$1");
          const denominator = rawParts[1].replace(/^\((.*)\)$/, "$1");

          elements.push(
            new DocxMath({
              children: [
                new MathFraction({
                  numerator: [new TextRun({ text: numerator.replace(/\^2/g, "²").replace(/\^3/g, "³"), font: "Cambria Math", size: 24, italics: true })],
                  denominator: [new TextRun({ text: denominator.replace(/\^2/g, "²").replace(/\^3/g, "³"), font: "Cambria Math", size: 24, italics: true })],
                }),
              ],
            })
          );
        } else {
          const powerParts = mathPart.split("^");
          elements.push(new TextRun({ text: powerParts[0], font: "Cambria Math", size: 24, italics: true }));
          elements.push(new TextRun({ text: powerParts[1], font: "Cambria Math", size: 24, superScript: true }));
        }

        lastIndex = mathRegex.lastIndex;
      }

      if (lastIndex < text.length) {
        elements.push(new TextRun({
          text: text.substring(lastIndex),
          font: "Times New Roman",
          size: 24,
        }));
      }

      return elements;
    };

    // --- ĐIỀU PHỐI LOGIC DUYỆT BLOCK ---
    blocks.forEach((block) => {
      if (block.type === "formula") {
        runs.push(...parsePureFormula(block.value as string));
      } 
      else if (block.type === "text") {
        runs.push(...parseMixedTextToElements(block.value as string));
      } 
      else if (block.type === "code") {
        const codeText = block.value as string;
        if (!isInsideOption || codeText.includes("\n")) {
          runs.push(new TextRun({ text: "\n", bold: true, font: "Courier New", size: 22, break: 1 }));
          const codeLines = codeText.split("\n");
          codeLines.forEach((line) => {
            runs.push(new TextRun({ text: line || " ", font: "Courier New", size: 22, break: 1 }));
          });
          runs.push(new TextRun({ text: "", break: 1 }));
        } else {
          runs.push(new TextRun({ text: ` ${codeText} `, font: "Courier New", size: 22 }));
        }
      }
    });

    return runs;
  };

  for (let index = 0; index < questionsList.length; index++) {
    const question = questionsList[index];
    
    const normalContentBlocks = question.content.filter(b => b.type !== "image" && b.type !== "table");
    const contentRuns = processTextAndCodeBlocks(normalContentBlocks, false);

    docChildren.push(
      new Paragraph({
        spacing: { before: 150, after: 100 },
        children: [
          new TextRun({ text: `Câu ${index + 1}: `, bold: true, size: 24, font: "Times New Roman" }),
          ...contentRuns
        ]
      })
    );

    const imageBlock = question.content.find(b => b.type === "image");
    if (imageBlock) {
      try {
        const imgUrl = `/${imageBlock.value as string}`;
        const imgBuffer = await convertUrlToBuffer(imgUrl);
        
        const imageOptions = {
          data: imgBuffer,
          transformation: {
            width: 450, 
            height: 150, 
          },
        } as ConstructorParameters<typeof ImageRun>[0];

        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER, 
            spacing: { before: 100, after: 100 },
            children: [
              new ImageRun(imageOptions), 
            ],
          })
        );
      } catch (error) {
        console.error("Lỗi nhúng hình ảnh:", error);
      }
    }

    if (question.content.some(b => b.type === "table")) {
      const tableBlock = question.content.find(b => b.type === "table");
      if (tableBlock) {
        const rowsData = tableBlock.value as ContentBlock[][];
        const tableRows: TableRow[] = [];

        tableRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Dòng", bold: true, font: "Times New Roman" })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "PYTHON", bold: true, font: "Times New Roman" })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "C++", bold: true, font: "Times New Roman" })] })] }),
            ]
          })
        );

        rowsData.forEach((row) => {
          const cellCodeLines = row.map(cell => (cell.value as string).split("\n"));
          const maxLines = Math.max(...cellCodeLines.map(lines => lines.length));

          for (let i = 0; i < maxLines; i++) {
            tableRows.push(
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${i + 1}`, font: "Courier New" })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: cellCodeLines[0][i] || "", font: "Courier New" })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: cellCodeLines[1][i] || "", font: "Courier New" })] })] }),
                ]
              })
            );
          }
        });

        docChildren.push(new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
      }
    }

    if (question.options) {
      for (const option of question.options) {
        const optionRuns = processTextAndCodeBlocks(option.content, true);
        docChildren.push(
          new Paragraph({
            indent: { left: 360 },
            spacing: { after: 60 },
            children: [
              new TextRun({ text: `${option.id}. `, bold: true, size: 24, font: "Times New Roman" }),
              ...optionRuns
            ]
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [{ properties: {}, children: docChildren }]
  });

  try {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Lỗi hệ thống khi tải file Word về máy local:", error);
  }
};