import React from 'react';
import { X, ArrowsClockwise, Broadcast, Users, Bell, CloudSlash, CheckCircle, Warning, Info } from '@phosphor-icons/react';

const RealTimeSyncModal = ({ isOpen, onClose, isEnabled, onToggle }) => {
    if (!isOpen) return null;

    const sections = [
        {
            id: 1,
            title: "Live Data Updates",
            icon: <Broadcast size={24} color="#0047AB" />,
            description: "No page refresh required for critical operations.",
            items: [
                "Project progress updates (tasks, milestones)",
                "Attendance updates (check-in / check-out)",
                "Hazard reports & safety logs",
                "Billing usage & plan limits",
                "Notifications (alerts, approvals, escalations)"
            ]
        },
        {
            id: 2,
            title: "Multi-Dashboard Synchronization",
            icon: <Users size={24} color="#0047AB" />,
            description: "Admin updates reflect instantly on all role-based views.",
            items: [
                "Admin approves user → user gets access instantly",
                "Site Manager submits report → Admin sees it live",
                "Immediate sync across Site Manager, Engineer, and Client views"
            ]
        },
        {
            id: 3,
            title: "Real-Time Collaboration",
            icon: <Users size={24} color="#0047AB" />,
            description: "Multiple users working on the same documents and projects.",
            items: [
                "Live status indicators: 'User is editing'",
                "Instant 'Changes saved' confirmations",
                "Relative timestamps (e.g., 'Updated 2 seconds ago')"
            ]
        },
        {
            id: 4,
            title: "Real-Time Notifications",
            icon: <Bell size={24} color="#0047AB" />,
            description: "Immediate alerts for time-sensitive events.",
            items: [
                "New hazard raised / Critical safety alerts",
                "Approval requests and status changes",
                "Payment failures and plan limit warnings",
                "System-triggered automation events"
            ]
        },
        {
            id: 5,
            title: "Sync Failure Handling",
            icon: <CloudSlash size={24} color="#0047AB" />,
            description: "Robust data integrity even with spotty connectivity.",
            items: [
                "Auto-retry on network failure",
                "Offline mode persistence with background sync",
                "Live status indicator (Connected / Syncing / Failed)"
            ]
        }
    ];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
            animation: 'modalFadeIn 0.3s ease'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)', width: '90%', maxWidth: '900px', borderRadius: '28px',
                padding: '2.5rem', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255,255,255,0.2)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <ArrowsClockwise size={32} color="#0047AB" weight="bold" />
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>Real-Time Sync Protocol</h2>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>This controls live data synchronization across the entire AI-AUTO platform.</p>
                    </div>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <X size={24} color="#475569" />
                    </button>
                </div>

                <div style={{
                    background: isEnabled ? 'rgba(16, 185, 129, 0.05)' : 'rgba(100, 116, 139, 0.05)',
                    padding: '1.5rem', borderRadius: '20px', border: `1px solid ${isEnabled ? '#d1fae5' : '#e2e8f0'}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isEnabled ? <CheckCircle size={24} color="#10b981" weight="fill" /> : <Info size={24} color="#64748b" weight="fill" />}
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isEnabled ? '#065f46' : '#1e293b' }}>
                            Status: {isEnabled ? 'LIVE SYNC ACTIVE' : 'MANUAL SYNC MODE'}
                        </span>
                    </div>
                    <button
                        onClick={onToggle}
                        style={{
                            padding: '10px 24px', borderRadius: '12px', border: 'none',
                            background: isEnabled ? '#ef4444' : '#0047AB',
                            color: 'white', fontWeight: 800, cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: isEnabled ? '0 4px 12px rgba(239, 68, 68, 0.2)' : '0 4px 12px rgba(0, 71, 171, 0.2)'
                        }}
                    >
                        {isEnabled ? 'Turn OFF' : 'Turn ON'}
                    </button>
                </div>

                <div style={{ padding: '0 1rem', flex: 1, overflowY: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: isEnabled ? '1fr 1fr' : '1fr', gap: '2rem' }}>
                        {isEnabled ? (
                            <>
                                {sections.map(section => (
                                    <div key={section.id} style={{
                                        padding: '1.5rem', borderRadius: '20px', background: '#f8fafc', border: '1px solid #f1f5f9'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                            <div style={{ width: '42px', height: '42px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                                {section.icon}
                                            </div>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{section.title}</h4>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', fontWeight: 500 }}>{section.description}</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {section.items.map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '8px', fontSize: '0.8rem', color: '#475569' }}>
                                                    <div style={{ width: '6px', height: '6px', background: '#0047AB', borderRadius: '50%', marginTop: '6px', flexShrink: 0 }}></div>
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', background: '#fef2f2', borderRadius: '24px', border: '1px solid #fee2e2' }}>
                                <Warning size={48} color="#ef4444" weight="bold" style={{ marginBottom: '1.5rem' }} />
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#991b1b', marginBottom: '1rem' }}>Synchronization Paused</h3>
                                <p style={{ color: '#b91c1c', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto' }}>
                                    When OFF, data updates only on <strong>manual refresh</strong> or <strong>scheduled sync</strong> cycles.
                                    This state reduces server load and is primary used for maintenance, debugging, or optimization in low-bandwidth environments.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <button onClick={onClose} style={{
                        padding: '12px 32px', background: '#0f172a', color: 'white',
                        border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer',
                        fontSize: '1rem'
                    }}>
                        Understand & Close
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default RealTimeSyncModal;
