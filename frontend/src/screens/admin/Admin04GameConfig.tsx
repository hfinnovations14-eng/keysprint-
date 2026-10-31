import * as React from 'react';
import { useState } from 'react';
import { Sliders, Save, CheckCircle2, ShieldAlert } from 'lucide-react';

export const Admin04GameConfig: React.FC = () => {
  const [countdownSec, setCountdownSec] = useState(3);
  const [matchmakingTimeout, setMatchmakingTimeout] = useState(12);
  const [targetMatchTime, setTargetMatchTime] = useState(8);
  const [maxRaceDuration, setMaxRaceDuration] = useState(150);
  const [reconnectGrace, setReconnectGrace] = useState(15);
  const [easyBotWpm, setEasyBotWpm] = useState(55);
  const [normalBotWpm, setNormalBotWpm] = useState(105);
  const [advancedBotWpm, setAdvancedBotWpm] = useState(150);
  const [antiCheatThreshold, setAntiCheatThreshold] = useState(200);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Game configuration updated & synchronized to Redis cluster!');
  };

  return (
    <div className="admin-page-view">
      <div className="admin-page-header mb-4">
        <h2>Game Server Configuration (SRS FR-D04)</h2>
        <p className="text-secondary text-sm">Tune authoritative WebSocket timings, match capacity, and bot profiles.</p>
      </div>

      <form onSubmit={handleSave} className="config-form-grid">
        {/* Matchmaking & Room Parameters */}
        <div className="card">
          <h3 className="mb-3">Room & Lifecycle Timers</h3>
          
          <div className="input-group mb-3">
            <label className="input-label">Synchronized Pre-Race Countdown (Seconds)</label>
            <input 
              type="number" 
              className="input-field"
              value={countdownSec}
              onChange={(e) => setCountdownSec(Number(e.target.value))}
            />
            <span className="text-xs text-secondary">Default 3 seconds (SRS FR-G02).</span>
          </div>

          <div className="input-group mb-3">
            <label className="input-label">Queue Match Target Window (Seconds)</label>
            <input 
              type="number" 
              className="input-field"
              value={targetMatchTime}
              onChange={(e) => setTargetMatchTime(Number(e.target.value))}
            />
            <span className="text-xs text-secondary">Seek humans for 8s target before filling (SRS 5.2).</span>
          </div>

          <div className="input-group mb-3">
            <label className="input-label">Max Queue Timeout / Hard Fallback (Seconds)</label>
            <input 
              type="number" 
              className="input-field"
              value={matchmakingTimeout}
              onChange={(e) => setMatchmakingTimeout(Number(e.target.value))}
            />
            <span className="text-xs text-secondary">Fill remaining slots with bots at 12s.</span>
          </div>

          <div className="input-group mb-3">
            <label className="input-label">Max Race Duration Timeout (Seconds)</label>
            <input 
              type="number" 
              className="input-field"
              value={maxRaceDuration}
              onChange={(e) => setMaxRaceDuration(Number(e.target.value))}
            />
            <span className="text-xs text-secondary">Default 150s before authoritative completion freeze.</span>
          </div>

          <div className="input-group mb-3">
            <label className="input-label">Client Disconnect Grace Interval (Seconds)</label>
            <input 
              type="number" 
              className="input-field"
              value={reconnectGrace}
              onChange={(e) => setReconnectGrace(Number(e.target.value))}
            />
            <span className="text-xs text-secondary">Window for client socket restoration (SRS FR-G07).</span>
          </div>
        </div>

        {/* Bot Calibrations & Anti-Cheat */}
        <div className="card">
          <h3 className="mb-3">AI Bot & Anti-Cheat Thresholds</h3>

          <div className="input-group mb-3">
            <label className="input-label">Easy Bot Speed (WPM Baseline)</label>
            <input 
              type="number" 
              className="input-field"
              value={easyBotWpm}
              onChange={(e) => setEasyBotWpm(Number(e.target.value))}
            />
          </div>

          <div className="input-group mb-3">
            <label className="input-label">Normal Bot Speed (WPM Baseline)</label>
            <input 
              type="number" 
              className="input-field"
              value={normalBotWpm}
              onChange={(e) => setNormalBotWpm(Number(e.target.value))}
            />
          </div>

          <div className="input-group mb-3">
            <label className="input-label">Advanced Bot Speed (WPM Baseline)</label>
            <input 
              type="number" 
              className="input-field"
              value={advancedBotWpm}
              onChange={(e) => setAdvancedBotWpm(Number(e.target.value))}
            />
          </div>

          <div className="input-group mb-4">
            <label className="input-label">Anti-Cheat Auto-Quarantine Burst Threshold (WPM)</label>
            <input 
              type="number" 
              className="input-field"
              value={antiCheatThreshold}
              onChange={(e) => setAntiCheatThreshold(Number(e.target.value))}
            />
            <span className="text-xs text-secondary">Bursts over this limit enter review (SRS AT-19).</span>
          </div>

          <button type="submit" className="btn btn-primary btn-lg full-width">
            <Save size={18} />
            <span>Apply Global Game Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
};
