import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import WelcomeScreen from './components/WelcomeScreen';
import LobbyScreen from './components/LobbyScreen';
import GameScreen from './components/GameScreen';
import EndGameScreen from './components/EndGameScreen';

const SERVER_URL = 'http://localhost:3000';

export type GameState = {
  players: Record<string, Player>;
  round: number;
  maxRounds: number;
  stockPrice: number;
  priceHistory: PricePoint[];
  sentiment: string;
  retailScore: number;
  hedgeScore: number;
  retailShares: number;
  hedgeShares: number;
  actions: Record<string, string>;
  roundHistory: RoundResult[];
  gameStarted: boolean;
  gameEnded: boolean;
  retailOptimalCount: number;
  hedgeOptimalCount: number;
};

export type Player = {
  id: string;
  name: string;
  role: 'RETAIL' | 'HEDGE';
  ready: boolean;
};

export type PricePoint = {
  round: number;
  price: number;
};

export type RoundResult = {
  round: number;
  retailAction: string;
  hedgeAction: string;
  oldPrice: number;
  newPrice: number;
  priceChange: number;
  retailProfit: number;
  hedgeProfit: number;
  sentiment: string;
  payoffMatrix: any;
  equilibria: any[];
  optimalStrategy: any;
  optimalPlay: any;
  achievement?: any;
};

export type GameStats = {
  winner: string;
  retailScore: number;
  hedgeScore: number;
  retailOptimalPercentage: string;
  hedgeOptimalPercentage: string;
  finalPrice: number;
  priceChange: string;
  roundHistory: RoundResult[];
};

type Screen = 'welcome' | 'lobby' | 'game' | 'endgame';

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomCode, setRoomCode] = useState<string>('');
  const [playerId, setPlayerId] = useState<string>('');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentRoundResult, setCurrentRoundResult] = useState<RoundResult | null>(null);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('error', ({ message }) => {
      setError(message);
    });

    newSocket.on('roomCreated', ({ roomCode, gameState, playerId }) => {
      setRoomCode(roomCode);
      setPlayerId(playerId);
      setGameState(gameState);
      setScreen('lobby');
      setError('');
    });

    newSocket.on('roomJoined', ({ roomCode, gameState, playerId }) => {
      setRoomCode(roomCode);
      setPlayerId(playerId);
      setGameState(gameState);
      setScreen('lobby');
      setError('');
    });

    newSocket.on('playerJoined', ({ gameState }) => {
      setGameState(gameState);
    });

    newSocket.on('playerReady', ({ gameState }) => {
      setGameState(gameState);
    });

    newSocket.on('gameStart', ({ gameState }) => {
      setGameState(gameState);
      setScreen('game');
    });

    newSocket.on('roundResult', ({ roundResult, gameState }) => {
      setCurrentRoundResult(roundResult);
      setGameState(gameState);
    });

    newSocket.on('nextRound', ({ gameState }) => {
      setGameState(gameState);
      setCurrentRoundResult(null);
    });

    newSocket.on('gameEnd', ({ gameStats, gameState }) => {
      setGameStats(gameStats);
      setGameState(gameState);
      setScreen('endgame');
    });

    newSocket.on('playerLeft', ({ gameState }) => {
      setGameState(gameState);
      setError('Player left the game');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleCreateRoom = (playerName: string, role: 'RETAIL' | 'HEDGE') => {
    socket?.emit('createRoom', { playerName, role });
  };

  const handleJoinRoom = (roomCode: string, playerName: string, role: 'RETAIL' | 'HEDGE') => {
    socket?.emit('joinRoom', { roomCode, playerName, role });
  };

  const handlePlayerReady = () => {
    socket?.emit('playerReady');
  };

  const handleSubmitAction = (action: string) => {
    socket?.emit('submitAction', { action });
  };

  const handlePlayAgain = () => {
    setScreen('welcome');
    setGameState(null);
    setGameStats(null);
    setCurrentRoundResult(null);
    setRoomCode('');
    setError('');
  };

  return (
    <div className="min-h-screen animated-bg">
      {screen === 'welcome' && (
        <WelcomeScreen
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          error={error}
        />
      )}
      {screen === 'lobby' && gameState && (
        <LobbyScreen
          gameState={gameState}
          roomCode={roomCode}
          playerId={playerId}
          onReady={handlePlayerReady}
        />
      )}
      {screen === 'game' && gameState && (
        <GameScreen
          gameState={gameState}
          playerId={playerId}
          onSubmitAction={handleSubmitAction}
          currentRoundResult={currentRoundResult}
        />
      )}
      {screen === 'endgame' && gameStats && gameState && (
        <EndGameScreen
          gameStats={gameStats}
          gameState={gameState}
          playerId={playerId}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export default App;
