import React from 'react';
import { CurrencyDollar, Flag, Warning, Info, Gear } from '@phosphor-icons/react';

const NotificationPanel = ({ notifications, onMarkRead, onSettingsClick }) => {

    const getIcon = (type, title) => {
        // Simple heuristic to match icons based on content or type
        const lowerTitle = title?.toLowerCase() || '';
        const lowerType = type?.toLowerCase() || '';

        if (lowerTitle.includes('budget') || lowerTitle.includes('cost') || lowerType === 'budget_exceeded') {
            return { icon: <CurrencyDollar size={20} weight="fill" />, color: '#F59E0B', bg: '#FFF7ED' }; // Amber
        }
        if (lowerTitle.includes('milestone') || lowerTitle.includes('complete') || lowerType === 'milestone') {
            return { icon: <Flag size={20} weight="fill" />, color: '#10B981', bg: '#ECFDF5' }; // Emerald
        }
        if (lowerTitle.includes('hazard') || lowerTitle.includes('safety') || lowerType === 'hazard') {
            return { icon: <Warning size={20} weight="fill" />, color: '#EF4444', bg: '#FEF2F2' }; // Red
        }
        return { icon: <Info size={20} weight="fill" />, color: '#3B82F6', bg: '#EFF6FF' }; // Blue
    };

    return (
        <div style={{
            width: '400px',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            border: '1px solid #f0f0f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>Notifications</h3>
                <span
                    onClick={onMarkRead}
                    style={{ fontSize: '0.8rem', color: '#0047AB', fontWeight: 600, cursor: 'pointer' }}
                >
                    Mark all read
                </span>
            </div>

            {/* List */}
            <div style={{ maxHeight: '450px', overflowY: 'auto', padding: '10px' }}>
                {notifications.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF' }}>
                        <p style={{ margin: 0 }}>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((n) => {
                        const style = getIcon(n.type, n.title);
                        const isUnread = n.status === 'unread';

                        return (
                            <div key={n.id} style={{
                                padding: '12px',
                                marginBottom: '8px',
                                borderRadius: '12px',
                                background: isUnread ? '#F8FAFC' : '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                display: 'flex',
                                gap: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: '40px', height: '40px',
                                    borderRadius: '50%',
                                    background: style.bg,
                                    color: style.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {style.icon}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>{n.title}</h4>
                                        <span style={{ fontSize: '0.7rem', color: '#9CA3AF', whiteSpace: 'nowrap', marginLeft: '8px' }}>{n.time}</span>
                                    </div>
                                    <p style={{
                                        margin: 0, fontSize: '0.8rem', color: '#6B7280',
                                        lineHeight: '1.4',
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                    }}>
                                        {n.detail}
                                    </p>
                                </div>

                                {/* Unread Indicator */}
                                {isUnread && (
                                    <div style={{
                                        width: '8px', height: '8px',
                                        borderRadius: '50%',
                                        background: '#0047AB',
                                        marginTop: '6px',
                                        flexShrink: 0
                                    }} />
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: '12px 20px',
                borderTop: '1px solid #f0f0f0',
                background: '#FAFAFA'
            }}>
                <button
                    onClick={onSettingsClick}
                    style={{
                        width: '100%',
                        padding: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        background: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        color: '#4B5563',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
                >
                    <Gear size={16} />
                    Notification Settings
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default NotificationPanel;
