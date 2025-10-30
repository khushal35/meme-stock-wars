import { motion } from 'framer-motion';
import { Copy, Check, Users } from 'lucide-react';
import { useState } from 'react';
import type { GameState } from '../App';

type Props = {
  gameState: GameState;
  roomCode: string;
  playerId: string;
  onReady: () => void;
};

export default function LobbyScreen({ gameState, roomCode, playerId, onReady }: Props) {
  const [copied, setCopied] = useState(false);
  const players = Object.values(gameState.players);
  const currentPlayer = gameState.players[playerId];
  const allReady = players.length === 2 && players.every(p => p.ready);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        <div className="glass p-8 rounded-2xl">
          {/* Room Code */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Room Code</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="bg-navy-dark px-8 py-4 rounded-lg">
                <span className="text-4xl font-mono font-bold tracking-widest text-neon-green">
                  {roomCode}
                </span>
              </div>
              <button
                onClick={copyRoomCode}
                className="bg-navy-dark hover:bg-gray-700 p-3 rounded-lg transition-all"
              >
                {copied ? (
                  <Check className="w-6 h-6 text-neon-green" />
                ) : (
                  <Copy className="w-6 h-6" />
                )}
              </button>
            </div>
            <p className="text-gray-400 mt-2 text-sm">Share this code with your opponent</p>
          </div>

          {/* Players */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-5 h-5" />
              <h3 className="text-xl font-bold">
                Players ({players.length}/2)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Retail Slot */}
              <div className={`glass p-6 rounded-xl ${
                players.find(p => p.role === 'RETAIL')?.ready ? 'border-2 border-neon-green' : ''
              }`}>
                <div className="text-4xl mb-2 text-center">💎</div>
                <div className="text-center">
                  <div className="font-bold mb-1">Retail Investor</div>
                  {players.find(p => p.role === 'RETAIL') ? (
                    <>
                      <div className="text-neon-green font-semibold">
                        {players.find(p => p.role === 'RETAIL')?.name}
                      </div>
                      {players.find(p => p.role === 'RETAIL')?.ready && (
                        <div className="text-sm text-neon-green mt-2">✓ Ready</div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-500">Waiting...</div>
                  )}
                </div>
              </div>

              {/* Hedge Slot */}
              <div className={`glass p-6 rounded-xl ${
                players.find(p => p.role === 'HEDGE')?.ready ? 'border-2 border-neon-pink' : ''
              }`}>
                <div className="text-4xl mb-2 text-center">🐻</div>
                <div className="text-center">
                  <div className="font-bold mb-1">Hedge Fund</div>
                  {players.find(p => p.role === 'HEDGE') ? (
                    <>
                      <div className="text-neon-pink font-semibold">
                        {players.find(p => p.role === 'HEDGE')?.name}
                      </div>
                      {players.find(p => p.role === 'HEDGE')?.ready && (
                        <div className="text-sm text-neon-pink mt-2">✓ Ready</div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-500">Waiting...</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ready Button */}
          <div className="text-center">
            {players.length < 2 ? (
              <div className="text-gray-400 mb-4 animate-pulse-slow">
                Waiting for opponent to join...
              </div>
            ) : allReady ? (
              <div className="text-neon-green text-xl font-bold mb-4 animate-pulse-glow">
                Game Starting...
              </div>
            ) : (
              <button
                onClick={onReady}
                disabled={currentPlayer?.ready}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  currentPlayer?.ready
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'btn-gradient text-navy-dark'
                }`}
              >
                {currentPlayer?.ready ? '✓ Ready' : 'Ready to Play'}
              </button>
            )}
          </div>

          {/* Game Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-navy-dark p-4 rounded-lg"
          >
            <h4 className="font-bold mb-2">Game Rules</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• 10 rounds of simultaneous action selection</li>
              <li>• Retail Investor: BUY, HOLD, SELL (wants price UP)</li>
              <li>• Hedge Fund: SHORT, COVER, HOLD (wants price DOWN)</li>
              <li>• Nash Equilibrium shows optimal strategies after each round</li>
              <li>• Markov Chain sentiment affects price multipliers</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
