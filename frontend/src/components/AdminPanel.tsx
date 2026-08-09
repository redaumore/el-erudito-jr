import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CategoryType, Question, CATEGORIES_CONFIG } from '../types/game';
import { Sparkles, Database, X, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/sound';

interface AdminPanelProps {
  onClose: () => void;
  onQuestionsUpdated: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onQuestionsUpdated }) => {
  const [activeTab, setActiveTab] = useState<'bank' | 'generate'>('bank');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Generator form state
  const [genCategory, setGenCategory] = useState<CategoryType>('sequence');
  const [genCount, setGenCount] = useState<number>(2);
  const [genTopic, setGenTopic] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genStatus, setGenStatus] = useState<string | null>(null);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAllQuestions(selectedCategory === 'all' ? undefined : selectedCategory);
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedCategory]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenStatus(null);
    try {
      const res = await api.generateQuestions({
        category: genCategory,
        count: genCount,
        topic: genTopic.trim() || undefined,
        customApiKey: apiKey.trim() || undefined,
      });
      setGenStatus(`¡Éxito! Se generaron y agregaron ${res.added} nuevas tarjetas.`);
      sounds.playSuccess();
      onQuestionsUpdated();
      loadQuestions();
    } catch (err: any) {
      setGenStatus(`Error al generar: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 9999,
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Database size={24} className="text-blue-400" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Banco de Preguntas & Generador LLM</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-secondary)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: activeTab === 'bank' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: activeTab === 'bank' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              borderBottom: activeTab === 'bank' ? '2px solid #3B82F6' : 'none',
            }}
          >
            Ver Banco ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: activeTab === 'generate' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              color: activeTab === 'generate' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              borderBottom: activeTab === 'generate' ? '2px solid #8B5CF6' : 'none',
            }}
          >
            <Sparkles size={16} />
            <span>Generar con IA (LLM)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'bank' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Category Filter Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: selectedCategory === 'all' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.08)',
                    color: selectedCategory === 'all' ? '#000000' : 'var(--text-secondary)',
                  }}
                >
                  Todas
                </button>
                {(['association', 'sequence', 'approximation', 'common'] as CategoryType[]).map((cat) => {
                  const cfg = CATEGORIES_CONFIG[cat];
                  const isSel = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: isSel ? cfg.colorHex : 'rgba(255, 255, 255, 0.08)',
                        color: isSel ? '#FFFFFF' : 'var(--text-secondary)',
                      }}
                    >
                      {cfg.name}
                    </button>
                  );
                })}
              </div>

              {/* Questions List */}
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  Cargando banco...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {questions.map((q) => {
                    const cfg = CATEGORIES_CONFIG[q.category];
                    return (
                      <div
                        key={q.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              background: `${cfg.colorHex}25`,
                              color: cfg.colorHex,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              border: `1px solid ${cfg.colorHex}50`,
                            }}
                          >
                            {cfg.name}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {q.topic} • {q.grade}
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#FFFFFF' }}>
                          {q.title}
                        </div>
                        {q.instructions && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {q.instructions}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'generate' && (
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.12)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  color: '#DDD6FE',
                  fontSize: '0.9rem',
                }}
              >
                Generá nuevas tarjetas pedagógicamente adaptadas para 6to grado de primaria en Argentina usando Google Gemini o plantillas algorítmicas de respaldo.
              </div>

              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Categoría a generar
                </label>
                <select
                  value={genCategory}
                  onChange={(e) => setGenCategory(e.target.value as CategoryType)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius-md)',
                    color: '#FFFFFF',
                    outline: 'none',
                  }}
                >
                  <option value="association" style={{ background: '#1E293B' }}>🔴 Asociación (Rojo)</option>
                  <option value="sequence" style={{ background: '#1E293B' }}>🔵 Secuencia (Azul)</option>
                  <option value="approximation" style={{ background: '#1E293B' }}>🟡 Aproximación (Amarillo)</option>
                  <option value="common" style={{ background: '#1E293B' }}>🟢 En Común (Verde)</option>
                </select>
              </div>

              {/* Count */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Cantidad de tarjetas
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={genCount}
                  onChange={(e) => setGenCount(parseInt(e.target.value) || 1)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius-md)',
                    color: '#FFFFFF',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Custom Topic */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Tema sugerido (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Geografía de la Patagonia, Revolución Francesa, Fracciones, Aparato Digestivo"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius-md)',
                    color: '#FFFFFF',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Optional API Key */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  API Key de Gemini (opcional si ya está configurada en servidor)
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius-md)',
                    color: '#FFFFFF',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Status Banner */}
              {genStatus && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: genStatus.startsWith('Error')
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(16, 185, 129, 0.2)',
                    color: genStatus.startsWith('Error') ? '#FCA5A5' : '#A7F3D0',
                    fontSize: '0.9rem',
                  }}
                >
                  {genStatus}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                  color: '#FFFFFF',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: isGenerating ? 'wait' : 'pointer',
                }}
              >
                {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                <span>{isGenerating ? 'Generando tarjetas...' : 'Generar e Ingerir'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
