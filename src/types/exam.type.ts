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
export interface ContentBlock {
  type: "text" | "code" | "image" | "table" | "formula" | "audio" | "video"; 
  value: string | ContentBlock[][]; 
  language?: string;     
}
export interface OptionItem {
  id: string;             
  content: ContentBlock[]; 
}

export interface CorrectAnswer {
  value: (string | boolean)[]; 
}

export interface QuestionAI {
  questionType: "single_choice" | "true_false" | "short_answer" | "essay"; // 
  difficulty: "easy" | "medium" | "hard"; // 
  content: ContentBlock[];             
  options?: OptionItem[];               
  correctAnswer: CorrectAnswer;          
  explanation?: ContentBlock[];          
}