// Game Engine with Nash Equilibrium, Markov Chain, and Price Calculations

// Action definitions
export const RETAIL_ACTIONS = {
  BUY: { impact: 3, label: 'BUY' },
  HOLD: { impact: 0, label: 'HOLD' },
  SELL: { impact: -2, label: 'SELL' }
};

export const HEDGE_ACTIONS = {
  SHORT: { impact: -2, label: 'SHORT' },
  COVER: { impact: 3, label: 'COVER' },
  HOLD: { impact: 0, label: 'HOLD' }
};

// Sentiment states and transitions (Markov Chain)
export const SENTIMENT_STATES = {
  BEARISH: { multiplier: 0.7, label: 'BEARISH 🐻' },
  NEUTRAL: { multiplier: 1.0, label: 'NEUTRAL ⚪' },
  BULLISH: { multiplier: 1.5, label: 'BULLISH 🐂' },
  MANIC: { multiplier: 2.0, label: 'MANIC 🚀' }
};

// Markov Chain transition probabilities based on actions
export function getNextSentiment(currentSentiment, retailAction, hedgeAction) {
  const transitions = {
    BEARISH: { BEARISH: 0.5, NEUTRAL: 0.3, BULLISH: 0.15, MANIC: 0.05 },
    NEUTRAL: { BEARISH: 0.2, NEUTRAL: 0.4, BULLISH: 0.3, MANIC: 0.1 },
    BULLISH: { BEARISH: 0.1, NEUTRAL: 0.2, BULLISH: 0.5, MANIC: 0.2 },
    MANIC: { BEARISH: 0.05, NEUTRAL: 0.15, BULLISH: 0.3, MANIC: 0.5 }
  };

  // Adjust probabilities based on actions
  let probs = { ...transitions[currentSentiment] };
  
  if (retailAction === 'BUY' && hedgeAction === 'COVER') {
    probs.BULLISH += 0.2;
    probs.MANIC += 0.1;
    probs.BEARISH -= 0.2;
  } else if (retailAction === 'SELL' && hedgeAction === 'SHORT') {
    probs.BEARISH += 0.2;
    probs.BULLISH -= 0.1;
    probs.MANIC -= 0.1;
  }

  // Normalize probabilities
  const total = Object.values(probs).reduce((sum, p) => sum + p, 0);
  Object.keys(probs).forEach(key => probs[key] /= total);

  // Random selection based on probabilities
  const rand = Math.random();
  let cumulative = 0;
  for (const [state, prob] of Object.entries(probs)) {
    cumulative += prob;
    if (rand <= cumulative) return state;
  }
  return 'NEUTRAL';
}

// Calculate new stock price
export function calculateNewPrice(oldPrice, retailAction, hedgeAction, sentiment) {
  const retailImpact = RETAIL_ACTIONS[retailAction].impact;
  const hedgeImpact = HEDGE_ACTIONS[hedgeAction].impact;
  const sentimentMultiplier = SENTIMENT_STATES[sentiment].multiplier;
  
  // Random noise between -1 and 1
  const noise = (Math.random() * 2 - 1);
  
  const netImpact = (retailImpact + hedgeImpact) * sentimentMultiplier + noise;
  const newPrice = Math.max(1, oldPrice + netImpact); // Minimum price $1
  
  return parseFloat(newPrice.toFixed(2));
}

// Calculate profit/loss for players
export function calculateProfits(priceChange, retailAction, hedgeAction, gameState) {
  let retailProfit = 0;
  let hedgeProfit = 0;

  // Retail Investor profit logic
  if (retailAction === 'BUY') {
    gameState.retailShares += 100;
    retailProfit = priceChange * gameState.retailShares;
  } else if (retailAction === 'SELL') {
    if (gameState.retailShares > 0) {
      retailProfit = priceChange * gameState.retailShares;
      gameState.retailShares = Math.max(0, gameState.retailShares - 50);
    }
  } else if (retailAction === 'HOLD') {
    retailProfit = priceChange * gameState.retailShares;
  }

  // Hedge Fund profit logic (inverse of price movement)
  if (hedgeAction === 'SHORT') {
    gameState.hedgeShares += 100;
    hedgeProfit = -priceChange * gameState.hedgeShares;
  } else if (hedgeAction === 'COVER') {
    if (gameState.hedgeShares > 0) {
      hedgeProfit = -priceChange * gameState.hedgeShares;
      gameState.hedgeShares = Math.max(0, gameState.hedgeShares - 50);
    }
  } else if (hedgeAction === 'HOLD') {
    hedgeProfit = -priceChange * gameState.hedgeShares;
  }

  return {
    retailProfit: parseFloat(retailProfit.toFixed(2)),
    hedgeProfit: parseFloat(hedgeProfit.toFixed(2))
  };
}

// Generate payoff matrix based on current game state
export function generatePayoffMatrix(currentPrice, sentiment, gameState) {
  const matrix = {};
  const sentimentMult = SENTIMENT_STATES[sentiment].multiplier;

  Object.keys(RETAIL_ACTIONS).forEach(retailAction => {
    matrix[retailAction] = {};
    Object.keys(HEDGE_ACTIONS).forEach(hedgeAction => {
      const retailImpact = RETAIL_ACTIONS[retailAction].impact;
      const hedgeImpact = HEDGE_ACTIONS[hedgeAction].impact;
      
      const priceChange = (retailImpact + hedgeImpact) * sentimentMult;
      const newPrice = Math.max(1, currentPrice + priceChange);
      const delta = newPrice - currentPrice;

      // Simplified profit calculation for matrix
      let retailPayoff = 0;
      let hedgePayoff = 0;

      if (retailAction === 'BUY') {
        retailPayoff = delta * 100;
      } else if (retailAction === 'SELL') {
        retailPayoff = -delta * 50;
      } else {
        retailPayoff = delta * 50;
      }

      if (hedgeAction === 'SHORT') {
        hedgePayoff = -delta * 100;
      } else if (hedgeAction === 'COVER') {
        hedgePayoff = delta * 50;
      } else {
        hedgePayoff = -delta * 50;
      }

      matrix[retailAction][hedgeAction] = {
        retail: parseFloat(retailPayoff.toFixed(0)),
        hedge: parseFloat(hedgePayoff.toFixed(0))
      };
    });
  });

  return matrix;
}

// Find Nash Equilibrium (pure strategies)
export function findNashEquilibrium(payoffMatrix) {
  const retailActions = Object.keys(RETAIL_ACTIONS);
  const hedgeActions = Object.keys(HEDGE_ACTIONS);
  
  const equilibria = [];

  // Find best responses
  retailActions.forEach(retailAction => {
    hedgeActions.forEach(hedgeAction => {
      let isNash = true;

      // Check if retail player wants to deviate
      for (const altRetail of retailActions) {
        if (altRetail !== retailAction) {
          if (payoffMatrix[altRetail][hedgeAction].retail > 
              payoffMatrix[retailAction][hedgeAction].retail) {
            isNash = false;
            break;
          }
        }
      }

      // Check if hedge player wants to deviate
      if (isNash) {
        for (const altHedge of hedgeActions) {
          if (altHedge !== hedgeAction) {
            if (payoffMatrix[retailAction][altHedge].hedge > 
                payoffMatrix[retailAction][hedgeAction].hedge) {
              isNash = false;
              break;
            }
          }
        }
      }

      if (isNash) {
        equilibria.push({ retailAction, hedgeAction });
      }
    });
  });

  return equilibria;
}

// Calculate optimal strategy (mixed strategy approximation)
export function calculateOptimalStrategy(payoffMatrix) {
  const retailActions = Object.keys(RETAIL_ACTIONS);
  const hedgeActions = Object.keys(HEDGE_ACTIONS);

  // Simple heuristic: probability proportional to average payoff
  const retailPayoffs = {};
  const hedgePayoffs = {};

  retailActions.forEach(ra => {
    let sum = 0;
    hedgeActions.forEach(ha => {
      sum += payoffMatrix[ra][ha].retail;
    });
    retailPayoffs[ra] = Math.max(0, sum);
  });

  hedgeActions.forEach(ha => {
    let sum = 0;
    retailActions.forEach(ra => {
      sum += payoffMatrix[ra][ha].hedge;
    });
    hedgePayoffs[ha] = Math.max(0, sum);
  });

  // Normalize to probabilities
  const retailSum = Object.values(retailPayoffs).reduce((a, b) => a + b, 0) || 1;
  const hedgeSum = Object.values(hedgePayoffs).reduce((a, b) => a + b, 0) || 1;

  const retailStrategy = {};
  const hedgeStrategy = {};

  retailActions.forEach(ra => {
    retailStrategy[ra] = parseFloat((retailPayoffs[ra] / retailSum * 100).toFixed(1));
  });

  hedgeActions.forEach(ha => {
    hedgeStrategy[ha] = parseFloat((hedgePayoffs[ha] / hedgeSum * 100).toFixed(1));
  });

  return { retailStrategy, hedgeStrategy };
}

// Check if players played optimally
export function checkOptimalPlay(retailAction, hedgeAction, payoffMatrix) {
  const hedgeActions = Object.keys(HEDGE_ACTIONS);
  const retailActions = Object.keys(RETAIL_ACTIONS);

  // Check if retail could have done better
  let retailOptimal = true;
  let bestRetailAction = retailAction;
  let bestRetailPayoff = payoffMatrix[retailAction][hedgeAction].retail;

  retailActions.forEach(ra => {
    if (payoffMatrix[ra][hedgeAction].retail > bestRetailPayoff) {
      retailOptimal = false;
      bestRetailAction = ra;
      bestRetailPayoff = payoffMatrix[ra][hedgeAction].retail;
    }
  });

  // Check if hedge could have done better
  let hedgeOptimal = true;
  let bestHedgeAction = hedgeAction;
  let bestHedgePayoff = payoffMatrix[retailAction][hedgeAction].hedge;

  hedgeActions.forEach(ha => {
    if (payoffMatrix[retailAction][ha].hedge > bestHedgePayoff) {
      hedgeOptimal = false;
      bestHedgeAction = ha;
      bestHedgePayoff = payoffMatrix[retailAction][ha].hedge;
    }
  });

  return {
    retailOptimal,
    hedgeOptimal,
    bestRetailAction,
    bestHedgeAction,
    retailLostPayoff: retailOptimal ? 0 : bestRetailPayoff - payoffMatrix[retailAction][hedgeAction].retail,
    hedgeLostPayoff: hedgeOptimal ? 0 : bestHedgePayoff - payoffMatrix[retailAction][hedgeAction].hedge
  };
}
