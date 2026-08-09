import React, { useState } from 'react';
import { Question } from '../../types/game';
import { Layers, Lightbulb, CheckCircle } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface CommonGameProps {
  question: Question;
  onSubmit: (userAnswer: string) => void;
  isSubmitting: boolean;
}

export const CommonGame: React.FC<CommonGameProps> = ({
  question,
  onSubmit,
  isSubmitting,
}) => {
  const [answer, setAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);

  const items = question.commonItems || [];

  const handleToggleHint = () => {
    sounds.playClick();
    setShowHint(!showHint);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    sounds.playClick();
    onSubmit(answer.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Category Header */}
      <div
        style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Layers size={28} className="text-emerald-400" style={{ color: '#34D399', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.75rem', color: '#A7F3D0', fontWeight: 700, textTransform: 'uppercase' }}>
            Desafío: ¿Qué tienen en común?
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.2rem' }}>
            {question.instructions || 'Descubrí la característica o concepto que comparten todos los elementos:'}
          </div>
        </div>
      </div>

      {/* Grid of Common Items */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}
      >
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '90px',
              gap: '0.4rem',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#6EE7B7', fontWeight: 700 }}>
              Elemento {index + 1}
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F1F5F9' }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Optional Hint Section */}
      {question.hint && (
        <div>
          {!showHint ? (
            <button
              type="button"
              onClick={handleToggleHint}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FCD34D',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <Lightbulb size={16} />
              <span>¿Necesitás una pista?</span>
            </button>
          ) : (
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: '#FDE68A',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Lightbulb size={18} style={{ flexShrink: 0 }} />
              <span><strong>Pista:</strong> {question.hint}</span>
            </div>
          )}
        </div>
      )}

      {/* Answer Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          Tu respuesta:
        </label>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Ej: Son provincias de Cuyo / Son ríos / Son partes del sistema..."
          autoFocus
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#FFFFFF',
            fontSize: '1.1rem',
            padding: '0.875rem 1.25rem',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button
          type="submit"
          disabled={!answer.trim() || isSubmitting}
          style={{
            background: answer.trim()
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : 'rgba(255, 255, 255, 0.1)',
            color: answer.trim() ? '#FFFFFF' : 'var(--text-muted)',
            padding: '0.875rem 2.25rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: answer.trim() ? 'pointer' : 'not-allowed',
            boxShadow: answer.trim() ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none',
          }}
        >
          <CheckCircle size={18} />
          <span>{isSubmitting ? 'Verificando...' : 'Confirmar Respuesta'}</span>
        </button>
      </div>
    </form>
  );
};
