import { Router, Request, Response } from 'express';
import { surveyService } from '../services/survey.service';
import { SubmitAnswersDto } from '../types/survey.types';

export const surveyRouter = Router();

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Получить список вопросов опроса
 *     tags: [Survey]
 *     responses:
 *       200:
 *         description: Список вопросов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestionsResponse'
 */
surveyRouter.get('/questions', (_req: Request, res: Response) => {
  const questions = surveyService.getQuestions();
  res.status(200).json({ questions });
});

/**
 * @swagger
 * /answers:
 *   post:
 *     summary: Отправить ответы на вопросы опроса
 *     tags: [Survey]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitAnswersDto'
 *     responses:
 *       201:
 *         description: Ответы успешно сохранены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Некорректные входные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /answers:
 *   get:
 *     summary: Получить все сохранённые ответы
 *     tags: [Survey]
 *     responses:
 *       200:
 *         description: Список ответов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnswersResponse'
 */
surveyRouter.get('/answers', (_req: Request, res: Response) => {
  const answers = surveyService.getAnswers();
  res.status(200).json({ answers });
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
