# 🚀 Quick Start Guide

Get Meme Stock Wars running in 5 minutes!

## Option 1: Quick Setup (Recommended)

```powershell
# Navigate to project directory
cd C:\Users\lenovo\meme-stock-wars

# Install concurrently (if not already installed)
npm install

# Install all dependencies (backend + frontend)
npm run install:all

# Start both servers at once
npm run start
```

Then open **two browser windows**:
- Window 1: `http://localhost:5173` - Create a room
- Window 2: `http://localhost:5173` - Join with the room code

## Option 2: Manual Setup

### Terminal 1 - Backend
```powershell
cd C:\Users\lenovo\meme-stock-wars\backend
npm install
npm start
```
✓ Server running on `http://localhost:3000`

### Terminal 2 - Frontend
```powershell
cd C:\Users\lenovo\meme-stock-wars\frontend
npm install
npm run dev
```
✓ Frontend running on `http://localhost:5173`

---

## 🎮 How to Play

### Step 1: Create Room
1. Open `http://localhost:5173`
2. Click **"Create Room"**
3. Enter your name
4. Choose role: **💎 Retail Investor** or **🐻 Hedge Fund**
5. Copy the room code (e.g., `ABC123`)

### Step 2: Join Room (Second Player)
1. Open `http://localhost:5173` in another browser/tab
2. Click **"Join Room"**
3. Enter the room code
4. Enter your name
5. Choose the OTHER role

### Step 3: Play!
1. Both players click **"Ready to Play"**
2. Game starts automatically
3. Each round:
   - Choose your action (60 seconds)
   - Submit your choice
   - Wait for opponent
   - See results and Nash Equilibrium analysis
4. After 10 rounds, see who won!

---

## 🎯 Strategy Tips

### For Retail Investor 💎
- **BUY** when you think Hedge will COVER (both push price up = profit!)
- **SELL** when price is high to lock in gains
- **HOLD** to preserve your position

### For Hedge Fund 🐻
- **SHORT** when you think Retail will SELL (price goes down = profit!)
- **COVER** to reduce losses when price is rising
- **HOLD** to maintain your short position

### Nash Equilibrium Tips
- Watch the **Payoff Matrix** after each round
- Look for **Pure Nash Equilibria** (highlighted cells)
- Follow the **Optimal Strategy probabilities**
- Try to play **Best Response** to your opponent's moves

---

## 📊 Understanding the Interface

### Game Screen Layout

```
┌─────────────────────────────────────────────┐
│  🎮 MEME STOCK WARS        Round 3/10  ⏱️ 45s│
├─────────────────────────────────────────────┤
│ 💎 Retail     │                             │
│ Score: $5,200 │     📈 PRICE CHART          │
│               │     Current: $32.50 ▲ +62%  │
│ 🐻 Hedge      │                             │
│ Score: -$3,400│                             │
│               │                             │
│ Sentiment:    │                             │
│ 🚀 MANIC      │                             │
├─────────────────────────────────────────────┤
│         CHOOSE YOUR ACTION:                 │
│   [BUY]    [HOLD]    [SELL]                │
├─────────────────────────────────────────────┤
│    🧠 NASH EQUILIBRIUM ANALYSIS             │
│    Payoff Matrix | Optimal Strategies       │
└─────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### "Cannot connect to server"
- Make sure backend is running on port 3000
- Check if another app is using port 3000

### "Room not found"
- Make sure you typed the room code correctly
- Room codes are case-sensitive

### Charts not showing
- Refresh the page
- Check browser console for errors

---

## 🎓 Learning Resources

- **Nash Equilibrium**: [Wikipedia](https://en.wikipedia.org/wiki/Nash_equilibrium)
- **Game Theory**: [Khan Academy](https://www.khanacademy.org/economics-finance-domain/microeconomics/nash-equilibrium-tutorial)
- **Markov Chains**: [Setosa.io Visualization](https://setosa.io/ev/markov-chains/)

---

**Ready? Let the battle begin! 🚀💎🐻**

For more details, see the full [README.md](./README.md)
