# 🎮 MEME STOCK WARS

> **A GameStop-Style Trading Battle Game with Real-Time Nash Equilibrium Analysis**

A professional, full-stack multiplayer trading game where two players compete in a stock market battle. Built for educational purposes to demonstrate Game Theory concepts (Nash Equilibrium) and Operations Research principles in a fun, engaging format.

![Game Screenshot](https://via.placeholder.com/800x400/0a0e27/00ff88?text=Meme+Stock+Wars)

---

## 🌟 Features

### Core Gameplay
- **2-Player Real-Time Multiplayer**: Compete against a friend using WebSocket connections
- **Role-Based Strategy**: Play as Retail Investor (💎) or Hedge Fund (🐻)
- **10 Rounds of Strategic Decision-Making**: Each round features simultaneous action selection
- **Dynamic Stock Pricing**: Prices influenced by player actions, sentiment, and volatility

### Game Theory & Analytics
- **Real-Time Nash Equilibrium Calculations**: See optimal strategies after each round
- **Interactive Payoff Matrix Heatmap**: Visualize all possible outcomes
- **Optimal Play Analysis**: Get feedback on whether you played optimally
- **Mixed Strategy Probabilities**: View recommended action distributions
- **Markov Chain Sentiment System**: 4-state sentiment (BEARISH → NEUTRAL → BULLISH → MANIC)

### Professional UI/UX
- **Bloomberg Terminal Aesthetic**: Dark theme with neon accents
- **Glassmorphism Design**: Modern, polished card-based interface
- **Smooth Animations**: Framer Motion powered transitions
- **Real-Time Price Chart**: Interactive Chart.js visualization
- **Confetti Effects**: Celebrate wins with particle animations
- **Responsive Design**: Works on desktop, tablet, and mobile

---

## 🎯 Game Mechanics

### Players

**💎 Retail Investor** (wants price UP)
- **BUY**: +$3 price impact
- **HOLD**: $0 price impact
- **SELL**: -$2 price impact
- Starting Capital: $50,000

**🐻 Hedge Fund** (wants price DOWN)
- **SHORT**: -$2 price impact
- **COVER**: +$3 price impact
- **HOLD**: $0 price impact
- Starting Capital: $200,000

### Pricing Formula

```
New Price = Old Price + (Player1 Impact + Player2 Impact) × Sentiment Multiplier + Random Noise
```

**Sentiment Multipliers:**
- BEARISH: 0.7x
- NEUTRAL: 1.0x
- BULLISH: 1.5x
- MANIC: 2.0x

### Profit Calculation

- **Retail Investor**: Profit = Price Change × Shares Owned
- **Hedge Fund**: Profit = -(Price Change × Shares Shorted)

### Nash Equilibrium Analysis

After each round, the game calculates:
1. **Payoff Matrix**: All 9 possible outcome combinations
2. **Pure Strategy Equilibria**: Stable strategy pairs where no player wants to deviate
3. **Mixed Strategy Recommendations**: Probability distributions for each action
4. **Optimal Play Check**: Did each player choose their best response?

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```powershell
   cd C:\Users\lenovo
   cd meme-stock-wars
   ```

2. **Install backend dependencies**
   ```powershell
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```powershell
   cd ..\frontend
   npm install
   ```

### Running the Game

1. **Start the backend server** (in `backend/` directory)
   ```powershell
   npm start
   ```
   Server will run on `http://localhost:3000`

2. **Start the frontend** (in `frontend/` directory, in a new terminal)
   ```powershell
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

4. **Create a room** and share the room code with your opponent!

---

## 📁 Project Structure

```
meme-stock-wars/
├── backend/
│   ├── gameEngine.js      # Game logic, Nash Equilibrium, Markov Chain
│   ├── server.js           # Socket.io server, room management
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WelcomeScreen.tsx    # Create/join room interface
│   │   │   ├── LobbyScreen.tsx      # Waiting room
│   │   │   ├── GameScreen.tsx       # Main game interface
│   │   │   ├── PriceChart.tsx       # Real-time stock chart
│   │   │   ├── NashPanel.tsx        # Nash Equilibrium display
│   │   │   ├── RoundResultModal.tsx # Round result animations
│   │   │   └── EndGameScreen.tsx    # Winner screen with stats
│   │   ├── App.tsx                  # Main app component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🧠 Technical Architecture

### Backend (Node.js + Express + Socket.io)

**Key Algorithms:**

1. **Nash Equilibrium Solver**
   - Iterates through all action pairs
   - Checks best response for each player
   - Identifies pure strategy equilibria

2. **Payoff Matrix Generator**
   - Dynamically calculates payoffs based on current game state
   - Considers sentiment multipliers and share positions

3. **Markov Chain Sentiment**
   - 4 states with probabilistic transitions
   - Actions influence transition probabilities
   - Affects price movement multipliers

4. **Price Engine**
   - Combines player impacts with sentiment
   - Adds random volatility
   - Enforces minimum price constraint

**Event Handlers:**
- `createRoom`: Initialize new game session
- `joinRoom`: Add second player
- `playerReady`: Start game when both ready
- `submitAction`: Process player moves
- `roundResult`: Broadcast results with Nash analysis
- `gameEnd`: Calculate final statistics

### Frontend (React + TypeScript + Tailwind + Framer Motion)

**State Management:**
- Socket.io client for real-time synchronization
- React hooks for local state
- Typed interfaces for type safety

**Key Components:**
- **Chart.js Integration**: Real-time line chart with price history
- **Framer Motion Animations**: Smooth page transitions, modal reveals
- **React Confetti**: Winner celebration effects
- **Responsive Grid Layouts**: Adapts to screen sizes

---

## 🎨 Design System

### Color Palette
- **Background**: `#0a0e27` (Navy Dark)
- **Cards**: `#1a1f3a` (Navy) with glassmorphism
- **Positive**: `#00ff88` (Neon Green)
- **Negative**: `#ff0055` (Neon Pink)
- **Special**: `#ffd700` (Gold)

### Typography
- **Headers**: Inter Bold (modern, clean)
- **Body**: Inter Regular
- **Numbers**: Monospace (trading terminal feel)

### Animations
- **Button Hovers**: Scale + glow effect
- **Price Changes**: Animated counting
- **Action Reveals**: Dramatic slide-ins
- **Nash Indicators**: Pulsing glow for optimal plays

---

## 🏆 Easter Eggs & Achievements

- **Nice! 🎉**: Stock hits $69.42
- **YOLO King**: (Future) All-in wins
- **Diamond Hands**: (Future) Hold 5+ rounds
- **Paper Hands**: (Future) Early sells

---

## 📊 Game Theory Concepts

### Nash Equilibrium
A state where no player can improve their payoff by unilaterally changing their strategy. The game calculates this after each round to show:
- Whether the current outcome is a Nash Equilibrium
- What the optimal strategies would have been
- How much value was lost by suboptimal play

### Mixed Strategies
When no pure Nash Equilibrium exists, players should randomize their actions according to probability distributions that make opponents indifferent. The game displays these probabilities as bar charts.

### Best Response
For any given opponent action, the best response is the action that maximizes your payoff. The game checks if players chose their best response each round.

---

## 🛠️ Development

### Tech Stack

**Backend:**
- Node.js v16+
- Express.js
- Socket.io v4
- ES Modules

**Frontend:**
- React 18
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Framer Motion
- Chart.js
- Lucide React (icons)
- React Confetti

### Scripts

**Backend:**
```powershell
npm start      # Start server
npm run dev    # Start with auto-reload (Node 18+)
```

**Frontend:**
```powershell
npm run dev    # Development server
npm run build  # Production build
npm run preview # Preview production build
```

---

## 🎓 Educational Value

This project demonstrates:
- **Game Theory**: Nash Equilibrium, payoff matrices, dominant strategies
- **Operations Research**: Optimization, decision analysis
- **Probability**: Markov Chains, mixed strategies
- **Real-Time Systems**: WebSocket communication
- **Modern Web Development**: React, TypeScript, responsive design

Perfect for:
- College hackathons
- Game theory courses
- Operations research projects
- Portfolio demonstrations

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Backend (port 3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Frontend (port 5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### WebSocket Connection Failed
- Ensure backend is running on `http://localhost:3000`
- Check CORS settings in `server.js`
- Verify firewall isn't blocking connections

### Chart Not Rendering
- Make sure Chart.js is properly installed
- Check browser console for errors
- Verify `PriceChart` component is receiving data

---

## 📝 Future Enhancements

- [ ] AI opponent (using minimax or Q-learning)
- [ ] Historical game replay system
- [ ] Leaderboard with ELO ratings
- [ ] More Easter eggs and achievements
- [ ] Sound effects and music
- [ ] Spectator mode
- [ ] Tournament bracket system
- [ ] Mobile app version

---

## 📄 License

MIT License - feel free to use this project for educational purposes!

---

## 🙏 Acknowledgments

- Inspired by the GameStop short squeeze of 2021
- Game Theory concepts from John Nash's work
- UI/UX inspired by Bloomberg Terminal and Robinhood

---

## 👨‍💻 Author

Built for a hackathon with ❤️ and ☕

**Keywords:** Game Theory, Nash Equilibrium, Multiplayer Game, WebSockets, React, TypeScript, Operations Research, Trading Game, Real-time Analytics

---

## 📸 Screenshots

### Welcome Screen
![Welcome](https://via.placeholder.com/600x400/0a0e27/00ff88?text=Welcome+Screen)

### Game Screen
![Game](https://via.placeholder.com/600x400/0a0e27/00ff88?text=Game+Screen)

### Nash Equilibrium Panel
![Nash](https://via.placeholder.com/600x400/0a0e27/ffd700?text=Nash+Panel)

### Winner Screen
![Winner](https://via.placeholder.com/600x400/0a0e27/ffd700?text=Victory!)

---

**Ready to dominate the market? Let the battle begin! 🚀💎🐻**
