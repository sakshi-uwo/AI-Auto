import React, { useState } from 'react';
import axios from 'axios';
import {
    X, ShieldWarning, Warning, MapPin, Camera, Info,
    CaretDown, CheckCircle, Clock, Users, ShieldCheck,
    FileText, VideoCamera, Paperclip, WarningCircle
} from '@phosphor-icons/react';
import { API_BASE_URL } from '../config/api';

const ReportIncidentModal = ({ onClose }) => {
    // Form State
    const [hazardType, setHazardType] = useState('Structural');
    const [severity, setSeverity] = useState('Medium');
    const [description, setDescription] = useState('');
    const [areaZone, setAreaZone] = useState('');
    const [actionsTaken, setActionsTaken] = useState([]);
    const [controlMeasures, setControlMeasures] = useState('Temporary fix');
    const [assignedTo, setAssignedTo] = useState('Safety Officer');
    const [dueDate, setDueDate] = useState('');
    const [complianceStandard, setComplianceStandard] = useState('OSHA');
    const [riskScore, setRiskScore] = useState(50);
    const [loading, setLoading] = useState(false);

    const HAZARD_TYPES = ['Electrical', 'Structural', 'Fire', 'Machinery', 'Chemical', 'Working at Height', 'Excavation', 'Other'];
    const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
    const ACTIONS = ['Area barricaded', 'Work stopped', 'Warning signage placed', 'PPE enforced', 'No action taken yet'];
    const CONTROLS = ['Temporary fix', 'Permanent fix', 'Engineer inspection required', 'Contractor action required'];
    const ASSIGNEES = ['Civil Engineer', 'Safety Officer', 'Contractor'];
    const STANDARDS = ['IS Codes', 'OSHA', 'Company SOP'];

    const handleActionToggle = (action) => {
        setActionsTaken(prev =>
            prev.includes(action) ? prev.filter(a => a !== action) : [...prev, action]
        );
    };

    const handleSubmit = async (e, isDraft = false) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/site-ops/incidents`, {
                title: `${hazardType} Hazard at ${areaZone || 'Site'}`,
                description,
                hazardType,
                severity,
                areaZone,
                actionsTaken,
                controlMeasures,
                assignedTo,
                dueDate,
                complianceStandard,
                riskScore,
                status: isDraft ? 'Draft' : 'Open'
            });
            onClose();
        } catch (error) {
            console.error("Error creating hazard report:", error);
            alert("Failed to subit report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
            padding: '20px'
        }}>
            <div style={{
                background: 'white', width: '100%', maxWidth: '800px', maxHeight: '95vh',
                borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                position: 'relative', border: '1px solid #fee2e2', overflow: 'hidden',
                display: 'flex', flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem 2.5rem', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#fff1f1'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            width: '45px', height: '45px', borderRadius: '14px', background: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626',
                            boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.1)'
                        }}>
                            <ShieldWarning size={28} weight="fill" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#991b1b', margin: 0 }}>Report New Hazard</h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#b91c1c', fontWeight: 600 }}>Site Safety Compliance Form</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        border: 'none', background: 'white', width: '36px', height: '36px',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <X size={20} weight="bold" color="#64748b" />
                    </button>
                </div>

                <div style={{ overflowY: 'auto', padding: '2.5rem' }}>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Section 1: Details */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                                    <WarningCircle size={18} weight="bold" color="#dc2626" /> Hazard Type
                                </label>
                                <select
                                    value={hazardType}
                                    onChange={(e) => setHazardType(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }}
                                >
                                    {HAZARD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                                    <ShieldWarning size={18} weight="bold" color="#dc2626" /> Severity
                                </label>
                                <select
                                    value={severity}
                                    onChange={(e) => setSeverity(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                        background: severity === 'Critical' ? '#fff1f1' : '#f8fafc',
                                        color: severity === 'Critical' ? '#dc2626' : '#1e293b',
                                        fontWeight: 800, outline: 'none'
                                    }}
                                >
                                    {SEVERITIES.map(s => <option key={s} value={s}>{s} {s === 'Critical' ? '⚠️' : ''}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                                    <MapPin size={18} weight="bold" color="#64748b" /> Project Location
                                </label>
                                <input
                                    disabled
                                    value="Downtown Heights - Site A"
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f1f5f9', fontWeight: 600, color: '#64748b' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                                    <MapPin size={18} weight="bold" color="#64748b" /> Site Area / Zone
                                </label>
                                <input
                                    placeholder="e.g. Zone B, Floor 4"
                                    value={areaZone}
                                    onChange={(e) => setAreaZone(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                                <FileText size={18} weight="bold" color="#64748b" /> Description
                            </label>
                            <textarea
                                placeholder="Describe the hazard clearly, what is unsafe and why."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none', resize: 'none', lineHeight: '1.5' }}
                            />
                        </div>

                        {/* Section 2: Evidence */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Evidence Upload</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                <button type="button" style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                    padding: '1.5rem', borderRadius: '16px', border: '2px dashed #e2e8f0',
                                    background: 'white', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s'
                                }}>
                                    <Camera size={24} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Photo</span>
                                </button>
                                <button type="button" style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                    padding: '1.5rem', borderRadius: '16px', border: '2px dashed #e2e8f0',
                                    background: 'white', color: '#64748b', cursor: 'pointer'
                                }}>
                                    <VideoCamera size={24} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Video</span>
                                </button>
                                <button type="button" style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                    padding: '1.5rem', borderRadius: '16px', border: '2px dashed #e2e8f0',
                                    background: 'white', color: '#64748b', cursor: 'pointer'
                                }}>
                                    <Paperclip size={24} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Report</span>
                                </button>
                            </div>
                        </div>

                        {/* Section 3: Action & Controls */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Immediate Action Taken</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {ACTIONS.map(action => (
                                        <label key={action} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={actionsTaken.includes(action)}
                                                onChange={() => handleActionToggle(action)}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                            />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>{action}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Recommended Control</label>
                                <select
                                    value={controlMeasures}
                                    onChange={(e) => setControlMeasures(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none', marginBottom: '1.5rem' }}
                                >
                                    {CONTROLS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>

                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Risk Score (AI Analysis)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={riskScore}
                                        onChange={(e) => setRiskScore(e.target.value)}
                                        style={{ flex: 1, accentColor: riskScore > 70 ? '#dc2626' : riskScore > 40 ? '#f59e0b' : '#16a34a' }}
                                    />
                                    <span style={{
                                        fontSize: '0.9rem', fontWeight: 900, width: '40px',
                                        color: riskScore > 70 ? '#dc2626' : riskScore > 40 ? '#f59e0b' : '#16a34a'
                                    }}>{riskScore}</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Responsibility & Compliance */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                                    <Users size={16} /> Assign To
                                </label>
                                <select
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 700, outline: 'none' }}
                                >
                                    {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                                    <Clock size={16} /> Due Date
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 700, outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                                    <ShieldCheck size={16} /> Standard
                                </label>
                                <select
                                    value={complianceStandard}
                                    onChange={(e) => setComplianceStandard(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 700, outline: 'none' }}
                                >
                                    {STANDARDS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Buttons */}
                <div style={{
                    padding: '1.5rem 2.5rem', borderTop: '1px solid #f1f5f9',
                    display: 'flex', justifyContent: 'flex-end', gap: '1rem',
                    background: 'white'
                }}>
                    <button
                        onClick={() => handleSubmit(null, true)}
                        disabled={loading}
                        style={{
                            padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0',
                            background: 'white', color: '#475569', fontWeight: 700, cursor: 'pointer'
                        }}
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e, false)}
                        disabled={loading}
                        style={{
                            padding: '12px 32px', borderRadius: '12px', border: 'none',
                            background: '#dc2626', color: 'white', fontWeight: 700,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
                        }}
                    >
                        {loading ? 'Submitting...' : (
                            <>
                                <CheckCircle size={20} weight="bold" />
                                Submit & Notify
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};

export default ReportIncidentModal;
