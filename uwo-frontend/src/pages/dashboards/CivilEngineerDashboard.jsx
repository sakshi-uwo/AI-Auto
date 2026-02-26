import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';
import { authService } from '../../services/api';
import {
    Kanban, Warning, ChartBar, CheckCircle, FilePdf,
    Link, Note, Package, Megaphone, GitDiff,
    ClipboardText, FileText, CaretRight, UploadSimple,
    HardHat, Blueprint, TrendUp, WarningCircle, ArrowsClockwise, Lightning
} from '@phosphor-icons/react';
import RaiseRequestModal from '../../components/RaiseRequestModal';
import UploadDrawingModal from '../../components/UploadDrawingModal';
import QualityChecklistModal from '../../components/QualityChecklistModal';
import ChangeRequestReviewModal from '../../components/ChangeRequestReviewModal';
import BOQModal from '../../components/BOQModal';
import HazardListModal from '../../components/HazardListModal';
import ViewAnalysisModal from '../../components/ViewAnalysisModal';
import GenerateReportModal from '../../components/GenerateReportModal';

const CivilEngineerDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRaiseRequestModal, setShowRaiseRequestModal] = useState(false);
    const [showUploadDrawingModal, setShowUploadDrawingModal] = useState(false);
    const [showChecklistModal, setShowChecklistModal] = useState(false);
    const [reviewItem, setReviewItem] = useState(null);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);
    const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mock data for new features
    const [drawings] = useState([
        { id: 1, name: 'Foundation_Plan_A1.pdf', project: 'Skyline Towers', date: '2025-02-15', status: 'Approved' },
        { id: 2, name: 'Structural_Column_B2.dwg', project: 'Green Valley', date: '2025-02-16', status: 'Pending Review' },
    ]);

    const [boqItems, setBoqItems] = useState([
        { id: 1, item: 'Cement (Grade 53)', category: 'Binding', quantity: '500', unit: 'Bags', unitRate: '$9', budget: '$4,500', status: 'On Track', vendor: 'ACC Ltd.' },
        { id: 2, item: 'Steel Reinforcement', category: 'Structural', quantity: '20', unit: 'Tons', unitRate: '$900', budget: '$18,000', status: 'Review Needed', vendor: 'TATA Steel' },
    ]);
    const [showBOQModal, setShowBOQModal] = useState(false);
    const [showAddMaterial, setShowAddMaterial] = useState(false);
    const [newMaterial, setNewMaterial] = useState({ item: '', quantity: '', unit: 'Kgs', budget: '' });
    const [showHazardsModal, setShowHazardsModal] = useState(false);

    const [structuralNotes, setStructuralNotes] = useState([
        { id: 1, title: 'Beam Reinforcement Update', date: '2025-02-17', urgency: 'High' },
        { id: 2, title: 'Soil Test Results - Plot 4', date: '2025-02-16', urgency: 'Medium' },
    ]);
    const [showAddNote, setShowAddNote] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', date: '', urgency: 'Medium' });

    useEffect(() => {
        fetchData();

        socketService.on('project-added', (newProject) => {
            setProjects(prev => [newProject, ...prev]);
        });
        socketService.on('project-updated', (updatedProject) => {
            setProjects(prev => prev.map(p => p._id === updatedProject._id ? updatedProject : p));
        });
        socketService.on('incidentReported', (newIncident) => {
            setIncidents(prev => [newIncident, ...prev]);
        });
        socketService.on('supportUpdated', (updatedRequest) => {
            setRequests(prev => {
                const index = prev.findIndex(r => r._id === updatedRequest._id);
                if (index !== -1) {
                    const newRequests = [...prev];
                    newRequests[index] = updatedRequest;
                    return newRequests;
                }
                return [updatedRequest, ...prev];
            });
        });

        return () => {
            socketService.off('project-added');
            socketService.off('project-updated');
            socketService.off('incidentReported');
            socketService.off('supportUpdated');
        };
    }, []);

    const fetchData = async () => {
        try {
            const user = authService.getCurrentUser();
            const userId = user?._id || user?.id;
            const [projectsRes, incidentsRes, requestsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/projects`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/site-ops/incidents`).catch(() => ({ data: [] })),
                userId ? axios.get(`${API_BASE_URL}/support/user/${userId}`).catch(() => ({ data: [] })) : { data: [] }
            ]);
            setProjects(projectsRes.data || []);
            setIncidents(incidentsRes.data || []);
            setRequests(requestsRes.data || []);
        } catch (error) {
            console.error("Error fetching civil engineer data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolveHazard = async (id) => {
        // Optimistic update
        setIncidents(prev => prev.filter(i => (i._id || i.id) !== id));
        // Note: Real API call omitted for simulation, but would be:
        // await axios.patch(`${API_BASE_URL}/site-ops/incidents/${id}`, { status: 'Closed' });
    };

    const handleRaiseRequest = async (requestData) => {
        const user = authService.getCurrentUser();
        const userId = user?._id || user?.id;
        const payload = {
            title: requestData.title,
            issueType: requestData.requestType,
            // message is required in DB - use fallback so Draft with empty message works
            message: requestData.message?.trim() || `[${requestData.status}] ${requestData.title || requestData.requestType}`,
            userId: userId,
            email: user?.email,
            projectName: projects.find(p => p._id === requestData.projectId)?.name || '',
            category: 'Technical',
            priority: requestData.priority,
            location: requestData.location,
            relatedTo: requestData.relatedTask,
            // pass real base64 file data from the modal
            attachments: (requestData.attachments || []).map(a => a.name || a),
            standardsReference: requestData.standardsReference,
            requestedAction: requestData.requestedAction,
            assignTo: requestData.assignTo,
            expectedTimeline: requestData.expectedTimeline,
            impactIfDelayed: requestData.impactIfDelayed,
            status: requestData.status
        };

        // Throw on error so the modal can catch and display it
        const res = await axios.post(`${API_BASE_URL}/support`, payload);
        setShowRaiseRequestModal(false);
        fetchData(); // Refresh the requests list
        return res;
    };


    const StatusBadge = ({ status }) => {
        const colors = {
            'Approved': '#16a34a',
            'Under Review': '#ea580c',
            'Submitted': '#0284c7',
            'Actioned': '#7c3aed',
            'Rejected': '#dc2626',
            'Draft': '#64748b',
            'On Track': '#0284c7',
            'Review Needed': '#dc2626',
            'Completed': '#059669',
            'Active': '#0284c7'
        };
        const bgColors = {
            'Approved': '#dcfce7',
            'Under Review': '#ffedd5',
            'Submitted': '#e0f2fe',
            'Actioned': '#f3e8ff',
            'Rejected': '#fee2e2',
            'Draft': '#f1f5f9',
            'On Track': '#e0f2fe',
            'Review Needed': '#fee2e2',
            'Completed': '#d1fae5',
            'Active': '#e0f2fe'
        };
        return (
            <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: bgColors[status] || '#f3f4f6',
                color: colors[status] || '#4b5563'
            }}>
                {status}
            </span>
        );
    };

    const FeatureCard = ({ title, icon, children, action, onAction }) => (
        <div className="dashboard-card" style={{
            background: 'white',
            padding: isMobile ? '1rem' : '1.5rem',
            borderRadius: '20px',
            border: '1px solid #f0f0f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '1.2rem', gap: isMobile ? '10px' : '0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: '#1a1a1a', margin: 0, flexWrap: 'wrap' }}>
                    {icon}
                    <span style={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>{title}</span>
                </h3>
                {action && (
                    <button
                        onClick={onAction}
                        style={{
                            background: 'transparent', border: 'none', color: 'var(--pivot-blue)',
                            fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
                        }}
                    >
                        {action}
                    </button>
                )}
            </div>
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );

    const renderActivityHeatmap = () => {
        const today = new Date();
        const days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            return d;
        }).reverse(); // Show oldest first

        const activityLevels = days.map(() => Math.floor(Math.random() * 5)); // 0-4 levels

        const getColor = (level) => {
            switch (level) {
                case 0: return '#ebedf0'; // No activity
                case 1: return '#9be9a8'; // Low
                case 2: return '#40c463'; // Medium
                case 3: return '#30a14e'; // High
                case 4: return '#216e39'; // Very High
                default: return '#ebedf0';
            }
        };

        return (
            <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '100%' }}>
                {days.map((day, index) => (
                    <div
                        key={index}
                        title={`${day.toLocaleDateString()}: Level ${activityLevels[index]}`}
                        style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: getColor(activityLevels[index]),
                            borderRadius: '2px',
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div style={{ padding: isMobile ? '1rem 0.5rem' : '2rem', maxWidth: '1600px', margin: '0 auto', fontFamily: 'Inter, sans-serif', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', marginBottom: '3rem', background: 'white', padding: isMobile ? '1rem' : '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)', gap: '1rem' }}>
                <div style={{ width: isMobile ? '100%' : 'auto', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>
                            Civil Engineer Dashboard
                        </h1>
                    </div>
                    <p style={{ fontSize: '1rem', color: '#64748b', marginTop: '8px', fontWeight: 500, maxWidth: '600px', lineHeight: 1.5 }}>
                        Manage structural integrity, site compliance, and technical reporting for active project sites.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
                        <button
                            onClick={() => setShowRaiseRequestModal(true)}
                            className="action-btn"
                            style={{ background: '#2563eb', color: 'white', padding: '12px 24px', height: 'auto', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
                        >
                            <Megaphone size={20} weight="bold" /> Raise Request
                        </button>
                        <button
                            className="action-btn"
                            onClick={() => setShowUploadDrawingModal(true)}
                            style={{ background: 'white', border: '1px solid #e2e8f0', color: '#1e293b', padding: '12px 24px', height: 'auto', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
                        >
                            <UploadSimple size={20} weight="bold" /> Upload Drawing
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {[
                    { label: 'Assigned Projects', value: projects.length, icon: <Blueprint size={32} weight="duotone" color="#2563eb" />, bg: '#eff6ff' },
                    { label: 'Pending Drawings', value: '4', icon: <FilePdf size={32} weight="duotone" color="#dc2626" />, bg: '#fef2f2' },
                    { label: 'Open Issues', value: incidents.length, icon: <Warning size={32} weight="duotone" color="#ea580c" />, bg: '#fff7ed' },
                    { label: 'Reports Due', value: '2', icon: <ClipboardText size={32} weight="duotone" color="#16a34a" />, bg: '#f0fdf4' }
                ].map((stat, i) => (
                    <div key={i} className="dashboard-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ width: '56px', height: '56px', background: stat.bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid Layout */}
            <div className="dashboard-main-grid" style={{ display: 'grid', gap: '2rem' }}>

                {/* 1. View Assigned Projects */}
                <div className="dashboard-span-2">
                    <FeatureCard
                        title="Assigned Projects Status"
                        icon={<Kanban size={24} color="var(--pivot-blue)" weight="fill" />}
                        action="View All Projects"
                    >
                        {projects.length === 0 && !loading ? (
                            <div style={{ textAlign: 'center', padding: isMobile ? '2rem 1rem' : '3rem', color: '#9ca3af', background: '#f8fafc', borderRadius: '16px' }}>
                                <Blueprint size={40} weight="duotone" />
                                <p style={{ marginTop: '1rem', fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1rem' }}>No active projects assigned.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
                                {projects.slice(0, 4).map(p => (
                                    <div key={p._id} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '18px', border: '1px solid #e2e8f0', transition: 'all 0.2s' }} className="project-sub-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{p.name}</div>
                                            <StatusBadge status={p.status || 'Active'} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                            <div style={{ flex: 1, minWidth: 0, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: '65%', height: '100%', background: '#2563eb', borderRadius: '4px' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>65%</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                                <HardHat size={16} weight="bold" color="#2563eb" /> {p.engineer || 'Er. Rajesh Kumar'}
                                            </div>
                                            <button style={{ border: 'none', background: 'transparent', color: '#2563eb', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>Details →</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </FeatureCard>
                </div>

                {/* 2. Upload / Review Drawings */}
                <FeatureCard
                    title="Drawing Reviews"
                    icon={<FilePdf size={24} color="#dc2626" weight="fill" />}
                    action="Upload New"
                    onAction={() => setShowUploadDrawingModal(true)}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {drawings.map(d => (
                            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ padding: '8px', background: '#fee2e2', borderRadius: '8px', color: '#dc2626' }}>
                                    <FilePdf size={20} weight="fill" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', wordBreak: 'break-word' }}>{d.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-word' }}>{d.project} • {d.date}</div>
                                </div>
                                <StatusBadge status={d.status} />
                            </div>
                        ))}
                    </div>
                </FeatureCard>

                {/* 3. BOQ Management & 5. Material Specifications */}
                <FeatureCard
                    title="BOQ & Material Specs"
                    icon={<Package size={24} color="#059669" weight="fill" />}
                    action="Full BOQ"
                    onAction={() => setShowBOQModal(true)}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {boqItems.slice(0, 3).map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #dcfce7', flexWrap: 'wrap', gap: '10px' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, color: '#065f46', fontSize: '0.88rem', wordBreak: 'break-word' }}>{item.item}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#059669', wordBreak: 'break-word' }}>{item.quantity} {item.unit} • {item.budget}</div>
                                </div>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '8px', background: item.status === 'On Track' ? '#dcfce7' : '#fee2e2', color: item.status === 'On Track' ? '#15803d' : '#dc2626' }}>{item.status}</span>
                            </div>
                        ))}

                        {/* Inline Add Material Spec */}
                        {showAddMaterial ? (
                            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '10px', border: '2px dashed #86efac', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <input autoFocus type="text" placeholder="Material name *" value={newMaterial.item}
                                    onChange={e => setNewMaterial(p => ({ ...p, item: e.target.value }))}
                                    style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1fae5', fontSize: '0.83rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                                    <input type="text" placeholder="Qty (e.g. 50)" value={newMaterial.quantity}
                                        onChange={e => setNewMaterial(p => ({ ...p, quantity: e.target.value }))}
                                        style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1fae5', fontSize: '0.83rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                                    <select value={newMaterial.unit} onChange={e => setNewMaterial(p => ({ ...p, unit: e.target.value }))}
                                        style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1fae5', fontSize: '0.83rem', outline: 'none', background: 'white' }}>
                                        {['Bags', 'Tons', 'Kgs', 'Nos', 'Cu.Ft', 'Ltrs', 'Sq.Ft', 'Rmt'].map(u => <option key={u}>{u}</option>)}
                                    </select>
                                    <input type="text" placeholder="Budget ($)" value={newMaterial.budget}
                                        onChange={e => setNewMaterial(p => ({ ...p, budget: e.target.value }))}
                                        style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #d1fae5', fontSize: '0.83rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => { setShowAddMaterial(false); setNewMaterial({ item: '', quantity: '', unit: 'Kgs', budget: '' }); }}
                                        style={{ padding: '6px 14px', borderRadius: '8px', background: '#f1f5f9', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', color: '#475569' }}>Cancel</button>
                                    <button onClick={() => {
                                        if (!newMaterial.item.trim()) return;
                                        setBoqItems(prev => [...prev, { id: Date.now(), item: newMaterial.item, quantity: newMaterial.quantity, unit: newMaterial.unit, budget: newMaterial.budget || '—', status: 'Pending', category: 'Other', unitRate: '', vendor: '' }]);
                                        setNewMaterial({ item: '', quantity: '', unit: 'Kgs', budget: '' });
                                        setShowAddMaterial(false);
                                    }} style={{ padding: '6px 14px', borderRadius: '8px', background: '#059669', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>Add</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setShowAddMaterial(true)}
                                style={{ width: '100%', marginTop: 'auto', padding: '10px', background: 'white', border: '1px dashed #059669', color: '#059669', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                                + Add Material Spec
                            </button>
                        )}
                    </div>
                </FeatureCard>

                {/* 4. Structural Notes & 6. Site Instructions */}
                <FeatureCard
                    title="Structural Notes & Instructions"
                    icon={<Note size={24} color="#d97706" weight="fill" />}
                    action={showAddNote ? '✕ Cancel' : '+ Add Note'}
                    onAction={() => {
                        setShowAddNote(prev => !prev);
                        setNewNote({ title: '', date: '', urgency: 'Medium' });
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {structuralNotes.map(note => (
                            <div key={note.id} style={{ padding: '12px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fcd34d' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ fontWeight: 700, color: '#92400e', fontSize: '0.9rem' }}>{note.title}</span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: note.urgency === 'High' ? '#dc2626' : '#d97706' }}>{note.urgency}</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#b45309', margin: 0 }}>Review required by {note.date}</p>
                            </div>
                        ))}

                        {/* Inline Add Note Form */}
                        {showAddNote && (
                            <div style={{ padding: '14px', background: '#fefce8', borderRadius: '12px', border: '2px dashed #fcd34d', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Note title / description..."
                                    value={newNote.title}
                                    onChange={e => setNewNote(p => ({ ...p, title: e.target.value }))}
                                    style={{ padding: '9px 12px', borderRadius: '9px', border: '1px solid #fcd34d', fontSize: '0.85rem', outline: 'none', width: '100%', boxSizing: 'border-box', background: 'white' }}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>Review Date</label>
                                        <input
                                            type="date"
                                            value={newNote.date}
                                            onChange={e => setNewNote(p => ({ ...p, date: e.target.value }))}
                                            style={{ width: '100%', padding: '8px 10px', borderRadius: '9px', border: '1px solid #fcd34d', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>Urgency</label>
                                        <select
                                            value={newNote.urgency}
                                            onChange={e => setNewNote(p => ({ ...p, urgency: e.target.value }))}
                                            style={{ width: '100%', padding: '8px 10px', borderRadius: '9px', border: '1px solid #fcd34d', fontSize: '0.82rem', outline: 'none', background: 'white' }}
                                        >
                                            <option value="High">🔴 High</option>
                                            <option value="Medium">🟠 Medium</option>
                                            <option value="Low">🟢 Low</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!newNote.title.trim()) return;
                                        setStructuralNotes(prev => [
                                            ...prev,
                                            { id: Date.now(), title: newNote.title.trim(), date: newNote.date || 'TBD', urgency: newNote.urgency }
                                        ]);
                                        setNewNote({ title: '', date: '', urgency: 'Medium' });
                                        setShowAddNote(false);
                                    }}
                                    style={{ padding: '9px', borderRadius: '9px', background: '#d97706', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                    Save Note
                                </button>
                            </div>
                        )}

                        <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Megaphone size={20} color="#2563eb" />
                            <div>
                                <div style={{ fontWeight: 600, color: '#1e40af', fontSize: '0.9rem' }}>Latest Site Instruction</div>
                                <div style={{ fontSize: '0.75rem', color: '#1e3a8a' }}>Strictly follow mix design M25 for Slab 2.</div>
                            </div>
                        </div>
                    </div>
                </FeatureCard>

                {/* 7. Change Requests & 8. Quality Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <FeatureCard
                        title="Change Requests & Quality"
                        icon={<GitDiff size={24} color="#7c3aed" weight="fill" />}
                        action="Checklist"
                        onAction={() => setShowChecklistModal(true)}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle size={18} color="#7c3aed" weight="bold" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, wordBreak: 'break-word' }}>Curing Checklist - Block A</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Submitted today</div>
                                </div>
                                <button
                                    onClick={() => setReviewItem({ title: 'Curing Checklist - Block A', category: 'Curing', submittedBy: 'Site Engineer', submittedOn: '2026-02-20' })}
                                    style={{ padding: '4px 10px', fontSize: '0.72rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
                                >
                                    Review
                                </button>
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard
                        title="Hazards Needing Tech. Resolution"
                        icon={<WarningCircle size={24} color="#dc2626" weight="fill" />}
                        action="View All"
                        onAction={() => setShowHazardsModal(true)}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {incidents.filter(i => i.status !== 'Closed').length === 0 ? (
                                <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '1rem' }}>No technical hazards reported.</p>
                            ) : incidents.filter(i => i.status !== 'Closed').slice(0, 2).map(incident => (
                                <div key={incident._id} style={{ padding: '12px', background: '#fff1f1', borderRadius: '12px', borderLeft: '4px solid #dc2626' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b' }}>{incident.hazardType || 'General Hazard'}</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dc2626' }}>{incident.severity}</span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#b91c1c', margin: '0 0 8px 0', lineHeight: 1.4 }}>{incident.description}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: 600 }}>Due: {incident.dueDate ? new Date(incident.dueDate).toLocaleDateString() : 'ASAP'}</span>
                                        <button style={{ padding: '4px 10px', background: 'white', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>Resolve</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FeatureCard>
                </div>

                {/* 10. Requests Tracking & History */}
                <div className="dashboard-span-3">
                    <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Megaphone size={22} color="#2563eb" weight="fill" />
                                My Raised Requests
                            </h3>
                            <button
                                onClick={() => setShowRaiseRequestModal(true)}
                                style={{ padding: '8px 16px', borderRadius: '10px', background: '#2563eb', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Megaphone size={16} weight="bold" /> + Raise New Request
                            </button>
                        </div>
                        {requests.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                <Megaphone size={40} weight="duotone" color="#cbd5e1" />
                                <p style={{ marginTop: '1rem', fontWeight: 600 }}>No requests raised yet.</p>
                                <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Click "Raise Request" to submit your first technical request.</p>
                            </div>
                        ) : (
                            <div className="table-wrapper" style={{ overflowX: 'auto', maxWidth: '100%' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                            {['Request ID', 'Title', 'Type', 'Assign To', 'Priority', 'Required By', 'Status', 'History'].map(h => (
                                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((req, i) => (
                                            <tr key={req._id} className="request-row" style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa', transition: 'all 0.2s' }}>
                                                <td style={{ padding: '16px', fontWeight: 800, color: '#2563eb', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                                    #{req.requestId?.slice(-6) || '—'}
                                                </td>
                                                <td style={{ padding: '16px', maxWidth: '280px' }}>
                                                    <div style={{ fontWeight: 800, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.title}</div>
                                                    {req.projectName && <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>{req.projectName}</div>}
                                                </td>
                                                <td style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>{req.issueType || '—'}</td>
                                                <td style={{ padding: '16px', color: '#475569', fontWeight: 600 }}>{req.assignTo || '—'}</td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{
                                                        padding: '4px 12px', borderRadius: '20px', fontWeight: 800, fontSize: '0.72rem',
                                                        background: req.priority === 'Critical' ? '#fef2f2' : req.priority === 'High' ? '#fff7ed' : '#f0fdf4',
                                                        color: req.priority === 'Critical' ? '#dc2626' : req.priority === 'High' ? '#ea580c' : '#16a34a',
                                                        border: `1px solid ${req.priority === 'Critical' ? '#fee2e2' : req.priority === 'High' ? '#ffedd5' : '#dcfce7'}`
                                                    }}>{req.priority}</span>
                                                </td>
                                                <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>
                                                    {req.expectedTimeline ? new Date(req.expectedTimeline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    <StatusBadge status={req.status} />
                                                </td>
                                                <td style={{ padding: '16px' }}>
                                                    {req.approvalHistory && req.approvalHistory.length > 0 ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            {req.approvalHistory.slice(-1).map((h, idx) => (
                                                                <div key={idx} style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', gap: '6px', alignItems: 'center', fontWeight: 600 }}>
                                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb' }}></div>
                                                                    <span>{h.status} by {h.actor}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>No history</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* 11. Activity Intensity Heatmap */}
                <div className="dashboard-span-3">
                    <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Lightning size={22} color="#fbbf24" weight="fill" />
                                Site Activity Intensity (Heatmap)
                            </h3>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ width: '10px', height: '10px', background: '#f1f5f9', borderRadius: '2px' }}></span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>Idle</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ width: '10px', height: '10px', background: '#2563eb', borderRadius: '2px' }}></span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>Active</span>
                                </div>
                                <select style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 700 }}>
                                    <option>Last 14 Days</option>
                                    <option>Phase: Foundation</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto', paddingBottom: '10px', maxWidth: '100%' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, minmax(40px, 1fr))', gap: '10px', minWidth: 'max-content' }}>
                                {Array.from({ length: 14 }).map((_, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                                            {Array.from({ length: 5 }).map((_, j) => {
                                                const active = Math.random() > 0.4;
                                                const intensity = Math.random();
                                                return (
                                                    <div
                                                        key={j}
                                                        style={{
                                                            height: '24px',
                                                            borderRadius: '4px',
                                                            background: active ? `rgba(37, 99, 235, ${0.4 + intensity * 0.6})` : '#f1f5f9',
                                                            border: active ? '1px solid rgba(255,255,255,0.2)' : 'none',
                                                            cursor: 'pointer'
                                                        }}
                                                        title={`Activity Block ${j + 1}, Day ${i + 1}`}
                                                    ></div>
                                                );
                                            })}
                                        </div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', textAlign: 'center' }}>D{14 - i}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>
                                Visualizing workforce and equipment engagement across Block A to Block E.
                            </div>
                        </div>
                    </div>
                </div>

                {/* 9. Engineer Reports */}
                <div className="dashboard-span-3">
                    <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '20px', color: 'white', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '1.5rem' : '0', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FileText size={24} weight="duotone" />
                                Engineer Reports & Analytics
                            </h3>
                            <p style={{ color: '#94a3b8', margin: 0, maxWidth: '600px', fontSize: '0.9rem' }}>
                                Generate comprehensive daily, weekly, and milestone reports. Track structural health, material consumption, and workforce efficiency.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', width: isMobile ? '100%' : 'auto' }}>
                            <button
                                onClick={() => setShowAnalysisModal(true)}
                                style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
                            >
                                Analysis <ChartBar size={18} />
                            </button>
                            <button
                                onClick={() => setShowGenerateReportModal(true)}
                                style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--pivot-blue)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
                            >
                                Report <CaretRight size={18} weight="bold" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                .action-btn {
                    padding: 10px 20px;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border: none;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .dashboard-card {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                }
                .dashboard-card:hover {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03);
                    transform: translateY(-4px);
                }
                .project-sub-card:hover {
                    background: white !important;
                    border-color: #2563eb !important;
                    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.1);
                }
                .request-row:hover {
                    background: #f0f7ff !important;
                }
                .dashboard-card-header-inner {
                    flex: 1;
                    min-width: 0;
                    word-break: break-word;
                }
                .dashboard-main-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
                .dashboard-span-2 {
                    grid-column: span 2;
                    min-width: 0;
                }
                .dashboard-span-3 {
                    grid-column: span 3;
                    min-width: 0;
                }
                @media (max-width: 1024px) {
                    .dashboard-main-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .dashboard-span-2, .dashboard-span-3 {
                        grid-column: span 2;
                    }
                }
                @media (max-width: 768px) {
                    .dashboard-main-grid {
                        grid-template-columns: 1fr;
                    }
                    .dashboard-span-2, .dashboard-span-3 {
                        grid-column: span 1;
                    }
                    .dashboard-card {
                        padding: 1rem !important;
                    }
                }
            `}</style>
            {showRaiseRequestModal && (
                <RaiseRequestModal
                    onClose={() => setShowRaiseRequestModal(false)}
                    onSave={handleRaiseRequest}
                    projects={projects}
                />
            )}
            {showUploadDrawingModal && (
                <UploadDrawingModal
                    onClose={() => setShowUploadDrawingModal(false)}
                    projects={projects}
                    onSuccess={() => fetchData()}
                />
            )}
            {showChecklistModal && (
                <QualityChecklistModal
                    onClose={() => setShowChecklistModal(false)}
                />
            )}
            {reviewItem && (
                <ChangeRequestReviewModal
                    item={reviewItem}
                    onClose={() => setReviewItem(null)}
                />
            )}
            {showBOQModal && (
                <BOQModal
                    onClose={() => setShowBOQModal(false)}
                    initialItems={boqItems}
                    onSave={(updatedItems) => { setBoqItems(updatedItems); setShowBOQModal(false); }}
                />
            )}
            {showHazardsModal && (
                <HazardListModal
                    hazards={incidents.filter(i => i.status !== 'Closed')}
                    onClose={() => setShowHazardsModal(false)}
                    onResolve={handleResolveHazard}
                />
            )}
            {showAnalysisModal && (
                <ViewAnalysisModal
                    onClose={() => setShowAnalysisModal(false)}
                    projects={projects}
                />
            )}
            {showGenerateReportModal && (
                <GenerateReportModal
                    onClose={() => setShowGenerateReportModal(false)}
                    projects={projects}
                />
            )}
        </div>
    );
};

export default CivilEngineerDashboard;
