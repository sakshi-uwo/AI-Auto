import React, { useState } from 'react';
import { User, Bell, Palette, ShieldCheck, Database, SlidersHorizontal } from '@phosphor-icons/react';

const Settings = ({ theme: currentTheme, setTheme }) => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: <User size={20} /> },
        { id: 'notifications', label: 'Alert Preferences', icon: <Bell size={20} /> },
        { id: 'appearance', label: 'UI Appearance', icon: <Palette size={20} /> },
        { id: 'security', label: 'Access & Security', icon: <ShieldCheck size={20} /> },
        { id: 'data', label: 'Property Data', icon: <Database size={20} /> },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Personal Information</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--charcoal)', opacity: 0.7 }}>Update your personal details and how others see you.</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>Full Name</label>
                                <input type="text" defaultValue="Alex Rodriguez" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--white)', color: 'var(--text-main)' }} />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>Email Address</label>
                                <input type="email" defaultValue="alex@ai-auto.com" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--white)', color: 'var(--text-main)' }} />
                            </div>
                        </div>
                    </div>
                );
            case 'appearance':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Theme Settings</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--charcoal)', opacity: 0.7 }}>Customize the visual experience for your dashboard.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['Light', 'Dark', 'Glass'].map(t => {
                                const modeKey = t.toLowerCase();
                                const isActive = currentTheme === modeKey;
                                return (
                                    <div
                                        key={t}
                                        onClick={() => setTheme(modeKey)}
                                        style={{
                                            flex: 1, padding: '1.5rem 1rem', borderRadius: '12px',
                                            border: isActive ? '2px solid var(--pivot-blue)' : '2px solid transparent',
                                            background: isActive ? 'var(--pivot-blue-soft)' : 'var(--light-grey)',
                                            cursor: 'pointer', textAlign: 'center',
                                            transition: 'var(--transition)',
                                            boxShadow: isActive ? '0 4px 12px rgba(0, 71, 171, 0.1)' : 'none'
                                        }}
                                    >
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: isActive ? 'var(--pivot-blue)' : 'inherit' }}>{t}</h4>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            default:
                return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--charcoal)' }}>This setting section is coming soon.</div>;
        }
    };

    return (
        <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>System Settings</h1>
                <p style={{ color: 'var(--charcoal)', fontSize: '0.9rem', marginTop: '5px' }}>Configure your AI-AUTO environment and account security.</p>
            </div>

            <div className="card" style={{ flex: 1, display: 'flex', padding: 0, overflow: 'hidden' }}>
                {/* Settings Sidebar */}
                <div style={{ width: '240px', background: 'var(--pivot-blue-soft)', borderRight: '1px solid var(--glass-border)', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {tabs.map(tab => (
                            <div
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 15px', borderRadius: '10px',
                                    cursor: 'pointer', fontSize: '0.9rem', fontWeight: activeTab === tab.id ? 700 : 500,
                                    color: activeTab === tab.id ? 'var(--pivot-blue)' : 'var(--charcoal)',
                                    background: activeTab === tab.id ? 'var(--pivot-blue-soft)' : 'transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {tab.icon}
                                {tab.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Settings Content */}
                <div style={{ flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1 }}>
                        {renderTabContent()}
                    </div>

                    <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--white)', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        <button style={{ padding: '10px 25px', borderRadius: '8px', border: 'none', background: 'var(--pivot-blue)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
