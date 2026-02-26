import React from 'react';
import { MagnifyingGlass, Bell } from '@phosphor-icons/react';
import socketService from '../services/socket';
import { notificationService } from '../services/api';
import NotificationPanel from './NotificationPanel';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [notifications, setNotifications] = React.useState([]);
    const [unread, setUnread] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return date.toLocaleDateString();
    };

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
            socketService.joinUser(userId);
            if (user.role) socketService.joinRole(user.role.toLowerCase());
        }
        socketService.on('notification', (notif) => {
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
        return () => { socketService.off('notification'); };
    }, [user?._id, user?.role]);

    const handleToggleNotifications = async () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications && unread) setUnread(false);
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

    const navigate = useNavigate();

    const handleSettingsClick = () => {
        navigate('/app/settings', { state: { activeTab: 'notifications' } });
        setShowNotifications(false);
    };

    return (
        <header style={{
            height: '70px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '0 1rem 0 64px' : '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 90,
        }}>
            {/* Search — hidden on mobile */}
            {!isMobile && (
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
            )}

            {/* Page title placeholder on mobile */}
            {isMobile && (
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--pivot-blue-dark)' }}>AI-AUTO</span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '1rem' : '1.5rem', position: 'relative' }}>
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
                            position: 'absolute', top: '50px',
                            right: isMobile ? '-60px' : '-10px',
                            zIndex: 1000,
                            maxWidth: isMobile ? 'calc(100vw - 20px)' : 'auto',
                        }}>
                            <NotificationPanel
                                notifications={notifications}
                                onMarkRead={handleMarkAllRead}
                                onSettingsClick={handleSettingsClick}
                            />
                        </div>
                    )}
                </div>

                <div
                    className="profile"
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                    onClick={onLogout}
                >
                    {!isMobile && (
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{user?.name || 'Administrator'}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--charcoal)', margin: 0, textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ') || 'User'} (Tap to Logout)</p>
                        </div>
                    )}
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=0047AB&color=fff`}
                        alt="Profile"
                        style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                    />
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
