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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MiniGamesPage() {
  const params = useParams();
  const tableId = (params?.tableId as string) || '7';
  const tableNumber = parseInt(tableId, 10) || 7;

  const { spicePoints, unlockedDiscountPercent, addPoints } = useGameStore();
  const [activeGame, setActiveGame] = useState<'memory' | 'catch' | 'trivia'>('memory');

  // --- Game 1: Memory Match ---
  const initialCards = [
    { id: 1, icon: '🍗', matched: false },
    { id: 2, icon: '🍛', matched: false },
    { id: 3, icon: '🍨', matched: false },
    { id: 4, icon: '☕', matched: false },
    { id: 5, icon: '🍗', matched: false },
    { id: 6, icon: '🍛', matched: false },
    { id: 7, icon: '🍨', matched: false },
    { id: 8, icon: '☕', matched: false },
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
      if (memoryDeck[first].icon === memoryDeck[second].icon) {
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

  // --- Game 2: Catch the Dish Tap Game ---
  const [catchScore, setCatchScore] = useState(0);
  const [catchTimeLeft, setCatchTimeLeft] = useState(20);
  const [catchActive, setCatchActive] = useState(false);
  const [dishPosition, setDishPosition] = useState({ top: 30, left: 40 });
  const [currentDishEmoji, setCurrentDishEmoji] = useState('🍲');

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
    const emojis = ['🍛', '🍗', '🥟', '🍤', '🍨', '🥭', '🫓'];
    setCurrentDishEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    setDishPosition({
      top: Math.floor(Math.random() * 65) + 10,
      left: Math.floor(Math.random() * 70) + 10,
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
      q: 'Which city is world-famous for its aromatic Kacche Gosht Dum Biryani?',
      options: ['Hyderabad', 'Amritsar', 'Jaipur', 'Goa'],
      answer: 0,
      fact: 'Nizami chefs perfected cooking raw marinated meat together with parboiled basmati under dough seal.',
    },
    {
      q: 'Which lentil is used to make the creamy and rich Dal Makhani?',
      options: ['Urad Dal (Black Gram)', 'Toor Dal', 'Chana Dal', 'Moong Dal'],
      answer: 0,
      fact: 'Whole black lentils are slow simmered for up to 24 hours with butter and fresh cream.',
    },
    {
      q: 'Which Indian sweet dumpling is soaked in saffron-infused clotted rabri?',
      options: ['Rasmalai', 'Jalebi', 'Kaju Katli', 'Mysore Pak'],
      answer: 0,
      fact: 'Rasmalai means "juice of cream" in Hindi and Bengali.',
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaFinished, setTriviaFinished] = useState(false);

  const handleTriviaAnswer = (optIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIndex);

    if (optIndex === triviaQuestions[currentQuestion].answer) {
      setTriviaScore((s) => s + 1);
      addPoints(10);
    }

    setTimeout(() => {
      if (currentQuestion < triviaQuestions.length - 1) {
        setCurrentQuestion((c) => c + 1);
        setSelectedOption(null);
      } else {
        setTriviaFinished(true);
      }
    }, 1400);
  };

  const resetTrivia = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setTriviaScore(0);
    setTriviaFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Top Nav */}
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
        className="bg-gradient-to-r from-sun/25 via-surface to-primary/15 border border-sun/40 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sun text-content-primary flex items-center justify-center text-2xl shadow-soft shrink-0">
            🎁
          </div>
          <div>
            <h3 className="font-heading font-black text-lg text-content-primary">
              Table {tableNumber} Waiting Reward
            </h3>
            <p className="text-xs text-content-secondary">
              {spicePoints >= 50
                ? '🎉 Congratulations! You unlocked 10% OFF on all Desserts!'
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-pill font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeGame === 'memory'
              ? 'bg-primary text-white shadow-accent'
              : 'bg-surface text-content-secondary border border-borderSubtle hover:bg-canvas'
          }`}
        >
          <span>🧠 Food Memory Match</span>
        </button>

        <button
          onClick={() => setActiveGame('catch')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-pill font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeGame === 'catch'
              ? 'bg-primary text-white shadow-accent'
              : 'bg-surface text-content-secondary border border-borderSubtle hover:bg-canvas'
          }`}
        >
          <span>⚡ Catch The Dish (20s)</span>
        </button>

        <button
          onClick={() => setActiveGame('trivia')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-pill font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeGame === 'trivia'
              ? 'bg-primary text-white shadow-accent'
              : 'bg-surface text-content-secondary border border-borderSubtle hover:bg-canvas'
          }`}
        >
          <span>🎯 Indian Food Trivia</span>
        </button>
      </div>

      {/* --- GAME 1: MEMORY MATCH --- */}
      {activeGame === 'memory' && (
        <Card padding="lg" className="space-y-6 text-center">
          <div>
            <h3 className="font-heading font-black text-2xl text-content-primary">
              Memory Match: Indian Delicacies
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary mt-1">
              Tap cards to flip and match pairs. Match all to win 40 points!
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-sm mx-auto">
            {memoryDeck.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx) || card.matched;
              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleCardClick(idx)}
                  className={`h-20 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-soft select-none transition-all duration-300 ${
                    card.matched
                      ? 'bg-status-success/20 border-2 border-status-success'
                      : isFlipped
                      ? 'bg-sun/30 border-2 border-sun'
                      : 'bg-canvas hover:bg-[#FAF4EB] border-2 border-dashed border-borderSubtle'
                  }`}
                >
                  {isFlipped ? card.icon : '❓'}
                </motion.button>
              );
            })}
          </div>

          {memoryWon ? (
            <div className="p-4 rounded-2xl bg-status-success/15 border border-status-success/40 text-status-success space-y-2">
              <div className="text-2xl">🏆</div>
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
            >
              Shuffle & Reset
            </Button>
          )}
        </Card>
      )}

      {/* --- GAME 2: CATCH THE DISH --- */}
      {activeGame === 'catch' && (
        <Card padding="lg" className="space-y-4 text-center">
          <div>
            <h3 className="font-heading font-black text-2xl text-content-primary">
              Speed Tap: Catch The Dish!
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary mt-1">
              Tap the popping dishes as fast as you can in 20 seconds.
            </p>
          </div>

          {/* Score & Time bar */}
          <div className="flex justify-between items-center max-w-md mx-auto p-3 rounded-2xl bg-canvas border border-borderSubtle font-mono text-sm font-bold">
            <span className="text-content-secondary">
              Time Left: <strong className="text-primary">{catchTimeLeft}s</strong>
            </span>
            <span className="text-content-secondary">
              Dishes Caught: <strong className="text-sun">{catchScore}</strong>
            </span>
          </div>

          {/* Game Canvas Box */}
          <div className="relative w-full h-64 sm:h-80 rounded-3xl bg-surface border-2 border-dashed border-borderSubtle overflow-hidden select-none">
            {catchActive ? (
              <motion.button
                key={catchScore}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.8 }}
                onClick={handleCatchDish}
                style={{ top: `${dishPosition.top}%`, left: `${dishPosition.left}%` }}
                className="absolute text-5xl sm:text-6xl p-2 cursor-pointer filter drop-shadow-md"
              >
                {currentDishEmoji}
              </motion.button>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 space-y-3">
                <span className="text-5xl">⚡</span>
                <h4 className="font-heading font-bold text-lg text-content-primary">
                  {catchTimeLeft === 0 ? `Finished! You caught ${catchScore} dishes!` : 'Ready for the reflex challenge?'}
                </h4>
                <Button variant="primary" size="md" onClick={startCatchGame}>
                  {catchTimeLeft === 0 ? 'Play Again' : 'Start 20s Round'}
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* --- GAME 3: FOOD TRIVIA --- */}
      {activeGame === 'trivia' && (
        <Card padding="lg" className="space-y-6">
          {!triviaFinished ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs font-bold text-content-secondary">
                <span>Question {currentQuestion + 1} of {triviaQuestions.length}</span>
                <span>Score: {triviaScore}</span>
              </div>

              <h3 className="font-heading font-black text-xl sm:text-2xl text-content-primary">
                {triviaQuestions[currentQuestion].q}
              </h3>

              <div className="space-y-2.5">
                {triviaQuestions[currentQuestion].options.map((opt, i) => {
                  const isChosen = selectedOption === i;
                  const isCorrect = i === triviaQuestions[currentQuestion].answer;
                  let btnColor = 'bg-surface border-borderSubtle text-content-primary hover:bg-canvas';

                  if (selectedOption !== null) {
                    if (isCorrect) {
                      btnColor = 'bg-status-success/20 border-status-success text-status-success font-bold';
                    } else if (isChosen) {
                      btnColor = 'bg-status-alert/20 border-status-alert text-status-alert font-bold';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={selectedOption !== null}
                      onClick={() => handleTriviaAnswer(i)}
                      className={`w-full p-4 rounded-2xl border text-left font-sans text-sm sm:text-base font-semibold transition-all flex items-center justify-between ${btnColor}`}
                    >
                      <span>{opt}</span>
                      {selectedOption !== null && isCorrect && <CheckCircle className="w-5 h-5 text-status-success" />}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="p-3.5 rounded-2xl bg-canvas border border-borderSubtle text-xs text-content-secondary">
                  <span className="font-bold text-content-primary">Chef Fact: </span>
                  {triviaQuestions[currentQuestion].fact}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="text-5xl">🎓</div>
              <h3 className="font-heading font-black text-2xl text-content-primary">
                Trivia Master!
              </h3>
              <p className="text-sm text-content-secondary">
                You answered {triviaScore} out of {triviaQuestions.length} questions correctly!
              </p>
              <Button variant="primary" size="md" onClick={resetTrivia}>
                Try Trivia Again
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
