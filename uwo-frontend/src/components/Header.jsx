import React from 'react';
import { MagnifyingGlass, Bell, ChatCircleDots } from '@phosphor-icons/react';
import socketService from '../services/socket';
import { notificationService } from '../services/api';
import NotificationPanel from './NotificationPanel';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
    // const [isConnected, setIsConnected] = React.useState(socketService.socket?.connected || false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [notifications, setNotifications] = React.useState([]);
    const [unread, setUnread] = React.useState(false);

    // Helper to format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return date.toLocaleDateString();
    };

    // Helper to map priority to UI type
    const getNotificationType = (priority) => {
        switch (priority) {
            case 'urgent': return 'Hot';
            case 'high': return 'Hot';
            case 'medium': return 'Warm';
            case 'low': return 'Cold';
            default: return 'Warm';
        }
    };

    const fetchNotifications = async () => {
        const userId = user?._id || user?.id;
        if (!userId) return;
        try {
            const data = await notificationService.getAll(user._id || user.id);
            const mapped = data.map(n => ({
                id: n._id,
                title: n.title,
                time: formatTime(n.createdAt),
                type: getNotificationType(n.priority),
                detail: n.message,
                status: n.status
            }));
            setNotifications(mapped);
            setUnread(mapped.some(n => n.status === 'unread'));
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    React.useEffect(() => {
        fetchNotifications();

        const userId = user?._id || user?.id;
        if (userId) {
            console.log(`📡 Joining socket rooms for user: ${userId} (${user.role})`);
            socketService.joinUser(userId);
            if (user.role) {
                socketService.joinRole(user.role.toLowerCase());
            }
        }

        socketService.on('notification', (notif) => {
            console.log('[REAL-TIME] Notification received:', notif.title);
            const newNotif = {
                id: notif._id || Date.now(),
                title: notif.title,
                time: 'Just now',
                type: getNotificationType(notif.priority),
                detail: notif.message,
                status: 'unread'
            };
            setNotifications(prev => [newNotif, ...prev]);
            setUnread(true);
        });

        return () => {
            socketService.off('notification');
        };
    }, [user?._id, user?.role]);

    const handleToggleNotifications = async () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications && unread) {
            // Optimistically mark all as read in UI
            // In a real app, you might want a specific "Mark all read" button or action
            // For now, we will just keep the red dot logic as is (removes on open)
            setUnread(false);

            // Optionally mark specific visible notifications as read in backend
            // const unreadIds = notifications.filter(n => n.status === 'unread').map(n => n.id);
            // unreadIds.forEach(id => notificationService.markAsRead(id));
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const unreadIds = notifications.filter(n => n.status === 'unread').map(n => n.id);
            await Promise.all(unreadIds.map(id => notificationService.markAsRead(id)));

            setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
            setUnread(false);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const headerStyle = {
        height: '70px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 90,
    };

    const navigate = useNavigate();

    const handleSettingsClick = () => {
        navigate('/app/settings', { state: { activeTab: 'notifications' } });
        setShowNotifications(false);
    };

    return (
        <header style={headerStyle}>
            <div className="search-bar" style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--light-grey)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                width: '300px',
                border: '1px solid transparent',
                transition: 'var(--transition)'
            }}>
                <MagnifyingGlass size={20} />
                <input
                    type="text"
                    placeholder="Search leads, projects..."
                    style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '10px', width: '100%' }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>

                <div style={{ position: 'relative' }}>
                    <button
                        className="icon-btn"
                        onClick={handleToggleNotifications}
                        style={{ background: 'none', border: 'none', color: 'var(--charcoal)', cursor: 'pointer', position: 'relative', outline: 'none' }}
                    >
                        <Bell size={24} color={showNotifications ? 'var(--pivot-blue)' : 'var(--charcoal)'} />
                        {unread && (
                            <span style={{ width: '8px', height: '8px', background: '#ff4d4d', borderRadius: '50%', position: 'absolute', top: '-2px', right: '-2px', border: '2px solid var(--white)' }}></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div style={{
                            position: 'absolute', top: '50px', right: '-10px',
                            zIndex: 1000
                        }}>
                            <NotificationPanel
                                notifications={notifications}
                                onMarkRead={handleMarkAllRead}
                                onSettingsClick={handleSettingsClick}
                            />
                        </div>
                    )}
                </div>

                <div className="profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={onLogout}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{user?.name || 'Administrator'}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--charcoal)', margin: 0, textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ') || 'User'} (Tap to Logout)</p>
                    </div>
                    <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=0047AB&color=fff`} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                </div>
            </div>
            <style>{`
                @keyframes slideInDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </header>
    );
};

export default Header;
