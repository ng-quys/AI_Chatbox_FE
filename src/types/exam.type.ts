export interface BackendQuestion {
  sample_q_id: number;
  id_question: number;
  question_order: number;
  allocated_score: number;
  media_url: string | null;
  content_edited: string;             
  correct_answer_edited: string;       
  generated_distractors_edited: string[]; 
}

// src/types/exam.type.ts

export interface ContentBlock {
  type: "text" | "code" | "image" | "table" | "formula" | "audio" | "video"; // [cite: 9, 12, 14]
  value: string | ContentBlock[][]; // Có thể là chuỗi chữ, mã code hoặc mảng hàng/cột nếu là table [cite: 9, 32]
  language?: string;     // Dùng riêng cho code block (html, java, python...) [cite: 9, 24, 32]
}

export interface OptionItem {
  id: string;             // A, B, C, D hoặc a, b, c, d [cite: 9, 17, 26]
  content: ContentBlock[]; // Nội dung đáp án cũng là một mảng block [cite: 9]
}

export interface CorrectAnswer {
  value: (string | boolean)[]; // Mảng chứa đáp án đúng (ví dụ: ["C"] hoặc [true, false...]) [cite: 20, 28, 44]
}

export interface QuestionAI {
  questionType: "single_choice" | "true_false" | "short_answer" | "essay"; // 
  difficulty: "easy" | "medium" | "hard"; // 
  content: ContentBlock[];               // Mảng nội dung câu hỏi 
  options?: OptionItem[];                // Danh sách đáp án (tùy loại câu hỏi) 
  correctAnswer: CorrectAnswer;          // Đáp án đúng [cite: 10, 14]
  explanation?: ContentBlock[];          // Giải thích đáp án [cite: 10, 14]
}