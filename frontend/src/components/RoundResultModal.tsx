import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { RoundResult, Player } from '../App';

type Props = {
  result: RoundResult;
  retailPlayer: Player;
  hedgePlayer: Player;
  onClose: () => void;
};

export default function RoundResultModal({ result, retailPlayer, hedgePlayer }: Props) {
  const priceChange = result.newPrice - result.oldPrice;
  const isPriceUp = priceChange >= 0;

  const actionIcons: Record<string, string> = {
    BUY: '📈',
    HOLD: '✋',
    SELL: '📉',
    SHORT: '🔻',
    COVER: '🔼',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="glass p-8 rounded-2xl max-w-2xl w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Round {result.round} Results</h2>

        {/* Actions Reveal */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-neon-green bg-opacity-10 border border-neon-green rounded-xl p-6"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{actionIcons[result.retailAction]}</div>
              <div className="text-sm text-gray-400 mb-1">{retailPlayer.name}</div>
              <div className="text-2xl font-bold text-neon-green">{result.retailAction}</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-neon-pink bg-opacity-10 border border-neon-pink rounded-xl p-6"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{actionIcons[result.hedgeAction]}</div>
              <div className="text-sm text-gray-400 mb-1">{hedgePlayer.name}</div>
              <div className="text-2xl font-bold text-neon-pink">{result.hedgeAction}</div>
            </div>
          </motion.div>
        </div>

        {/* Price Change */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="bg-navy-dark rounded-xl p-6 mb-6"
        >
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Price Movement</div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-2xl font-mono">${result.oldPrice.toFixed(2)}</span>
              <div className={`flex items-center gap-1 ${isPriceUp ? 'text-neon-green' : 'text-neon-pink'}`}>
                {isPriceUp ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>
              <span className="text-2xl font-mono">${result.newPrice.toFixed(2)}</span>
            </div>
            <div className={`text-xl font-bold ${isPriceUp ? 'text-neon-green' : 'text-neon-pink'}`}>
              {isPriceUp ? '+' : ''}{priceChange.toFixed(2)} ({isPriceUp ? '+' : ''}{((priceChange / result.oldPrice) * 100).toFixed(1)}%)
            </div>
          </div>
        </motion.div>

        {/* Profits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-navy-dark rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">💎 Retail Profit</div>
            <div className={`text-2xl font-mono font-bold ${result.retailProfit >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
              {result.retailProfit >= 0 ? '+' : ''}${result.retailProfit.toFixed(0)}
            </div>
          </div>

          <div className="bg-navy-dark rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-1">🐻 Hedge Profit</div>
            <div className={`text-2xl font-mono font-bold ${result.hedgeProfit >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
              {result.hedgeProfit >= 0 ? '+' : ''}${result.hedgeProfit.toFixed(0)}
            </div>
          </div>
        </motion.div>

        {/* Optimal Play Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-2 mb-6"
        >
          <div className={`p-3 rounded-lg ${result.optimalPlay.retailOptimal ? 'bg-neon-green bg-opacity-10' : 'bg-neon-pink bg-opacity-10'}`}>
            {result.optimalPlay.retailOptimal ? (
              <div className="text-center text-neon-green font-bold">
                ✓ {retailPlayer.name} played optimally!
              </div>
            ) : (
              <div className="text-center text-neon-pink text-sm">
                {retailPlayer.name} should have played <span className="font-bold">{result.optimalPlay.bestRetailAction}</span>
              </div>
            )}
          </div>

          <div className={`p-3 rounded-lg ${result.optimalPlay.hedgeOptimal ? 'bg-neon-green bg-opacity-10' : 'bg-neon-pink bg-opacity-10'}`}>
            {result.optimalPlay.hedgeOptimal ? (
              <div className="text-center text-neon-green font-bold">
                ✓ {hedgePlayer.name} played optimally!
              </div>
            ) : (
              <div className="text-center text-neon-pink text-sm">
                {hedgePlayer.name} should have played <span className="font-bold">{result.optimalPlay.bestHedgeAction}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Achievement */}
        {result.achievement && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.1, type: 'spring' }}
            className="bg-gold bg-opacity-20 border border-gold rounded-xl p-4 mb-6 text-center"
          >
            <div className="text-2xl mb-1">{result.achievement.title}</div>
            <div className="text-sm text-gray-400">{result.achievement.message}</div>
          </motion.div>
        )}

        {/* Continue indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center text-gray-400 text-sm animate-pulse"
        >
          Next round starting soon...
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
