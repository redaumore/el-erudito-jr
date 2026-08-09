import React from 'react';
import { CategoryType, CATEGORIES_CONFIG } from '../types/game';
import { Link2, ArrowUpDown, Calculator, Layers, HelpCircle } from 'lucide-react';
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
    <div
      style={{
        maxWidth: '650px',
        margin: '0 auto',
        padding: '0.75rem',
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* 2x2 Grid of 4 Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          width: '100%',
          alignItems: 'stretch',
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
                cursor: isLoading ? 'wait' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 0.5rem',
                gap: '0.5rem',
              }}
            >
              {/* Icon Container */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: `${config.colorHex}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${config.colorHex}40`,
                  color: config.colorHex,
                }}
              >
                {getIcon(catKey)}
              </div>

              {/* Category Title */}
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: '1.2',
                }}
              >
                {config.name}
              </h2>

              {/* Card Count Badge */}
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: config.colorHex,
                  background: `${config.colorHex}18`,
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${config.colorHex}30`,
                }}
              >
                {count > 0 ? `${count} tarjetas` : config.color.toUpperCase()}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

