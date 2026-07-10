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

export interface ExamJsonData {
  id_exam: number;
  user_id: number;
  soluongcauhoi: number;
  danhsachcauhoi: BackendQuestion[];  
}