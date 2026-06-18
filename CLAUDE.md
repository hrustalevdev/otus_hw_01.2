# CLAUDE.md — AI-инструкции для проекта mini-survey

## 1. Контекст и границы проекта

**mini-survey** — учебное веб-приложение для прохождения анкеты. Пользователь открывает страницу, видит список вопросов (текстовых и с выбором варианта), заполняет все поля и отправляет ответы. После успешной отправки отображается экран благодарности.

Проект создан в рамках курса OTUS как иллюстрация работы с AI-агентами в full-stack монорепо.

### Структура монорепо

```
mini-survey/
├── apps/
│   ├── backend/          Express + TypeScript, порт 3001
│   │   └── src/
│   │       ├── app.ts               — точка входа, Express + middleware
│   │       ├── routes/
│   │       │   └── survey.routes.ts — HTTP-хендлеры (только I/O)
│   │       ├── services/
│   │       │   └── survey.service.ts — бизнес-логика, хранение в памяти
│   │       ├── types/
│   │       │   └── survey.types.ts  — локальные типы (дублируют shared для TS-резолва)
│   │       └── swagger.ts           — OpenAPI-спецификация (swagger-jsdoc)
│   └── frontend/         Next.js 15 App Router + TypeScript, порт 3000
│       └── src/
│           ├── app/                 — Next.js App Router (layout, page)
│           ├── features/
│           │   └── survey/
│           │       ├── api/         — вызовы к backend API
│           │       ├── components/  — UI-компоненты фичи
│           │       └── types.ts     — локальный реэкспорт shared-types
│           └── shared/
│               └── api/
│                   └── httpClient.ts — тонкая обёртка над native fetch
└── packages/
    └── shared-types/     — общие TypeScript-интерфейсы, без сборки
        └── index.ts
```

### Глоссарий

| Термин | Описание |
|---|---|
| `Question` | Вопрос анкеты: `{ id, text, type: 'text' \| 'radio', options? }` |
| `Answer` | Ответ пользователя: `{ questionId, value }` |
| `SubmitAnswersDto` | Тело POST /answers: `{ answers: Answer[] }` |
| `QuestionsResponse` | Тело ответа GET /questions: `{ questions: Question[] }` |
| `SurveyService` | Синглтон-сервис: хранит вопросы (статика) и ответы (in-memory массив) |
| `httpClient` | Утилита на native fetch; единственный способ делать HTTP с фронта |

### Архитектурные инварианты (нельзя нарушать)

- **Хранение данных — только in-memory.** Не добавлять БД (PostgreSQL, MongoDB, SQLite и т.д.).
- **HTTP-клиент — только native fetch** через `apps/frontend/src/shared/api/httpClient.ts`. Axios, ky, got — запрещены.
- **Стейт на фронте — только `useState`/`useEffect`.** React Query, SWR, Zustand, Redux — запрещены.
- **Стили — только inline.** Tailwind, CSS-модули, styled-components — запрещены.
- **Shared-типы** всегда добавляются в `packages/shared-types/index.ts`. Локальные дубли в `types/` — только технические реэкспорты для TypeScript, не самостоятельные определения.
- **Swagger/OpenAPI-аннотации** обязательны для каждого нового backend-роута (JSDoc в файле `*.routes.ts`).
- **Тесты** не добавлять, если явно не запрошено.
- **Docker** не трогать, если явно не запрошено.

### Уточняющие вопросы

Задавай уточняющий вопрос, если:
- задача затрагивает хранилище данных (какие данные, какая структура);
- задача требует нового типа вопроса (нужны ли новые поля в `Question`).

В остальных случаях делай разумные допущения и объясняй их в секции **Plan**.

---

## 2. Требования к результату

### Стиль кода

- **TypeScript везде**, `strict: true`. Никакого `any` без явной необходимости.
- **Слоёная архитектура backend**: роут (`routes/`) обрабатывает только HTTP (валидация тела, формирование ответа); бизнес-логика — только в `services/`.
- **Новые shared-типы** → `packages/shared-types/index.ts`.
- **Новые backend-роуты** → отдельный файл `*.routes.ts` или расширение существующего; обязательно с Swagger JSDoc.
- **Новые frontend-компоненты** → `apps/frontend/src/features/survey/components/`.
- Функции именовать: `camelCase`, компоненты: `PascalCase`.
- Комментарии писать только там, где **почему** неочевидно.

### Проверочное требование

> **Каждый новый файл `.ts` / `.tsx`, создаваемый AI-агентом, должен начинаться со строки-баннера:**
>
> ```ts
> // [mini-survey] <package-name> | <one-line description>
> ```
>
> Примеры:
> ```ts
> // [mini-survey] backend | валидация тела запроса /answers
> // [mini-survey] frontend | компонент выбора нескольких вариантов
> // [mini-survey] shared-types | интерфейс нового типа вопроса
> ```
>
> Это требование позволяет мгновенно проверить, следовал ли агент инструкциям проекта.

### Формат ответа AI-агента

Каждый ответ на задачу должен содержать три секции:

#### Plan
Нумерованный список шагов с указанием файлов и характером изменений (без кода).

#### Changes
Изменения в коде, сгруппированные по файлам. Для каждого файла — полный контекст вокруг изменения.

#### Verification
Конкретные шаги для ручной проверки: какую команду запустить, какой URL открыть, что должно произойти.

---

## 3. Примеры типовых задач

### Сценарий A — добавление нового endpoint

**Промпт:**
```
Добавь на backend endpoint GET /answers, который возвращает все сохранённые ответы
в формате { answers: Answer[] }. Учти CORS и Swagger.
```

**Ожидаемый формат ответа:**

```
## Plan
1. shared-types/index.ts — добавить интерфейс AnswersResponse
2. backend/src/routes/survey.routes.ts — добавить GET /answers с Swagger JSDoc
3. backend/src/services/survey.service.ts — метод getAnswers() уже есть, использовать его

## Changes
// [mini-survey] shared-types | интерфейс ответа GET /answers
...

## Verification
1. pnpm dev:backend
2. GET http://localhost:3001/answers → { answers: [] }
3. POST /answers с телом, затем повторный GET — список непустой
```

**Критерии готовности:**
- Swagger UI на `/api-docs` отображает новый роут.
- Все новые файлы содержат баннер `// [mini-survey]`.
- Типы экспортированы из `shared-types`.

---

### Сценарий B — новый тип вопроса

**Промпт:**
```
Добавь поддержку типа вопроса 'checkbox' (множественный выбор).
Question.type должен принимать 'text' | 'radio' | 'checkbox',
Answer.value для checkbox — JSON-массив выбранных строк.
Обнови frontend-компонент, чтобы отображать чекбоксы.
```

**Ожидаемый формат ответа:**

```
## Plan
1. shared-types/index.ts — добавить 'checkbox' в union-тип Question.type
2. backend/src/services/survey.service.ts — добавить пример вопроса типа checkbox
3. frontend/src/features/survey/components/SurveyForm.tsx — добавить ветку для 'checkbox'

## Changes
...

## Verification
1. pnpm dev
2. Открыть http://localhost:3000 — новый вопрос с чекбоксами виден
3. Отметить несколько вариантов, отправить — форма принимает, экран ThankYou появляется
```

**Критерии готовности:**
- `Question.type` расширен в `shared-types`, не дублируется локально.
- Валидация на бэке по-прежнему работает.
- Все новые файлы содержат баннер `// [mini-survey]`.

---

### Сценарий C — исправление бага в валидации

**Промпт:**
```
POST /answers принимает пустой массив answers: [] и отвечает 201.
Это баг — пустой опрос не должен сохраняться. Исправь валидацию на backend.
```

**Ожидаемый формат ответа:**

```
## Plan
1. backend/src/routes/survey.routes.ts — добавить проверку answers.length > 0

## Changes
...

## Verification
1. POST http://localhost:3001/answers { "answers": [] } → 400
2. POST с непустым массивом → 201
```

**Критерии готовности:**
- `POST /answers` с `answers: []` возвращает `400` с понятным сообщением об ошибке.
- Существующая валидация (`!Array.isArray`) сохранена.

---

### Сценарий D — рефакторинг без изменения поведения

**Промпт:**
```
SurveyForm.tsx слишком длинный. Вынеси рендеринг одного вопроса
в отдельный компонент QuestionField, не меняя внешнее поведение формы.
```

**Ожидаемый формат ответа:**

```
## Plan
1. Создать frontend/src/features/survey/components/QuestionField.tsx
2. Перенести в него JSX одного вопроса (ветки text и radio)
3. SurveyForm.tsx — заменить inline-JSX на <QuestionField />

## Changes
// [mini-survey] frontend | компонент рендеринга одного вопроса анкеты
...

## Verification
1. pnpm dev:frontend
2. http://localhost:3000 — форма выглядит идентично до рефакторинга
3. Заполнить и отправить — поведение не изменилось
```

**Критерии готовности:**
- `SurveyForm.tsx` не содержит прямого рендеринга input/radio.
- `QuestionField.tsx` начинается с баннера `// [mini-survey]`.
- Визуальное поведение неизменно.

---

## 4. Команды разработки

```bash
# Из корня репо
pnpm dev              # backend + frontend параллельно
pnpm dev:backend      # только backend (port 3001)
pnpm dev:frontend     # только frontend (port 3000)
```

- Всегда запускать через `pnpm` из корня.
- Не запускать `npm install` — используется только `pnpm`.

## 5. Переменные окружения

| Переменная | Где | Значение по умолчанию |
|---|---|---|
| `PORT` | backend | `3001` |
| `CORS_ORIGIN` | backend | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | frontend | `http://localhost:3001` |

`.env`-файлы не коммитить.
