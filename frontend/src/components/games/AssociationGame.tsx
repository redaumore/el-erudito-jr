import React, { useState, useEffect } from 'react';
import { PairItem, Question } from '../../types/game';
import { CheckCircle, RotateCcw, Link2, X } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface AssociationGameProps {
  question: Question;
  onSubmit: (userPairs: PairItem[]) => void;
  isSubmitting: boolean;
  highlightMistakeItem?: string;
}

const PAIR_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

export const AssociationGame: React.FC<AssociationGameProps> = ({
  question,
  onSubmit,
  isSubmitting,
  highlightMistakeItem,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Map<string, string>>(new Map()); // left -> right

  useEffect(() => {
    // Reset state on question change
    setSelectedLeft(null);
    setPairs(new Map());
  }, [question]);

  const leftItems = question.leftItems || [];
  const rightItems = question.rightItems || [];

  const handleSelectLeft = (item: string) => {
    sounds.playClick();
    if (pairs.has(item)) {
      // Remove pair if clicked
      const next = new Map(pairs);
      next.delete(item);
      setPairs(next);
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(item === selectedLeft ? null : item);
  };

  const handleSelectRight = (item: string) => {
    if (!selectedLeft) return;

    // Check if right item is already used
    const next = new Map(pairs);
    for (const [l, r] of next.entries()) {
      if (r === item) {
        next.delete(l);
      }
    }

    next.set(selectedLeft, item);
    sounds.playConnect();
    setPairs(next);
    setSelectedLeft(null);
  };

  const removePair = (leftItem: string) => {
    sounds.playClick();
    const next = new Map(pairs);
    next.delete(leftItem);
    setPairs(next);
  };

  const handleReset = () => {
    sounds.playClick();
    setPairs(new Map());
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    sounds.playClick();
    // Build userPairs in the original order of leftItems
    const userPairs: PairItem[] = leftItems.map((left) => ({
      left,
      right: pairs.get(left) || '',
    }));
    onSubmit(userPairs);
  };

  const isAllPaired = leftItems.length > 0 && leftItems.every((left) => pairs.has(left));

  // Find color index for pairs
  const getPairColor = (leftItem: string) => {
    const keys = Array.from(pairs.keys());
    const idx = keys.indexOf(leftItem);
    return idx >= 0 ? PAIR_COLORS[idx % PAIR_COLORS.length] : undefined;
  };

  const getPairedLeftForRight = (rightItem: string) => {
    for (const [l, r] of pairs.entries()) {
      if (r === rightItem) return l;
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Instructions */}
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <Link2 size={24} className="text-red-400" style={{ color: '#F87171', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.75rem', color: '#FCA5A5', fontWeight: 700, textTransform: 'uppercase' }}>
            Consigna de Asociación
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF' }}>
            Tocá un elemento de la izquierda y luego su correspondiente de la derecha para unirlos.
          </div>
        </div>
      </div>

      {/* Dual Columns Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
        }}
      >
        {/* Left Column (Columna A) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Columna A
          </div>
          {leftItems.map((item) => {
            const isSelected = selectedLeft === item;
            const pairedRight = pairs.get(item);
            const pairColor = getPairColor(item);
            const isFirstMistake = highlightMistakeItem === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => handleSelectLeft(item)}
                disabled={isSubmitting}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isFirstMistake
                    ? 'rgba(239, 68, 68, 0.3)'
                    : isSelected
                    ? 'rgba(239, 68, 68, 0.25)'
                    : pairedRight
                    ? `${pairColor}22`
                    : 'rgba(255, 255, 255, 0.06)',
                  border: isFirstMistake
                    ? '2px solid var(--cat-red)'
                    : isSelected
                    ? '2px solid var(--cat-red)'
                    : pairedRight
                    ? `2px solid ${pairColor}`
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  transition: 'all 0.15s ease',
                  transform: isSelected ? 'scale(1.02)' : 'none',
                }}
              >
                <span>{item}</span>
                {pairedRight && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      removePair(item);
                    }}
                    style={{
                      background: pairColor,
                      color: '#FFFFFF',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    title="Desconectar"
                  >
                    <X size={14} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column (Columna B) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Columna B
          </div>
          {rightItems.map((item) => {
            const pairedLeft = getPairedLeftForRight(item);
            const pairColor = pairedLeft ? getPairColor(pairedLeft) : undefined;
            const isSelectable = selectedLeft !== null && !pairedLeft;

            return (
              <button
                key={item}
                type="button"
                onClick={() => handleSelectRight(item)}
                disabled={isSubmitting || (!selectedLeft && !pairedLeft)}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: pairedLeft
                    ? `${pairColor}22`
                    : isSelectable
                    ? 'rgba(239, 68, 68, 0.12)'
                    : 'rgba(255, 255, 255, 0.06)',
                  border: pairedLeft
                    ? `2px solid ${pairColor}`
                    : isSelectable
                    ? '2px dashed rgba(239, 68, 68, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  color: pairedLeft ? '#FFFFFF' : isSelectable ? '#FECACA' : 'var(--text-secondary)',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: selectedLeft || pairedLeft ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{item}</span>
                {pairedLeft && (
                  <span
                    style={{
                      background: pairColor,
                      color: '#FFFFFF',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
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
          onClick={handleReset}
          disabled={pairs.size === 0 || isSubmitting}
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
            opacity: pairs.size === 0 ? 0.5 : 1,
          }}
        >
          <RotateCcw size={16} />
          <span>Reiniciar Parejas</span>
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isAllPaired || isSubmitting}
          style={{
            background: isAllPaired
              ? 'linear-gradient(135deg, #EF4444, #DC2626)'
              : 'rgba(255, 255, 255, 0.1)',
            color: isAllPaired ? '#FFFFFF' : 'var(--text-muted)',
            padding: '0.875rem 2rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: isAllPaired ? 'pointer' : 'not-allowed',
            boxShadow: isAllPaired ? '0 4px 14px rgba(239, 68, 68, 0.4)' : 'none',
          }}
        >
          <CheckCircle size={18} />
          <span>{isSubmitting ? 'Verificando...' : 'Confirmar Parejas'}</span>
        </button>
      </div>
    </div>
  );
};
