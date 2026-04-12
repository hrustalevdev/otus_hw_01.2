'use client';

import { useEffect, useState } from 'react';
import { getQuestions, submitAnswers } from '@/features/survey/api/survey.api';
import { SurveyForm } from '@/features/survey/components/SurveyForm';
import { ThankYou } from '@/features/survey/components/ThankYou';
import { Answer, Question } from '@/features/survey/types';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getQuestions()
      .then((data) => {
        setQuestions(data.questions);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки вопросов');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleSubmit(answers: Answer[]) {
    try {
      await submitAnswers({ answers });
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки ответов');
    }
  }

  function handleReset() {
    setSubmitted(false);
    setError(null);
  }

  if (loading) {
    return <p style={{ padding: '2rem' }}>Загрузка...</p>;
  }

  if (error) {
    return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;
  }

  if (submitted) {
    return <ThankYou onReset={handleReset} />;
  }

  return <SurveyForm questions={questions} onSubmit={handleSubmit} />;
}
