import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { CategoryType, EvaluationResult, PairItem, Question, CATEGORIES_CONFIG } from './types/game';
import { DeckSelector } from './components/DeckSelector';
import { SequenceGame } from './components/games/SequenceGame';
import { AssociationGame } from './components/games/AssociationGame';
import { ApproximationGame } from './components/games/ApproximationGame';
import { CommonGame } from './components/games/CommonGame';
import { FeedbackModal } from './components/FeedbackModal';
import { AdminPanel } from './components/AdminPanel';
import { Volume2, VolumeX, Database, ArrowLeft } from 'lucide-react';
import { sounds } from './utils/sound';

export const App: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(false);
  const [stats, setStats] = useState<{ total: number; byCategory: Record<CategoryType, number> } | undefined>();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);

  // Gamification & Session stats
  const [score, setScore] = useState<{ correct: number; attempts: number }>({ correct: 0, attempts: 0 });

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSelectCategory = async (category: CategoryType) => {
    setIsLoadingQuestion(true);
    try {
      const q = await api.getRandomQuestion(category, currentQuestion?.id);
      setCurrentQuestion(q);
      setEvaluationResult(null);
    } catch (err: any) {
      alert(err.message || 'Error al cargar tarjeta');
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const handleSequenceSubmit = async (userOrder: string[]) => {
    if (!currentQuestion) return;
    setIsSubmitting(true);
    try {
      const res = await api.evaluateAnswer({
        questionId: currentQuestion.id,
        userOrder,
      });
      setEvaluationResult(res);
      setScore((prev) => ({
        correct: prev.correct + (res.isCorrect ? 1 : 0),
        attempts: prev.attempts + 1,
      }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssociationSubmit = async (userPairs: PairItem[]) => {
    if (!currentQuestion) return;
    setIsSubmitting(true);
    try {
      const res = await api.evaluateAnswer({
        questionId: currentQuestion.id,
        userPairs,
      });
      setEvaluationResult(res);
      setScore((prev) => ({
        correct: prev.correct + (res.isCorrect ? 1 : 0),
        attempts: prev.attempts + 1,
      }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproximationSubmit = async (userValue: number) => {
    if (!currentQuestion) return;
    setIsSubmitting(true);
    try {
      const res = await api.evaluateAnswer({
        questionId: currentQuestion.id,
        userValue,
      });
      setEvaluationResult(res);
      setScore((prev) => ({
        correct: prev.correct + (res.isCorrect ? 1 : 0),
        attempts: prev.attempts + 1,
      }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommonSubmit = async (userAnswer: string) => {
    if (!currentQuestion) return;
    setIsSubmitting(true);
    try {
      const res = await api.evaluateAnswer({
        questionId: currentQuestion.id,
        userAnswer,
      });
      setEvaluationResult(res);
      setScore((prev) => ({
        correct: prev.correct + (res.isCorrect ? 1 : 0),
        attempts: prev.attempts + 1,
      }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToDeck = () => {
    sounds.playClick();
    setCurrentQuestion(null);
    setEvaluationResult(null);
  };

  const handleTryAgainInView = () => {
    // Keep question in view, close modal so the child can adjust answer
    setEvaluationResult(null);
  };

  const handleToggleSound = () => {
    const next = sounds.toggleSound();
    setSoundEnabled(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Navigation & Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(11, 15, 25, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0.875rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo & Title */}
          <div
            onClick={handleReturnToDeck}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6, #EF4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              🎓
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                  El Erudito Jr.
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#60A5FA',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                  }}
                >
                  6to Grado
                </span>
              </div>
            </div>
          </div>

          {/* Controls & Session Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {score.attempts > 0 && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#34D399',
                }}
              >
                Aciertos: {score.correct}/{score.attempts}
              </div>
            )}

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: soundEnabled ? '#F8FAFC' : 'var(--text-muted)',
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Admin / Bank button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowAdmin(true);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <Database size={16} />
              <span>Banco de Tarjetas</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem' }}>
        {!currentQuestion ? (
          <DeckSelector
            onSelectCategory={handleSelectCategory}
            stats={stats}
            isLoading={isLoadingQuestion}
          />
        ) : (
          <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>
            {/* Active Challenge Card Header */}
            {(() => {
              const cfg = CATEGORIES_CONFIG[currentQuestion.category];
              return (
                <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                  {/* Top Bar inside card */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleReturnToDeck}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'var(--text-secondary)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      <ArrowLeft size={16} />
                      <span>Cambiar de mazo</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          background: `${cfg.colorHex}25`,
                          color: cfg.colorHex,
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          padding: '0.3rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          border: `1px solid ${cfg.colorHex}50`,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Mazo {cfg.name} ({cfg.color.toUpperCase()})
                      </span>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                          background: 'rgba(255, 255, 255, 0.06)',
                          padding: '0.3rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        {currentQuestion.topic}
                      </span>
                    </div>
                  </div>

                  {/* Question Title */}
                  <h1
                    style={{
                      fontSize: '1.65rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {currentQuestion.title}
                  </h1>

                  {/* Game Interaction Area */}
                  {currentQuestion.category === 'sequence' && (
                    <SequenceGame
                      question={currentQuestion}
                      onSubmit={handleSequenceSubmit}
                      isSubmitting={isSubmitting}
                      highlightMistakeIndex={
                        evaluationResult && !evaluationResult.isCorrect
                          ? evaluationResult.firstMistakeIndex
                          : undefined
                      }
                    />
                  )}

                  {currentQuestion.category === 'association' && (
                    <AssociationGame
                      question={currentQuestion}
                      onSubmit={handleAssociationSubmit}
                      isSubmitting={isSubmitting}
                      highlightMistakeItem={
                        evaluationResult && !evaluationResult.isCorrect
                          ? evaluationResult.firstMistakeDetail?.pairLeft
                          : undefined
                      }
                    />
                  )}

                  {currentQuestion.category === 'approximation' && (
                    <ApproximationGame
                      question={currentQuestion}
                      onSubmit={handleApproximationSubmit}
                      isSubmitting={isSubmitting}
                    />
                  )}

                  {currentQuestion.category === 'common' && (
                    <CommonGame
                      question={currentQuestion}
                      onSubmit={handleCommonSubmit}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </main>

      {/* Feedback Modal */}
      {evaluationResult && currentQuestion && (
        <FeedbackModal
          result={evaluationResult}
          question={currentQuestion}
          onClose={handleReturnToDeck}
          onTryAgain={handleTryAgainInView}
        />
      )}

      {/* Admin Panel Modal */}
      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onQuestionsUpdated={loadStats}
        />
      )}
    </div>
  );
};
