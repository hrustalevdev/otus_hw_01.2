# Mini Survey

Полностековое приложение-опрос на TypeScript. Монорепозиторий с Express-бэкендом, Next.js-фронтендом и общим пакетом типов.

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
