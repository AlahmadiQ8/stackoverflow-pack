export interface SeResponse<T> {
  items: T[];
  has_more: boolean;
}

export interface QuestionResponse {
  tags: string[];
  view_count: number;
  answer_count: number;
  score: number;
  last_activity_date: number;
  creation_date: number;
  question_id: number;
  link: string;
  title: string;
}

