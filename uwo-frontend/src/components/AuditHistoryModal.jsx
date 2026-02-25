import React from 'react';
import { X, ListBullets, CaretRight } from '@phosphor-icons/react';

const AuditHistoryModal = ({ isOpen, onClose, logs }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                background: 'white', width: '90%', maxWidth: '800px', borderRadius: '24px',
                padding: '2rem', maxHeight: '85vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                        <ListBullets size={32} color="#0047AB" weight="bold" /> Full Audit History
                    </h2>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}>
                        <X size={24} color="#64748b" />
                    </button>
                </div>

                <div style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }}>
                    {logs.map((log, index) => (
                        <div key={index} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '16px 0', borderBottom: index !== logs.length - 1 ? '1px solid #f1f5f9' : 'none'
                        }}>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                                    {log.action} <span style={{ color: '#94a3b8', fontWeight: 400 }}>—</span> {log.user} <span style={{ color: '#94a3b8', fontWeight: 400 }}>—</span> {log.time}
                                </div>
                                <div style={{
                                    display: 'inline-block', marginTop: '6px', padding: '4px 10px',
                                    borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800,
                                    background: log.status === 'Security' ? '#fee2e2' : log.status === 'Finance' ? '#f0fdf4' : '#f0f9ff',
                                    color: log.status === 'Security' ? '#ef4444' : log.status === 'Finance' ? '#22c55e' : '#0ea5e9',
                                }}>
                                    #{log.status.toUpperCase()}
                                </div>
                            </div>
                            <CaretRight size={20} color="#cbd5e1" />
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{
                        padding: '12px 24px', background: '#0047AB', color: 'white',
                        border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer'
                    }}>
                        Close History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditHistoryModal;
