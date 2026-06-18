// [mini-survey] frontend | экран благодарности с просмотром сохранённых ответов
'use client';

import { useState } from 'react';
import { Answer } from '../types';
import { getAnswers } from '../api/survey.api';

interface ThankYouProps {
  onReset: () => void;
}

export function ThankYou({ onReset }: ThankYouProps) {
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleViewAnswers() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnswers();
      setAnswers(data.answers);
    } catch {
      setError('Не удалось загрузить ответы');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h1>Спасибо за ваши ответы!</h1>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button onClick={onReset} style={{ padding: '0.75rem 2rem', cursor: 'pointer' }}>
          Пройти ещё раз
        </button>
        <button onClick={handleViewAnswers} disabled={loading} style={{ padding: '0.75rem 2rem', cursor: 'pointer' }}>
          {loading ? 'Загрузка...' : 'Посмотреть ответы'}
        </button>
      </div>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {answers !== null && (
        <ul style={{ marginTop: '1.5rem', textAlign: 'left', listStyle: 'none', padding: 0 }}>
          {answers.length === 0 ? (
            <li>Нет сохранённых ответов</li>
          ) : (
            answers.map((a, i) => (
              <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <strong>Вопрос {a.questionId}:</strong> {a.value}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
