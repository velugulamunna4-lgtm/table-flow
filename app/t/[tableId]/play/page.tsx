'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/lib/store';
import {
  ArrowLeft,
  Gamepad2,
  Sparkles,
  Trophy,
  RotateCcw,
  CheckCircle,
  Flame,
  Award,
  Zap,
  HelpCircle,
  Gift,
  Soup,
  Cake,
  Coffee,
  UtensilsCrossed,
  Brain,
  Timer,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MiniGamesPage() {
  const params = useParams();
  const tableId = (params?.tableId as string) || '7';
  const tableNumber = parseInt(tableId, 10) || 7;

  const { spicePoints, unlockedDiscountPercent, addPoints } = useGameStore();
  const [activeGame, setActiveGame] = useState<'memory' | 'catch' | 'trivia'>('memory');

  // --- Game 1: Memory Match ---
  const cardTypes = [
    { type: 'tikka', label: 'Tandoor', icon: <Flame className="w-8 h-8 text-primary" /> },
    { type: 'biryani', label: 'Biryani', icon: <Soup className="w-8 h-8 text-sun" /> },
    { type: 'dessert', label: 'Dessert', icon: <Cake className="w-8 h-8 text-status-success" /> },
    { type: 'coffee', label: 'Coffee', icon: <Coffee className="w-8 h-8 text-info" /> },
  ];

  const initialCards = [
    ...cardTypes.map((c, i) => ({ id: i + 1, ...c, matched: false })),
    ...cardTypes.map((c, i) => ({ id: i + 5, ...c, matched: false })),
  ];

  const [memoryDeck, setMemoryDeck] = useState(() =>
    [...initialCards].sort(() => Math.random() - 0.5)
  );
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [memoryWon, setMemoryWon] = useState(false);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || memoryDeck[index].matched) {
      return;
    }
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (memoryDeck[first].type === memoryDeck[second].type) {
        // Matched!
        setTimeout(() => {
          const updated = memoryDeck.map((c, i) =>
            i === first || i === second ? { ...c, matched: true } : c
          );
          setMemoryDeck(updated);
          setFlippedIndices([]);
          addPoints(15);

          if (updated.every((c) => c.matched)) {
            setMemoryWon(true);
            addPoints(25);
          }
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => setFlippedIndices([]), 900);
      }
    }
  };

  const resetMemoryGame = () => {
    setMemoryDeck([...initialCards].sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMemoryWon(false);
  };

  // --- Game 2: Speed Tap Dish Game ---
  const [catchScore, setCatchScore] = useState(0);
  const [catchTimeLeft, setCatchTimeLeft] = useState(20);
  const [catchActive, setCatchActive] = useState(false);
  const [dishPosition, setDishPosition] = useState({ top: 30, left: 40 });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (catchActive && catchTimeLeft > 0) {
      timer = setInterval(() => {
        setCatchTimeLeft((t) => t - 1);
      }, 1000);
    } else if (catchTimeLeft === 0 && catchActive) {
      setCatchActive(false);
      addPoints(catchScore * 2);
    }
    return () => clearInterval(timer);
  }, [catchActive, catchTimeLeft, catchScore, addPoints]);

  const startCatchGame = () => {
    setCatchScore(0);
    setCatchTimeLeft(20);
    setCatchActive(true);
    relocateDish();
  };

  const relocateDish = () => {
    setDishPosition({
      top: Math.floor(Math.random() * 60) + 15,
      left: Math.floor(Math.random() * 65) + 15,
    });
  };

  const handleCatchDish = () => {
    if (!catchActive) return;
    setCatchScore((s) => s + 1);
    relocateDish();
  };

  // --- Game 3: Food Trivia ---
  const triviaQuestions = [
    {
      q: 'Which spice gives Biryani its signature golden hue and regal aroma?',
      options: ['Saffron (Kesar)', 'Coriander', 'Cinnamon', 'Black Cumin'],
      answer: 0,
      fact: 'Pure Kashmiri saffron strands are soaked in warm milk before layering on dum.',
    },
    {
      q: 'What is the traditional clay oven used for tandoori kebabs and naans called?',
      options: ['Kadai', 'Tandoor', 'Handi', 'Tawa'],
      answer: 1,
      fact: 'Tandoor ovens reach blistering temperatures up to 480°C (900°F).',
    },
    {
      q: 'In Indian culinary tradition, which digestive refresher is chewed after a rich meal?',
      options: ['Meetha Paan & Saunf', 'Dry Ginger', 'Chili Flakes', 'Cardamom Tea'],
      answer: 0,
      fact: 'Betel leaf, fennel seeds, and sweet rose petal gulkand cleanse the palate.',
    },
  ];

  const [currentTriviaIdx, setCurrentTriviaIdx] = useState(0);
  const [selectedTriviaOption, setSelectedTriviaOption] = useState<number | null>(null);
  const [triviaAnswered, setTriviaAnswered] = useState(false);

  const handleTriviaSelect = (idx: number) => {
    if (triviaAnswered) return;
    setSelectedTriviaOption(idx);
    setTriviaAnswered(true);

    if (idx === triviaQuestions[currentTriviaIdx].answer) {
      addPoints(20);
    }
  };

  const handleNextTrivia = () => {
    setSelectedTriviaOption(null);
    setTriviaAnswered(false);
    setCurrentTriviaIdx((i) => (i + 1) % triviaQuestions.length);
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/t/${tableId}/status`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-content-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order Status</span>
        </Link>

        {/* Spice Points Counter */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill bg-sun/20 border border-sun/40 text-content-primary font-bold text-xs sm:text-sm shadow-soft">
          <Flame className="w-4 h-4 text-primary fill-primary" />
          <span>{spicePoints} Spice Points</span>
        </div>
      </div>

      {/* Rewards Banner */}
      <Card
        padding="md"
        className="bg-gradient-to-r from-sun/20 via-surface to-primary/10 border border-sun/40 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sun text-content-primary flex items-center justify-center shadow-soft shrink-0">
            <Gift className="w-6 h-6 text-content-primary" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base sm:text-lg text-content-primary">
              Table {tableNumber} Waiting Reward
            </h3>
            <p className="text-xs text-content-secondary">
              {spicePoints >= 50
                ? 'Congratulations! You unlocked 10% OFF on all Desserts!'
                : `Earn 50 Spice Points to unlock 10% OFF dessert (${50 - spicePoints} pts to go)`}
            </p>
          </div>
        </div>

        {spicePoints >= 50 && (
          <span className="px-3 py-1 rounded-full bg-status-success text-white font-bold text-xs shrink-0 shadow-sm">
            Unlocked
          </span>
        )}
      </Card>

      {/* Game Selector Tabs */}
      <div className="flex gap-2 border-b border-borderSubtle pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveGame('memory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-pill font-heading font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeGame === 'memory'
              ? 'bg-primary text-white shadow-accent'
              : 'bg-surface text-content-secondary border border-borderSubtle hover:bg-canvas'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Food Memory Match</span>
        </button>

        <button
          onClick={() => setActiveGame('catch')}
          className={`flex items-center gap-2 px-4 py-2 rounded-pill font-heading font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeGame === 'catch'
              ? 'bg-primary text-white shadow-accent'
              : 'bg-surface text-content-secondary border border-borderSubtle hover:bg-canvas'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>Speed Tap (20s)</span>
        </button>

        <button
          onClick={() => setActiveGame('trivia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-pill font-heading font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeGame === 'trivia'
              ? 'bg-primary text-white shadow-accent'
              : 'bg-surface text-content-secondary border border-borderSubtle hover:bg-canvas'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Culinary Trivia</span>
        </button>
      </div>

      {/* --- GAME 1: MEMORY MATCH --- */}
      {activeGame === 'memory' && (
        <Card padding="lg" className="space-y-6 text-center">
          <div>
            <h3 className="font-heading font-black text-xl sm:text-2xl text-content-primary">
              Memory Match: Culinary Icons
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary mt-1">
              Tap cards to flip and match pairs. Match all to win 40 points!
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-sm mx-auto">
            {memoryDeck.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx) || card.matched;
              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleCardClick(idx)}
                  className={`h-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center shadow-soft select-none transition-all duration-300 ${
                    card.matched
                      ? 'bg-status-success/20 border-2 border-status-success'
                      : isFlipped
                      ? 'bg-sun/25 border-2 border-sun'
                      : 'bg-canvas hover:bg-surface border-2 border-dashed border-borderSubtle'
                  }`}
                >
                  {isFlipped ? (
                    <div className="flex flex-col items-center gap-1">
                      {card.icon}
                      <span className="text-[10px] font-bold text-content-primary">
                        {card.label}
                      </span>
                    </div>
                  ) : (
                    <HelpCircle className="w-6 h-6 text-content-muted" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {memoryWon ? (
            <div className="p-4 rounded-2xl bg-status-success/15 border border-status-success/40 text-status-success space-y-2">
              <Trophy className="w-8 h-8 mx-auto text-status-success" />
              <h4 className="font-heading font-black text-lg">Great Memory! All Matched!</h4>
              <p className="text-xs">You won 40 Spice Points for Table {tableNumber}!</p>
              <Button variant="primary" size="sm" onClick={resetMemoryGame}>
                Play Again
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={resetMemoryGame}
              className="text-xs"
            >
              Shuffle & Reset
            </Button>
          )}
        </Card>
      )}

      {/* --- GAME 2: SPEED TAP --- */}
      {activeGame === 'catch' && (
        <Card padding="lg" className="space-y-4 text-center">
          <div>
            <h3 className="font-heading font-black text-xl sm:text-2xl text-content-primary">
              Speed Tap Challenge
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary mt-1">
              Tap the appearing spice tokens as fast as possible in 20 seconds.
            </p>
          </div>

          {/* Score & Time bar */}
          <div className="flex justify-between items-center max-w-md mx-auto p-3 rounded-2xl bg-canvas border border-borderSubtle font-mono text-xs sm:text-sm font-bold">
            <span className="text-content-secondary">
              Time Left: <strong className="text-primary">{catchTimeLeft}s</strong>
            </span>
            <span className="text-content-secondary">
              Dishes Caught: <strong className="text-sun">{catchScore}</strong>
            </span>
          </div>

          {/* Game Canvas Box */}
          <div className="relative w-full h-64 sm:h-72 rounded-3xl bg-canvas border-2 border-dashed border-borderSubtle overflow-hidden">
            {catchActive ? (
              <motion.button
                onClick={handleCatchDish}
                style={{ top: `${dishPosition.top}%`, left: `${dishPosition.left}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary text-white shadow-accent flex items-center justify-center font-bold text-sm cursor-pointer select-none active:scale-90 transition-transform"
              >
                <Flame className="w-8 h-8 fill-white" />
              </motion.button>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Flame className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-black text-lg text-content-primary">
                  {catchTimeLeft === 0 ? 'Time Up!' : 'Ready to Tap?'}
                </h4>
                {catchTimeLeft === 0 && (
                  <p className="text-xs text-status-success font-bold">
                    You earned {catchScore * 2} Spice Points!
                  </p>
                )}
                <Button variant="primary" size="lg" className="font-bold shadow-accent" onClick={startCatchGame}>
                  {catchTimeLeft === 0 ? 'Play Again' : 'Start Tap Game (20s)'}
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* --- GAME 3: TRIVIA --- */}
      {activeGame === 'trivia' && (
        <Card padding="lg" className="space-y-5">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
              Question {currentTriviaIdx + 1} of {triviaQuestions.length}
            </span>
            <h3 className="font-heading font-black text-xl sm:text-2xl text-content-primary pt-2">
              {triviaQuestions[currentTriviaIdx].q}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {triviaQuestions[currentTriviaIdx].options.map((opt, oIdx) => {
              const isSelected = selectedTriviaOption === oIdx;
              const isCorrect = oIdx === triviaQuestions[currentTriviaIdx].answer;

              let style = 'bg-surface hover:bg-canvas border-borderSubtle text-content-primary';
              if (triviaAnswered) {
                if (isCorrect) {
                  style = 'bg-status-success/20 border-status-success text-status-success font-black';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-status-alert/20 border-status-alert text-status-alert';
                }
              }

              return (
                <button
                  key={oIdx}
                  disabled={triviaAnswered}
                  onClick={() => handleTriviaSelect(oIdx)}
                  className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {triviaAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-status-success" />}
                </button>
              );
            })}
          </div>

          {/* Fact card after answer */}
          {triviaAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-canvas border border-borderSubtle space-y-2 text-xs"
            >
              <div className="font-heading font-bold text-content-primary flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Chef Fact:</span>
              </div>
              <p className="text-content-secondary">
                {triviaQuestions[currentTriviaIdx].fact}
              </p>
              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="sm" onClick={handleNextTrivia}>
                  Next Question
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      )}
    </div>
  );
}
