'use client';

import { useState } from 'react';
import { Answer, Question } from '../types';

interface SurveyFormProps {
  questions: Question[];
  onSubmit: (answers: Answer[]) => void;
}

export function SurveyForm({ questions, onSubmit }: SurveyFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  function handleTextChange(questionId: string, value: string) {
    setValues((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleRadioChange(questionId: string, value: string) {
    setValues((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const unanswered = questions.filter((q) => !values[q.id]?.trim());
    if (unanswered.length > 0) {
      setError('Пожалуйста, ответьте на все вопросы.');
      return;
    }

    setError(null);
    const answers: Answer[] = questions.map((q) => ({
      questionId: q.id,
      value: values[q.id],
    }));
    onSubmit(answers);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h1>Мини-анкета</h1>
      {questions.map((question) => (
        <div key={question.id} style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{question.text}</p>
          {question.type === 'text' && (
            <input
              type="text"
              value={values[question.id] ?? ''}
              onChange={(e) => handleTextChange(question.id, e.target.value)}
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          )}
          {question.type === 'radio' &&
            question.options?.map((option) => (
              <label key={option} style={{ display: 'block', marginBottom: '0.25rem' }}>
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={values[question.id] === option}
                  onChange={() => handleRadioChange(question.id, option)}
                  style={{ marginRight: '0.5rem' }}
                />
                {option}
              </label>
            ))}
        </div>
      ))}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" style={{ padding: '0.75rem 2rem', cursor: 'pointer' }}>
        Отправить
      </button>
    </form>
  );
}
