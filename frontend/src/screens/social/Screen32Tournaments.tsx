import React from 'react';
import { Trophy, Clock, Coins, ChevronRight, Shield, Award, Sparkles } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen32TournamentsProps {
  onNavigate: (screenId: string) => void;
}

export const Screen32Tournaments: React.FC<Screen32TournamentsProps> = ({ onNavigate }) => {
  return (
    <div className="screen-page tournaments-screen">
      <div className="content-wrapper">
        
        {/* HEADER (Matching Reference Image 13) */}
        <div className="tournaments-header-row mb-4">
          <div>
            <div className="flex-center gap-2 mb-1">
              <span className="badge badge-gold">Special Events</span>
              <span className="badge badge-purple">SRS V2 Feature</span>
            </div>
            <h1 className="page-title">Upcoming Tournaments</h1>
            <p className="page-subtitle">Compete in special events and win exclusive virtual rewards!</p>
          </div>

          <button className="btn btn-secondary btn-sm flex-center gap-1">
            <span>View All</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* 3 TOURNAMENT CARDS (Matching Reference Image 13) */}
        <div className="tournaments-cards-grid">
          {/* Tournament 1: Weekend Cup */}
          <div className="tournament-card card">
            <div className="t-card-top">
              <div className="t-icon-box orange">
                <Trophy size={24} className="text-orange" />
              </div>
              <div className="t-title-wrap">
                <h3>Weekend Cup</h3>
                <div className="t-countdown-line">
                  <Clock size={13} className="text-secondary" />
                  <span>Starts in <strong>2d 5h</strong></span>
                </div>
              </div>
            </div>

            <div className="t-car-display">
              <SvgCar id="blaze" size={160} />
            </div>

            <div className="t-card-bottom card-cream">
              <div className="t-prize-wrap">
                <span className="t-prize-label">Prize Pool</span>
                <span className="t-prize-amount font-bold">🪙 5,000 Coins</span>
              </div>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => alert('Registered for Weekend Cup!')}
              >
                Register
              </button>
            </div>
          </div>

          {/* Tournament 2: Speed Challenge */}
          <div className="tournament-card card">
            <div className="t-card-top">
              <div className="t-icon-box blue">
                <Trophy size={24} className="text-blue" />
              </div>
              <div className="t-title-wrap">
                <h3>Speed Challenge</h3>
                <div className="t-countdown-line">
                  <Clock size={13} className="text-secondary" />
                  <span>Starts in <strong>4d 12h</strong></span>
                </div>
              </div>
            </div>

            <div className="t-car-display">
              <SvgCar id="starter" size={160} />
            </div>

            <div className="t-card-bottom card-cream">
              <div className="t-prize-wrap">
                <span className="t-prize-label">Prize Pool</span>
                <span className="t-prize-amount font-bold">🪙 10,000 Coins</span>
              </div>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => alert('Registered for Speed Challenge!')}
              >
                Register
              </button>
            </div>
          </div>

          {/* Tournament 3: Pro League */}
          <div className="tournament-card card">
            <div className="t-card-top">
              <div className="t-icon-box gold">
                <Trophy size={24} className="text-gold" />
              </div>
              <div className="t-title-wrap">
                <h3>Pro League</h3>
                <div className="t-countdown-line">
                  <Clock size={13} className="text-secondary" />
                  <span>Starts in <strong>1w 3d</strong></span>
                </div>
              </div>
            </div>

            <div className="t-car-display">
              <SvgCar id="golden" size={160} />
            </div>

            <div className="t-card-bottom card-cream">
              <div className="t-prize-wrap">
                <span className="t-prize-label">Prize Pool</span>
                <span className="t-prize-amount font-bold">🪙 25,000 Coins</span>
              </div>
              <button 
                className="btn btn-gold btn-sm"
                onClick={() => alert('Registered for Pro League!')}
              >
                Join League
              </button>
            </div>
          </div>
        </div>

        {/* ROADMAP ARCHITECTURE NOTICE */}
        <div className="v2-roadmap-banner card card-cream mt-5">
          <Shield size={24} className="text-purple flex-shrink-0" />
          <div className="v2-text">
            <strong>SRS Phase V2 Feature: Seasonal Brackets & Tournaments</strong>
            <p className="text-xs text-secondary mt-1">
              Bracket matchmaking, automated elimination rounds, and tiered coin prize pools are scheduled for the V2 Competitive Release.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
