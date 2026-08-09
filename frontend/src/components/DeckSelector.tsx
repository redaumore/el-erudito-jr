import React from 'react';
import { CategoryType, CATEGORIES_CONFIG } from '../types/game';
import { Link2, ArrowUpDown, Calculator, Layers, Sparkles, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/sound';

interface DeckSelectorProps {
  onSelectCategory: (category: CategoryType) => void;
  stats?: { total: number; byCategory: Record<CategoryType, number> };
  isLoading?: boolean;
}

export const DeckSelector: React.FC<DeckSelectorProps> = ({
  onSelectCategory,
  stats,
  isLoading,
}) => {
  const getIcon = (type: CategoryType) => {
    switch (type) {
      case 'association':
        return <Link2 size={38} className="text-red-400" />;
      case 'sequence':
        return <ArrowUpDown size={38} className="text-blue-400" />;
      case 'approximation':
        return <Calculator size={38} className="text-amber-400" />;
      case 'common':
        return <Layers size={38} className="text-emerald-400" />;
      default:
        return <HelpCircle size={38} />;
    }
  };

  const handleCardClick = (cat: CategoryType) => {
    sounds.playCardSelect();
    onSelectCategory(cat);
  };

  const categories: CategoryType[] = ['association', 'sequence', 'approximation', 'common'];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem', width: '100%' }}>
      {/* Header / Hero Prompt */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#93C5FD',
            marginBottom: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Sparkles size={16} />
          <span>¡Turno de Juego en el Tablero!</span>
        </div>
        <h1
          style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.75rem',
          }}
        >
          Elegí el color de tu casillero
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Tocá el mazo que coincide con el color donde cayó tu ficha para obtener tu consigna de 6to grado.
        </p>
      </div>

      {/* Grid of 4 Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {categories.map((catKey) => {
          const config = CATEGORIES_CONFIG[catKey];
          const count = stats?.byCategory?.[catKey] || 0;

          return (
            <button
              key={catKey}
              onClick={() => handleCardClick(catKey)}
              disabled={isLoading}
              className={`category-card ${config.color}`}
              style={{
                textAlign: 'center',
                minHeight: '260px',
                cursor: isLoading ? 'wait' : 'pointer',
              }}
            >
              {/* Top Card Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: 'rgba(0, 0, 0, 0.35)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  color: config.colorHex,
                  border: `1px solid ${config.colorHex}40`,
                  marginBottom: '1.25rem',
                }}
              >
                <span>Mazo {config.name}</span>
              </div>

              {/* Icon Container with subtle background glow */}
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '20px',
                  background: `${config.colorHex}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  border: `1px solid ${config.colorHex}35`,
                  color: config.colorHex,
                }}
              >
                {getIcon(catKey)}
              </div>

              {/* Category Title */}
              <h2
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  marginBottom: '0.5rem',
                }}
              >
                {config.name}
              </h2>

              {/* Short Description */}
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.35',
                  marginBottom: '1rem',
                  flexGrow: 1,
                }}
              >
                {config.description}
              </p>

              {/* Card Count / Tap Action */}
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: config.colorHex,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: `${config.colorHex}15`,
                  padding: '0.3rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <span>Tocar para jugar</span>
                {count > 0 && <span style={{ opacity: 0.7 }}>• ({count} tarjetas)</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
