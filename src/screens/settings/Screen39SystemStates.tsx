import React, { useState } from 'react';
import { WifiOff, AlertTriangle, Wrench, SearchX, RotateCcw, Home } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen39SystemStatesProps {
  onNavigate: (screenId: string) => void;
}

export const Screen39SystemStates: React.FC<Screen39SystemStatesProps> = ({ onNavigate }) => {
  const [selectedState, setSelectedState] = useState<'404' | 'maintenance' | '500' | 'reconnect' | 'empty'>('404');

  return (
    <div className="screen-page system-screen">
      <div className="content-wrapper">
        <div className="system-states-inspector card">
          <div className="states-switcher-row mb-4">
            <span className="badge badge-orange">System State Overlays</span>
            <div className="tab-list">
              <button 
                className={`tab-btn ${selectedState === '404' ? 'active' : ''}`}
                onClick={() => setSelectedState('404')}
              >
                404 Not Found
              </button>
              <button 
                className={`tab-btn ${selectedState === 'maintenance' ? 'active' : ''}`}
                onClick={() => setSelectedState('maintenance')}
              >
                Maintenance Mode
              </button>
              <button 
                className={`tab-btn ${selectedState === '500' ? 'active' : ''}`}
                onClick={() => setSelectedState('500')}
              >
                500 Error
              </button>
              <button 
                className={`tab-btn ${selectedState === 'reconnect' ? 'active' : ''}`}
                onClick={() => setSelectedState('reconnect')}
              >
                Connection Lost
              </button>
              <button 
                className={`tab-btn ${selectedState === 'empty' ? 'active' : ''}`}
                onClick={() => setSelectedState('empty')}
              >
                Empty Data
              </button>
            </div>
          </div>

          {/* STATE 1: 404 Not Found */}
          {selectedState === '404' && (
            <div className="system-display-box card-cream text-center py-5">
              <div className="system-car-decor">
                <SvgCar id="retro" size={170} />
              </div>
              <h1 className="system-code text-orange">404</h1>
              <h2>Wrong Turn on the Track!</h2>
              <p className="text-secondary text-sm mt-1">
                The racing page or room you are looking for has driven off the map.
              </p>
              <button 
                className="btn btn-primary mt-4"
                onClick={() => onNavigate('screen-01')}
              >
                <Home size={16} />
                <span>Return to Home Highway</span>
              </button>
            </div>
          )}

          {/* STATE 2: Maintenance Mode */}
          {selectedState === 'maintenance' && (
            <div className="system-display-box card-cream text-center py-5">
              <div className="system-icon-ring orange">
                <Wrench size={40} className="text-orange" />
              </div>
              <h2>Pit Stop: Pit Lane Maintenance</h2>
              <p className="text-secondary text-sm mt-2 max-w-md mx-auto">
                KeySprint engine servers are currently undergoing routine track resurfacing and database indexing. 
                Estimated race resumption in <strong>25 minutes</strong>.
              </p>
              <div className="badge badge-gold mt-4">Status: Maintenance Scheduled (SRS NFR-01)</div>
            </div>
          )}

          {/* STATE 3: 500 Server Error */}
          {selectedState === '500' && (
            <div className="system-display-box card-cream text-center py-5">
              <div className="system-icon-ring red">
                <AlertTriangle size={40} className="text-red" />
              </div>
              <h2>Engine Misfire (500 Error)</h2>
              <p className="text-secondary text-sm mt-2">
                Our server telemetry encountered an unexpected exception while synchronizing room state.
              </p>
              <button 
                className="btn btn-secondary mt-4"
                onClick={() => alert('Refreshing server socket session...')}
              >
                <RotateCcw size={16} />
                <span>Retry Connection</span>
              </button>
            </div>
          )}

          {/* STATE 4: Reconnecting Overlay */}
          {selectedState === 'reconnect' && (
            <div className="system-display-box card-cream text-center py-5">
              <div className="system-icon-ring blue">
                <WifiOff size={40} className="text-blue" />
              </div>
              <h2>Signal Interrupted • Reconnecting...</h2>
              <p className="text-secondary text-sm mt-2">
                Attempting to restore your live race lane within the 15-second grace window (SRS FR-G07).
              </p>
              <div className="reconnect-progress-bar mt-4 mx-auto">
                <div className="reconnect-fill" />
              </div>
            </div>
          )}

          {/* STATE 5: Empty Data */}
          {selectedState === 'empty' && (
            <div className="system-display-box card-cream text-center py-5">
              <div className="system-icon-ring gray">
                <SearchX size={40} className="text-muted" />
              </div>
              <h2>No Records Found</h2>
              <p className="text-secondary text-sm mt-2">
                You haven't completed any races in this category yet. Fire up your engine and set your first record!
              </p>
              <button 
                className="btn btn-primary mt-4"
                onClick={() => onNavigate('screen-10')}
              >
                Start Your First Race
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
