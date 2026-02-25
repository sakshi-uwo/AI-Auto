import React, { useState } from 'react';
import axios from 'axios';
import { X, Notebook, CloudSun, Clock, Camera, PaperPlaneRight } from '@phosphor-icons/react';
import { API_BASE_URL } from '../config/api';

const SiteLogModal = ({ onClose }) => {
    const [logType, setLogType] = useState('general');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/site-ops/logs`, {
                type: logType,
                description,
                timestamp: new Date()
            });
            onClose();
        } catch (error) {
            console.error("Error creating site log:", error);
            alert("Failed to create log. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
            padding: '20px'
        }}>
            <div style={{
                background: 'white', width: '100%', maxWidth: '550px', borderRadius: '24px',
                padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative', animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '20px', right: '20px', border: 'none',
                    background: '#f1f5f9', width: '36px', height: '36px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}>
                    <X size={20} weight="bold" color="#64748b" />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                    <div style={{
                        width: '50px', height: '50px', borderRadius: '15px', background: 'var(--pivot-blue-soft)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pivot-blue)'
                    }}>
                        <Notebook size={28} weight="fill" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>New Site Activity Log</h2>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Downtown Heights • Sector A</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Log Type</label>
                            <select
                                value={logType}
                                onChange={(e) => setLogType(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                    outline: 'none', background: '#f8fafc', fontWeight: 600
                                }}
                            >
                                <option value="general">General Activity</option>
                                <option value="material">Material Receipt</option>
                                <option value="weather">Weather Update</option>
                                <option value="inspection">Inspection Note</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Time of Event</label>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px',
                                background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'
                            }}>
                                <Clock size={18} weight="bold" color="#64748b" />
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Description</label>
                        <textarea
                            required
                            placeholder="Describe what happened on site..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{
                                width: '100%', minHeight: '120px', padding: '15px', borderRadius: '15px',
                                border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none',
                                resize: 'none', fontSize: '0.95rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            padding: '12px', borderRadius: '12px', border: '1px dashed #cbd5e1',
                            background: '#f8fafc', color: '#64748b', fontWeight: 700, cursor: 'pointer'
                        }}>
                            <Camera size={20} weight="bold" /> Add Photo
                        </button>
                        <button type="submit" style={{
                            flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            padding: '12px', borderRadius: '12px', border: 'none',
                            background: 'var(--pivot-blue)', color: 'white', fontWeight: 700,
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 71, 171, 0.2)'
                        }}>
                            <PaperPlaneRight size={20} weight="bold" /> Save Entry
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes modalSlideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SiteLogModal;
