import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users, CheckCircle, XCircle, Clock, Calendar,
    Download, Funnel, MagnifyingGlass, FloppyDisk,
    ArrowLeft, HardHat, Timer, BellRinging,
    SealCheck, Info, CaretRight, Plus,
    PencilLine, Trash, PlusCircle, IdentificationCard, Storefront, Money, UserPlus, ArrowsLeftRight,
    X, ArrowLeft as BackIcon
} from '@phosphor-icons/react';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';

const ManageAttendance = ({ setCurrentPage }) => {
    const [viewMode, setViewMode] = useState('attendance'); // 'attendance' or 'labor'
    const [workers, setWorkers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [stats, setStats] = useState({
        totalWorkers: 0, present: 0, absent: 0, late: 0, onLeave: 0, overtime: 0
    });
    const [showAuditModal, setShowAuditModal] = useState(null);
    const [auditHistory, setAuditHistory] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [filter, setFilter] = useState({ trade: 'All', contractor: 'All', search: '' });

    // Labor Management State
    const [showLaborForm, setShowLaborForm] = useState(false);
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [formData, setFormData] = useState({
        name: '', role: 'Helper', tradeType: 'Civil', contractor: '',
        phoneNumber: '', wageType: 'Daily', wageAmount: '', idProof: '', status: 'Active'
    });
    const [assignData, setAssignData] = useState({
        project: '', block: '', shift: 'Morning', startDate: '', endDate: ''
    });

    useEffect(() => {
        fetchData();
        fetchProjects();

        socketService.on('attendanceUpdated', fetchData);
        socketService.on('workerAdded', fetchData);
        socketService.on('workerUpdated', fetchData);
        socketService.on('workerAssigned', fetchData);

        return () => {
            socketService.off('attendanceUpdated');
            socketService.off('workerAdded');
            socketService.off('workerUpdated');
            socketService.off('workerAssigned');
        };
    }, [date]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [workersRes, attendanceRes, statsRes, alertsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/attendance/workers`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/attendance?date=${date}`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/attendance/stats`).catch(() => ({ data: { totalWorkers: 0, present: 0, absent: 0, late: 0, onLeave: 0, overtime: 0 } })),
                axios.get(`${API_BASE_URL}/attendance/alerts`).catch(() => ({ data: [] }))
            ]);

            setWorkers(workersRes.data);
            setAlerts(alertsRes.data);

            const attendanceMap = {};
            attendanceRes.data.forEach(a => {
                attendanceMap[a.workerId?._id || a.workerId] = a;
            });
            setAttendance(attendanceMap);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/projects`);
            setProjects(res.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleAddLabor = async (e) => {
        e.preventDefault();
        try {
            if (selectedWorker) {
                await axios.patch(`${API_BASE_URL}/attendance/workers/${selectedWorker._id}`, formData);
            } else {
                await axios.post(`${API_BASE_URL}/attendance/workers`, formData);
            }
            setShowLaborForm(false);
            setSelectedWorker(null);
            setFormData({
                name: '', role: 'Helper', tradeType: 'Civil', contractor: '',
                phoneNumber: '', wageType: 'Daily', wageAmount: '', idProof: '', status: 'Active'
            });
        } catch (error) {
            alert("Error saving labor: " + error.message);
        }
    };

    const handleAssignLabor = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/attendance/workers/${selectedWorker._id}/assign`, assignData);
            setShowAssignForm(false);
            setSelectedWorker(null);
            setAssignData({ project: '', block: '', shift: 'Morning', startDate: '', endDate: '' });
        } catch (error) {
            alert("Assignment failed: " + error.message);
        }
    };

    const openEditForm = (worker) => {
        setSelectedWorker(worker);
        setFormData({
            name: worker.name, role: worker.role, tradeType: worker.tradeType,
            contractor: worker.contractor, phoneNumber: worker.phoneNumber || '',
            wageType: worker.wageType || 'Daily', wageAmount: worker.wageAmount || '',
            idProof: worker.idProof || '', status: worker.status
        });
        setShowLaborForm(true);
    };

    const openAssignForm = (worker) => {
        setSelectedWorker(worker);
        setAssignData({
            project: worker.activeAssignment?.project?._id || worker.activeAssignment?.project || '',
            block: worker.activeAssignment?.block || '',
            shift: worker.activeAssignment?.shift || 'Morning',
            startDate: worker.activeAssignment?.startDate?.split('T')[0] || '',
            endDate: worker.activeAssignment?.endDate?.split('T')[0] || ''
        });
        setShowAssignForm(true);
    };

    const handleStatusChange = (workerId, status) => {
        const normalizedDate = new Date(date);
        normalizedDate.setHours(12, 0, 0, 0);

        setAttendance(prev => ({
            ...prev,
            [workerId]: {
                ...(prev[workerId] || {}),
                workerId,
                status,
                date: normalizedDate,
                shift: prev[workerId]?.shift || 'Morning',
                remarks: prev[workerId]?.remarks || ''
            }
        }));
    };

    const handleBulkSave = async () => {
        setSaving(true);
        try {
            const updates = Object.values(attendance);
            await axios.post(`${API_BASE_URL}/attendance`, updates);
            alert("Attendance and corrections saved successfully!");
        } catch (error) {
            console.error("Error saving attendance:", error);
            alert("Failed to save attendance.");
        } finally {
            setSaving(false);
        }
    };

    const handleAutoSync = () => {
        alert("Syncing with Site entry devices...\n- QR Code logs fetched (12)\n- Mobile Geo-fenced logs fetched (8)");
    };

    const filteredWorkers = workers.filter(w => {
        const matchesTrade = filter.trade === 'All' || w.tradeType === filter.trade;
        const matchesContractor = filter.contractor === 'All' || w.contractor === filter.contractor;
        const matchesSearch = w.name.toLowerCase().includes(filter.search.toLowerCase());
        const isActive = w.status === 'Active';
        return matchesTrade && matchesContractor && matchesSearch && (viewMode === 'labor' || isActive);
    });

    const trades = ['All', 'Civil', 'Electrical', 'Plumbing', 'Carpentry', 'Other'];
    const roles = ['Mason', 'Carpenter', 'Electrician', 'Helper', 'Painter', 'Plumber', 'Supervisor'];
    const contractors = ['All', ...new Set(workers.map(w => w.contractor))];

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh', position: 'relative' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button
                        onClick={() => setCurrentPage('dashboard')}
                        style={{ border: 'none', background: 'white', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                    >
                        <BackIcon size={20} weight="bold" color="#64748b" />
                    </button>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0047AB', margin: 0 }}>
                            {viewMode === 'attendance' ? 'Daily Attendance & Compliance' : 'Labor Management System'}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <Calendar size={18} weight="bold" color="#64748b" />
                            {viewMode === 'attendance' ? (
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    style={{ border: 'none', background: 'transparent', fontWeight: 700, color: '#64748b', outline: 'none', fontSize: '1rem' }}
                                />
                            ) : (
                                <span style={{ fontWeight: 700, color: '#64748b' }}>Project-wide Workforce</span>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setViewMode(viewMode === 'attendance' ? 'labor' : 'attendance')}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: 'white', border: '1px solid #0047AB', borderRadius: '12px', fontWeight: 700, color: '#0047AB', cursor: 'pointer' }}
                    >
                        {viewMode === 'attendance' ? <Users size={20} /> : <CheckCircle size={20} />}
                        {viewMode === 'attendance' ? 'Manage Labor' : 'Mark Attendance'}
                    </button>

                    {viewMode === 'attendance' ? (
                        <button
                            onClick={handleBulkSave}
                            disabled={saving}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#0047AB', border: 'none', borderRadius: '12px', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 71, 171, 0.2)' }}
                        >
                            {saving ? 'Saving...' : <><FloppyDisk size={20} weight="bold" /> Finalize Records</>}
                        </button>
                    ) : (
                        <button
                            onClick={() => { setSelectedWorker(null); setFormData({ name: '', role: 'Helper', tradeType: 'Civil', contractor: '', phoneNumber: '', wageType: 'Daily', wageAmount: '', idProof: '', status: 'Active' }); setShowLaborForm(true); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#0047AB', border: 'none', borderRadius: '12px', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 71, 171, 0.2)' }}
                        >
                            <UserPlus size={20} weight="bold" /> Add New Labor
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Stats Grid (Only on Attendance) */}
            {viewMode === 'attendance' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Total Workers', value: stats.totalWorkers, icon: <Users size={24} />, color: '#0047AB', bg: '#eff6ff' },
                        { label: 'Present', value: stats.present, icon: <CheckCircle size={24} />, color: '#16a34a', bg: '#f0fdf4' },
                        { label: 'Absent', value: stats.absent, icon: <XCircle size={24} />, color: '#dc2626', bg: '#fff1f1' },
                        { label: 'Late', value: stats.late, icon: <Clock size={24} />, color: '#ea580c', bg: '#fff7ed' },
                        { label: 'On Leave', value: stats.onLeave, icon: <Calendar size={24} />, color: '#7c3aed', bg: '#f5f3ff' },
                        { label: 'Overtime', value: stats.overtime, icon: <Timer size={24} />, color: '#0891b2', bg: '#ecfeff' }
                    ].map((stat, i) => (
                        <div key={i} style={{ background: 'white', padding: '1.2rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ color: stat.color, background: stat.bg, width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {stat.icon}
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>{stat.value}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters & Search */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                    <MagnifyingGlass size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search worker by name..."
                        value={filter.search}
                        onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                        style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 600 }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <select
                        value={filter.trade}
                        onChange={(e) => setFilter(prev => ({ ...prev, trade: e.target.value }))}
                        style={{ padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569', outline: 'none', minWidth: '150px' }}
                    >
                        {trades.map(t => <option key={t} value={t}>{t === 'All' ? 'All Trades' : t}</option>)}
                    </select>

                    <select
                        value={filter.contractor}
                        onChange={(e) => setFilter(prev => ({ ...prev, contractor: e.target.value }))}
                        style={{ padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569', outline: 'none', minWidth: '150px' }}
                    >
                        {contractors.map(c => <option key={c} value={c}>{c === 'All' ? 'All Contractors' : c}</option>)}
                    </select>
                </div>

                {viewMode === 'attendance' && (
                    <button
                        onClick={handleAutoSync}
                        style={{ marginLeft: 'auto', padding: '12px 20px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #dcfce7', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <SealCheck size={20} weight="bold" /> Auto-Sync device
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="card" style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 800 }}>WORKER PROFILE</th>
                            <th style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 800 }}>TRADE & SKILL</th>
                            {viewMode === 'attendance' ? (
                                <>
                                    <th style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 800 }}>STATUS</th>
                                    <th style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 800 }}>SHIFT/LOGS</th>
                                </>
                            ) : (
                                <>
                                    <th style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 800 }}>WAGE & TERMS</th>
                                    <th style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 800 }}>CURRENT SITE</th>
                                    <th style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 800 }}>STATUS</th>
                                    <th style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 800, textAlign: 'right' }}>ACTIONS</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWorkers.map(worker => {
                            const record = attendance[worker._id] || {};
                            return (
                                <tr key={worker._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s' }}>
                                    <td style={{ padding: '1.2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {worker.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, color: '#0f172a' }}>{worker.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{worker.workerId} • {worker.contractor}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.2rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{worker.role}</span>
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{worker.tradeType}</div>
                                    </td>

                                    {viewMode === 'attendance' ? (
                                        <>
                                            <td style={{ padding: '1.2rem' }}>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    {['Present', 'Absent', 'Late', 'Half Day'].map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => handleStatusChange(worker._id, s)}
                                                            style={{
                                                                padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                                                                border: '1px solid',
                                                                borderColor: record.status === s ? 'transparent' : '#e2e8f0',
                                                                background: record.status === s ? (s === 'Present' ? '#16a34a' : s === 'Absent' ? '#dc2626' : '#ea580c') : 'white',
                                                                color: record.status === s ? 'white' : '#64748b'
                                                            }}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <Clock size={16} color="#64748b" />
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{record.shift || 'Morning'}</span>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td style={{ padding: '1.2rem' }}>
                                                <div style={{ fontWeight: 700 }}>₹{worker.wageAmount} / {worker.wageType}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{worker.phoneNumber || 'No Contact'}</div>
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                                                    <Storefront size={16} color="#0047AB" />
                                                    {worker.activeAssignment?.project?.name || 'Unassigned'}
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{worker.activeAssignment?.block}</div>
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700,
                                                    background: worker.status === 'Active' ? '#e6f4ea' : '#fff0f0',
                                                    color: worker.status === 'Active' ? '#1e7e34' : '#e53e3e'
                                                }}>{worker.status}</span>
                                            </td>
                                            <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => openEditForm(worker)} title="Edit Labor" style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#475569' }}><PencilLine size={18} /></button>
                                                    <button onClick={() => openAssignForm(worker)} title="Assign to site" style={{ background: '#eff6ff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#0047AB' }}><ArrowsLeftRight size={18} /></button>
                                                    <button onClick={() => { if (window.confirm('Deactivate this worker?')) axios.patch(`${API_BASE_URL}/attendance/workers/${worker._id}`, { status: 'Inactive' }); }} title="Deactivate" style={{ background: '#fff1f1', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#dc2626' }}><Trash size={18} /></button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Labor Form Modal */}
            {showLaborForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', width: '550px', borderRadius: '28px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{selectedWorker ? 'Update Labor Details' : 'Onboard New Labor'}</h3>
                            <button onClick={() => setShowLaborForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={24} weight="bold" /></button>
                        </div>
                        <form onSubmit={handleAddLabor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Labor Name</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Trade / Category</label>
                                <select value={formData.tradeType} onChange={e => setFormData({ ...formData, tradeType: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}>
                                    {trades.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Specific Skill</label>
                                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}>
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Contractor / Vendor</label>
                                <input type="text" required value={formData.contractor} onChange={e => setFormData({ ...formData, contractor: e.target.value })} placeholder="Contractor/Firm name" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Contact Number</label>
                                <input type="text" value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="10-digit mobile" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Wage Type</label>
                                <select value={formData.wageType} onChange={e => setFormData({ ...formData, wageType: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Wage Amount (₹)</label>
                                <input type="number" required value={formData.wageAmount} onChange={e => setFormData({ ...formData, wageAmount: e.target.value })} placeholder="Amount in INR" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                            </div>
                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowLaborForm(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#0047AB', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Save Labor Profile</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assignment Form Modal */}
            {showAssignForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', width: '500px', borderRadius: '28px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>Project Assignment</h3>
                            <button onClick={() => setShowAssignForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={24} weight="bold" /></button>
                        </div>
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Assigning:</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0047AB' }}>{selectedWorker?.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#475569' }}>{selectedWorker?.role} • {selectedWorker?.contractor}</div>
                        </div>
                        <form onSubmit={handleAssignLabor} style={{ display: 'grid', gap: '1.2rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Select Project</label>
                                <select required value={assignData.project} onChange={e => setAssignData({ ...assignData, project: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}>
                                    <option value="">Choose Project</option>
                                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Site / Block</label>
                                    <input type="text" placeholder="e.g. Wing A" value={assignData.block} onChange={e => setAssignData({ ...assignData, block: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Worker Shift</label>
                                    <select value={assignData.shift} onChange={e => setAssignData({ ...assignData, shift: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}>
                                        <option value="Morning">Morning</option>
                                        <option value="Night">Night</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Start Date</label>
                                    <input type="date" value={assignData.startDate} onChange={e => setAssignData({ ...assignData, startDate: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>End Date</label>
                                    <input type="date" value={assignData.endDate} onChange={e => setAssignData({ ...assignData, endDate: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowAssignForm(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#0047AB', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Deploy to Site</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Footer with Alerts */}
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {alerts.length > 0 ? alerts.map((alert, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px',
                        borderRadius: '16px', background: alert.severity === 'Critical' ? '#fff1f1' : alert.severity === 'High' ? '#fff7ed' : '#f0f9ff',
                        border: `1px solid ${alert.severity === 'Critical' ? '#fecaca' : alert.severity === 'High' ? '#fed7aa' : '#bae6fd'}`,
                        color: alert.severity === 'Critical' ? '#991b1b' : alert.severity === 'High' ? '#9a3412' : '#0369a1',
                        fontSize: '0.85rem', fontWeight: 700
                    }}>
                        <BellRinging size={20} weight="bold" />
                        {alert.message}
                    </div>
                )) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '16px', background: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', fontSize: '0.85rem', fontWeight: 700 }}>
                        <SealCheck size={20} weight="bold" /> Manpower Health Stable • All critical zones covered
                    </div>
                )}
            </div>

            <style>{`
                input::placeholder { color: #94a3b8; }
                select { cursor: pointer; }
                tr:hover { background-color: #f8fafc !important; }
            `}</style>
        </div>
    );
};

export default ManageAttendance;
