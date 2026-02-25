import React from 'react';
import { X, WarningCircle, HardHat, Clock, MapPin, CheckCircle } from '@phosphor-icons/react';

const HazardListModal = ({ hazards, onClose, onResolve }) => {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
        }}>
            <div style={{
                width: '850px', maxHeight: '85vh', background: 'white',
                borderRadius: '24px', display: 'flex', flexDirection: 'column',
                boxShadow: '0 40px 100px rgba(0,0,0,0.3)', overflow: 'hidden',
                animation: 'modalSlideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                {/* Header */}
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff1f1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <WarningCircle size={28} weight="fill" />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#991b1b' }}>All Technical Hazards</h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#b91c1c', opacity: 0.8, fontWeight: 600 }}>Active safety issues requiring engineering resolution</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#fee2e2', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626' }}>
                        <X size={20} weight="bold" />
                    </button>
                </div>

                {/* List Container */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', background: '#fafbfc' }}>
                    {hazards.length === 0 ? (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                            <CheckCircle size={64} weight="duotone" color="#16a34a" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>No Active Hazards</h3>
                            <p>Great work! All reported structural and safety hazards have been resolved.</p>
                        </div>
                    ) : (
                        hazards.map((hazard, idx) => (
                            <div key={hazard._id || idx} style={{
                                background: 'white', borderRadius: '18px', border: '1px solid #fee2e2',
                                padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 200px', gap: '2rem',
                                transition: '0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800,
                                            background: hazard.severity === 'Critical' ? '#dc2626' : (hazard.severity === 'High' ? '#ea580c' : '#f59e0b'),
                                            color: 'white', textTransform: 'uppercase'
                                        }}>{hazard.severity} Risk</span>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                                            Reported: {hazard.reportedDate ? new Date(hazard.reportedDate).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: 800, color: '#1a1a1a' }}>{hazard.hazardType || 'Structural Hazard'}</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#4a5568', lineHeight: 1.5, fontWeight: 500 }}>{hazard.description}</p>

                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                                            <MapPin size={16} /> {hazard.location || 'Main Site'}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                                            <HardHat size={16} /> Reported by: {hazard.reportedBy || 'Site Staff'}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontSize: '0.85rem', fontWeight: 800 }}>
                                        <Clock size={18} /> Due: {hazard.dueDate ? new Date(hazard.dueDate).toLocaleDateString() : 'Immediate'}
                                    </div>
                                    <button
                                        onClick={() => onResolve(hazard._id)}
                                        style={{
                                            width: '100%', padding: '12px', background: '#dc2626', color: 'white',
                                            border: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800,
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            transition: '0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
                                        onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
                                    >
                                        <CheckCircle size={20} weight="fill" /> Resolve Now
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'white' }}>
                    <button onClick={onClose} style={{ padding: '10px 24px', borderRadius: '12px', background: '#f1f5f9', border: 'none', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>Close List</button>
                </div>
            </div>

            <style>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default HazardListModal;
