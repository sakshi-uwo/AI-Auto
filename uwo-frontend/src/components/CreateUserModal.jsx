import React, { useState, useEffect } from 'react';
import { X, User, IdentificationCard, Envelope, Phone, Image, CheckCircle, ShieldCheck, ChartBar, Lock, Eye, Bell, Globe, Key, Tag } from '@phosphor-icons/react';

const CreateUserModal = ({ onClose, onSave, initialData = null }) => {
    const [formData, setFormData] = useState({
        // 1. Basic Info
        firstName: initialData?.name?.split(' ')[0] || '',
        lastName: initialData?.name?.split(' ').slice(1).join(' ') || '',
        name: initialData?.name || '',
        email: initialData?.email || '',
        mobile: initialData?.mobile || '',
        userId: initialData?.userId || `USR-${Math.floor(Math.random() * 10000)}`,
        photo: initialData?.photo || null,
        // 2. Role
        roles: initialData?.role ? [initialData.role] : [],
        // 3. Dashboard Access
        dashboards: initialData?.dashboards || [],
        // 4. Permissions
        permissions: initialData?.permissions || {},
        // 5. Project Assignment
        assignedProjects: initialData?.assignedProjects || [],
        assignedSites: initialData?.assignedSites || [],
        projectRole: initialData?.projectRole || 'Support',
        // 6. Automation
        automationEnabled: initialData?.automationEnabled || false,
        ruleCreation: initialData?.ruleCreation || false,
        ruleEditing: initialData?.ruleEditing || false,
        alertLevel: initialData?.alertLevel || 'Standard',
        // 7. Security
        tempPassword: '',
        forceChange: initialData?.forceChange ?? true,
        twoFactor: initialData?.twoFactor || false,
        status: initialData?.status || 'Active',
        // 8. Reporting
        viewGlobalReports: initialData?.viewGlobalReports || false,
        dataVisibility: initialData?.dataVisibility || 'Assigned',
        exportPermission: initialData?.exportPermission || false,
        // 9. Notification
        emailAlerts: initialData?.emailAlerts ?? true,
        smsAlerts: initialData?.smsAlerts || false,
        inAppNotifs: initialData?.inAppNotifs ?? true,
        reportSchedule: initialData?.reportSchedule || 'Weekly',
        // 10. Audit
        createdBy: initialData?.createdBy || 'Admin',
        createdOn: initialData?.createdAt || new Date().toISOString()
    });

    const isEdit = !!initialData;

    // Smart Defaults based on Role
    useEffect(() => {
        if (formData.roles.length === 0) return;

        const lastRole = formData.roles[formData.roles.length - 1];
        let newDashboards = [...formData.dashboards];
        let newPermissions = { ...formData.permissions };
        let newReporting = { ...formData.viewGlobalReports };

        // Reset logic for demo purposes - in real app, merge permissions logic would be complex
        // This acts as a "preset applier"

        switch (lastRole) {
            case 'Admin':
                newDashboards = ['Admin', 'Reports', 'Finance', 'Projects'];
                newPermissions = { projects: 'Delete', boq: 'Approve', finance: 'Approve' };
                setFormData(prev => ({ ...prev, viewGlobalReports: true, automationEnabled: true, ruleCreation: true, dataVisibility: 'All' }));
                break;
            case 'Builder':
                newDashboards = ['Builder', 'Projects'];
                newPermissions = { projects: 'Edit', boq: 'View' };
                setFormData(prev => ({ ...prev, viewGlobalReports: false, dataVisibility: 'Appointed', automationEnabled: false }));
                break;
            case 'Civil Engineer':
                newDashboards = ['Engineer', 'Projects'];
                newPermissions = { projects: 'Edit', boq: 'Edit', reports: 'Create' };
                setFormData(prev => ({ ...prev, viewGlobalReports: false, dataVisibility: 'Appointed' }));
                break;
            case 'Client':
                newDashboards = ['Client'];
                newPermissions = { projects: 'View', documents: 'View' };
                setFormData(prev => ({ ...prev, viewGlobalReports: false, dataVisibility: 'Assigned' }));
                break;
            default:
                break;
        }

        // De-duplicate dashboards
        setFormData(prev => ({ ...prev, dashboards: [...new Set([...prev.dashboards, ...newDashboards])] }));

    }, [formData.roles]); // Dependency on roles array

    const toggleRole = (role) => {
        setFormData(prev => {
            const roles = prev.roles.includes(role)
                ? prev.roles.filter(r => r !== role)
                : [...prev.roles, role];
            return { ...prev, roles };
        });
    };

    const toggleDashboard = (board) => {
        setFormData(prev => {
            const dashboards = prev.dashboards.includes(board)
                ? prev.dashboards.filter(b => b !== board)
                : [...prev.dashboards, board];
            return { ...prev, dashboards };
        });
    };

    const handlePermissionChange = (module, level) => {
        setFormData(prev => ({
            ...prev,
            permissions: { ...prev.permissions, [module]: level }
        }));
    };

    const SectionHeader = ({ icon: Icon, title, sub }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem', marginTop: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--pivot-blue-soft)', color: 'var(--pivot-blue)' }}>
                <Icon size={18} weight="bold" />
            </div>
            <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1a1a1a' }}>{title}</h4>
                {sub && <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{sub}</p>}
            </div>
        </div>
    );

    const rolesList = ['Admin', 'Builder', 'Civil Engineer', 'Site Manager', 'QC', 'Client', 'Vendor', 'Finance'];
    const dashboardsList = ['Admin', 'Builder', 'Engineer', 'Site', 'Client', 'QC', 'Reports'];
    const permissionModules = ['Projects', 'BOQ', 'Drawings', 'Automation', 'Reports', 'Payments', 'Documents'];
    const permissionLevels = ['View', 'Create', 'Edit', 'Approve', 'Delete'];

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'white', width: '900px', maxHeight: '90vh', borderRadius: '24px',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={24} color="var(--pivot-blue)" weight="duotone" /> {isEdit ? 'Edit User Profile' : 'Create New User'}
                        </h2>
                        <p style={{ fontSize: '0.75rem', margin: '4px 0 0 0', color: '#64748b', fontWeight: 600 }}>Configure access credentials, role-based permissions, and security settings.</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} weight="bold" /></button>
                </div>

                {/* Scrollable Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 2rem 2rem 2rem' }}>

                    {/* 1. Basic Info */}
                    <SectionHeader icon={IdentificationCard} title="1. Identity & Credentials" sub="Basic profile information required for account creation" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="input-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>FULL NAME</label>
                            <input
                                type="text"
                                placeholder="e.g. Sarah Conners"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600 }}
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS (LOGIN)</label>
                            <input
                                type="email"
                                placeholder="sarah@reality-os.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600 }}
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>PASSWORD</label>
                            <input
                                type="password"
                                placeholder="Set initial password"
                                value={formData.tempPassword}
                                onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600 }}
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>MOBILE NUMBER</label>
                            <input
                                type="text"
                                placeholder="+1 (555) 000-0000"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600 }}
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>SYSTEM ID</label>
                            <input type="text" value={formData.userId} disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #f1f5f9', background: '#f8fafc', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }} />
                        </div>
                    </div>

                    {/* 2. Role Assignment */}
                    <SectionHeader icon={ShieldCheck} title="2. Role Assignment" sub="Select one or multiple roles to define base access level" />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {rolesList.map(role => (
                            <button key={role} onClick={() => toggleRole(role)} style={{
                                padding: '8px 16px', borderRadius: '20px', border: formData.roles.includes(role) ? '1px solid var(--pivot-blue)' : '1px solid #e2e8f0',
                                background: formData.roles.includes(role) ? 'var(--pivot-blue-soft)' : 'white',
                                color: formData.roles.includes(role) ? 'var(--pivot-blue)' : '#64748b',
                                fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                            }}>
                                {formData.roles.includes(role) && <CheckCircle size={14} weight="fill" style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
                                {role}
                            </button>
                        ))}
                    </div>

                    {/* 3. Dashboard Access */}
                    <SectionHeader icon={ChartBar} title="3. Dashboard Access" sub="Toggle specific dashboard visibility based on selected roles" />
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {dashboardsList.map(board => (
                            <div key={board} onClick={() => toggleDashboard(board)} style={{
                                width: '120px', padding: '10px', borderRadius: '12px', border: formData.dashboards.includes(board) ? '2px solid var(--pivot-blue)' : '1px solid #e2e8f0',
                                cursor: 'pointer', textAlign: 'center', opacity: formData.dashboards.includes(board) ? 1 : 0.6
                            }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1a1a1a' }}>{board}</div>
                            </div>
                        ))}
                    </div>

                    {/* 4. Permissions Matrix */}
                    <SectionHeader icon={Key} title="4. Granular Permissions" sub="Fine-tune access rights for specific modules" />
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '8px', color: '#94a3b8' }}>MODULE</th>
                                {permissionLevels.map(l => <th key={l} style={{ padding: '8px', color: '#94a3b8' }}>{l.toUpperCase()}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {permissionModules.map(mod => (
                                <tr key={mod} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '10px', fontWeight: 700 }}>{mod}</td>
                                    {permissionLevels.map(level => (
                                        <td key={level} style={{ padding: '10px', textAlign: 'center' }}>
                                            <div
                                                onClick={() => handlePermissionChange(mod.toLowerCase(), level)}
                                                style={{
                                                    width: '16px', height: '16px', borderRadius: '4px', margin: '0 auto', cursor: 'pointer',
                                                    border: '1px solid #cbd5e1',
                                                    background: formData.permissions[mod.toLowerCase()] === level ? 'var(--pivot-blue)' : 'white'
                                                }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 5. Project Assignment */}
                    <SectionHeader icon={Globe} title="5. Project & Site Assignment" sub="Scope user visibility to specific active projects" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>ASSIGN TO PROJECTS</label>
                            <select style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <option>Select Projects...</option>
                                <option>Downtown Heights</option>
                                <option>Skyline Towers</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>PROJECT ROLE</label>
                            <select style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <option>Support Staff</option>
                                <option>Team Lead</option>
                                <option>Manager</option>
                            </select>
                        </div>
                    </div>

                    {/* 6. Automation & 7. Security (Combined Row) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <SectionHeader icon={Lock} title="6. Automation & Security" sub="Control AI access and login security" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <input type="checkbox" checked={formData.automationEnabled} onChange={() => setFormData(p => ({ ...p, automationEnabled: !p.automationEnabled }))} /> Enable AI Automation Rules
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <input type="checkbox" checked={formData.forceChange} onChange={() => setFormData(p => ({ ...p, forceChange: !p.forceChange }))} /> Force Password Change
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <input type="checkbox" checked={formData.twoFactor} onChange={() => setFormData(p => ({ ...p, twoFactor: !p.twoFactor }))} /> Require 2FA
                                </label>
                            </div>
                            <div style={{ marginTop: '1rem', padding: '10px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7', fontSize: '0.8rem' }}>
                                <strong>Temp Pwd:</strong> <code style={{ fontWeight: 800 }}>{formData.tempPassword}</code>
                            </div>
                        </div>

                        {/* 8. Reporting & Visibility */}
                        <div>
                            <SectionHeader icon={Eye} title="7. Data Visibility" sub="Global reporting access controls" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>View Global Reports</span>
                                    <div
                                        onClick={() => setFormData(p => ({ ...p, viewGlobalReports: !p.viewGlobalReports }))}
                                        style={{ width: '40px', height: '20px', borderRadius: '20px', background: formData.viewGlobalReports ? 'var(--pivot-blue)' : '#cbd5e1', position: 'relative', cursor: 'pointer', transition: '0.2s' }}
                                    >
                                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: formData.viewGlobalReports ? '22px' : '2px', transition: '0.2s' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>DATA VISIBILITY SCOPE</label>
                                    <select
                                        value={formData.dataVisibility}
                                        onChange={(e) => setFormData({ ...formData, dataVisibility: e.target.value })}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    >
                                        <option>All Projects (Full Admin)</option>
                                        <option>Assigned Projects Only</option>
                                        <option>Public Data Only</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 9. Notification & 10. Metadata */}
                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                                <input type="checkbox" checked={formData.emailAlerts} onChange={() => setFormData(p => ({ ...p, emailAlerts: !p.emailAlerts }))} /> Email Alerts
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                                <input type="checkbox" checked={formData.smsAlerts} onChange={() => setFormData(p => ({ ...p, smsAlerts: !p.smsAlerts }))} /> SMS Alerts
                            </label>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#94a3b8' }}>
                            <div>Created by: {formData.createdBy}</div>
                            <div>{new Date(formData.createdOn).toLocaleDateString()}</div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'white' }}>
                    <button onClick={onClose} style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={() => onSave(formData, initialData?._id)} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'var(--pivot-blue)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 71, 171, 0.2)' }}>{isEdit ? 'Save Changes' : 'Create User Account'}</button>
                </div>
            </div>
        </div>
    );
};

export default CreateUserModal;
