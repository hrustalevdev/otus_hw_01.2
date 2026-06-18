import { httpClient } from '@/shared/api/httpClient';
import { QuestionsResponse, SubmitAnswersDto, AnswersResponse } from '../types';

export function getQuestions(): Promise<QuestionsResponse> {
  return httpClient.get<QuestionsResponse>('/questions');
}

export function submitAnswers(dto: SubmitAnswersDto): Promise<void> {
  return httpClient.post<void>('/answers', dto);
}

export function getAnswers(): Promise<AnswersResponse> {
  return httpClient.get<AnswersResponse>('/answers');
}
