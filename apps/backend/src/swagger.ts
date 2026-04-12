import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini Survey API',
      version: '1.0.0',
      description:
        'REST API для приложения Mini Survey — получение вопросов опроса и сохранение ответов.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Локальный сервер разработки',
      },
    ],
    components: {
      schemas: {
        Question: {
          type: 'object',
          required: ['id', 'text', 'type'],
          properties: {
            id: {
              type: 'string',
              example: '1',
            },
            text: {
              type: 'string',
              example: 'Как вас зовут?',
            },
            type: {
              type: 'string',
              enum: ['text', 'radio'],
              example: 'text',
            },
            options: {
              type: 'array',
              items: { type: 'string' },
              example: ['TypeScript', 'Python', 'Go', 'Rust'],
              nullable: true,
            },
          },
        },
        Answer: {
          type: 'object',
          required: ['questionId', 'value'],
          properties: {
            questionId: {
              type: 'string',
              example: '1',
            },
            value: {
              type: 'string',
              example: 'Иван',
            },
          },
        },
        SubmitAnswersDto: {
          type: 'object',
          required: ['answers'],
          properties: {
            answers: {
              type: 'array',
              items: { $ref: '#/components/schemas/Answer' },
              example: [
                { questionId: '1', value: 'Иван' },
                { questionId: '2', value: 'TypeScript' },
              ],
            },
          },
        },
        QuestionsResponse: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Question' },
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Answers saved successfully',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'answers field is required and must be an array',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
