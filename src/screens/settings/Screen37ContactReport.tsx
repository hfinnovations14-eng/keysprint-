import React, { useState } from 'react';
import { Send, ShieldAlert, Bug, UserX, CheckCircle2 } from 'lucide-react';

interface Screen37ContactReportProps {
  onNavigate: (screenId: string) => void;
}

export const Screen37ContactReport: React.FC<Screen37ContactReportProps> = ({ onNavigate }) => {
  const [reportType, setReportType] = useState('bug');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [reportedUser, setReportedUser] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="screen-page contact-screen">
      <div className="content-wrapper">
        <div className="contact-card card">
          <div className="page-header-block text-center mb-4">
            <span className="badge badge-orange">Fair Play & Help</span>
            <h1 className="page-title">Contact Support & Report Issue</h1>
            <p className="page-subtitle">Submit bug discoveries, suspicious typing behavior, or offensive nicknames.</p>
          </div>

          {submitted ? (
            <div className="success-feedback-box text-center py-5">
              <CheckCircle2 size={54} className="text-green mb-2" />
              <h2>Report Ticket Logged!</h2>
              <p className="text-secondary text-sm mt-2">
                Thank you for keeping KeySprint clean and enjoyable. Our moderation team has received your ticket (#TKT-9214).
              </p>
              <button 
                className="btn btn-primary mt-4"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              {/* Category selector */}
              <div className="report-categories-row mb-4">
                <button
                  type="button"
                  className={`category-pill-btn ${reportType === 'bug' ? 'active' : ''}`}
                  onClick={() => setReportType('bug')}
                >
                  <Bug size={16} />
                  <span>Bug Report</span>
                </button>

                <button
                  type="button"
                  className={`category-pill-btn ${reportType === 'cheat' ? 'active' : ''}`}
                  onClick={() => setReportType('cheat')}
                >
                  <ShieldAlert size={16} />
                  <span>Suspicious Cheating</span>
                </button>

                <button
                  type="button"
                  className={`category-pill-btn ${reportType === 'nickname' ? 'active' : ''}`}
                  onClick={() => setReportType('nickname')}
                >
                  <UserX size={16} />
                  <span>Offensive Nickname</span>
                </button>
              </div>

              {reportType === 'cheat' && (
                <div className="input-group mb-3">
                  <label className="input-label">Reported Player Nickname</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. SpeedBot_99"
                    className="input-field"
                    value={reportedUser}
                    onChange={(e) => setReportedUser(e.target.value)}
                  />
                </div>
              )}

              <div className="input-group mb-3">
                <label className="input-label">Subject</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Summary of what happened"
                  className="input-field"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="input-group mb-4">
                <label className="input-label">Detailed Description</label>
                <textarea 
                  rows={4}
                  required 
                  placeholder="Include race room ID or steps to reproduce..."
                  className="input-field"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg full-width">
                <Send size={18} />
                <span>Submit Report to Moderation</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
