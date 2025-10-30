import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { GameState, RoundResult } from '../App';
import PriceChart from './PriceChart';
import NashPanel from './NashPanel';
import RoundResultModal from './RoundResultModal';

type Props = {
  gameState: GameState;
  playerId: string;
  onSubmitAction: (action: string) => void;
  currentRoundResult: RoundResult | null;
};

export default function GameScreen({ gameState, playerId, onSubmitAction, currentRoundResult }: Props) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentPlayer = gameState.players[playerId];
  const players = Object.values(gameState.players);
  const retailPlayer = players.find(p => p.role === 'RETAIL');
  const hedgePlayer = players.find(p => p.role === 'HEDGE');

  const isRetail = currentPlayer?.role === 'RETAIL';
  const actions = isRetail 
    ? ['BUY', 'HOLD', 'SELL']
    : ['SHORT', 'COVER', 'HOLD'];

  const actionIcons: Record<string, string> = {
    BUY: '📈',
    HOLD: '✋',
    SELL: '📉',
    SHORT: '🔻',
    COVER: '🔼',
  };

  const actionDescriptions: Record<string, string> = {
    BUY: '+$3 price impact',
    HOLD: 'No impact',
    SELL: '-$2 price impact',
    SHORT: '-$2 price impact',
    COVER: '+$3 price impact',
  };

  // Timer effect
  useEffect(() => {
    if (currentRoundResult) {
      setHasSubmitted(false);
      setSelectedAction(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit HOLD if time runs out
          if (!hasSubmitted) {
            handleSubmit('HOLD');
          }
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasSubmitted, currentRoundResult]);

  const handleSubmit = (action?: string) => {
    const finalAction = action || selectedAction;
    if (finalAction && !hasSubmitted) {
      onSubmitAction(finalAction);
      setHasSubmitted(true);
    }
  };

  const priceChange = gameState.stockPrice - 20;
  const priceChangePercent = ((priceChange / 20) * 100).toFixed(1);

  const sentimentColors: Record<string, string> = {
    BEARISH: 'text-red-500',
    NEUTRAL: 'text-gray-400',
    BULLISH: 'text-green-500',
    MANIC: 'text-purple-500',
  };

  const sentimentEmojis: Record<string, string> = {
    BEARISH: '🐻',
    NEUTRAL: '⚪',
    BULLISH: '🐂',
    MANIC: '🚀',
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass p-4 rounded-xl mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">🎮 MEME STOCK WARS</h1>
            <div className="bg-navy-dark px-3 py-1 rounded-lg">
              <span className="text-sm">Round {gameState.round}/{gameState.maxRounds}</span>
            </div>
          </div>
          
          {!hasSubmitted && !currentRoundResult && (
            <div className={`text-2xl font-mono font-bold ${timeLeft <= 10 ? 'text-neon-pink animate-pulse' : 'text-neon-green'}`}>
              {timeLeft}s
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Left Column - Player Stats */}
          <div className="space-y-4">
            {/* Retail Player */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`glass p-4 rounded-xl ${isRetail ? 'border-2 border-neon-green' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💎</span>
                  <div>
                    <div className="font-bold">{retailPlayer?.name}</div>
                    <div className="text-xs text-gray-400">Retail Investor</div>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-400 mb-1">Score</div>
                <div className={`text-2xl font-mono font-bold ${gameState.retailScore >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                  ${gameState.retailScore.toFixed(0)}
                </div>
              </div>
            </motion.div>

            {/* Hedge Player */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`glass p-4 rounded-xl ${!isRetail ? 'border-2 border-neon-pink' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐻</span>
                  <div>
                    <div className="font-bold">{hedgePlayer?.name}</div>
                    <div className="text-xs text-gray-400">Hedge Fund</div>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-400 mb-1">Score</div>
                <div className={`text-2xl font-mono font-bold ${gameState.hedgeScore >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                  ${gameState.hedgeScore.toFixed(0)}
                </div>
              </div>
            </motion.div>

            {/* Sentiment */}
            <div className="glass p-4 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Market Sentiment</div>
              <div className={`text-2xl font-bold ${sentimentColors[gameState.sentiment]}`}>
                {sentimentEmojis[gameState.sentiment]} {gameState.sentiment}
              </div>
            </div>
          </div>

          {/* Middle Column - Price Chart */}
          <div className="lg:col-span-2">
            <div className="glass p-6 rounded-xl h-full">
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">Current Price</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-mono font-bold">${gameState.stockPrice.toFixed(2)}</span>
                  <span className={`text-xl flex items-center gap-1 ${priceChange >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                    {priceChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {priceChange >= 0 ? '+' : ''}{priceChangePercent}%
                  </span>
                </div>
              </div>
              <PriceChart priceHistory={gameState.priceHistory} />
            </div>
          </div>
        </div>

        {/* Action Selection */}
        {!hasSubmitted && !currentRoundResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-xl mb-4"
          >
            <h3 className="text-xl font-bold mb-4">Choose Your Action</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {actions.map((action) => (
                <button
                  key={action}
                  onClick={() => setSelectedAction(action)}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    selectedAction === action
                      ? 'border-neon-green bg-neon-green bg-opacity-20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-4xl mb-2">{actionIcons[action]}</div>
                  <div className="font-bold text-lg mb-1">{action}</div>
                  <div className="text-xs text-gray-400">{actionDescriptions[action]}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => handleSubmit()}
              disabled={!selectedAction}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selectedAction
                  ? 'btn-gradient text-navy-dark'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {selectedAction ? `Submit ${selectedAction}` : 'Select an Action'}
            </button>
          </motion.div>
        )}

        {hasSubmitted && !currentRoundResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-6 rounded-xl mb-4 text-center"
          >
            <div className="text-xl font-bold text-neon-green animate-pulse-slow">
              ✓ Waiting for opponent...
            </div>
          </motion.div>
        )}

        {/* Nash Equilibrium Panel */}
        {gameState.roundHistory.length > 0 && (
          <NashPanel lastRound={gameState.roundHistory[gameState.roundHistory.length - 1]} />
        )}
      </div>

      {/* Round Result Modal */}
      <AnimatePresence>
        {currentRoundResult && (
          <RoundResultModal
            result={currentRoundResult}
            retailPlayer={retailPlayer!}
            hedgePlayer={hedgePlayer!}
            onClose={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
