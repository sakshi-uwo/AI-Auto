import React, { useState, useEffect } from 'react';
import {
    HardHat, Users, CheckCircle, Clock,
    ArrowRight, MapPin, ChartBar, Plus,
    UsersThree, TrendUp, ClipboardText, Notebook,
    ListChecks, Calendar, WarningCircle, Monitor,
    ShieldWarning, Package, FileArrowUp, VideoCamera,
    Camera, PaperPlaneRight, CloudSun, UploadSimple,
    CaretRight, CheckSquare, ImageSquare, PlayCircle, X,
    PencilLine, FloppyDisk
} from '@phosphor-icons/react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';
import SiteLogModal from '../../components/SiteLogModal';
import ReportIncidentModal from '../../components/ReportIncidentModal';
import RecordUsageModal from '../../components/RecordUsageModal';

const ProjectSiteDashboard = ({ setCurrentPage }) => {
    const [showSiteLogModal, setShowSiteLogModal] = useState(false);
    const [showIncidentModal, setShowIncidentModal] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isEditingIncident, setIsEditingIncident] = useState(false);
    const [editIncidentData, setEditIncidentData] = useState({});
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [mediaType, setMediaType] = useState('photo');
    const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
    const [mediaUrl, setMediaUrl] = useState('');
    const [dailyTasks, setDailyTasks] = useState([]);
    const [attStats, setAttStats] = useState({ totalWorkers: 0, present: 0 });
    const [materialUsage, setMaterialUsage] = useState([]);
    const [showUsageModal, setShowUsageModal] = useState(false);
    const [siteLogs, setSiteLogs] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [quickLog, setQuickLog] = useState('');
    const [isSavingLog, setIsSavingLog] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();

        socketService.on('taskUpdated', (task) => setDailyTasks(prev => prev.map(t => t._id === task._id ? task : t)));
        socketService.on('materialUpdated', (material) => setMaterialUsage(prev => prev.map(m => m._id === material._id ? material : m)));
        socketService.on('attendanceUpdated', fetchAllData);
        socketService.on('siteLogAdded', (newLog) => setSiteLogs(prev => [newLog, ...prev]));
        socketService.on('incidentReported', (newIncident) => setIncidents(prev => [newIncident, ...prev]));

        return () => {
            socketService.off('taskUpdated');
            socketService.off('materialUpdated');
            socketService.off('attendanceUpdated');
            socketService.off('siteLogAdded');
            socketService.off('incidentReported');
        };
    }, []);

    const fetchAllData = async () => {
        try {
            const [tasksRes, materialsRes, logsRes, incidentsRes, attStatsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/tasks`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/materials`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/site-ops/logs`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/site-ops/incidents`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/attendance/stats`).catch(() => ({ data: { totalWorkers: 0, present: 0 } }))
            ]);

            setDailyTasks(tasksRes.data || []);
            setMaterialUsage(materialsRes.data || []);
            setSiteLogs(logsRes.data || []);
            setIncidents(incidentsRes.data || []);
            setAttStats(attStatsRes.data);
        } catch (error) {
            console.error('Error fetching site data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLog = async () => {
        if (!quickLog.trim()) return;
        setIsSavingLog(true);
        try {
            await axios.post(`${API_BASE_URL}/site-ops/logs`, {
                type: 'general',
                description: quickLog,
                timestamp: new Date()
            });
            setQuickLog('');
        } catch (error) {
            console.error("Failed to save log:", error);
            alert("Failed to save log.");
        } finally {
            setIsSavingLog(false);
        }
    };

    const handleMediaUpload = async (e) => {
        e.preventDefault();
        if (!mediaUrl) return;

        try {
            if (uploadMode === 'file' && typeof mediaUrl === 'object') {
                const formData = new FormData();
                formData.append('files', mediaUrl);
                formData.append('type', 'general');
                formData.append('description', `Progress ${mediaType === 'photo' ? 'Photo' : 'Video'} Uploaded`);

                await axios.post(`${API_BASE_URL}/upload/media`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // URL Upload
                await axios.post(`${API_BASE_URL}/site-ops/logs`, {
                    type: 'general',
                    description: `Progress ${mediaType === 'photo' ? 'Photo' : 'Video'} Link Added`,
                    photos: mediaType === 'photo' ? [mediaUrl] : [],
                    videos: mediaType === 'video' ? [mediaUrl] : [],
                    timestamp: new Date()
                });
            }

            setShowMediaModal(false);
            setMediaUrl('');
            alert("Media added successfully!");
        } catch (error) {
            console.error("Error uploading media:", error);
            alert("Failed to save media entry.");
        }
    };

    const handleUpdateIncident = async () => {
        if (!selectedIncident?._id) return;
        try {
            const { data: updated } = await axios.patch(
                `${API_BASE_URL}/site-ops/incidents/${selectedIncident._id}`,
                editIncidentData
            );
            setSelectedIncident(updated);
            setIsEditingIncident(false);
            alert('Incident updated successfully!');
        } catch (error) {
            console.error('Failed to update incident:', error);
            alert('Failed to update incident.');
        }
    };

    const getStats = () => {
        const activeLabor = attStats.present;
        const totalTasks = dailyTasks.length;
        const completedTasks = dailyTasks.filter(t => t.status === 'Completed').length;

        // Site Productivity: Weighted avg of Task Progress (70%) and Manpower Presence (30%)
        const taskProd = totalTasks > 0 ? (completedTasks / totalTasks) : 0;
        const laborProd = attStats.totalWorkers > 0 ? (attStats.present / attStats.totalWorkers) : 1;
        const productivity = Math.round((taskProd * 0.7 + laborProd * 0.3) * 100);

        const openIssues = incidents.filter(i => i.status !== 'Closed').length +
            dailyTasks.filter(t => t.status === 'Delayed').length;
        return { activeLabor, productivity, openIssues };
    };

    const dashboardStats = getStats();

    return (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#003380', margin: 0 }}>Site Operations Dashboard</h2>
                    <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={20} weight="bold" /> Downtown Heights - Site A
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setShowIncidentModal(true)} style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                        background: 'white', color: '#be123c', border: '1px solid #fda4af',
                        borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fff1f2'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                        <WarningCircle size={20} weight="bold" /> Report Incident
                    </button>
                    <button
                        onClick={() => setShowSiteLogModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                            background: '#0047AB', color: 'white', border: 'none',
                            borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 71, 171, 0.4)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                        <Plus size={20} weight="bold" /> New Site Log
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{
                    background: 'white', padding: '2rem', borderRadius: '24px',
                    border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    display: 'flex', alignItems: 'center', gap: '1.5rem', transition: 'transform 0.3s ease'
                }} className="dashboard-card">
                    <div style={{ padding: '15px', background: '#f0fdf4', borderRadius: '16px', color: '#16a34a' }}>
                        <UsersThree size={32} weight="bold" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Active Labor</div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>{dashboardStats.activeLabor}</div>
                    </div>
                </div>
                <div style={{
                    background: 'white', padding: '2rem', borderRadius: '24px',
                    border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    display: 'flex', alignItems: 'center', gap: '1.5rem', transition: 'transform 0.3s ease'
                }} className="dashboard-card">
                    <div style={{ padding: '15px', background: '#eff6ff', borderRadius: '16px', color: '#0047AB' }}>
                        <TrendUp size={32} weight="bold" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Site Productivity</div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>{dashboardStats.productivity}%</div>
                    </div>
                </div>
                <div style={{
                    background: 'white', padding: '2rem', borderRadius: '24px',
                    border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    display: 'flex', alignItems: 'center', gap: '1.5rem', transition: 'transform 0.3s ease'
                }} className="dashboard-card">
                    <div style={{ padding: '15px', background: '#fff1f2', borderRadius: '16px', color: '#e11d48' }}>
                        <WarningCircle size={32} weight="bold" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Open Issues</div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>{dashboardStats.openIssues}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '2rem' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Daily Execution Tracker */}
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ListChecks size={24} weight="bold" color="#0047AB" /> Daily Execution Tracker
                            </h3>
                            <button
                                onClick={() => setCurrentPage('manage-schedule')}
                                style={{ background: 'none', border: 'none', color: '#0047AB', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                            >
                                Manage Schedule
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {dailyTasks.length === 0 ? (
                                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No tasks scheduled for today.</p>
                            ) : dailyTasks.slice(0, 3).map((task, idx) => (
                                <div key={task._id || idx} style={{ padding: '1.2rem', border: '1px solid #f1f5f9', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{task.task || task.title}</h4>
                                            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>Team: {task.team || task.assignedTo || 'General'}</p>
                                        </div>
                                        <span style={{
                                            fontSize: '0.75rem', fontWeight: 800,
                                            color: task.status === 'Completed' ? '#16a34a' : task.status === 'Delayed' ? '#e11d48' : '#0047AB',
                                            padding: '4px 12px',
                                            background: task.status === 'Completed' ? '#16a34a15' : task.status === 'Delayed' ? '#e11d4815' : '#0047AB15',
                                            borderRadius: '8px'
                                        }}>{task.status}</span>
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${task.progress}%`,
                                                height: '100%',
                                                background: task.status === 'Completed' ? '#16a34a' : task.status === 'Delayed' ? '#e11d48' : '#0047AB',
                                                borderRadius: '4px'
                                            }}></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Current Progress</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{task.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Material Usage Log */}
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Package size={24} weight="bold" color="#0047AB" /> Material Usage Log
                            </h3>
                            <button
                                onClick={() => setShowUsageModal(true)}
                                style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #0047AB, #1e3a8a)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,71,171,0.25)' }}
                            >
                                <Package size={16} weight="bold" /> Record Usage
                            </button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>ITEM</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>USAGE TODAY</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>INVENTORY</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materialUsage.length === 0 ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8', fontWeight: 600 }}>No materials in inventory. Add materials to get started.</td></tr>
                                ) : materialUsage.map((m, idx) => {
                                    const statusColors = {
                                        Available: { bg: '#f0fdf4', color: '#16a34a' },
                                        Requested: { bg: '#fff1f2', color: '#e11d48' },
                                        'Low Stock': { bg: '#fffbeb', color: '#d97706' },
                                        'In Transit': { bg: '#eff6ff', color: '#2563eb' },
                                        Arrived: { bg: '#f0fdf4', color: '#16a34a' },
                                    };
                                    const sc = statusColors[m.status] || { bg: '#f1f5f9', color: '#64748b' };
                                    const remaining = m.remainingQty ?? m.qty ?? 0;
                                    const used = m.usedQty ?? 0;
                                    return (
                                        <tr key={m._id || idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{m.item}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{m.category}</div>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 700, color: '#0047AB' }}>
                                                {used > 0 ? `${used} ${m.unit || ''}` : '—'}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{remaining} {m.unit || ''}</div>
                                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>of {m.qty || 0} total</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: sc.color, padding: '4px 10px', background: sc.bg, borderRadius: '6px' }}>{m.status}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Site Progress Media */}
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Monitor size={24} weight="bold" color="#0047AB" /> Site Progress Media
                            </h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => { setMediaType('photo'); setShowMediaModal(true); }}
                                    style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Camera size={18} /> Photo
                                </button>
                                <button
                                    onClick={() => { setMediaType('video'); setShowMediaModal(true); }}
                                    style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <VideoCamera size={18} /> Video
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {(() => {
                                const photos = siteLogs.flatMap(l => l.photos || []).map(url => ({
                                    url: url.startsWith('/uploads') ? `${API_BASE_URL}${url}` : url,
                                    type: 'photo'
                                }));
                                const videos = siteLogs.flatMap(l => l.videos || []).map(url => ({
                                    url: url.startsWith('/uploads') ? `${API_BASE_URL}${url}` : url,
                                    type: 'video'
                                }));
                                const allMedia = [...videos, ...photos].slice(0, 4);

                                if (allMedia.length === 0) {
                                    return [1, 2, 3, 4].map((i) => (
                                        <div key={i} style={{ aspectRatio: '1', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ImageSquare size={32} color="#cbd5e1" weight="duotone" />
                                        </div>
                                    ));
                                }

                                return allMedia.map((media, i) => (
                                    <div key={i} style={{ aspectRatio: '1', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', position: 'relative' }}>
                                        {media.type === 'photo' ? (
                                            <img src={media.url} alt="Site Progress" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <video src={media.url} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                                                <PlayCircle size={40} weight="fill" color="white" style={{ position: 'absolute' }} />
                                            </div>
                                        )}
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>

                    {/* Media Upload Modal */}
                    {showMediaModal && (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001 }}>
                            <div style={{ background: 'white', width: '450px', borderRadius: '24px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Upload {mediaType === 'photo' ? 'Progress Photo' : 'Site Video'}</h3>
                                    <button onClick={() => setShowMediaModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
                                </div>
                                <form onSubmit={handleMediaUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                                    {/* Upload Tabs (URL vs File) */}
                                    <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => { setUploadMode('file'); setMediaUrl(''); }}
                                            style={{
                                                paddingBottom: '8px',
                                                borderBottom: `2px solid ${uploadMode === 'file' ? '#0047AB' : 'transparent'}`,
                                                fontWeight: uploadMode === 'file' ? 700 : 600,
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: uploadMode === 'file' ? '#0047AB' : '#94a3b8'
                                            }}
                                        >
                                            File Upload
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setUploadMode('url'); setMediaUrl(''); }}
                                            style={{
                                                paddingBottom: '8px',
                                                borderBottom: `2px solid ${uploadMode === 'url' ? '#0047AB' : 'transparent'}`,
                                                fontWeight: uploadMode === 'url' ? 700 : 600,
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: uploadMode === 'url' ? '#0047AB' : '#94a3b8'
                                            }}
                                        >
                                            External URL
                                        </button>
                                    </div>

                                    {/* Input Area */}
                                    {uploadMode === 'file' ? (
                                        <div
                                            style={{
                                                border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '2rem',
                                                textAlign: 'center', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s'
                                            }}
                                            onClick={() => document.getElementById('mediaFileInput').click()}
                                        >
                                            <input
                                                id="mediaFileInput"
                                                type="file"
                                                accept={mediaType === 'photo' ? "image/*" : "video/*"}
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) setMediaUrl(file);
                                                }}
                                            />
                                            <UploadSimple size={48} color="#94a3b8" />
                                            <p style={{ margin: '10px 0 0', fontWeight: 600, color: '#64748b' }}>
                                                {mediaUrl && typeof mediaUrl === 'object' ? mediaUrl.name : `Click to upload ${mediaType}`}
                                            </p>
                                            <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>MP4, JPG, PNG allowed</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                                                {mediaType === 'photo' ? 'Image URL' : 'Video URL'}
                                            </label>
                                            <input
                                                required
                                                type="url"
                                                placeholder={`Paste ${mediaType} URL here...`}
                                                value={typeof mediaUrl === 'string' ? mediaUrl : ''}
                                                onChange={(e) => setMediaUrl(e.target.value)}
                                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            />
                                        </div>
                                    )}

                                    <button type="submit" disabled={!mediaUrl} style={{
                                        padding: '12px', background: mediaUrl ? '#0047AB' : '#94a3b8',
                                        color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700,
                                        cursor: mediaUrl ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
                                    }}>
                                        {mediaUrl ? 'Add Media' : 'Select Media'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Safety & Issues Report */}
                    <div style={{
                        background: 'white', padding: '1.8rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#be123c', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldWarning size={24} color="#be123c" weight="bold" /> Safety & Issues Report
                        </h4>
                        {incidents.length === 0 ? (
                            <div style={{ padding: '1.2rem', background: '#f0fdf4', borderRadius: '16px', borderLeft: '4px solid #16a34a', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#16a34a', marginBottom: '8px' }}>SAFE ZONE</div>
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#0f172a', fontWeight: 600, margin: 0, opacity: 0.9 }}>
                                    No safety incidents reported today. Keep up the high standards.
                                </p>
                            </div>
                        ) : (
                            incidents.filter(i => i.status !== 'Closed').slice(0, 1).map(incident => (
                                <div key={incident._id} style={{ padding: '1.2rem', background: '#fff1f2', borderRadius: '16px', borderLeft: '4px solid #e11d48', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#e11d48' }}>{incident.severity?.toUpperCase() || 'HIGH'} PRIORITY</div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#be123c', background: '#fff1f2', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fda4af' }}>{incident.status}</div>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#0f172a', fontWeight: 700, margin: '0 0 4px 0' }}>
                                        {incident.hazardType || incident.title}
                                    </p>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, margin: '0 0 10px 0' }}>
                                        {incident.description?.length > 60 ? incident.description.substring(0, 60) + '...' : incident.description}
                                    </p>
                                    <button
                                        onClick={() => setSelectedIncident(incident)}
                                        style={{
                                            padding: '6px 14px', background: '#e11d48', color: 'white',
                                            border: 'none', borderRadius: '8px', fontWeight: 700,
                                            fontSize: '0.8rem', cursor: 'pointer'
                                        }}
                                    >
                                        Open
                                    </button>
                                </div>
                            ))
                        )}
                        <button
                            onClick={() => setShowIncidentModal(true)}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '12px',
                                background: '#e11d48', color: 'white', border: 'none',
                                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#be123c'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#e11d48'}
                        >Report New Hazard</button>
                    </div>

                    {/* Labor & Attendance */}
                    <div style={{
                        background: 'white', padding: '1.8rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#16a34a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HardHat size={24} color="#16a34a" weight="bold" /> Labor & Attendance
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
                            {(!attStats.tradeWise || attStats.tradeWise.length === 0) ? (
                                <p style={{ color: '#64748b', textAlign: 'center' }}>No attendance logged yet.</p>
                            ) : attStats.tradeWise.map((l, idx) => (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{l.trade}</div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#16a34a' }}>{l.present}/{l.total}</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, margin: 0 }}>Active Manpower</p>
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: 800,
                                            color: '#16a34a',
                                            background: '#16a34a15',
                                            padding: '2px 8px', borderRadius: '4px'
                                        }}>{Math.round((l.present / l.total) * 100)}% Prod.</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage('manage-attendance')}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '12px',
                                background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0',
                                fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
                            }}>Manage Attendance</button>
                    </div>

                    {/* Site Diary & Activity Logs */}
                    <div style={{
                        background: 'white', padding: '1.8rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0047AB', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ClipboardText size={24} color="#0047AB" weight="bold" /> Site Diary & Activity Logs
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                            {siteLogs.length === 0 ? (
                                <p style={{ color: '#64748b', textAlign: 'center' }}>No logs today.</p>
                            ) : siteLogs.map((log, idx) => (
                                <div key={log._id || idx} style={{
                                    padding: '1rem',
                                    background: log.type === 'incident' ? '#fff1f2' : log.type === 'weather' ? '#fffbeb' : '#eff6ff',
                                    borderRadius: '16px',
                                    borderLeft: `4px solid ${log.type === 'incident' ? '#e11d48' : log.type === 'weather' ? '#F59E0B' : '#0047AB'}`
                                }}>
                                    <div style={{
                                        fontSize: '0.75rem', fontWeight: 800,
                                        color: log.type === 'incident' ? '#be123c' : log.type === 'weather' ? '#B45309' : '#1E40AF',
                                        marginBottom: '4px', textTransform: 'uppercase'
                                    }}>
                                        {log.type || 'General'} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: log.type === 'incident' ? '#881337' : log.type === 'weather' ? '#92400E' : '#1E3A8A',
                                        fontWeight: 600, margin: 0, lineHeight: '1.4'
                                    }}>
                                        {log.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Type a quick log entry..."
                                value={quickLog}
                                onChange={(e) => setQuickLog(e.target.value)}
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem' }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveLog()}
                            />
                            <button
                                onClick={handleSaveLog}
                                disabled={isSavingLog}
                                style={{
                                    padding: '0 15px', background: '#0047AB', color: 'white', border: 'none',
                                    borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center'
                                }}
                            >
                                <PaperPlaneRight size={18} weight="bold" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showSiteLogModal && <SiteLogModal onClose={() => setShowSiteLogModal(false)} />}
            {showIncidentModal && <ReportIncidentModal onClose={() => setShowIncidentModal(false)} />}
            {showUsageModal && (
                <RecordUsageModal
                    onClose={() => setShowUsageModal(false)}
                    materials={materialUsage}
                    tasks={dailyTasks}
                    onSuccess={fetchAllData}
                />
            )}

            {/* Incident Detail / Edit Modal */}
            {selectedIncident && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10002, padding: '20px'
                }}>
                    <div style={{
                        background: 'white', width: '100%', maxWidth: '600px', maxHeight: '90vh',
                        borderRadius: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
                        overflow: 'hidden', display: 'flex', flexDirection: 'column'
                    }}>
                        {/* Header */}
                        <div style={{ background: '#fff1f2', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #fecdd3', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <ShieldWarning size={28} weight="fill" color="#dc2626" />
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#991b1b' }}>
                                        {isEditingIncident ? 'Edit Incident Report' : 'Incident Report'}
                                    </h3>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#b91c1c', fontWeight: 600 }}>
                                        {selectedIncident.hazardType || 'Hazard'} · {selectedIncident.severity?.toUpperCase()} PRIORITY
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {/* Pencil / Save toggle */}
                                {!isEditingIncident ? (
                                    <button
                                        onClick={() => {
                                            setEditIncidentData({
                                                hazardType: selectedIncident.hazardType || '',
                                                severity: selectedIncident.severity || 'Medium',
                                                description: selectedIncident.description || '',
                                                areaZone: selectedIncident.areaZone || '',
                                                status: selectedIncident.status || 'Open',
                                                assignedTo: selectedIncident.assignedTo || '',
                                                dueDate: selectedIncident.dueDate ? selectedIncident.dueDate.split('T')[0] : '',
                                                controlMeasures: selectedIncident.controlMeasures || '',
                                                riskScore: selectedIncident.riskScore ?? 50,
                                                complianceStandard: selectedIncident.complianceStandard || '',
                                            });
                                            setIsEditingIncident(true);
                                        }}
                                        title="Edit Report"
                                        style={{ background: 'white', border: '1px solid #fecdd3', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                    >
                                        <PencilLine size={18} color="#dc2626" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleUpdateIncident}
                                        title="Save Changes"
                                        style={{ background: '#dc2626', border: 'none', borderRadius: '10px', padding: '0 14px', height: '36px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}
                                    >
                                        <FloppyDisk size={18} /> Save
                                    </button>
                                )}
                                <button
                                    onClick={() => { setSelectedIncident(null); setIsEditingIncident(false); }}
                                    style={{ background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <X size={20} color="#64748b" />
                                </button>
                            </div>
                        </div>

                        {/* Body — scrollable */}
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', overflowY: 'auto' }}>

                            {isEditingIncident ? (
                                /* ---- EDIT MODE ---- */
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Hazard Type</label>
                                            <select value={editIncidentData.hazardType} onChange={e => setEditIncidentData(p => ({ ...p, hazardType: e.target.value }))}
                                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }}>
                                                {['Electrical', 'Structural', 'Fire', 'Machinery', 'Chemical', 'Working at Height', 'Excavation', 'Other'].map(t => <option key={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Severity</label>
                                            <select value={editIncidentData.severity} onChange={e => setEditIncidentData(p => ({ ...p, severity: e.target.value }))}
                                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }}>
                                                {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Status</label>
                                            <select value={editIncidentData.status} onChange={e => setEditIncidentData(p => ({ ...p, status: e.target.value }))}
                                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }}>
                                                {['Open', 'In Progress', 'Resolved', 'Closed', 'Draft'].map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Area / Zone</label>
                                            <input value={editIncidentData.areaZone} onChange={e => setEditIncidentData(p => ({ ...p, areaZone: e.target.value }))}
                                                placeholder="e.g. Zone B, Floor 4"
                                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Description</label>
                                        <textarea value={editIncidentData.description} onChange={e => setEditIncidentData(p => ({ ...p, description: e.target.value }))}
                                            rows={3} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none', resize: 'none', lineHeight: '1.5' }} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Assigned To</label>
                                            <select value={editIncidentData.assignedTo} onChange={e => setEditIncidentData(p => ({ ...p, assignedTo: e.target.value }))}
                                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }}>
                                                {['Civil Engineer', 'Safety Officer', 'Contractor'].map(a => <option key={a}>{a}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Due Date</label>
                                            <input type="date" value={editIncidentData.dueDate} onChange={e => setEditIncidentData(p => ({ ...p, dueDate: e.target.value }))}
                                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Control Measure</label>
                                            <select value={editIncidentData.controlMeasures} onChange={e => setEditIncidentData(p => ({ ...p, controlMeasures: e.target.value }))}
                                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }}>
                                                {['Temporary fix', 'Permanent fix', 'Engineer inspection required', 'Contractor action required'].map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Compliance Standard</label>
                                            <select value={editIncidentData.complianceStandard} onChange={e => setEditIncidentData(p => ({ ...p, complianceStandard: e.target.value }))}
                                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, outline: 'none' }}>
                                                {['IS Codes', 'OSHA', 'Company SOP'].map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                                            Risk Score: <span style={{ color: editIncidentData.riskScore > 70 ? '#dc2626' : editIncidentData.riskScore > 40 ? '#f59e0b' : '#16a34a' }}>{editIncidentData.riskScore}</span>
                                        </label>
                                        <input type="range" min="0" max="100" value={editIncidentData.riskScore}
                                            onChange={e => setEditIncidentData(p => ({ ...p, riskScore: Number(e.target.value) }))}
                                            style={{ width: '100%', accentColor: editIncidentData.riskScore > 70 ? '#dc2626' : editIncidentData.riskScore > 40 ? '#f59e0b' : '#16a34a' }} />
                                    </div>
                                </>
                            ) : (
                                /* ---- VIEW MODE ---- */
                                <>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#fee2e2', color: '#dc2626', fontWeight: 800, fontSize: '0.75rem' }}>{selectedIncident.status}</span>
                                        {selectedIncident.areaZone && <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: '0.75rem' }}>📍 {selectedIncident.areaZone}</span>}
                                        {selectedIncident.complianceStandard && <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#eff6ff', color: '#1d4ed8', fontWeight: 700, fontSize: '0.75rem' }}>{selectedIncident.complianceStandard}</span>}
                                    </div>

                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Description</div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, lineHeight: '1.6' }}>{selectedIncident.description || 'No description provided.'}</p>
                                    </div>

                                    {selectedIncident.actionsTaken?.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Actions Taken</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                {selectedIncident.actionsTaken.map((a, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                                                        <CheckCircle size={16} weight="fill" color="#16a34a" /> {a}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', borderRadius: '16px', padding: '1.2rem' }}>
                                        {selectedIncident.assignedTo && <div><div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Assigned To</div><div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{selectedIncident.assignedTo}</div></div>}
                                        {selectedIncident.dueDate && <div><div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Due Date</div><div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{new Date(selectedIncident.dueDate).toLocaleDateString()}</div></div>}
                                        {selectedIncident.controlMeasures && <div><div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Control Measure</div><div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{selectedIncident.controlMeasures}</div></div>}
                                        {selectedIncident.riskScore !== undefined && (
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Risk Score</div>
                                                <div style={{ fontWeight: 900, fontSize: '1rem', color: selectedIncident.riskScore > 70 ? '#dc2626' : selectedIncident.riskScore > 40 ? '#f59e0b' : '#16a34a' }}>{selectedIncident.riskScore}/100</div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '1.2rem 2rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
                            {isEditingIncident ? (
                                <button onClick={() => setIsEditingIncident(false)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer', color: '#475569' }}>
                                    Cancel
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => { setSelectedIncident(null); setIsEditingIncident(false); }} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer', color: '#475569' }}>
                                        Close
                                    </button>
                                    <button onClick={() => { setSelectedIncident(null); setShowIncidentModal(true); }} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                                        + Report New
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}


            <style>{`
                .dashboard-card:hover {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                    transform: translateY(-4px);
                }
            `}</style>
        </div>
    );
};

export default ProjectSiteDashboard;
