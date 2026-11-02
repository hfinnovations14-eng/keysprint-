import React, { useState, useEffect } from 'react';
import { Bell, Trophy, UserPlus, Gift, Swords, Check, Trash2, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useRace } from '../../context/RaceContext';

interface Screen31NotificationsProps {
  onNavigate: (screenId: string) => void;
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: string | null;
  isRead: boolean;
  createdAt: string;
}

export const Screen31Notifications: React.FC<Screen31NotificationsProps> = ({ onNavigate }) => {
  const { joinPrivateRoom } = useRace();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      if (data && data.notifications) {
        setNotifications(data.notifications);
      }
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await api.markNotificationRead('all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {
      // fallback
    }
  };

  const handleAction = async (n: NotificationItem) => {
    await markSingleRead(n.id);

    let parsedData: any = {};
    try {
      if (n.data) parsedData = JSON.parse(n.data);
    } catch {
      // json parse fallback
    }

    if (n.type === 'race_invite' && parsedData.roomCode) {
      await joinPrivateRoom(parsedData.roomCode);
      onNavigate('screen-18');
    } else if (n.type === 'friend_request' || n.type === 'friend_accepted') {
      onNavigate('screen-30');
    } else if (n.type === 'reward') {
      onNavigate('screen-28');
    } else if (n.type === 'achievement') {
      onNavigate('screen-27');
    } else {
      onNavigate('screen-19');
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diffMs / (1000 * 60));
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // Default fallback items if list is empty
  const displayList: NotificationItem[] = notifications.length > 0 ? notifications : [
    {
      id: 'demo_1',
      type: 'race_invite',
      title: 'Private Race Challenge!',
      message: 'Emma invited you to join a private room race!',
      data: JSON.stringify({ roomCode: 'SPRINT-42' }),
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'demo_2',
      type: 'reward',
      title: 'Daily Challenge Completed!',
      message: 'You completed your daily typing challenge. Claim bonus XP & Coins now!',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'demo_3',
      type: 'achievement',
      title: 'Achievement Milestones Ready!',
      message: 'New speed badges and driver rank trophies are waiting in your showcase.',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  const unreadCount = displayList.filter(n => !n.isRead).length;

  return (
    <div className="screen-page notifs-screen">
      <div className="content-wrapper">
        <div className="notifs-card card">
          <div className="section-header-row mb-4">
            <div>
              <div className="flex-center gap-2 mb-1" style={{ justifyContent: 'flex-start' }}>
                <span className="badge badge-orange">Inbox</span>
                {unreadCount > 0 && (
                  <span className="badge badge-gold font-bold">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <h1 className="page-title">Notifications & Invites</h1>
              <p className="page-subtitle">Track incoming friend requests, private room invites, and reward deliveries.</p>
            </div>

            <div className="flex-center gap-2">
              <button 
                type="button" 
                className="btn btn-outline btn-sm flex-center gap-1"
                onClick={fetchNotifications}
              >
                <RefreshCw size={14} className={loading ? 'spinner-icon' : ''} />
                <span>Refresh</span>
              </button>

              <button className="btn btn-secondary btn-sm flex-center gap-1" onClick={markAllRead}>
                <Check size={14} />
                <span>Mark All as Read</span>
              </button>
            </div>
          </div>

          <div className="notifs-list-stack">
            {displayList.map((n) => (
              <div key={n.id} className={`notif-item-card card ${!n.isRead ? 'card-cream unread-border border-orange' : 'card-cream'}`}>
                <div className="notif-icon-col">
                  {n.type === 'race_invite' && <div className="notif-badge orange"><Swords size={20} className="text-orange" /></div>}
                  {n.type === 'reward' && <div className="notif-badge gold"><Gift size={20} className="text-gold" /></div>}
                  {n.type === 'achievement' && <div className="notif-badge green"><Trophy size={20} className="text-green" /></div>}
                  {(n.type === 'friend_request' || n.type === 'friend_accepted') && (
                    <div className="notif-badge blue"><UserPlus size={20} className="text-blue" /></div>
                  )}
                </div>

                <div className="notif-content-col flex-1">
                  <div className="notif-title-row flex-between">
                    <strong className="text-base">{n.title}</strong>
                    <span className="notif-time text-xs text-secondary">{formatTimeAgo(n.createdAt)}</span>
                  </div>
                  <p className="notif-desc text-secondary text-sm mt-1">{n.message}</p>
                </div>

                <div className="notif-action-col">
                  <button 
                    className="btn btn-primary btn-sm flex-center gap-1"
                    onClick={() => handleAction(n)}
                  >
                    <span>{n.type === 'race_invite' ? 'Accept & Race' : 'View'}</span>
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
