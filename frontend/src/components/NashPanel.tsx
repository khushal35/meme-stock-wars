import { motion } from 'framer-motion';
import { Brain, CheckCircle, XCircle } from 'lucide-react';
import type { RoundResult } from '../App';

type Props = {
  lastRound: RoundResult;
};

export default function NashPanel({ lastRound }: Props) {
  const { payoffMatrix, optimalStrategy, optimalPlay, equilibria } = lastRound;

  const retailActions = ['BUY', 'SELL', 'HOLD'];
  const hedgeActions = ['SHORT', 'COVER', 'HOLD'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-xl"
    >
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-gold" />
        <h3 className="text-2xl font-bold">🧠 Nash Equilibrium Analysis</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payoff Matrix */}
        <div>
          <h4 className="font-bold mb-3 text-lg">Payoff Matrix</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left"></th>
                  {hedgeActions.map(action => (
                    <th key={action} className="p-2 text-center font-bold text-neon-pink">
                      {action}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {retailActions.map(retailAction => (
                  <tr key={retailAction}>
                    <td className="p-2 font-bold text-neon-green">{retailAction}</td>
                    {hedgeActions.map(hedgeAction => {
                      const payoff = payoffMatrix[retailAction]?.[hedgeAction];
                      const isCurrentPlay = 
                        retailAction === lastRound.retailAction && 
                        hedgeAction === lastRound.hedgeAction;
                      
                      return (
                        <td
                          key={hedgeAction}
                          className={`p-2 text-center border border-gray-700 ${
                            isCurrentPlay ? 'bg-gold bg-opacity-20 border-gold' : ''
                          }`}
                        >
                          <div className="font-mono text-xs">
                            <div className="text-neon-green">{payoff?.retail || 0}</div>
                            <div className="text-neon-pink">{payoff?.hedge || 0}</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            <span className="text-neon-green">Green</span>: Retail payoff • 
            <span className="text-neon-pink"> Pink</span>: Hedge payoff
          </div>
        </div>

        {/* Optimal Strategy & Performance */}
        <div className="space-y-4">
          {/* Optimal Strategy */}
          <div>
            <h4 className="font-bold mb-3 text-lg">Optimal Strategies</h4>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400 mb-1">💎 Retail Investor:</div>
                {Object.entries(optimalStrategy.retailStrategy).map(([action, prob]) => (
                  <div key={action} className="flex items-center gap-2 mb-1">
                    <div className="text-xs w-12">{action}</div>
                    <div className="flex-1 bg-navy-dark rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-neon-green h-full transition-all duration-500"
                        style={{ width: `${prob}%` }}
                      />
                    </div>
                    <div className="text-xs w-12 text-right font-mono">{prob}%</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">🐻 Hedge Fund:</div>
                {Object.entries(optimalStrategy.hedgeStrategy).map(([action, prob]) => (
                  <div key={action} className="flex items-center gap-2 mb-1">
                    <div className="text-xs w-12">{action}</div>
                    <div className="flex-1 bg-navy-dark rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-neon-pink h-full transition-all duration-500"
                        style={{ width: `${prob}%` }}
                      />
                    </div>
                    <div className="text-xs w-12 text-right font-mono">{prob}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance */}
          <div>
            <h4 className="font-bold mb-3 text-lg">Player Performance</h4>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                optimalPlay.retailOptimal ? 'bg-neon-green bg-opacity-10' : 'bg-neon-pink bg-opacity-10'
              }`}>
                {optimalPlay.retailOptimal ? (
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-neon-pink flex-shrink-0" />
                )}
                <div className="text-sm">
                  {optimalPlay.retailOptimal ? (
                    <span className="text-neon-green font-bold">Retail: OPTIMAL PLAY! ✓</span>
                  ) : (
                    <span className="text-neon-pink">
                      Retail: Should have <span className="font-bold">{optimalPlay.bestRetailAction}</span>
                      {optimalPlay.retailLostPayoff > 0 && ` (lost $${optimalPlay.retailLostPayoff.toFixed(0)})`}
                    </span>
                  )}
                </div>
              </div>

              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                optimalPlay.hedgeOptimal ? 'bg-neon-green bg-opacity-10' : 'bg-neon-pink bg-opacity-10'
              }`}>
                {optimalPlay.hedgeOptimal ? (
                  <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-neon-pink flex-shrink-0" />
                )}
                <div className="text-sm">
                  {optimalPlay.hedgeOptimal ? (
                    <span className="text-neon-green font-bold">Hedge: OPTIMAL PLAY! ✓</span>
                  ) : (
                    <span className="text-neon-pink">
                      Hedge: Should have <span className="font-bold">{optimalPlay.bestHedgeAction}</span>
                      {optimalPlay.hedgeLostPayoff > 0 && ` (lost $${optimalPlay.hedgeLostPayoff.toFixed(0)})`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nash Equilibria */}
          {equilibria.length > 0 && (
            <div className="bg-navy-dark p-3 rounded-lg">
              <div className="text-sm font-bold mb-1">Pure Nash Equilibrium:</div>
              {equilibria.map((eq, i) => (
                <div key={i} className="text-sm text-gold">
                  ({eq.retailAction}, {eq.hedgeAction})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
