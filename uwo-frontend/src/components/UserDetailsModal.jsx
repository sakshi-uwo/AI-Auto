import React from 'react';
import { X, User, IdentificationCard, ShieldCheck, ChartBar, Key, Globe, Lock, Eye, Bell, ListBullets } from '@phosphor-icons/react';

const UserDetailsModal = ({ user, onClose, onEdit }) => {
    if (!user) return null;

    // Mocking some extended data since the current DB schema is simple
    const extendedData = {
        mobile: user.mobile || '+1 (555) 123-4567',
        userId: user.userId || `USR-${user._id.slice(-4).toUpperCase()}`,
        roles: [user.role],
        dashboards: ['Admin', 'Reports', 'Projects'],
        permissions: {
            projects: 'Approve',
            boq: 'Edit',
            automation: 'View',
            reports: 'Create',
            payments: 'View'
        },
        assignedProjects: ['Downtown Heights', 'Skyline Towers'],
        createdOn: user.createdAt || new Date().toISOString(),
        dataVisibility: 'All Projects (Full Admin)',
        status: user.status || 'Active'
    };

    const SectionHeader = ({ icon: Icon, title }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', marginTop: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--pivot-blue-soft)', color: 'var(--pivot-blue)' }}>
                <Icon size={18} weight="bold" />
            </div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1a1a1a' }}>{title}</h4>
        </div>
    );

    const DetailItem = ({ label, value, fullWidth = false }) => (
        <div style={{ gridColumn: fullWidth ? '1 / span 2' : 'auto', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{value || 'Not Specified'}</div>
        </div>
    );

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'white', width: '700px', maxHeight: '90vh', borderRadius: '24px',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'fadeIn 0.3s ease'
            }}>
                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <User size={28} weight="bold" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{user.name}</h2>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{user.email}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{
                            padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800,
                            background: extendedData.status === 'Active' ? '#e6f4ea' : extendedData.status === 'Pending' ? '#fffbeb' : '#fff0f0',
                            color: extendedData.status === 'Active' ? '#1e7e34' : extendedData.status === 'Pending' ? '#b45309' : '#e53e3e'
                        }}>
                            {extendedData.status.toUpperCase()}
                        </span>
                        <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={18} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem 2rem' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <DetailItem label="Full Name" value={user.name} />
                        <DetailItem label="Email Address" value={user.email} />
                        <DetailItem label="Mobile Number" value={extendedData.mobile} />
                        <DetailItem label="System ID" value={extendedData.userId} />
                    </div>

                    <SectionHeader icon={ShieldCheck} title="Role & Access Scope" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <DetailItem label="Primary Role" value={user.role} />
                        <DetailItem label="Data Visibility" value={extendedData.dataVisibility} />
                        <DetailItem label="Assigned Projects" value={extendedData.assignedProjects.join(', ')} fullWidth />
                    </div>

                    <SectionHeader icon={ChartBar} title="Dashboard Access" />
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {extendedData.dashboards.map(db => (
                            <span key={db} style={{ padding: '8px 16px', background: '#f1f5f9', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, color: '#475569', border: '1px solid #e2e8f0' }}>
                                {db} Dashboard
                            </span>
                        ))}
                    </div>

                    <SectionHeader icon={Key} title="Module Permissions" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {Object.entries(extendedData.permissions).map(([module, level]) => (
                            <div key={module} style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>{module}</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pivot-blue)' }}>{level}</div>
                            </div>
                        ))}
                    </div>

                    <SectionHeader icon={Lock} title="Security & Compliance" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <DetailItem label="Registration Date" value={new Date(extendedData.createdOn).toLocaleDateString(undefined, { dateStyle: 'long' })} />
                        <DetailItem label="2FA Authentication" value="Disabled" />
                        <DetailItem label="Last Login" value="Feb 20, 2026 14:32" />
                        <DetailItem label="Account Source" value="Direct Entry (Admin)" />
                    </div>

                </div>

                {/* Footer */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: '#f8fafc' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '12px 28px', borderRadius: '14px', border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}
                    >
                        Close Details
                    </button>
                    <button
                        onClick={() => onEdit(user)}
                        style={{ padding: '12px 28px', borderRadius: '14px', border: 'none', background: 'var(--pivot-blue)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 71, 171, 0.2)', transition: '0.2s' }}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default UserDetailsModal;
