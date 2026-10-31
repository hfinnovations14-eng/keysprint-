import React, { useState } from 'react';
import { Bell, Trophy, UserPlus, Gift, Swords, Check, Trash2, ArrowLeft } from 'lucide-react';

interface Screen31NotificationsProps {
  onNavigate: (screenId: string) => void;
}

export const Screen31Notifications: React.FC<Screen31NotificationsProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      type: 'race_invite',
      title: 'Private Race Challenge!',
      desc: 'Emma invited you to join room "Desert Speedsters" (SPRINT-42)',
      time: '2 mins ago',
      unread: true,
      actionScreen: 'screen-18'
    },
    {
      id: 'n2',
      type: 'reward',
      title: 'Daily Challenge Completed!',
      desc: 'You completed "Speed Demon". +150 XP and +75 Coins are ready to collect.',
      time: '1 hour ago',
      unread: true,
      actionScreen: 'screen-28'
    },
    {
      id: 'n3',
      type: 'achievement',
      title: 'Achievement Unlocked: Race Streak!',
      desc: 'You won 5 races in a row. Check your profile trophy shelf.',
      time: 'Yesterday',
      unread: false,
      actionScreen: 'screen-27'
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="screen-page notifs-screen">
      <div className="content-wrapper">
        <div className="notifs-card card">
          <div className="section-header-row mb-4">
            <div>
              <span className="badge badge-orange">Inbox</span>
              <h1 className="page-title">Notifications & Invites</h1>
              <p className="page-subtitle">Track incoming friend requests, private room invites, and reward deliveries.</p>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={markAllRead}>
              <Check size={14} />
              <span>Mark All as Read</span>
            </button>
          </div>

          <div className="notifs-list-stack">
            {notifications.map((n) => (
              <div key={n.id} className={`notif-item-card card ${n.unread ? 'card-cream unread-border' : ''}`}>
                <div className="notif-icon-col">
                  {n.type === 'race_invite' && <div className="notif-badge orange"><Swords size={18} /></div>}
                  {n.type === 'reward' && <div className="notif-badge gold"><Gift size={18} /></div>}
                  {n.type === 'achievement' && <div className="notif-badge green"><Trophy size={18} /></div>}
                </div>

                <div className="notif-content-col">
                  <div className="notif-title-row">
                    <strong>{n.title}</strong>
                    <span className="notif-time text-xs text-secondary">{n.time}</span>
                  </div>
                  <p className="notif-desc text-secondary text-sm mt-1">{n.desc}</p>
                </div>

                <div className="notif-action-col">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => onNavigate(n.actionScreen)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
