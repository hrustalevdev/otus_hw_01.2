import { Question, Answer, SubmitAnswersDto } from '../types/survey.types';

const questions: Question[] = [
  {
    id: '1',
    text: 'Как вас зовут?',
    type: 'text',
  },
  {
    id: '2',
    text: 'Какой ваш любимый язык программирования?',
    type: 'radio',
    options: ['TypeScript', 'Python', 'Go', 'Rust'],
  },
  {
    id: '3',
    text: 'Сколько лет вы занимаетесь разработкой?',
    type: 'radio',
    options: ['Менее 1 года', '1–3 года', '3–5 лет', 'Более 5 лет'],
  },
  {
    id: '4',
    text: 'Опишите ваш текущий проект',
    type: 'text',
  },
  {
    id: '5',
    text: 'Какой формат работы вы предпочитаете?',
    type: 'radio',
    options: ['Офис', 'Удалённо', 'Гибридный'],
  },
];

class SurveyService {
  private answers: Answer[] = [];

  getQuestions(): Question[] {
    return questions;
  }

  saveAnswers(dto: SubmitAnswersDto): void {
    this.answers.push(...dto.answers);
    console.log('Answers saved:', this.answers);
  }

  getAnswers(): Answer[] {
    return this.answers;
  }
}

export const surveyService = new SurveyService();
