import React from 'react';
import { X, UserPlus, CheckCircle, Warning, Info, Lock as LockIcon, Globe, ShieldCheck, EnvelopeSimple } from '@phosphor-icons/react';

const PublicRegistrationModal = ({ isOpen, onClose, isEnabled, onToggle }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
            animation: 'modalFadeIn 0.3s ease'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)', width: '90%', maxWidth: '850px', borderRadius: '28px',
                padding: '2.5rem', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255,255,255,0.2)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <UserPlus size={32} color="#0047AB" weight="bold" />
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>Access Governance Protocol</h2>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>This controls who can create an account on the AI-AUTO platform.</p>
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
                        {isEnabled ? <Globe size={24} color="#10b981" weight="fill" /> : <LockIcon size={24} color="#64748b" weight="fill" />}
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: isEnabled ? '#065f46' : '#1e293b' }}>
                            Status: {isEnabled ? 'PUBLIC REGISTRATION ACTIVE' : 'PRIVATE ACCESS ONLY'}
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* ON STATE DETAILS */}
                        <div style={{
                            padding: '1.5rem', borderRadius: '20px', background: isEnabled ? '#f0fdf4' : '#f8fafc',
                            border: `1px solid ${isEnabled ? '#dcfce7' : '#f1f5f9'}`, opacity: isEnabled ? 1 : 0.6
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                <Globe size={24} color="#10b981" />
                                <h4 style={{ margin: 0, fontWeight: 800, color: '#166534' }}>Public Onboarding</h4>
                            </div>
                            <ul style={{ padding: 0, listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    "Anyone can visit the registration page",
                                    "Self-signup enabled for all roles",
                                    "Selection of Client, Engineer, or Manager roles",
                                    "Standard email verification required"
                                ].map((text, i) => (
                                    <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#374151' }}>
                                        <CheckCircle size={18} color="#10b981" weight="fill" style={{ flexShrink: 0 }} />
                                        {text}
                                    </li>
                                ))}
                            </ul>
                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '12px' }}>
                                <h5 style={{ margin: '0 0 8px 0', fontSize: '0.8rem', fontWeight: 800, color: '#166534' }}>ADMIN CONTROLS REMAIN:</h5>
                                <div style={{ fontSize: '0.75rem', color: '#4b5563', lineHeight: '1.4' }}>
                                    All new users are flagged as <strong>Pending Approval</strong>. Admission to the platform still requires explicit Admin authorization.
                                </div>
                            </div>
                        </div>

                        {/* OFF STATE DETAILS */}
                        <div style={{
                            padding: '1.5rem', borderRadius: '20px', background: !isEnabled ? '#fff1f2' : '#f8fafc',
                            border: `1px solid ${!isEnabled ? '#ffe4e6' : '#f1f5f9'}`, opacity: !isEnabled ? 1 : 0.6
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                <ShieldCheck size={24} color="#ef4444" />
                                <h4 style={{ margin: 0, fontWeight: 800, color: '#991b1b' }}>Secured Enterprise</h4>
                            </div>
                            <ul style={{ padding: 0, listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    "No self-signup allowed",
                                    "Registration page hidden/disabled",
                                    "Admins must manually create users",
                                    "Invite-only email workflow enabled"
                                ].map((text, i) => (
                                    <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#374151' }}>
                                        <LockIcon size={18} color="#ef4444" weight="fill" style={{ flexShrink: 0 }} />
                                        {text}
                                    </li>
                                ))}
                            </ul>
                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '12px' }}>
                                <h5 style={{ margin: '0 0 8px 0', fontSize: '0.8rem', fontWeight: 800, color: '#991b1b' }}>IDEAL FOR:</h5>
                                <div style={{ fontSize: '0.75rem', color: '#4b5563', lineHeight: '1.4' }}>
                                    Enterprise environments, high-security projects, or internal testing where external signups pose a risk.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <button onClick={onClose} style={{
                        padding: '12px 32px', background: '#0f172a', color: 'white',
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

export default PublicRegistrationModal;
