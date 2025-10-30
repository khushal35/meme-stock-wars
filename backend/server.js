import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import {
  calculateNewPrice,
  calculateProfits,
  getNextSentiment,
  generatePayoffMatrix,
  findNashEquilibrium,
  calculateOptimalStrategy,
  checkOptimalPlay
} from './gameEngine.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// In-memory game state storage
const rooms = new Map();

// Generate random room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Initialize game state
function createGameState() {
  return {
    players: {},
    round: 0,
    maxRounds: 10,
    stockPrice: 20,
    priceHistory: [{ round: 0, price: 20 }],
    sentiment: 'NEUTRAL',
    retailScore: 0,
    hedgeScore: 0,
    retailShares: 0,
    hedgeShares: 0,
    actions: {},
    roundHistory: [],
    gameStarted: false,
    gameEnded: false,
    retailOptimalCount: 0,
    hedgeOptimalCount: 0
  };
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Create room
  socket.on('createRoom', ({ playerName, role }) => {
    const roomCode = generateRoomCode();
    const gameState = createGameState();
    
    gameState.players[socket.id] = {
      id: socket.id,
      name: playerName,
      role: role, // 'RETAIL' or 'HEDGE'
      ready: false
    };

    rooms.set(roomCode, gameState);
    socket.join(roomCode);
    socket.roomCode = roomCode;

    socket.emit('roomCreated', { roomCode, gameState, playerId: socket.id });
    console.log(`Room created: ${roomCode} by ${playerName}`);
  });

  // Join room
  socket.on('joinRoom', ({ roomCode, playerName, role }) => {
    const gameState = rooms.get(roomCode);

    if (!gameState) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (Object.keys(gameState.players).length >= 2) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    // Check if role is already taken
    const existingRoles = Object.values(gameState.players).map(p => p.role);
    if (existingRoles.includes(role)) {
      socket.emit('error', { message: 'Role already taken' });
      return;
    }

    gameState.players[socket.id] = {
      id: socket.id,
      name: playerName,
      role: role,
      ready: false
    };

    socket.join(roomCode);
    socket.roomCode = roomCode;

    io.to(roomCode).emit('playerJoined', { gameState });
    socket.emit('roomJoined', { roomCode, gameState, playerId: socket.id });
    console.log(`${playerName} joined room: ${roomCode}`);
  });

  // Player ready
  socket.on('playerReady', () => {
    const roomCode = socket.roomCode;
    const gameState = rooms.get(roomCode);

    if (!gameState) return;

    gameState.players[socket.id].ready = true;

    // Check if both players are ready
    const allReady = Object.values(gameState.players).every(p => p.ready) &&
                     Object.keys(gameState.players).length === 2;

    io.to(roomCode).emit('playerReady', { gameState });

    if (allReady && !gameState.gameStarted) {
      gameState.gameStarted = true;
      gameState.round = 1;
      io.to(roomCode).emit('gameStart', { gameState });
      console.log(`Game started in room: ${roomCode}`);
    }
  });

  // Submit action
  socket.on('submitAction', ({ action }) => {
    const roomCode = socket.roomCode;
    const gameState = rooms.get(roomCode);

    if (!gameState || !gameState.gameStarted || gameState.gameEnded) return;

    const player = gameState.players[socket.id];
    if (!player) return;

    gameState.actions[player.role] = action;
    console.log(`${player.name} (${player.role}) submitted action: ${action}`);

    // Check if both players have submitted
    if (gameState.actions.RETAIL && gameState.actions.HEDGE) {
      processRound(roomCode, gameState);
    }
  });

  // Process round
  function processRound(roomCode, gameState) {
    const retailAction = gameState.actions.RETAIL;
    const hedgeAction = gameState.actions.HEDGE;
    const oldPrice = gameState.stockPrice;

    // Generate payoff matrix before calculating results
    const payoffMatrix = generatePayoffMatrix(oldPrice, gameState.sentiment, gameState);

    // Calculate new price
    const newPrice = calculateNewPrice(oldPrice, retailAction, hedgeAction, gameState.sentiment);
    const priceChange = newPrice - oldPrice;

    // Calculate profits
    const { retailProfit, hedgeProfit } = calculateProfits(
      priceChange,
      retailAction,
      hedgeAction,
      gameState
    );

    // Update scores
    gameState.retailScore += retailProfit;
    gameState.hedgeScore += hedgeProfit;
    gameState.stockPrice = newPrice;

    // Update sentiment
    const newSentiment = getNextSentiment(gameState.sentiment, retailAction, hedgeAction);
    gameState.sentiment = newSentiment;

    // Add to price history
    gameState.priceHistory.push({ round: gameState.round, price: newPrice });

    // Nash Equilibrium analysis
    const equilibria = findNashEquilibrium(payoffMatrix);
    const optimalStrategy = calculateOptimalStrategy(payoffMatrix);
    const optimalPlay = checkOptimalPlay(retailAction, hedgeAction, payoffMatrix);

    // Track optimal plays
    if (optimalPlay.retailOptimal) gameState.retailOptimalCount++;
    if (optimalPlay.hedgeOptimal) gameState.hedgeOptimalCount++;

    // Easter egg: Nice price
    let achievement = null;
    if (newPrice >= 69.41 && newPrice <= 69.43) {
      achievement = { title: 'Nice! 🎉', message: 'Stock hit $69.42!' };
    }

    // Store round results
    const roundResult = {
      round: gameState.round,
      retailAction,
      hedgeAction,
      oldPrice,
      newPrice,
      priceChange,
      retailProfit,
      hedgeProfit,
      sentiment: newSentiment,
      payoffMatrix,
      equilibria,
      optimalStrategy,
      optimalPlay,
      achievement
    };

    gameState.roundHistory.push(roundResult);

    // Send round results
    io.to(roomCode).emit('roundResult', { roundResult, gameState });

    // Clear actions for next round
    gameState.actions = {};

    // Check if game ended
    if (gameState.round >= gameState.maxRounds) {
      gameState.gameEnded = true;
      const winner = gameState.retailScore > gameState.hedgeScore ? 'RETAIL' : 'HEDGE';
      
      const gameStats = {
        winner,
        retailScore: gameState.retailScore,
        hedgeScore: gameState.hedgeScore,
        retailOptimalPercentage: (gameState.retailOptimalCount / gameState.maxRounds * 100).toFixed(1),
        hedgeOptimalPercentage: (gameState.hedgeOptimalCount / gameState.maxRounds * 100).toFixed(1),
        finalPrice: gameState.stockPrice,
        priceChange: ((gameState.stockPrice - 20) / 20 * 100).toFixed(1),
        roundHistory: gameState.roundHistory
      };

      io.to(roomCode).emit('gameEnd', { gameStats, gameState });
      console.log(`Game ended in room: ${roomCode}. Winner: ${winner}`);
    } else {
      // Next round
      gameState.round++;
      io.to(roomCode).emit('nextRound', { gameState });
    }
  }

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    const roomCode = socket.roomCode;
    if (roomCode) {
      const gameState = rooms.get(roomCode);
      if (gameState) {
        delete gameState.players[socket.id];
        
        if (Object.keys(gameState.players).length === 0) {
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted (empty)`);
        } else {
          io.to(roomCode).emit('playerLeft', { gameState });
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
