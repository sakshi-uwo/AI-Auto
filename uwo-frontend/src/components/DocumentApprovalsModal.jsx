import React, { useState } from 'react';
import {
    X, CheckCircle, WarningCircle, Clock, FileText, DownloadSimple,
    Funnel, MagnifyingGlass, User, CalendarBlank, Tag, Eye,
    ThumbsUp, ThumbsDown, ArrowCounterClockwise, ShieldCheck, FilePdf, FileImage,
    ChatCircleText, PaperPlaneRight, Trash, Pencil, Bell, Archive, Certificate
} from '@phosphor-icons/react';

const DocumentApprovalsModal = ({ isOpen, onClose, documents = [], project = {} }) => {
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [dateRange, setDateRange] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // Mock functionality for action handlers
    const addNotification = (message, type) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000); // Auto dismiss
    };

    const handleApprove = (docId) => {
        addNotification(`Document ${docId} approved successfully!`, 'success');
        setSelectedDoc(null);
    };

    const handleReject = (docId) => {
        addNotification(`Document ${docId} rejected. Notification sent to submitter.`, 'error');
        setSelectedDoc(null);
    };

    const handleRequestRevision = (docId) => {
        addNotification(`Revision requested for ${docId}. SLA updated.`, 'warning');
        setSelectedDoc(null);
    };

    const handleDownloadCertificate = (docId) => {
        addNotification('Downloading Approval Certificate...', 'info');
    }

    if (!isOpen) return null;

    // --- Data Enrichment (Mocking missing fields for demo) ---
    const enrichedDocs = documents.map((doc, index) => {
        const types = ['Drawing', 'BOQ', 'Material Submittal', 'Method Statement', 'Safety Document', 'Contract'];
        const statuses = ['Approved', 'Pending Approval', 'Rejected', 'Revision Requested'];
        const approvers = ['Client', 'Project Manager', 'Lead Architect', 'Safety Officer'];
        // Mock versions logic
        const version = (index % 3) + 1;

        return {
            ...doc,
            id: doc._id || `doc-${index}`,
            type: doc.type !== 'Site Update' ? doc.type : types[index % types.length],
            status: doc.status !== 'Review' ? doc.status : statuses[index % statuses.length],
            submittedBy: 'Site Engineer',
            approver: approvers[index % approvers.length],
            project: project.name || 'Skyline Towers',
            description: 'Please review the attached document for the upcoming phase.',
            version: `v${version}.0`,
            isLatest: true, // For demo, assume all are latest
            date: doc.date || '2026-02-18',
            history: [
                { action: 'Uploaded', user: 'Site Engineer', date: '2026-02-15 10:00 AM' },
                { action: 'Review Started', user: 'Project Manager', date: '2026-02-16 09:30 AM' },
                ...(doc.status === 'Approved' ? [{ action: 'Approved', user: 'Client', date: '2026-02-18 02:00 PM' }] : [])
            ],
            notes: 'Architectural drawings for the 2nd floor foundation.'
        };
    });

    // --- Filtering ---
    const filteredDocs = enrichedDocs.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || doc.status === filterStatus;
        const matchesType = filterType === 'All' || doc.type === filterType;
        // Mock date filtering logic
        const matchesDate = dateRange === 'All' ? true : true;

        return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    // --- Stats Calculation ---
    // ... existing stats logic ...
    const stats = {
        pending: enrichedDocs.filter(d => d.status === 'Pending Approval').length,
        approved: enrichedDocs.filter(d => d.status === 'Approved').length,
        rejected: enrichedDocs.filter(d => d.status === 'Rejected').length,
        revisions: enrichedDocs.filter(d => d.status === 'Revision Requested').length,
        overdue: enrichedDocs.filter((d, idx) => d.status === 'Pending Approval' && idx % 2 === 0).length // Mock overdue
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return { bg: '#dcfce7', text: '#15803d', icon: <CheckCircle weight="fill" /> };
            case 'Pending Approval': return { bg: '#eff6ff', text: '#1d4ed8', icon: <Clock weight="fill" /> };
            case 'Rejected': return { bg: '#fee2e2', text: '#b91c1c', icon: <WarningCircle weight="fill" /> };
            case 'Revision Requested': return { bg: '#fff7ed', text: '#c2410c', icon: <ArrowCounterClockwise weight="bold" /> };
            default: return { bg: '#f1f5f9', text: '#64748b', icon: <Question weight="fill" /> };
        }
    };

    const getFileIcon = (name) => {
        if (name.endsWith('.pdf')) return <FilePdf size={24} color="#ef4444" weight="duotone" />;
        if (name.match(/\.(jpg|jpeg|png)$/)) return <FileImage size={24} color="#3b82f6" weight="duotone" />;
        return <FileText size={24} color="#64748b" weight="duotone" />;
    };

    // Filter Options
    const docTypes = ['All', 'Drawing', 'BOQ', 'Material Submittal', 'Method Statement', 'Safety Document', 'Contract'];

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px'
        }}>
            {/* Notifications Toast */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 10001 }}>
                {notifications.map(n => (
                    <div key={n.id} style={{
                        padding: '12px 16px', borderRadius: '12px', background: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: `4px solid ${n.type === 'success' ? '#22c55e' : n.type === 'error' ? '#ef4444' : '#3b82f6'}`,
                        display: 'flex', alignItems: 'center', gap: '8px', animation: 'slideInRight 0.3s ease-out'
                    }}>
                        {n.type === 'success' && <CheckCircle size={20} color="#22c55e" weight="fill" />}
                        {n.type === 'error' && <WarningCircle size={20} color="#ef4444" weight="fill" />}
                        {n.type === 'warning' && <ArrowCounterClockwise size={20} color="#f59e0b" weight="bold" />}
                        {n.type === 'info' && <DownloadSimple size={20} color="#3b82f6" weight="bold" />}
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{n.message}</span>
                    </div>
                ))}
            </div>

            <div style={{
                background: '#f8fafc', width: '100%', maxWidth: '1400px', height: '90vh',
                borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e2e8f0',
                position: 'relative'
            }}>
                {/* Header */}
                <div style={{ padding: '24px 32px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Document Approvals</h2>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Manage, review, and audit project documentation</p>
                    </div>
                    <button onClick={onClose} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <X size={20} weight="bold" />
                    </button>
                </div>

                <div style={{ padding: '32px', overflowY: 'auto', flex: 1, display: 'flex', gap: '32px' }}>

                    {/* LEFT LIST PANEL */}
                    <div style={{ flex: selectedDoc ? '1' : '1', transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}>

                        {/* 1. Approval Dashboard (Cards) */}
                        <div style={{ display: 'grid', gridTemplateColumns: selectedDoc ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
                            <StatusCard title="Pending" count={stats.pending} icon={<Clock size={24} weight="fill" />} color="blue" compact={!!selectedDoc} />
                            <StatusCard title="Approved" count={stats.approved} icon={<CheckCircle size={24} weight="fill" />} color="green" compact={!!selectedDoc} />
                            <StatusCard title="Rejected" count={stats.rejected} icon={<WarningCircle size={24} weight="fill" />} color="red" compact={!!selectedDoc} />
                            <StatusCard title="Revisions" count={stats.revisions} icon={<ArrowCounterClockwise size={24} weight="bold" />} color="orange" compact={!!selectedDoc} />
                            <StatusCard title="Overdue" count={stats.overdue} icon={<WarningCircle size={24} weight="fill" />} color="red" alert compact={!!selectedDoc} />
                        </div>

                        {/* Enhanced Toolbar */}
                        <div style={{ background: 'white', borderRadius: '16px 16px 0 0', border: '1px solid #e2e8f0', borderBottom: 'none', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                {/* Status Filters */}
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {['All', 'Pending Approval', 'Approved', 'Revision Requested'].map(status => (
                                        <button key={status} onClick={() => setFilterStatus(status)} style={{
                                            padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600,
                                            border: filterStatus === status ? '1px solid #0f172a' : '1px solid #e2e8f0',
                                            background: filterStatus === status ? '#0f172a' : 'white',
                                            color: filterStatus === status ? 'white' : '#64748b', cursor: 'pointer', transition: 'all 0.2s', flex: selectedDoc ? '1' : 'none'
                                        }}>{status}</button>
                                    ))}
                                </div>
                                <div style={{ position: 'relative', width: selectedDoc ? '100%' : '300px' }}>
                                    <MagnifyingGlass size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 500, outline: 'none' }} />
                                </div>
                            </div>

                            {/* Advanced Filters */}
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                                <Funnel size={16} color="#64748b" />
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Filters:</span>
                                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#334155', fontWeight: 600, outline: 'none', background: 'white' }}>
                                    {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#334155', fontWeight: 600, outline: 'none', background: 'white' }}>
                                    <option value="All">All Time</option>
                                    <option value="Last 7 Days">Last 7 Days</option>
                                    <option value="Last 30 Days">Last 30 Days</option>
                                    <option value="This Month">This Month</option>
                                </select>
                            </div>
                        </div>

                        {/* 2. Document List Table */}
                        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0 0 16px 16px', overflow: 'hidden', flex: 1, overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', position: 'sticky', top: 0, zIndex: 10 }}>
                                        <th style={{ padding: '16px 24px', textAlign: 'left' }}>Document Name</th>
                                        {!selectedDoc && <th style={{ padding: '16px 24px', textAlign: 'left' }}>Type</th>}
                                        {!selectedDoc && <th style={{ padding: '16px 24px', textAlign: 'left' }}>Ver.</th>}
                                        {!selectedDoc && <th style={{ padding: '16px 24px', textAlign: 'left' }}>Submitted By</th>}
                                        <th style={{ padding: '16px 24px', textAlign: 'left' }}>Date</th>
                                        {!selectedDoc && <th style={{ padding: '16px 24px', textAlign: 'left' }}>Assigned Approver</th>}
                                        <th style={{ padding: '16px 24px', textAlign: 'center' }}>Status</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDocs.map((doc, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s', cursor: 'pointer', background: selectedDoc?.id === doc.id ? '#f0f9ff' : 'transparent' }} onClick={() => setSelectedDoc(doc)} className="hover:bg-slate-50">
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    {getFileIcon(doc.name)}
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{doc.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{doc.project}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {!selectedDoc && (
                                                <>
                                                    <td style={{ padding: '16px 24px' }}>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>{doc.type}</span>
                                                    </td>
                                                    <td style={{ padding: '16px 24px' }}>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{doc.version}</span>
                                                    </td>
                                                    <td style={{ padding: '16px 24px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#475569' }}>
                                                                {doc.submittedBy.charAt(0)}
                                                            </div>
                                                            <span style={{ fontSize: '0.9rem', color: '#334155' }}>{doc.submittedBy}</span>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                            <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: '#64748b' }}>{doc.date}</td>
                                            {!selectedDoc && (
                                                <td style={{ padding: '16px 24px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#334155' }}>
                                                        <ShieldCheck size={16} color="#64748b" /> {doc.approver}
                                                    </div>
                                                </td>
                                            )}
                                            <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: getStatusColor(doc.status).bg, color: getStatusColor(doc.status).text }}>
                                                    {getStatusColor(doc.status).icon} {doc.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                <button onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); }} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIGHT DETAIL PANEL */}
                    {selectedDoc && (
                        <div style={{ width: '450px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideIn 0.3s ease-out' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Document Details</h3>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {selectedDoc.status === 'Approved' && (
                                        <button onClick={() => handleDownloadCertificate(selectedDoc.id)} title="Download Approval Certificate" style={{ background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer', padding: '6px', borderRadius: '6px', color: '#3b82f6' }}><Certificate size={18} weight="duotone" /></button>
                                    )}
                                    <button onClick={() => setSelectedDoc(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                                {/* File Preview Mock */}
                                <div style={{ height: '200px', background: '#e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '2px dashed #cbd5e1', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                                        LATEST VERSION ({selectedDoc.version})
                                    </div>
                                    {getFileIcon(selectedDoc.name)}
                                    <div style={{ marginTop: '12px', fontWeight: 600, color: '#475569' }}>Preview Unavailable</div>
                                    <button style={{ marginTop: '8px', padding: '6px 12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <DownloadSimple size={14} /> Download File
                                    </button>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Metadata</h4>
                                    <DetailRow label="Version" value={<span style={{ background: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '4px' }}>{selectedDoc.version}</span>} />
                                    <DetailRow label="Type" value={selectedDoc.type} />
                                    <DetailRow label="Submitted By" value={selectedDoc.submittedBy} />
                                    <DetailRow label="Date" value={selectedDoc.date} />
                                    <DetailRow label="Approver" value={selectedDoc.approver} />
                                </div>

                                <div style={{ marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                                    <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>Submission Notes</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>{selectedDoc.notes}</p>
                                </div>

                                {/* Workflow Timeline (Audit Trail) */}
                                <div style={{ marginBottom: '24px' }}>
                                    <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>Audit Trail & Workflow</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {selectedDoc.history.map((step, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}></div>
                                                    {idx < selectedDoc.history.length - 1 && <div style={{ width: '2px', flex: 1, background: '#e2e8f0', minHeight: '16px' }}></div>}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{step.action}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>by {step.user} • {step.date}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {selectedDoc.status === 'Pending Approval' && (
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #cbd5e1', background: 'white' }}></div>
                                                <div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8' }}>Pending Approval</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>SLA: 2 days remaining</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            {selectedDoc.status !== 'Approved' && (
                                <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', background: 'white' }}>
                                    <textarea placeholder="Add comments or rejection notes..." rows="2" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '12px', fontSize: '0.9rem', outline: 'none', resize: 'none' }}></textarea>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                        <button onClick={() => handleApprove(selectedDoc.id)} style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#16a34a', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                                            <ThumbsUp size={18} weight="bold" /> Approve
                                        </button>
                                        <button onClick={() => handleRequestRevision(selectedDoc.id)} style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#f59e0b', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                                            <ArrowCounterClockwise size={18} weight="bold" /> Revision
                                        </button>
                                        <button onClick={() => handleReject(selectedDoc.id)} style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                                            <ThumbsDown size={18} weight="bold" /> Reject
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            `}</style>
        </div>
    );
};

const DetailRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
        <span style={{ color: '#64748b' }}>{label}</span>
        <span style={{ fontWeight: 600, color: '#1e293b' }}>{value}</span>
    </div>
);

const StatusCard = ({ title, count, icon, color, alert, compact }) => {
    const colors = {
        blue: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: '#3b82f6' },
        green: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', icon: '#22c55e' },
        red: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '#ef4444' },
        orange: { bg: '#fff7ed', border: '#fed7aa', text: '#9a3412', icon: '#f97316' },
    };
    const c = colors[color] || colors.blue;

    return (
        <div style={{
            background: 'white', border: `1px solid ${c.border}`, borderRadius: '16px', padding: compact ? '12px' : '20px',
            display: 'flex', alignItems: 'center', gap: '16px', boxShadow: alert ? '0 4px 6px -1px rgba(239, 68, 68, 0.1)' : 'none',
            flexDirection: compact ? 'column' : 'row', justifyContent: compact ? 'center' : 'flex-start', textAlign: compact ? 'center' : 'left'
        }}>
            <div style={{ padding: '12px', background: c.bg, borderRadius: '12px', color: c.icon }}>{icon}</div>
            <div>
                <div style={{ fontSize: compact ? '1.2rem' : '1.5rem', fontWeight: 800, color: '#0f172a' }}>{count}</div>
                <div style={{ fontSize: compact ? '0.75rem' : '0.85rem', fontWeight: 600, color: '#64748b' }}>{title}</div>
            </div>
        </div>
    );
};

export default DocumentApprovalsModal;
