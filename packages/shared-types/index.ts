export interface Question {
  id: string;
  text: string;
  type: 'text' | 'radio';
  options?: string[];
}

export interface Answer {
  questionId: string;
  value: string;
}

export interface SubmitAnswersDto {
  answers: Answer[];
}

export interface QuestionsResponse {
  questions: Question[];
}
