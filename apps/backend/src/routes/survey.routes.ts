import { Router, Request, Response } from 'express';
import { surveyService } from '../services/survey.service';
import { SubmitAnswersDto } from '../types/survey.types';

export const surveyRouter = Router();

surveyRouter.get('/questions', (_req: Request, res: Response) => {
  const questions = surveyService.getQuestions();
  res.status(200).json({ questions });
});

surveyRouter.post('/answers', (req: Request, res: Response) => {
  const body = req.body as SubmitAnswersDto;

  if (!body.answers || !Array.isArray(body.answers)) {
    res.status(400).json({ error: 'answers field is required and must be an array' });
    return;
  }

  surveyService.saveAnswers(body);
  res.status(201).json({ message: 'Answers saved successfully' });
});
