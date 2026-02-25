import React, { useState, useEffect } from 'react';
import {
    UserPlus, Gear, ShieldCheck, ToggleLeft, ToggleRight,
    PencilSimple, Plus, CreditCard, ListBullets, ChartBar,
    CaretRight, BellRinging, Globe, Lock as LockIcon, Download, Warning
} from '@phosphor-icons/react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';
import CreateUserModal from '../../components/CreateUserModal';
import AuditHistoryModal from '../../components/AuditHistoryModal';
import TransactionHistoryModal from '../../components/TransactionHistoryModal';
import RealTimeSyncModal from '../../components/RealTimeSyncModal';
import PublicRegistrationModal from '../../components/PublicRegistrationModal';
import MaintenanceModeModal from '../../components/MaintenanceModeModal';
import UserDetailsModal from '../../components/UserDetailsModal';
import { Eye } from '@phosphor-icons/react';

const AdminDashboard = ({ setCurrentPage }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showBillingModal, setShowBillingModal] = useState(false);
    const [showSyncModal, setShowSyncModal] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [realTimeSyncEnabled, setRealTimeSyncEnabled] = useState(true);
    const [publicRegistration, setPublicRegistration] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [settings, setSettings] = useState(null);
    const [billing, setBilling] = useState(null);

    const userId = "65ca9f56e9c123456789abcd"; // Same mock userId

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/settings`);
            setSettings(res.data);
            setRealTimeSyncEnabled(res.data.realTimeSync);
            setPublicRegistration(res.data.publicRegistration);
            setMaintenanceMode(res.data.maintenanceMode);
        } catch (err) {
            console.error("Failed to fetch settings:", err);
        }
    };

    const updateSetting = async (key, value) => {
        try {
            const res = await axios.patch(`${API_BASE_URL}/settings`, { [key]: value });
            setSettings(res.data);
            if (key === 'realTimeSync') setRealTimeSyncEnabled(res.data.realTimeSync);
            if (key === 'publicRegistration') setPublicRegistration(res.data.publicRegistration);
            if (key === 'maintenanceMode') setMaintenanceMode(res.data.maintenanceMode);
            // toast.success("System configuration updated!");
        } catch (err) {
            // toast.error("Update failed");
        }
    };

    const updateMultipleSettings = async (updates) => {
        try {
            const res = await axios.patch(`${API_BASE_URL}/settings`, updates);
            setSettings(res.data);
            setRealTimeSyncEnabled(res.data.realTimeSync);
            setPublicRegistration(res.data.publicRegistration);
            setMaintenanceMode(res.data.maintenanceMode);
            // toast.success("System configuration updated!");
        } catch (err) {
            // toast.error("Update failed");
        }
    };

    const fetchBilling = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/billing/${userId}`);
            setBilling(res.data);
        } catch (err) {
            console.error("Dashboard billing fetch error:", err);
        }
    };

    useEffect(() => {
        fetchBilling();
        fetchSettings();

        const socket = socketService.getSocket();
        if (socket) {
            socket.on('settingsUpdated', (data) => {
                setSettings(data);
                setRealTimeSyncEnabled(data.realTimeSync);
                setPublicRegistration(data.publicRegistration);
                setMaintenanceMode(data.maintenanceMode);
            });
            socket.on('billingUpdated', (data) => {
                if (data.userId === userId) setBilling(data);
            });
            socket.on('newUser', fetchBilling);
        }
        return () => {
            if (socket) {
                socket.off('settingsUpdated');
                socket.off('billingUpdated');
                socket.off('newUser');
            }
        };
    }, []);

    const [users, setUsers] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [stats, setStats] = useState({
        activeSubscriptions: 0,
        systemHealth: '99.9%',
        pendingApprovals: 0,
        auditAlerts: 0
    });
    const [loading, setLoading] = useState(true);

    const [logFilter, setLogFilter] = useState('All');
    const logs = [
        { id: 1, action: 'Budget Created / Updated', user: 'Finance Dept', time: '1 hour ago', status: 'Finance' },
        { id: 2, action: 'Billing Plan Changed', user: 'Sarah Chen', time: '2 hours ago', status: 'Finance' },
        { id: 3, action: 'Invoice Generated (#INV-4022)', user: 'System', time: '3 hours ago', status: 'Finance' },
        { id: 4, action: 'Invoice Approved / Rejected', user: 'Admin', time: '4 hours ago', status: 'Finance' },
        { id: 5, action: 'Payment Received', user: 'System', time: '5 hours ago', status: 'Finance' },
        { id: 6, action: 'Payment Failed', user: 'System', time: '6 hours ago', status: 'Finance' },
        { id: 7, action: 'Refund Issued', user: 'Admin', time: '7 hours ago', status: 'Finance' },
        { id: 8, action: 'Adjustment / Credit Note Added', user: 'Sarah Chen', time: '8 hours ago', status: 'Finance' },
        { id: 9, action: 'Retention Money Released', user: 'Finance Dept', time: '10 hours ago', status: 'Finance' },
        { id: 10, action: 'Tax / GST Update', user: 'Admin', time: '12 hours ago', status: 'Finance' },
        { id: 11, action: 'Transaction Synced with Accounting System', user: 'System', time: '14 hours ago', status: 'Finance' },
        { id: 12, action: 'Example Log', user: 'System', time: '18 hours ago', status: 'Finance' },
        { id: 13, action: 'Billing Tier Updated', user: 'Admin', time: '5 hours ago', status: 'Finance' },
        { id: 14, action: 'User Deactivated', user: 'Bob Wilson', time: '1 day ago', status: 'Security' },
        { id: 15, action: 'Suspicious Login Flagged', user: 'Unknown IP', time: '1 day ago', status: 'Security' },
        { id: 16, action: 'Workflow Triggered — Low Stock → Purchase Request', user: 'System', time: '1 hour ago', status: 'Automation' },
        { id: 17, action: 'Scheduled Job Executed', user: 'System', time: '3 hours ago', status: 'Automation' },
        { id: 18, action: 'Auto-Approval Performed', user: 'System', time: '4 hours ago', status: 'Automation' },
        { id: 19, action: 'Auto-Notification Sent', user: 'System', time: '5 hours ago', status: 'Automation' },
        { id: 20, action: 'SLA Escalation Triggered', user: 'System', time: '6 hours ago', status: 'Automation' },
        { id: 21, action: 'AI Prediction Generated', user: 'AI Engine', time: '8 hours ago', status: 'Automation' },
        { id: 22, action: 'Auto Task Created', user: 'System', time: '9 hours ago', status: 'Automation' },
        { id: 23, action: 'Auto Status Update — Pending → In Progress', user: 'System', time: '10 hours ago', status: 'Automation' },
        { id: 24, action: 'Cron / Scheduler Run', user: 'System', time: '11 hours ago', status: 'Automation' },
        { id: 25, action: 'Integration Sync — ERP / Payroll', user: 'System', time: '12 hours ago', status: 'Automation' },
        { id: 26, action: 'Workflow Triggered', user: 'System', time: '12 hours ago', status: 'Automation' },
    ];

    useEffect(() => {
        fetchDashboardData();

        // Real-time listeners
        socketService.on('newUser', (user) => {
            if (!realTimeSyncEnabled) return;
            console.log('[REAL-TIME] New user added:', user);
            setUsers(prev => [user, ...prev]);
        });

        socketService.on('userUpdated', (updatedUser) => {
            if (!realTimeSyncEnabled) return;
            console.log('[REAL-TIME] User updated:', updatedUser);
            setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
        });

        socketService.on('incidentReported', (incident) => {
            if (!realTimeSyncEnabled) return;
            setIncidents(prev => [incident, ...prev]);
            fetchDashboardData();
        });

        socketService.on('taskUpdated', () => {
            if (realTimeSyncEnabled) fetchDashboardData();
        });
        socketService.on('attendanceUpdated', () => {
            if (realTimeSyncEnabled) fetchDashboardData();
        });

        return () => {
            socketService.off('newUser');
            socketService.off('userUpdated');
            socketService.off('incidentReported');
            socketService.off('taskUpdated');
            socketService.off('attendanceUpdated');
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [usersRes, incidentsRes, attStatsRes, tasksRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/users`),
                axios.get(`${API_BASE_URL}/site-ops/incidents`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/attendance/stats`).catch(() => ({ data: { totalWorkers: 0, present: 0 } })),
                axios.get(`${API_BASE_URL}/tasks`).catch(() => ({ data: [] }))
            ]);

            setUsers(usersRes.data);
            setIncidents(incidentsRes.data);

            const attendanceRate = attStatsRes.data.totalWorkers > 0 ? (attStatsRes.data.present / attStatsRes.data.totalWorkers) : 1;
            const criticalCount = incidentsRes.data.filter(i => i.severity === 'Critical').length;

            // Site Productivity: Weighted avg of Task Progress (70%) and Manpower Presence (30%)
            const totalTasks = tasksRes.data.length;
            const completedTasks = tasksRes.data.filter(t => t.status === 'Completed').length;
            const taskProd = totalTasks > 0 ? (completedTasks / totalTasks) : 0;
            const productivity = Math.round((taskProd * 0.7 + attendanceRate * 0.3) * 100);

            setStats(prev => ({
                ...prev,
                activeSubscriptions: usersRes.data.filter(u => u.status === 'Active').length,
                pendingApprovals: usersRes.data.filter(u => u.status === 'Pending').length,
                auditAlerts: criticalCount,
                systemHealth: '99.9%'
            }));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id) => {
        const user = users.find(u => u._id === id);
        let newStatus;

        if (user.status === 'Pending') {
            newStatus = 'Active';
        } else {
            newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        }

        try {
            await axios.patch(`${API_BASE_URL}/users/${id}`, { status: newStatus });
            setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));

            // Refresh stats
            fetchDashboardData();
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const handleSaveUser = async (userData, editingUserId = null) => {
        try {
            const payload = {
                name: userData.name || `${userData.firstName} ${userData.lastName}`,
                email: userData.email,
                role: userData.roles[0] || 'Client',
                status: userData.status || 'Active'
            };

            if (userData.tempPassword) {
                payload.password = userData.tempPassword;
            }

            if (editingUserId) {
                // Update existing user
                const response = await axios.patch(`${API_BASE_URL}/users/${editingUserId}`, payload);
                setUsers(users.map(u => u._id === editingUserId ? response.data : u));
            } else {
                // Create new user
                const response = await axios.post(`${API_BASE_URL}/users`, payload);
                setUsers([response.data, ...users]);
            }

            setShowCreateModal(false);
            setSelectedUser(null);
            fetchDashboardData();
        } catch (error) {
            console.error('Error saving user:', error);
            const errorMsg = error.response?.data?.message || "Failed to save user. Ensure the email is unique.";
            alert(errorMsg);
        }
    };

    const downloadReport = () => {
        try {
            // Check if we are in a browser environment
            if (typeof window !== 'undefined') {
                window.print();
            }
        } catch (error) {
            console.error('Failed to generate report:', error);
            alert('Could not generate report at this time.');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Admin Control Center</h1>
                <div style={{ display: 'flex', gap: '1.2rem' }}>
                    <button
                        onClick={() => setCurrentPage('reports')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                            background: 'white', color: '#0047AB', border: '1.5px solid #0047AB',
                            borderRadius: '14px', fontWeight: 700, cursor: 'pointer',
                            fontSize: '0.95rem', transition: 'all 0.2s ease'
                        }}
                    >
                        <ChartBar size={22} weight="bold" /> Global Reports
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                            background: '#0047AB', color: 'white', border: 'none',
                            borderRadius: '14px', fontWeight: 700, cursor: 'pointer',
                            fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(0, 71, 171, 0.25)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <UserPlus size={22} weight="bold" /> Create User
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {[
                    { label: 'Active Subscriptions', value: stats.activeSubscriptions, color: '#0047AB' },
                    { label: 'System Health', value: stats.systemHealth || '99.9%', color: '#10b981' },
                    { label: 'Pending Approvals', value: stats.pendingApprovals, color: '#f59e0b' },
                    { label: 'Audit Alerts', value: stats.auditAlerts || '0', color: '#ef4444' }
                ].map((stat, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>{stat.label}</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Section 0: Global Safety Overview (New) */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '6px solid #e53e3e' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', margin: 0 }}>
                        <Warning size={24} color="#e53e3e" weight="bold" /> Global Safety & High-Risk Trends
                    </h3>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e53e3e', background: '#feeded', padding: '4px 12px', borderRadius: '8px' }}>
                        {incidents.filter(i => i.severity === 'Critical').length} Critical Issues
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {incidents.filter(i => i.status !== 'Closed').slice(0, 3).map(incident => (
                        <div key={incident._id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: incident.severity === 'Critical' ? '#e53e3e' : '#475569' }}>{incident.hazardType || 'Hazard'}</span>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.6 }}>{incident.status}</span>
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>{incident.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Project: {incident.areaZone || 'Global'}</div>
                        </div>
                    ))}
                    {incidents.length === 0 && <p style={{ gridColumn: 'span 3', textAlign: 'center', color: '#64748b', padding: '1rem' }}>No active safety hazards reported.</p>}
                </div>
            </div>

            {/* Section 1: User Management & Permissions */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={24} color="var(--pivot-blue)" /> Users & Permissions
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', opacity: 0.6 }}>
                            <th style={{ padding: '1rem' }}>User Profile</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{u.name}</td>
                                <td style={{ padding: '1rem' }}>{u.role}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700,
                                        background: u.status === 'Active' ? '#e6f4ea' : u.status === 'Pending' ? '#fffbeb' : '#fff0f0',
                                        color: u.status === 'Active' ? '#1e7e34' : u.status === 'Pending' ? '#b45309' : '#e53e3e'
                                    }}>{u.status}</span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
                                        <button
                                            onClick={() => { setSelectedUser(u); setShowDetailsModal(true); }}
                                            style={{
                                                background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '8px',
                                                cursor: 'pointer', color: '#0047AB', fontWeight: 700, fontSize: '0.75rem',
                                                display: 'flex', alignItems: 'center', gap: '5px'
                                            }}
                                        >
                                            <Eye size={16} weight="bold" /> View
                                        </button>

                                        {u.status === 'Pending' ? (
                                            <button
                                                onClick={() => toggleStatus(u._id)}
                                                style={{
                                                    background: '#ecfdf5', border: '1px solid #10b981', color: '#059669', padding: '6px 12px', borderRadius: '8px',
                                                    cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px'
                                                }}
                                            >
                                                <ShieldCheck size={16} weight="bold" /> Approve
                                            </button>
                                        ) : (
                                            <button onClick={() => toggleStatus(u._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: u.status === 'Active' ? '#10b981' : '#cbd5e1', transition: 'all 0.2s' }}>
                                                {u.status === 'Active' ? <ToggleRight size={32} weight="fill" /> : <ToggleLeft size={32} weight="fill" />}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Section 2: Activity Logs & Audit Trails */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', margin: 0 }}>
                            <ListBullets size={24} color="#0047AB" /> Audit Trails & Logs
                        </h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {['All', 'Security', 'Finance', 'Automation'].map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setLogFilter(filter)}
                                    style={{
                                        padding: '5px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700,
                                        border: 'none', cursor: 'pointer',
                                        background: logFilter === filter ? '#0047AB' : '#f1f5f9',
                                        color: logFilter === filter ? 'white' : '#64748b'
                                    }}
                                >
                                    {filter === 'Security' ? 'Security Logs' : filter}
                                </button>
                            ))}
                        </div>
                    </div>
                    {logFilter === 'Finance' && (
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem', marginTop: '-10px', fontStyle: 'italic' }}>
                            Events related to money, plans, billing, and payments.
                        </p>
                    )}
                    {logFilter === 'Automation' && (
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem', marginTop: '-10px', fontStyle: 'italic' }}>
                            Events triggered by rules, workflows, AI, or system automations.
                        </p>
                    )}
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {logs.filter(log => logFilter === 'All' || log.status === logFilter).slice(0, 7).map(log => (
                            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                                        {log.action} <span style={{ color: '#94a3b8', fontWeight: 400 }}>—</span> {log.user} <span style={{ color: '#94a3b8', fontWeight: 400 }}>—</span> {log.time}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: log.status === 'Security' ? '#ef4444' : log.status === 'Finance' ? '#22c55e' : log.status === 'Automation' ? '#0ea5e9' : '#64748b', fontWeight: 600, marginTop: '4px' }}>
                                        #{log.status.toUpperCase()}
                                    </div>
                                </div>
                                <CaretRight size={16} color="#94a3b8" />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowHistoryModal(true)}
                        style={{ width: '100%', marginTop: '1.5rem', padding: '12px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#0047AB', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        View Full History
                    </button>
                </div>

                {/* Modals */}
                {showCreateModal && <CreateUserModal onClose={() => { setShowCreateModal(false); setSelectedUser(null); }} onSave={handleSaveUser} initialData={selectedUser} />}
                <AuditHistoryModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} logs={logs} />

                {/* Section 3: Subscription & Billing */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        <CreditCard size={22} color="var(--pivot-blue)" /> Billing & Plans
                    </h3>
                    <div style={{ padding: '1rem', background: '#f1f5f9', borderRadius: '12px', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Current Plan</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0047AB' }}>
                            {billing ? `${billing.plan} Subscription` : "Loading Plan..."}
                        </div>
                        <div style={{ fontSize: '0.75rem', marginTop: '5px' }}>
                            Next renewal: {billing ? new Date(billing.nextBillingDate).toLocaleDateString() : "..."}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setCurrentPage('billing')} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#0047AB', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Manage Plan</button>
                        <button onClick={() => setShowBillingModal(true)} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'white', border: '1px solid #e2e8f0', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>History</button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Section 4: System-Wide Settings */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', marginBottom: '1.5rem', color: '#0f172a' }}>
                        <Globe size={22} color="#0047AB" /> System Configuration
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[
                            { label: 'Security Logs', icon: <ShieldCheck size={18} />, status: 'View', action: () => setLogFilter('Security'), color: '#0047AB' },
                            { label: 'Real-time Sync', icon: <BellRinging size={18} />, status: realTimeSyncEnabled ? 'On' : 'Off', action: () => setShowSyncModal(true), color: realTimeSyncEnabled ? '#0047AB' : '#ef4444' },
                            { label: 'Public Registration', icon: <Plus size={18} />, status: publicRegistration ? 'On' : 'Off', action: () => setShowRegistrationModal(true), color: publicRegistration ? '#0047AB' : '#ef4444' },
                            { label: 'Maintenance Mode', icon: <LockIcon size={18} />, status: maintenanceMode ? 'On' : 'Off', action: () => setShowMaintenanceModal(true), color: maintenanceMode ? '#ef4444' : '#0047AB' }
                        ].map((item, i) => (
                            <div key={i}
                                onClick={item.action}
                                style={{
                                    padding: '1rem', border: '1px solid #f1f5f9',
                                    borderRadius: '12px', display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', cursor: item.action ? 'pointer' : 'default',
                                    background: (item.label === 'Security Logs' && logFilter === 'Security') || (item.label === 'Real-time Sync' && showSyncModal) || (item.label === 'Public Registration' && showRegistrationModal) || (item.label === 'Maintenance Mode' && showMaintenanceModal) ? '#f1f5f9' : 'transparent',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => { if (item.action) e.currentTarget.style.background = '#f8fafc' }}
                                onMouseLeave={(e) => { if (item.action) e.currentTarget.style.background = (item.label === 'Security Logs' && logFilter === 'Security') || (item.label === 'Real-time Sync' && showSyncModal) || (item.label === 'Public Registration' && showRegistrationModal) || (item.label === 'Maintenance Mode' && showMaintenanceModal) ? '#f1f5f9' : 'transparent' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ opacity: 0.6 }}>{item.icon}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.label}</span>
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: item.color }}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 5: Performance Reports Generation */}
                <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #0047AB 0%, #003380 100%)', color: 'white' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'white' }}>Intelligence Reports</h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '1.5rem', lineHeight: '1.5' }}>
                        Generate a comprehensive PDF audit of system performance, lead conversions, and site activity across all regions.
                    </p>
                    <button
                        onClick={downloadReport}
                        style={{
                            width: '100%', padding: '12px', borderRadius: '10px',
                            background: 'white', color: '#0047AB', border: 'none',
                            fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            cursor: 'pointer', transition: 'transform 0.2s ease'
                        }}>
                        <Download size={20} weight="bold" /> Download PDF
                    </button>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '1.5rem', paddingTop: '1rem', fontSize: '0.75rem', opacity: 0.7 }}>
                        Last generated: Yesterday, 11:45 PM
                    </div>
                </div>
            </div>

            {/* Modal Components */}
            <AuditHistoryModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} logs={logs} />
            <TransactionHistoryModal isOpen={showBillingModal} onClose={() => setShowBillingModal(false)} transactions={[]} expenses={[]} financials={{}} />
            <RealTimeSyncModal
                isOpen={showSyncModal}
                onClose={() => setShowSyncModal(false)}
                isEnabled={realTimeSyncEnabled}
                onToggle={() => updateSetting('realTimeSync', !realTimeSyncEnabled)}
            />
            <PublicRegistrationModal
                isOpen={showRegistrationModal}
                onClose={() => setShowRegistrationModal(false)}
                isEnabled={publicRegistration}
                onToggle={() => updateSetting('publicRegistration', !publicRegistration)}
            />
            <MaintenanceModeModal
                isOpen={showMaintenanceModal}
                onClose={() => setShowMaintenanceModal(false)}
                isEnabled={maintenanceMode}
                onToggle={() => updateSetting('maintenanceMode', !maintenanceMode)}
                settings={settings}
                onUpdateSettings={updateMultipleSettings}
            />
            {showCreateModal && <CreateUserModal onClose={() => { setShowCreateModal(false); setSelectedUser(null); }} onSave={handleSaveUser} initialData={selectedUser} />}
            {showDetailsModal && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setShowDetailsModal(false)}
                    onEdit={(user) => {
                        setShowDetailsModal(false);
                        setSelectedUser(user);
                        setShowCreateModal(true);
                    }}
                />
            )}

            <style>{`
                .card {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    transition: all 0.3s ease;
                }
                .card:hover {
                    box-shadow: 0 12px 40px rgba(0, 71, 171, 0.08);
                }
            `}</style>
        </div >
    );
};

export default AdminDashboard;
