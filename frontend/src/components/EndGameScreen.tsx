import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { Trophy, TrendingUp, Brain, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { GameStats, GameState } from '../App';

type Props = {
  gameStats: GameStats;
  gameState: GameState;
  playerId: string;
  onPlayAgain: () => void;
};

export default function EndGameScreen({ gameStats, gameState, playerId, onPlayAgain }: Props) {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const currentPlayer = gameState.players[playerId];
  const isWinner = 
    (gameStats.winner === 'RETAIL' && currentPlayer?.role === 'RETAIL') ||
    (gameStats.winner === 'HEDGE' && currentPlayer?.role === 'HEDGE');

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const players = Object.values(gameState.players);
  const retailPlayer = players.find(p => p.role === 'RETAIL');
  const hedgePlayer = players.find(p => p.role === 'HEDGE');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {isWinner && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        <div className="glass p-8 rounded-2xl">
          {/* Winner Announcement */}
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-center mb-8"
          >
            <Trophy className={`w-20 h-20 mx-auto mb-4 ${isWinner ? 'text-gold' : 'text-gray-500'}`} />
            <h1 className="text-5xl font-bold mb-4">
              {isWinner ? '🎉 VICTORY! 🎉' : 'Game Over'}
            </h1>
            <div className="text-2xl text-gray-400">
              {gameStats.winner === 'RETAIL' ? '💎 Retail Investor' : '🐻 Hedge Fund'} Wins!
            </div>
            <div className="text-xl text-neon-green mt-2">
              {gameStats.winner === 'RETAIL' ? retailPlayer?.name : hedgePlayer?.name}
            </div>
          </motion.div>

          {/* Final Scores */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`glass p-6 rounded-xl ${gameStats.winner === 'RETAIL' ? 'border-2 border-gold' : ''}`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">💎</div>
                <div className="font-bold mb-1">{retailPlayer?.name}</div>
                <div className="text-xs text-gray-400 mb-3">Retail Investor</div>
                <div className={`text-3xl font-mono font-bold ${gameStats.retailScore >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                  ${gameStats.retailScore.toFixed(0)}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`glass p-6 rounded-xl ${gameStats.winner === 'HEDGE' ? 'border-2 border-gold' : ''}`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🐻</div>
                <div className="font-bold mb-1">{hedgePlayer?.name}</div>
                <div className="text-xs text-gray-400 mb-3">Hedge Fund</div>
                <div className={`text-3xl font-mono font-bold ${gameStats.hedgeScore >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                  ${gameStats.hedgeScore.toFixed(0)}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Game Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-navy-dark p-4 rounded-xl text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-neon-green" />
              <div className="text-2xl font-bold">${gameStats.finalPrice.toFixed(2)}</div>
              <div className="text-xs text-gray-400">Final Price</div>
              <div className={`text-sm ${parseFloat(gameStats.priceChange) >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
                {parseFloat(gameStats.priceChange) >= 0 ? '+' : ''}{gameStats.priceChange}%
              </div>
            </div>

            <div className="bg-navy-dark p-4 rounded-xl text-center">
              <Brain className="w-6 h-6 mx-auto mb-2 text-gold" />
              <div className="text-2xl font-bold">{gameStats.retailOptimalPercentage}%</div>
              <div className="text-xs text-gray-400">Retail Optimal</div>
            </div>

            <div className="bg-navy-dark p-4 rounded-xl text-center">
              <Brain className="w-6 h-6 mx-auto mb-2 text-gold" />
              <div className="text-2xl font-bold">{gameStats.hedgeOptimalPercentage}%</div>
              <div className="text-xs text-gray-400">Hedge Optimal</div>
            </div>

            <div className="bg-navy-dark p-4 rounded-xl text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-neon-pink" />
              <div className="text-2xl font-bold">{gameStats.roundHistory.length}</div>
              <div className="text-xs text-gray-400">Rounds Played</div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-navy-dark p-6 rounded-xl mb-8"
          >
            <h3 className="text-xl font-bold mb-4 text-center">Game Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Most Profitable Round:</div>
                <div className="font-bold">
                  Round {gameStats.roundHistory.reduce((max, r, i) => 
                    Math.abs(r.retailProfit) > Math.abs(gameStats.roundHistory[max].retailProfit) ? i : max, 0
                  ) + 1}
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Most Volatile Round:</div>
                <div className="font-bold">
                  Round {gameStats.roundHistory.reduce((max, r, i) => 
                    Math.abs(r.priceChange) > Math.abs(gameStats.roundHistory[max].priceChange) ? i : max, 0
                  ) + 1}
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Nash Equilibria Found:</div>
                <div className="font-bold text-gold">
                  {gameStats.roundHistory.filter(r => r.equilibria.length > 0).length} rounds
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Perfect Plays:</div>
                <div className="font-bold text-neon-green">
                  {gameStats.roundHistory.filter(r => r.optimalPlay.retailOptimal && r.optimalPlay.hedgeOptimal).length} rounds
                </div>
              </div>
            </div>
          </motion.div>

          {/* Play Again Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <button
              onClick={onPlayAgain}
              className="btn-gradient px-8 py-4 rounded-xl font-bold text-lg text-navy-dark"
            >
              Play Again
            </button>
          </motion.div>

          {/* Fun Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center text-sm text-gray-500"
          >
            {isWinner ? (
              <p>🎮 Outstanding strategic play! You mastered the Nash Equilibrium!</p>
            ) : (
              <p>💪 Great game! Study the Nash analysis to improve your strategy!</p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
