import React, { useState } from 'react';
import { X, CheckCircle, XCircle, ArrowCounterClockwise, Warning, GitDiff, ChatText, Clock } from '@phosphor-icons/react';

const ChangeRequestReviewModal = ({ item, onClose }) => {
    const [decision, setDecision] = useState(null);  // 'approve' | 'reject' | 'revision'
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // Merge passed item with rich defaults — so fields like description/affectedArea/checklist
    // are always populated even when the caller only passes title/category/submittedBy
    const changeRequest = {
        title: 'Curing Checklist - Block A',
        submittedBy: 'Site Engineer — Rahul M.',
        submittedOn: '2026-02-20',
        category: 'Curing',
        description: 'Requesting approval for water curing of concrete slabs in Block A for 14 days as per IS 456:2000 clause 13.5. Curing compound was initially applied but found to be insufficient due to high ambient temperature (>38°C). Extended wet curing is now required to achieve design strength.',
        affectedArea: 'Block A — Ground Floor Slab',
        impactIfNotDone: 'Risk of surface cracks and reduced compressive strength. Estimated strength loss: 15–20% below M25 target.',
        standard: 'IS 456:2000, Clause 13.5',
        checklist: [
            { id: 1, label: 'Water curing arrangement set up', done: true },
            { id: 2, label: 'Hessian cloth placed on surface', done: true },
            { id: 3, label: 'Curing log sheet initiated', done: false },
            { id: 4, label: 'Supervisor sign-off obtained', done: false },
        ],
        // ↑ Spread the caller's item LAST so its fields override defaults where provided
        ...item,
    };

    const handleSubmit = () => {
        if (!decision) return;
        setSubmitted(true);
        setTimeout(() => { onClose(); }, 1800);
    };

    const decisionConfig = {
        approve: { label: 'Approve', color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0', icon: <CheckCircle size={18} weight="fill" /> },
        reject: { label: 'Reject', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: <XCircle size={18} weight="fill" /> },
        revision: { label: 'Request Revision', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', icon: <ArrowCounterClockwise size={18} weight="bold" /> },
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(6px)' }}>
            <div style={{ width: '700px', maxHeight: '90vh', background: 'white', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 64px -12px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <GitDiff size={22} weight="fill" />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>Review Change Request</h2>
                            <p style={{ margin: '2px 0 0', fontSize: '0.77rem', color: '#64748b' }}>Approve, reject, or request revision</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <X size={17} weight="bold" />
                    </button>
                </div>

                {/* Success Banner */}
                {submitted && (
                    <div style={{ padding: '13px 24px', background: '#dcfce7', borderBottom: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '10px', color: '#15803d', fontWeight: 700, fontSize: '0.88rem', flexShrink: 0 }}>
                        <CheckCircle size={20} weight="fill" />
                        Decision submitted — {decisionConfig[decision]?.label} recorded!
                    </div>
                )}

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Title + Meta */}
                    <div>
                        <h3 style={{ margin: '0 0 10px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{changeRequest.title}</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Submitted by', value: changeRequest.submittedBy },
                                { label: 'Date', value: changeRequest.submittedOn },
                                { label: 'Category', value: changeRequest.category },
                            ].map(m => (
                                <div key={m.label}>
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{m.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ChatText size={14} /> Description
                        </div>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>{changeRequest.description}</p>
                    </div>

                    {/* Affected Area & Impact */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', marginBottom: '5px' }}>📍 Affected Area</div>
                            <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600 }}>{changeRequest.affectedArea}</div>
                        </div>
                        <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Warning size={13} weight="fill" /> Impact if Not Actioned
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#991b1b' }}>{changeRequest.impactIfNotDone}</div>
                        </div>
                    </div>

                    {/* Reference Standard */}
                    {changeRequest.standard && (
                        <div style={{ padding: '10px 14px', background: '#faf5ff', borderRadius: '10px', border: '1px solid #ddd6fe', fontSize: '0.82rem', color: '#6d28d9', fontWeight: 600 }}>
                            📋 Standard / Reference: {changeRequest.standard}
                        </div>
                    )}

                    {/* Sub-checklist */}
                    {changeRequest.checklist && (
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={14} /> Checklist Status
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {changeRequest.checklist.map(c => (
                                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', background: c.done ? '#f0fdf4' : '#f8fafc', border: `1px solid ${c.done ? '#bbf7d0' : '#e2e8f0'}` }}>
                                        {c.done
                                            ? <CheckCircle size={18} color="#16a34a" weight="fill" />
                                            : <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1', flexShrink: 0 }} />
                                        }
                                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: c.done ? '#15803d' : '#334155', textDecoration: c.done ? 'none' : 'none' }}>{c.label}</span>
                                        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 700, color: c.done ? '#15803d' : '#94a3b8' }}>{c.done ? 'Done' : 'Pending'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Decision Buttons */}
                    <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>Your Decision</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                            {Object.entries(decisionConfig).map(([key, cfg]) => (
                                <button key={key} onClick={() => setDecision(key)}
                                    style={{
                                        padding: '12px 10px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', transition: 'all 0.2s',
                                        border: decision === key ? `2px solid ${cfg.color}` : '2px solid #e2e8f0',
                                        background: decision === key ? cfg.bg : 'white',
                                        color: decision === key ? cfg.color : '#64748b'
                                    }}>
                                    {cfg.icon} {cfg.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment Box */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '7px' }}>
                            Comments / Notes {decision === 'reject' && <span style={{ color: '#dc2626' }}>*</span>}
                        </label>
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            rows="3"
                            placeholder={
                                decision === 'approve' ? 'Optional remarks for approval...' :
                                    decision === 'reject' ? 'Reason for rejection (required)...' :
                                        decision === 'revision' ? 'Specify what needs to be revised...' :
                                            'Select a decision above, then add your comments...'
                            }
                            style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: `1px solid ${decision ? decisionConfig[decision]?.border || '#e2e8f0' : '#e2e8f0'}`, fontSize: '0.88rem', outline: 'none', resize: 'vertical', lineHeight: '1.5', boxSizing: 'border-box', background: decision ? decisionConfig[decision]?.bg || 'white' : 'white' }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#f8fafc', flexShrink: 0 }}>
                    <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '11px', background: 'white', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!decision || submitted}
                        style={{
                            padding: '10px 24px', borderRadius: '11px', fontWeight: 700, cursor: decision ? 'pointer' : 'not-allowed', border: 'none',
                            background: !decision ? '#e2e8f0' : submitted ? '#15803d' : decision === 'approve' ? '#16a34a' : decision === 'reject' ? '#dc2626' : '#ea580c',
                            color: !decision ? '#94a3b8' : 'white',
                            display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                        }}>
                        {submitted
                            ? <><CheckCircle size={18} weight="fill" /> Submitted!</>
                            : decision ? <>{decisionConfig[decision]?.icon} Submit {decisionConfig[decision]?.label}</> : 'Select a Decision'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeRequestReviewModal;
