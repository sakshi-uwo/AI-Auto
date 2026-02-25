import React, { useState, useEffect } from 'react';
import { X, Lock as LockIcon, CheckCircle, Warning, Info, ShieldCheck, Gear, Pulse, Clock, Bell, Stop, Calendar } from '@phosphor-icons/react';

const MaintenanceModeModal = ({ isOpen, onClose, isEnabled, onToggle, settings, onUpdateSettings }) => {
    const [notice, setNotice] = useState(settings?.maintenanceNotice || "System is under maintenance. Please try again later.");
    const [startTime, setStartTime] = useState(settings?.maintenanceWindow?.startTime ? new Date(settings.maintenanceWindow.startTime).toISOString().slice(0, 16) : "");
    const [endTime, setEndTime] = useState(settings?.maintenanceWindow?.endTime ? new Date(settings.maintenanceWindow.endTime).toISOString().slice(0, 16) : "");
    const [autoDisable, setAutoDisable] = useState(settings?.autoDisableMaintenance || false);

    useEffect(() => {
        if (settings) {
            setNotice(settings.maintenanceNotice || "");
            if (settings.maintenanceWindow?.startTime) setStartTime(new Date(settings.maintenanceWindow.startTime).toISOString().slice(0, 16));
            if (settings.maintenanceWindow?.endTime) setEndTime(new Date(settings.maintenanceWindow.endTime).toISOString().slice(0, 16));
            setAutoDisable(settings.autoDisableMaintenance || false);
        }
    }, [settings]);

    if (!isOpen) return null;

    const handleSaveSettings = () => {
        onUpdateSettings({
            maintenanceNotice: notice,
            maintenanceWindow: {
                startTime: startTime ? new Date(startTime) : null,
                endTime: endTime ? new Date(endTime) : null
            },
            autoDisableMaintenance: autoDisable
        });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
            animation: 'modalFadeIn 0.3s ease'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)', width: '90%', maxWidth: '900px', borderRadius: '28px',
                padding: '2.5rem', maxHeight: '95vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255,255,255,0.2)'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <Gear size={32} color="#0047AB" weight="bold" />
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>System Maintenance Protocol</h2>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Advanced orchestration for platform availability and updates.</p>
                    </div>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '14px', cursor: 'pointer' }}>
                        <X size={24} color="#475569" />
                    </button>
                </div>

                {/* Primary Toggle (Emergency Stop / Mode Switch) */}
                <div style={{
                    background: isEnabled ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                    padding: '1.5rem', borderRadius: '20px', border: `1px solid ${isEnabled ? '#fecaca' : '#d1fae5'}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isEnabled ? <Stop size={28} color="#ef4444" weight="fill" /> : <CheckCircle size={28} color="#10b981" weight="fill" />}
                        <div>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isEnabled ? '#991b1b' : '#065f46', display: 'block' }}>
                                Status: {isEnabled ? 'MAINTENANCE MODE ACTIVE' : 'SYSTEM OPERATIONAL'}
                            </span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.7, color: isEnabled ? '#991b1b' : '#065f46' }}>
                                {isEnabled ? 'Non-admin users are currently blocked.' : 'All users have normal access.'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onToggle}
                        style={{
                            padding: '12px 28px', borderRadius: '14px', border: 'none',
                            background: isEnabled ? '#10b981' : '#ef4444',
                            color: 'white', fontWeight: 800, cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: isEnabled ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 4px 12px rgba(239, 68, 68, 0.2)'
                        }}
                    >
                        {isEnabled ? 'Disable Mode' : 'Enable Emergency Mode'}
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Configuration Controls */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <section>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Bell size={20} color="#0047AB" /> Maintenance Notice
                                </h4>
                                <textarea
                                    value={notice}
                                    onChange={(e) => setNotice(e.target.value)}
                                    placeholder="Enter message for non-admin users..."
                                    style={{
                                        width: '100%', height: '80px', padding: '12px', borderRadius: '12px',
                                        border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.9rem',
                                        resize: 'none', outline: 'none'
                                    }}
                                />
                            </section>

                            <section>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={20} color="#0047AB" /> Maintenance Window
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Start Time</label>
                                        <input
                                            type="datetime-local"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '10px',
                                                border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.85rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>End Time (Estimated)</label>
                                        <input
                                            type="datetime-local"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '10px',
                                                border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.85rem'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={autoDisable}
                                        onChange={(e) => setAutoDisable(e.target.checked)}
                                        id="autoDisable"
                                    />
                                    <label htmlFor="autoDisable" style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                                        Auto-disable mode when window expires
                                    </label>
                                </div>
                            </section>

                            <button onClick={handleSaveSettings} style={{
                                width: '100%', padding: '14px', background: '#0f172a', color: 'white',
                                borderRadius: '14px', border: 'none', fontWeight: 800, cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                Save Configuration
                            </button>
                        </div>

                        {/* Guardrails & Info */}
                        <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
                            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>Guardrails & Effects</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <ShieldCheck size={20} color="#0047AB" weight="fill" style={{ flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>Admin Immunity</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
                                            Admins maintain full CRUD access to debug, run migrations, and monitor logs.
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Pulse size={20} color="#f59e0b" weight="fill" style={{ flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>Paused Automations</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
                                            Billing runs, background syncs, and AI workflows are hibernated during maintenance.
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Clock size={20} color="#ef4444" weight="fill" style={{ flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>Session Termination</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
                                            Enabling mode triggers an immediate disconnect for all non-admin socket sessions.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', padding: '1rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <Info size={16} color="#0047AB" />
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0047AB' }}>PRO TIP</span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                                    Notify users 15 minutes before starting maintenance to prevent data loss. The logout is immediate.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <button onClick={onClose} style={{
                        padding: '12px 32px', background: '#f1f5f9', color: '#1e293b',
                        border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer',
                        fontSize: '1rem'
                    }}>
                        Close Governance
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

export default MaintenanceModeModal;
