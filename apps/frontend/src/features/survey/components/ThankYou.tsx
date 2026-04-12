'use client';

interface ThankYouProps {
  onReset: () => void;
}

export function ThankYou({ onReset }: ThankYouProps) {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h1>Спасибо за ваши ответы!</h1>
      <button onClick={onReset} style={{ padding: '0.75rem 2rem', cursor: 'pointer', marginTop: '1rem' }}>
        Пройти ещё раз
      </button>
    </div>
  );
}
