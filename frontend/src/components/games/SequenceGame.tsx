import React, { useState, useEffect } from 'react';
import { Question } from '../../types/game';
import { ArrowUp, ArrowDown, Shuffle, CheckCircle } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface SequenceGameProps {
  question: Question;
  onSubmit: (userOrder: string[]) => void;
  isSubmitting: boolean;
  highlightMistakeIndex?: number;
}

export const SequenceGame: React.FC<SequenceGameProps> = ({
  question,
  onSubmit,
  isSubmitting,
  highlightMistakeIndex,
}) => {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (question.items) {
      setItems([...question.items]);
    }
  }, [question]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    sounds.playClick();
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const handleShuffle = () => {
    sounds.playClick();
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  };

  const handleSubmit = () => {
    sounds.playClick();
    onSubmit(items);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {question.orderCriteria && (
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#93C5FD', textAlign: 'center' }}>
          {question.orderCriteria}
        </div>
      )}

      {/* Items List to Order */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map((item, index) => {
          const isFirstMistake = highlightMistakeIndex === index;

          return (
            <div
              key={`${item}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.875rem 1.25rem',
                background: isFirstMistake ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                border: isFirstMistake
                  ? '2px solid var(--cat-red)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Position Number & Text */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isFirstMistake ? 'var(--cat-red)' : 'var(--cat-blue)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#F1F5F9' }}>
                  {item}
                </span>
              </div>

              {/* Move Buttons */}
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0 || isSubmitting}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: index === 0 ? '#475569' : '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                  title="Mover arriba"
                >
                  <ArrowUp size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1 || isSubmitting}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: index === items.length - 1 ? '#475569' : '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: index === items.length - 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                  title="Mover abajo"
                >
                  <ArrowDown size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
        }}
      >
        <button
          type="button"
          onClick={handleShuffle}
          disabled={isSubmitting}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-secondary)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <Shuffle size={16} />
          <span>Mezclar</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            color: '#FFFFFF',
            padding: '0.875rem 2rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
          }}
        >
          <CheckCircle size={18} />
          <span>{isSubmitting ? 'Verificando...' : 'Confirmar Secuencia'}</span>
        </button>
      </div>
    </div>
  );
};
