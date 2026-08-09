import React, { useEffect } from 'react';
import { EvaluationResult, Question } from '../types/game';
import confetti from 'canvas-confetti';
import { AlertTriangle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { sounds } from '../utils/sound';

interface FeedbackModalProps {
  result: EvaluationResult;
  question: Question;
  onClose: () => void;
  onTryAgain?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  result,
  question,
  onClose,
  onTryAgain,
}) => {
  useEffect(() => {
    if (result.isCorrect) {
      sounds.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#EC4899'],
        });
      } catch {}
    } else {
      sounds.playFirstMistake();
    }
  }, [result]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '2rem',
          textAlign: 'center',
          border: result.isCorrect
            ? '2px solid rgba(16, 185, 129, 0.5)'
            : '2px solid rgba(239, 68, 68, 0.5)',
          boxShadow: result.isCorrect
            ? '0 20px 50px -10px rgba(16, 185, 129, 0.35)'
            : '0 20px 50px -10px rgba(239, 68, 68, 0.35)',
        }}
      >
        {/* Result Icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            margin: '0 auto 1.25rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: result.isCorrect
              ? 'rgba(16, 185, 129, 0.15)'
              : 'rgba(239, 68, 68, 0.15)',
            border: result.isCorrect
              ? '2px solid #10B981'
              : '2px solid #EF4444',
            color: result.isCorrect ? '#10B981' : '#EF4444',
          }}
        >
          {result.isCorrect ? <Award size={44} /> : <AlertTriangle size={42} />}
        </div>

        {/* Title */}
        {result.isCorrect && (
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#34D399',
              marginBottom: '0.75rem',
            }}
          >
            ¡Respuesta Correcta!
          </h2>
        )}

        {/* Dynamic First-Mistake / Success Message */}
        <div
          style={{
            background: result.isCorrect
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(239, 68, 68, 0.12)',
            border: result.isCorrect
              ? '1px solid rgba(16, 185, 129, 0.25)'
              : '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#F8FAFC',
              lineHeight: '1.45',
            }}
          >
            {result.message}
          </div>

          {result.isCorrect && question.explanation && (
            <div
              style={{
                fontSize: '0.9rem',
                color: '#A7F3D0',
                marginTop: '0.75rem',
                borderTop: '1px solid rgba(16, 185, 129, 0.2)',
                paddingTop: '0.5rem',
              }}
            >
              💡 <strong>Dato curioso:</strong> {question.explanation}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {!result.isCorrect && onTryAgain && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onTryAgain();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <RotateCcw size={16} />
              <span>Corregir en pantalla</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            style={{
              background: result.isCorrect
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : 'linear-gradient(135deg, #EF4444, #DC2626)',
              color: '#FFFFFF',
              padding: '0.75rem 1.75rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <span>{result.isCorrect ? 'Siguiente Turno' : 'Volver al Tablero'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
