import React from 'react';
import { Target, Shield, HeartHandshake, Zap, Cpu, Users } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen03AboutProps {
  onNavigate: (screenId: string) => void;
}

export const Screen03About: React.FC<Screen03AboutProps> = ({ onNavigate }) => {
  return (
    <div className="screen-page about-screen">
      <div className="content-wrapper">
        <div className="page-header-block text-center">
          <span className="badge badge-orange">Our Mission</span>
          <h1 className="page-title">About KeySprint</h1>
          <p className="page-subtitle">
            Transforming mundane keyboard typing training into a thrilling, community-first arcade motorsport.
          </p>
        </div>

        {/* Story Section */}
        <div className="about-grid">
          <div className="about-text-card card card-cream">
            <h2>Built for Speed, Accuracy, and Pure Joy</h2>
            <p>
              Traditional typing practice can feel monotonous. KeySprint was founded on a simple principle: 
              when you pair responsive typing feedback with the thrill of competitive arcade racing, 
              muscle memory builds twice as fast—and players actually look forward to daily practice.
            </p>
            <p className="mt-3">
              Inspired by the classic fun of casual motorsport and engineered with modern server-authoritative 
              WebSockets, KeySprint provides an uncompromised browser experience: zero mandatory downloads, 
              instant matchmaking in under 8 seconds, and 60 FPS visual smoothness across desktop and tablet devices.
            </p>
          </div>

          <div className="about-media-card card text-center">
            <SvgCar id="golden" size={200} animatedNitro={true} />
            <h3 className="mt-4">100% Fair Play Architecture</h3>
            <p className="text-secondary text-sm">
              All vehicle purchases are purely cosmetic. Whether driving the rookie Starter Car or the legendary Shadow X, 
              progression speed depends strictly on your typing cadence and accuracy.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="pillars-grid mt-5">
          <div className="pillar-card card">
            <div className="pillar-icon blue"><Zap size={22} /></div>
            <h4>Low-Latency Sync</h4>
            <p>Monotonic state packets ensure your car mirrors your exact keystrokes in real time without rubber-banding.</p>
          </div>

          <div className="pillar-card card">
            <div className="pillar-icon green"><Shield size={22} /></div>
            <h4>Anti-Cheat Engine</h4>
            <p>Advanced cadence timestamp analysis, paste suppression, and anomalous burst detection safeguard leaderboards.</p>
          </div>

          <div className="pillar-card card">
            <div className="pillar-icon orange"><HeartHandshake size={22} /></div>
            <h4>Welcoming for All Ages</h4>
            <p>Child-safe privacy defaults, friendly cartoon aesthetics, and zero pay-to-win or cash-out gambling features.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
