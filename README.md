# Mini Survey

Fullstack-приложение мини-анкета на TypeScript. Монорепозиторий с Express-бэкендом, Next.js-фронтендом и общим пакетом типов.

## Технологии

| Часть        | Стек                                          |
|--------------|-----------------------------------------------|
| Backend      | Node.js 20, Express 4, TypeScript 5           |
| Frontend     | Next.js 15 (App Router), React 19, TypeScript |
| Shared Types | TypeScript-интерфейсы без шага сборки         |
| Пакетный менеджер | pnpm 9 + workspaces                      |

## Структура проекта

```
mini-survey/
├── apps/
│   ├── backend/          # Express API, порт 3001
│   └── frontend/         # Next.js, порт 3000
├── packages/
│   └── shared-types/     # Общие TypeScript-интерфейсы
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## Локальный запуск

### Требования

- Node.js >= 20
- pnpm >= 9 (`npm install -g pnpm@9`)

### Установка зависимостей

```bash
pnpm install
```

### Запуск в режиме разработки

```bash
# Запустить оба сервиса одновременно
pnpm dev

# Или по отдельности
pnpm dev:backend    # http://localhost:3001
pnpm dev:frontend   # http://localhost:3000
```

После запуска:

- Фронтенд: http://localhost:3000
- Swagger UI: http://localhost:3001/api-docs

## Запуск в Docker

### Требования

- Docker >= 24
- Docker Compose >= 2

### Сборка и запуск

```bash
docker compose up --build
```

После запуска сервисы доступны по тем же адресам:

- Фронтенд: http://localhost:3000
- Swagger UI: http://localhost:3001/api-docs

### Остановка

```bash
docker compose down
```

### Переменные окружения

| Переменная            | Сервис   | По умолчанию            | Описание                              |
|-----------------------|----------|-------------------------|---------------------------------------|
| `PORT`                | backend  | `3001`                  | Порт HTTP-сервера                     |
| `CORS_ORIGIN`         | backend  | `http://localhost:3000` | Разрешённый источник для CORS         |
| `NEXT_PUBLIC_API_URL` | frontend | `http://localhost:3001` | URL бэкенда для браузерных запросов   |

> `NEXT_PUBLIC_API_URL` встраивается в бандл при сборке, поэтому при изменении необходима пересборка образа.

## Использованные промпты

* инициализация проекта:

```text
Сгенерируй full-stack монорепо проект «Мини-анкета» по следующей спецификации.

## Стек
- Менеджер пакетов: pnpm workspaces
- Backend: Express + TypeScript
- Frontend: Next.js (App Router) + TypeScript
- Shared: общий пакет с типами

## Структура проекта
mini-survey/
├── package.json
├── pnpm-workspace.yaml
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── routes/survey.routes.ts
│   │   │   ├── services/survey.service.ts
│   │   │   ├── types/survey.types.ts
│   │   │   └── app.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/
│       ├── src/
│       │   ├── app/
│       │   │   └── page.tsx
│       │   ├── features/survey/
│       │   │   ├── api/survey.api.ts
│       │   │   ├── components/SurveyForm.tsx
│       │   │   ├── components/ThankYou.tsx
│       │   │   └── types.ts
│       │   └── shared/api/httpClient.ts
│       ├── package.json
│       ├── next.config.ts
│       └── tsconfig.json
└── packages/
    └── shared-types/
        ├── index.ts
        └── package.json

## Требования к каждому файлу

### packages/shared-types/index.ts
Экспортировать интерфейсы:
- Question { id: string; text: string; type: 'text' | 'radio'; options?: string[] }
- Answer { questionId: string; value: string }
- SubmitAnswersDto { answers: Answer[] }
- QuestionsResponse { questions: Question[] }

### packages/shared-types/package.json
- name: "@mini-survey/shared-types"
- main: "index.ts"
- Без сборки, TypeScript напрямую через paths

### Backend — apps/backend/src/services/survey.service.ts
- Жёстко заданный массив из 3–5 вопросов (mix of 'text' и 'radio' типов)
- Метод getQuestions(): Question[]
- Метод saveAnswers(dto: SubmitAnswersDto): void
- Хранение ответов в приватном массиве в памяти (in-memory)
- Метод getAnswers(): для дебага (опционально)

### Backend — apps/backend/src/routes/survey.routes.ts
- GET /questions → вызывает surveyService.getQuestions()
- POST /answers → валидирует наличие answers в body, вызывает surveyService.saveAnswers()
- Возвращает JSON, HTTP статусы: 200, 201, 400

### Backend — apps/backend/src/app.ts
- Express app с json() middleware
- CORS настроен на http://localhost:3000
- Подключить survey.routes
- Слушать на порту 3001
- Консольный лог при старте

### Backend — apps/backend/tsconfig.json
- Настроить paths для "@mini-survey/shared-types" → "../../../packages/shared-types/index.ts"

### Backend — apps/backend/package.json
- name: "@mini-survey/backend"
- Scripts: dev (ts-node-dev), build (tsc), start (node dist)
- Dependencies: express, cors
- DevDependencies: typescript, ts-node-dev, @types/express, @types/cors, @types/node

### Frontend — apps/frontend/src/shared/api/httpClient.ts
- Базовый fetch-клиент
- baseURL берётся из process.env.NEXT_PUBLIC_API_URL с fallback на http://localhost:3001
- Методы get<T>(path) и post<T>(path, body) возвращают Promise<T>
- Пробрасывать HTTP ошибки как Error с текстом статуса

### Frontend — apps/frontend/src/features/survey/api/survey.api.ts
- getQuestions(): Promise<QuestionsResponse> → GET /questions
- submitAnswers(dto: SubmitAnswersDto): Promise<void> → POST /answers

### Frontend — apps/frontend/src/features/survey/components/SurveyForm.tsx
- Принимает пропс questions: Question[]
- Для type === 'text' рендерить <input type="text">
- Для type === 'radio' рендерить группу <input type="radio"> по question.options
- Хранить ответы в useState
- Кнопка Submit вызывает onSubmit(answers: Answer[])
- Базовая валидация: все поля должны быть заполнены перед отправкой

### Frontend — apps/frontend/src/features/survey/components/ThankYou.tsx
- Простой компонент с сообщением «Спасибо за ваши ответы!»
- Кнопка «Пройти ещё раз» которая вызывает onReset()

### Frontend — apps/frontend/src/app/page.tsx
- 'use client'
- Состояния: loading, error, questions, submitted (boolean)
- useEffect → загружает вопросы при монтировании
- Пока loading — показывает «Загрузка...»
- При ошибке — показывает текст ошибки
- При submitted === false — рендерит <SurveyForm>
- При submitted === true — рендерит <ThankYou>
- handleSubmit вызывает submitAnswers, затем ставит submitted = true

### Frontend — apps/frontend/src/features/survey/types.ts
- Реэкспортировать все типы из @mini-survey/shared-types

### Frontend — apps/frontend/next.config.ts
- transpilePackages: ['@mini-survey/shared-types']

### Frontend — apps/frontend/tsconfig.json
- Настроить paths для "@mini-survey/shared-types" → "../../../packages/shared-types/index.ts"

### Frontend — apps/frontend/package.json
- name: "@mini-survey/frontend"
- Scripts: dev (port 3000), build, start
- Dependencies: next, react, react-dom, @mini-survey/shared-types (workspace:*)
- DevDependencies: typescript, @types/react, @types/node

### Root — package.json
- name: "mini-survey"
- private: true
- Scripts:
  - dev: запускать backend и frontend параллельно
  - dev:backend / dev:frontend — по отдельности через pnpm --filter

### Root — pnpm-workspace.yaml
- packages: ['apps/*', 'packages/*']

## Порядок генерации файлов
Генерируй строго в таком порядке:
1. pnpm-workspace.yaml
2. root package.json
3. packages/shared-types/package.json
4. packages/shared-types/index.ts
5. apps/backend/package.json
6. apps/backend/tsconfig.json
7. apps/backend/src/types/survey.types.ts (реэкспорт из shared-types)
8. apps/backend/src/services/survey.service.ts
9. apps/backend/src/routes/survey.routes.ts
10. apps/backend/src/app.ts
11. apps/frontend/package.json
12. apps/frontend/tsconfig.json
13. apps/frontend/next.config.ts
14. apps/frontend/src/shared/api/httpClient.ts
15. apps/frontend/src/features/survey/types.ts
16. apps/frontend/src/features/survey/api/survey.api.ts
17. apps/frontend/src/features/survey/components/SurveyForm.tsx
18. apps/frontend/src/features/survey/components/ThankYou.tsx
19. apps/frontend/src/app/page.tsx

## После генерации всех файлов
Выполни команды:
1. pnpm install (из корня)
2. Убедись что backend запускается: pnpm dev:backend
3. Убедись что frontend запускается: pnpm dev:frontend
4. Если есть ошибки TypeScript или зависимостей — исправь их

## Чего не делать
- Не добавлять лишние библиотеки (React Query, Axios, Zustand и т.д.)
- Не добавлять CSS фреймворки — только базовые стили инлайном если нужно
- Не добавлять тесты
- Не добавлять БД — только in-memory хранение на бэкенде
```

* добавления swagger, docker, README:

```text
• Добавь поддержку swagger для backend;
• Добавь для приложения поддержку работы в docker;
• Добавь подробное описание README для приложения;
```

* проверка на ошибки при сборке docker-контейнера:

```test
Проверь, чтобы сборка и работа docker-контейнера работала и собиралась без ошибок. Если будут ошибки - исправь и проверь, чтобы всё собиралось и работало без ошибок.
```

## API

Интерактивная документация доступна через Swagger UI по адресу `http://localhost:3001/api-docs`.

### Эндпоинты

#### `GET /questions`

Возвращает список вопросов опроса.

**Ответ `200`:**

```json
{
  "questions": [
    { "id": "1", "text": "Как вас зовут?", "type": "text" },
    {
      "id": "2",
      "text": "Какой ваш любимый язык программирования?",
      "type": "radio",
      "options": ["TypeScript", "Python", "Go", "Rust"]
    }
  ]
}
```

#### `POST /answers`

Сохраняет ответы пользователя (хранятся в памяти).

**Тело запроса:**

```json
{
  "answers": [
    { "questionId": "1", "value": "Иван" },
    { "questionId": "2", "value": "TypeScript" }
  ]
}
```

**Ответ `201`:**

```json
{ "message": "Answers saved successfully" }
```

**Ответ `400`** (некорректные данные):

```json
{ "error": "answers field is required and must be an array" }
```

## Сборка для продакшна

```bash
# Backend
pnpm --filter @mini-survey/backend build
# Артефакты: apps/backend/dist/

# Frontend
pnpm --filter @mini-survey/frontend build
# Артефакты: apps/frontend/.next/
```

## Примечания по архитектуре

- **Хранилище данных:** ответы хранятся в памяти (массив в `SurveyService`), сброс при перезапуске сервера.
- **CORS:** разрешён только один источник, настраивается через `CORS_ORIGIN`.
- **Shared-types:** TypeScript-интерфейсы подключаются напрямую без шага компиляции через path aliases в `tsconfig.json`.
