# mini-survey — инструкции для Claude Code

## Структура монорепо

```
mini-survey/
├── apps/
│   ├── backend/    — Express + TypeScript, порт 3001
│   └── frontend/   — Next.js 15 App Router + TypeScript, порт 3000
└── packages/
    └── shared-types/ — общие интерфейсы (без сборки, через TS paths)
```

## Команды

```bash
pnpm dev            # запустить backend и frontend параллельно
pnpm dev:backend    # только backend (port 3001)
pnpm dev:frontend   # только frontend (port 3000)
```

Запускать только из корня репо через `pnpm --filter`.

## Зависимости между пакетами

- `@mini-survey/shared-types` подключается через `workspace:*` и TS paths — без сборки, напрямую как `.ts`
- Backend импортирует типы через `@mini-survey/shared-types` (path в tsconfig → `../../../packages/shared-types/index.ts`)
- Frontend аналогично + `transpilePackages` в `next.config.ts`

## Архитектурные решения

- Хранение ответов — **in-memory** (массив в `SurveyService`), не использовать БД
- HTTP-клиент на фронте — нативный `fetch`, без Axios
- Стейт-менеджмент — `useState`/`useEffect`, без Redux/Zustand/React Query
- Стили — инлайн, без CSS-фреймворков

## Ограничения

- Не добавлять: React Query, Axios, Zustand, Redux, Tailwind, CSS-модули
- Не добавлять тесты
- Не добавлять Docker (пока не запрошено явно)
- Не добавлять БД

## TypeScript

- Backend: `"module": "commonjs"`, `ts-node-dev` для дева, `tsc` для билда
- Frontend: `"moduleResolution": "bundler"` (Next.js 15)
- Оба используют `paths` в tsconfig для резолва `@mini-survey/shared-types`

## API контракт

| Метод | Путь        | Тело запроса          | Ответ              |
|-------|-------------|----------------------|--------------------|
| GET   | /questions  | —                    | `{ questions: [] }` |
| POST  | /answers    | `{ answers: [] }`    | 201 или 400         |

CORS разрешён только для `http://localhost:3000`.
