import React, { useState } from 'react';
import { Search, ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

interface Screen36HelpFAQProps {
  onNavigate: (screenId: string) => void;
}

export const Screen36HelpFAQ: React.FC<Screen36HelpFAQProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How is typing speed (WPM) calculated in KeySprint?',
      a: 'KeySprint measures Net WPM following standard typing formula: (Validated Correct Keystrokes / 5) divided by elapsed race minutes. Uncorrected errors do not award progress.'
    },
    {
      q: 'Do unlocked cars make my vehicle faster in races?',
      a: 'No! Strictly zero pay-to-win mechanics exist on KeySprint. Every car in the garage—from the starter coupe to the legendary Shadow X—possesses 100% identical progression physics.'
    },
    {
      q: 'Can I play with my friends in a private room?',
      a: 'Yes. Simply click "Create Room" from the Play menu, specify 2–6 player capacity, and share the generated 6-character room code or direct URL with your friends.'
    },
    {
      q: 'What anti-cheat systems are active during multiplayer races?',
      a: 'All typing input timestamps are validated server-side. Pasting is blocked, and suspicious typing speed bursts (>200 WPM) or identical inter-key cadences are automatically flagged for review.'
    },
    {
      q: 'Can I race as a guest without creating an account?',
      a: 'Yes! Guest mode allows instant racing. However, creating a free account ensures your coin wallet, garage unlocks, and leaderboard placements are permanently preserved.'
    }
  ];

  return (
    <div className="screen-page faq-screen">
      <div className="content-wrapper">
        <div className="faq-master-card card">
          <div className="page-header-block text-center mb-4">
            <span className="badge badge-orange">Support Center</span>
            <h1 className="page-title">Help & Frequently Asked Questions</h1>
            <p className="page-subtitle">Find fast answers to game mechanics, account settings, and fairness rules.</p>
          </div>

          <div className="faq-search-box mb-4">
            <div className="input-icon-wrap">
              <Search size={18} className="input-field-icon" />
              <input 
                type="text" 
                placeholder="Search help topics..."
                className="input-field with-icon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="faq-item card card-cream mb-3"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <div className="faq-question-row">
                  <h4>{faq.q}</h4>
                  <ChevronDown size={18} className={`caret ${openIndex === idx ? 'rotate' : ''}`} />
                </div>
                {openIndex === idx && (
                  <p className="faq-answer-text mt-2 text-secondary text-sm">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="faq-footer-card card-cream mt-5 text-center py-4">
            <h4>Still have questions or found a bug?</h4>
            <p className="text-secondary text-sm mt-1">Our support team and game moderators are always ready to assist.</p>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => onNavigate('screen-37')}
            >
              <MessageSquare size={16} />
              <span>Contact Support / Report Issue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
