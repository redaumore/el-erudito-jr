import React, { useState } from 'react';
import { Question } from '../../types/game';
import { Calculator, CheckCircle, Plus, Minus, RotateCcw } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface ApproximationGameProps {
  question: Question;
  onSubmit: (userValue: number) => void;
  isSubmitting: boolean;
}

export const ApproximationGame: React.FC<ApproximationGameProps> = ({
  question,
  onSubmit,
  isSubmitting,
}) => {
  const [val, setVal] = useState<string>('');

  const handleAdjust = (delta: number) => {
    sounds.playClick();
    const current = parseFloat(val) || 0;
    const updated = Math.max(0, current + delta);
    setVal(String(Number(updated.toFixed(2))));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(val);
    if (isNaN(num)) return;
    sounds.playClick();
    onSubmit(num);
  };

  const isValidNumber = val !== '' && !isNaN(parseFloat(val));

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Unit & Target Topic Banner */}
      <div
        style={{
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Calculator size={28} className="text-amber-400" style={{ color: '#FBBF24', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.75rem', color: '#FDE68A', fontWeight: 700, textTransform: 'uppercase' }}>
            Desafío de Estimación Numérica
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.2rem' }}>
            {question.instructions || question.title}
          </div>
        </div>
      </div>

      {/* Numeric Display / Input Box */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.35)',
          border: '2px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Ingresá tu respuesta estimada:
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="number"
            step="any"
            value={val}
            onChange={handleInputChange}
            placeholder="0"
            autoFocus
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-md)',
              color: '#FDE68A',
              fontSize: '2.5rem',
              fontWeight: 800,
              textAlign: 'center',
              padding: '0.5rem 1rem',
              width: '200px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {question.unit && (
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {question.unit}
            </span>
          )}
        </div>

        {/* Quick Stepper Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => handleAdjust(-100)}
            style={{
              padding: '0.4rem 0.8rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            <Minus size={12} /> 100
          </button>
          <button
            type="button"
            onClick={() => handleAdjust(-10)}
            style={{
              padding: '0.4rem 0.8rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            <Minus size={12} /> 10
          </button>
          <button
            type="button"
            onClick={() => handleAdjust(-1)}
            style={{
              padding: '0.4rem 0.8rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            <Minus size={12} /> 1
          </button>
          <button
            type="button"
            onClick={() => handleAdjust(1)}
            style={{
              padding: '0.4rem 0.8rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            <Plus size={12} /> 1
          </button>
          <button
            type="button"
            onClick={() => handleAdjust(10)}
            style={{
              padding: '0.4rem 0.8rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            <Plus size={12} /> 10
          </button>
          <button
            type="button"
            onClick={() => handleAdjust(100)}
            style={{
              padding: '0.4rem 0.8rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#F8FAFC',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            <Plus size={12} /> 100
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setVal('');
            }}
            style={{
              padding: '0.4rem 0.8rem',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#FCA5A5',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            <RotateCcw size={12} /> Borrar
          </button>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button
          type="submit"
          disabled={!isValidNumber || isSubmitting}
          style={{
            background: isValidNumber
              ? 'linear-gradient(135deg, #F59E0B, #D97706)'
              : 'rgba(255, 255, 255, 0.1)',
            color: isValidNumber ? '#000000' : 'var(--text-muted)',
            padding: '0.875rem 2.25rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: isValidNumber ? 'pointer' : 'not-allowed',
            boxShadow: isValidNumber ? '0 4px 14px rgba(245, 158, 11, 0.4)' : 'none',
          }}
        >
          <CheckCircle size={18} />
          <span>{isSubmitting ? 'Verificando...' : 'Confirmar Estimación'}</span>
        </button>
      </div>
    </form>
  );
};
