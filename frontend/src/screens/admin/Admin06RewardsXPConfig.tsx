import * as React from 'react';
import { useState } from 'react';
import { Trophy, Star, Coins, Gift, Save } from 'lucide-react';

export const Admin06RewardsXPConfig: React.FC = () => {
  const [publicRaceXP, setPublicRaceXP] = useState(50);
  const [winPlacementBonusXP, setWinPlacementBonusXP] = useState(70);
  const [publicRaceCoins, setPublicRaceCoins] = useState(30);
  const [winCoinsBonus, setWinCoinsBonus] = useState(20);
  const [practiceXpCap, setPracticeXpCap] = useState(100);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Rewards economy formula saved!');
  };

  return (
    <div className="admin-page-view">
      <div className="admin-page-header mb-4">
        <h2>Progression XP & Rewards Engine (SRS 5.3)</h2>
        <p className="text-secondary text-sm">Configure base match payouts, placement bonuses, daily challenge caps, and leveling formulas.</p>
      </div>

      <form onSubmit={handleSave} className="config-form-grid">
        <div className="card">
          <h3 className="mb-3">Match Payout Rules</h3>

          <div className="input-group mb-3">
            <label className="input-label">Public Race Base XP Payout</label>
            <input 
              type="number" 
              className="input-field"
              value={publicRaceXP}
              onChange={(e) => setPublicRaceXP(Number(e.target.value))}
            />
          </div>

          <div className="input-group mb-3">
            <label className="input-label">1st Place Bonus XP</label>
            <input 
              type="number" 
              className="input-field"
              value={winPlacementBonusXP}
              onChange={(e) => setWinPlacementBonusXP(Number(e.target.value))}
            />
          </div>

          <div className="input-group mb-3">
            <label className="input-label">Base Virtual Coins per Match</label>
            <input 
              type="number" 
              className="input-field"
              value={publicRaceCoins}
              onChange={(e) => setPublicRaceCoins(Number(e.target.value))}
            />
          </div>

          <div className="input-group mb-4">
            <label className="input-label">1st Place Bonus Virtual Coins</label>
            <input 
              type="number" 
              className="input-field"
              value={winCoinsBonus}
              onChange={(e) => setWinCoinsBonus(Number(e.target.value))}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} />
            <span>Update Economy Matrix</span>
          </button>
        </div>

        <div className="card card-cream">
          <h3 className="mb-3">Anti-Exploit Ledger Safeguards</h3>
          <ul className="text-secondary text-sm">
            <li className="mb-2">✓ Idempotent transaction keys per completed race ID (SRS FR-S04).</li>
            <li className="mb-2">✓ Practice session daily XP hard-capped at {practiceXpCap} XP.</li>
            <li className="mb-2">✓ Bot-only and abandoned matches award exactly 0 league points.</li>
          </ul>
        </div>
      </form>
    </div>
  );
};
