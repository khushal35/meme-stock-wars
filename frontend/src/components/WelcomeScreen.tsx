import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Gamepad2 } from 'lucide-react';

type Props = {
  onCreateRoom: (playerName: string, role: 'RETAIL' | 'HEDGE') => void;
  onJoinRoom: (roomCode: string, playerName: string, role: 'RETAIL' | 'HEDGE') => void;
  error: string;
};

export default function WelcomeScreen({ onCreateRoom, onJoinRoom, error }: Props) {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<'RETAIL' | 'HEDGE'>('RETAIL');

  const handleCreate = () => {
    if (playerName.trim()) {
      onCreateRoom(playerName, selectedRole);
    }
  };

  const handleJoin = () => {
    if (playerName.trim() && roomCode.trim()) {
      onJoinRoom(roomCode.toUpperCase(), playerName, selectedRole);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        {/* Title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <TrendingUp className="w-20 h-20 mx-auto text-neon-green" />
          </motion.div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-neon-green to-neon-pink bg-clip-text text-transparent">
            MEME STOCK WARS
          </h1>
          <p className="text-xl text-gray-400">
            GameStop-Style Trading Battle with Game Theory
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Gamepad2 className="w-4 h-4" />
            <span>2 Players • Real-time • Nash Equilibrium</span>
          </div>
        </div>

        {/* Main Menu */}
        {mode === 'menu' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <button
              onClick={() => setMode('create')}
              className="w-full glass p-6 rounded-xl hover:bg-opacity-80 transition-all group"
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-neon-green" />
              <h3 className="text-2xl font-bold mb-2">Create Room</h3>
              <p className="text-gray-400">Start a new game and invite a friend</p>
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full glass p-6 rounded-xl hover:bg-opacity-80 transition-all group"
            >
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-neon-pink" />
              <h3 className="text-2xl font-bold mb-2">Join Room</h3>
              <p className="text-gray-400">Enter a room code to join</p>
            </button>
          </motion.div>
        )}

        {/* Create Room */}
        {mode === 'create' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-xl"
          >
            <h2 className="text-3xl font-bold mb-6">Create Room</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-navy-dark border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neon-green"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Choose Your Role</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedRole('RETAIL')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 'RETAIL'
                        ? 'border-neon-green bg-neon-green bg-opacity-10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-4xl mb-2">💎</div>
                    <div className="font-bold">Retail Investor</div>
                    <div className="text-xs text-gray-400 mt-1">Push price UP</div>
                  </button>

                  <button
                    onClick={() => setSelectedRole('HEDGE')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 'HEDGE'
                        ? 'border-neon-pink bg-neon-pink bg-opacity-10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-4xl mb-2">🐻</div>
                    <div className="font-bold">Hedge Fund</div>
                    <div className="text-xs text-gray-400 mt-1">Push price DOWN</div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 text-red-300">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setMode('menu')}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg px-6 py-3 font-semibold transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 btn-gradient rounded-lg px-6 py-3 font-semibold text-navy-dark"
                  disabled={!playerName.trim()}
                >
                  Create Room
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Join Room */}
        {mode === 'join' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-xl"
          >
            <h2 className="text-3xl font-bold mb-6">Join Room</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Room Code</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full bg-navy-dark border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neon-green font-mono text-lg tracking-wider"
                  placeholder="ABCDEF"
                  maxLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-navy-dark border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neon-green"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Choose Your Role</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedRole('RETAIL')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 'RETAIL'
                        ? 'border-neon-green bg-neon-green bg-opacity-10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-4xl mb-2">💎</div>
                    <div className="font-bold">Retail Investor</div>
                    <div className="text-xs text-gray-400 mt-1">Push price UP</div>
                  </button>

                  <button
                    onClick={() => setSelectedRole('HEDGE')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 'HEDGE'
                        ? 'border-neon-pink bg-neon-pink bg-opacity-10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-4xl mb-2">🐻</div>
                    <div className="font-bold">Hedge Fund</div>
                    <div className="text-xs text-gray-400 mt-1">Push price DOWN</div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 text-red-300">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setMode('menu')}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg px-6 py-3 font-semibold transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleJoin}
                  className="flex-1 btn-gradient rounded-lg px-6 py-3 font-semibold text-navy-dark"
                  disabled={!playerName.trim() || !roomCode.trim()}
                >
                  Join Room
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* How to Play */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>💡 Tip: Use Nash Equilibrium analysis to outsmart your opponent!</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
