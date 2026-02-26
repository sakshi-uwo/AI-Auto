import React, { useState, useEffect } from 'react';
import { SquaresFour, Buildings, UsersThree, CalendarCheck, Gear, SignOut, Cube, List, X } from '@phosphor-icons/react';
import { authService } from '../services/api';

const Sidebar = ({ currentPage, setCurrentPage, onLogout }) => {
    const user = authService.getCurrentUser();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setIsMobileOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close sidebar when a nav item is chosen on mobile
    const handleNav = (id) => {
        setCurrentPage(id);
        if (isMobile) setIsMobileOpen(false);
    };

    const getNavItems = () => {
        const baseItems = [
            { id: 'dashboard', label: 'Dashboard', icon: <SquaresFour size={24} /> },
        ];
        switch (user?.role) {
            case 'admin':
                return [
                    ...baseItems,
                    { id: 'projects', label: 'Projects', icon: <Buildings size={24} /> },
                    { id: 'leads', label: 'Leads Analytics', icon: <UsersThree size={24} /> },
                    { id: 'visits', label: 'Site Visits', icon: <CalendarCheck size={24} /> },
                ];
            case 'builder':
                return [
                    ...baseItems,
                    { id: 'projects', label: 'Portfolio', icon: <Buildings size={24} /> },
                    { id: 'leads', label: 'Leads Analytics', icon: <UsersThree size={24} /> },
                ];
            case 'civil_engineer':
                return [
                    ...baseItems,
                ];
            case 'project_site':
                return [
                    ...baseItems,
                    { id: 'attendance', label: 'Labor Logs', icon: <UsersThree size={24} /> },
                ];
            case 'client':
                return [
                    ...baseItems,
                    { id: 'documents', label: 'My Documents', icon: <Cube size={20} /> },
                ];
            default:
                return baseItems;
        }
    };

    const navItems = getNavItems();

    const navLinkStyle = (active) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0.8rem 1rem',
        color: active ? 'var(--white)' : 'rgba(255, 255, 255, 0.7)',
        textDecoration: 'none',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--pivot-blue-light)' : 'transparent',
        transition: 'var(--transition)',
        cursor: 'pointer',
        marginBottom: '0.5rem',
    });

    const sidebarContent = (
        <aside style={{
            width: '280px',
            background: 'linear-gradient(180deg, var(--pivot-blue-dark) 0%, #001a3d 100%)',
            color: 'var(--white)',
            display: 'flex',
            flexDirection: 'column',
            padding: '2.5rem 1.5rem',
            height: '100vh',
            zIndex: 1000,
            position: 'fixed',
            left: 0,
            top: 0,
            transform: isMobile && !isMobileOpen ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
            overflowY: 'auto',
            boxShadow: isMobile && isMobileOpen ? '20px 0 50px rgba(0,0,0,0.3)' : 'none'
        }}>
            {/* Logo + Close Button Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1.6rem', fontWeight: 800 }}>
                    <div style={{ width: '36px', height: '36px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
                        <img src="/logo/AI-Auto.png" alt="Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                    </div>
                    <span style={{ letterSpacing: '-0.5px' }}>AI-AUTO</span>
                </div>
                {isMobile && (
                    <button onClick={() => setIsMobileOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                        <X size={20} weight="bold" />
                    </button>
                )}
            </div>

            <nav style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1.2rem', paddingLeft: '0.5rem' }}>Main Menu</div>
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        style={navLinkStyle(currentPage === item.id)}
                        onClick={() => handleNav(item.id)}
                        onMouseEnter={(e) => { if (currentPage !== item.id) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                        onMouseLeave={(e) => { if (currentPage !== item.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                        <div style={{ opacity: currentPage === item.id ? 1 : 0.7 }}>{item.icon}</div>
                        <span style={{ fontWeight: currentPage === item.id ? 700 : 500 }}>{item.label}</span>
                    </div>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div
                    style={navLinkStyle(currentPage === 'settings')}
                    onClick={() => handleNav('settings')}
                    onMouseEnter={(e) => { if (currentPage !== 'settings') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                    onMouseLeave={(e) => { if (currentPage !== 'settings') e.currentTarget.style.background = 'transparent'; }}
                >
                    <Gear size={24} style={{ opacity: 0.7 }} />
                    <span>Settings</span>
                </div>
                <div
                    style={navLinkStyle(false)}
                    onClick={onLogout}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <SignOut size={24} style={{ opacity: 0.7 }} />
                    <span>Logout</span>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', padding: '0.5rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UsersThree size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{user?.name || 'User'}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ') || 'Member'}</div>
                    </div>
                </div>
            </div>
        </aside>
    );

    return (
        <>
            {/* Hamburger Button — only shows on mobile */}
            {isMobile && (
                <button
                    onClick={() => setIsMobileOpen(true)}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        left: '20px',
                        zIndex: 500,
                        background: 'rgba(0, 51, 128, 0.9)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        width: '46px',
                        height: '46px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 8px 32px rgba(0, 71, 171, 0.25)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <List size={26} color="white" weight="bold" />
                </button>
            )}

            {/* Overlay backdrop */}
            {isMobile && isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 150,
                    }}
                />
            )}

            {sidebarContent}
        </>
    );
};

export default Sidebar;
