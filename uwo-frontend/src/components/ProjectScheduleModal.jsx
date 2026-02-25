import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
    X, Calendar, Clock, CheckCircle, Warning, ChartLineUp,
    ListChecks, ArrowRight, Timer, MapPin, Users, Flag,
    TrendDown, Info, CalendarDots, HardHat, Package,
    Truck, WarningOctagon, Star, ShieldCheck, Pulse,
    Funnel, MagnifyingGlass, FilePdf, Link, ShareNetwork,
    Lock as LockIcon, CaretDown, DotsThreeOutlineVertical, PencilSimple,
    ArrowsClockwise, FileText, DownloadSimple
} from '@phosphor-icons/react';

const ProjectScheduleModal = ({ isOpen, onClose, project, tasks, user = { role: 'Admin' } }) => {
    const [activeTab, setActiveTab] = useState('overview'); // overview, timeline, resources, analysis

    // --- Filter States ---
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [phaseFilter, setPhaseFilter] = useState('All');
    const [teamFilter, setTeamFilter] = useState('All');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [showFilters, setShowFilters] = useState(false);

    // --- Action & UI States ---
    const [localTasks, setLocalTasks] = useState(null);
    const [activeAction, setActiveAction] = useState(null); // { task, type }
    const [notification, setNotification] = useState(null);
    const [isExporting, setIsExporting] = useState(false);


    // --- Initialize Local Tasks ---
    useEffect(() => {
        if (isOpen && tasks && !localTasks) {
            const enriched = tasks.map(t => ({
                ...t,
                resources: t.resources || {
                    labor: ['Mechanical Team', 'Plumbing Crew'],
                    materials: [
                        { item: 'Cement', qtyNeeded: 50, unit: 'Bags', status: t.status === 'Delayed' ? 'Shortage' : 'Available' },
                        { item: 'Steel Rails', qtyNeeded: 2, unit: 'Ton', status: 'Available' }
                    ],
                    equipment: [
                        { name: 'Excavator', status: t.status === 'Blocked' ? 'Conflict' : 'Available' }
                    ]
                },
                isCriticalPath: t.isCriticalPath || (t.priority === 'Critical' || t.status === 'Delayed'),
                riskLevel: t.riskLevel || (t.status === 'Delayed' ? 'High' : (t.status === 'Blocked' ? 'High' : (t.progress < 20 && new Date(t.endDate) < new Date() ? 'Medium' : 'Low')))
            }));
            setLocalTasks(enriched);
        }
    }, [isOpen, tasks, localTasks]);

    if (!isOpen || !project) return null;

    const currentTasks = localTasks || [];

    // --- Data Calculations ---
    const startDate = project.startDate ? new Date(project.startDate) : new Date();
    const endDate = project.endDate ? new Date(project.endDate) : new Date(new Date().setMonth(new Date().getMonth() + 6));

    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysCompleted = Math.max(0, Math.ceil((new Date() - startDate) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, totalDays - daysCompleted);

    const overallProgress = project.progress || 0;

    // Stats
    const totalTasks = currentTasks.length;
    const criticalTasksCount = currentTasks.filter(t => t.isCriticalPath).length;
    const atRiskTasksCount = currentTasks.filter(t => t.riskLevel === 'High' || t.riskLevel === 'Medium').length;
    const resourceShortageCount = currentTasks.filter(t =>
        t.resources.materials.some(m => m.status === 'Shortage') ||
        t.resources.equipment.some(e => e.status === 'Conflict')
    ).length;

    // Phases Logic
    // --- Filtering Logic ---
    const filteredTasks = currentTasks.filter(t => {
        const matchesSearch = t.task.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
        const matchesPhase = phaseFilter === 'All' || t.category === phaseFilter;
        const matchesTeam = teamFilter === 'All' || t.assignedTeam === teamFilter;

        let matchesDate = true;
        if (dateRange.start && t.startDate) {
            matchesDate = matchesDate && new Date(t.startDate) >= new Date(dateRange.start);
        }
        if (dateRange.end && t.endDate) {
            matchesDate = matchesDate && new Date(t.endDate) <= new Date(dateRange.end);
        }

        return matchesSearch && matchesStatus && matchesPhase && matchesTeam && matchesDate;
    });

    const PHASES = [
        { id: 'pre', name: 'Pre-Construction', categories: ['Other'], keywords: ['Pre', 'Plan', 'Site Setup'] },
        { id: 'found', name: 'Foundation', categories: ['Structural'], keywords: ['Foundation', 'Footing', 'Excavation'] },
        { id: 'super', name: 'Superstructure', categories: ['Structural'], keywords: ['Column', 'Beam', 'Slab', 'Brickwork'] },
        { id: 'finishing', name: 'Finishing', categories: ['Finishing'], keywords: ['Plaster', 'Paint', 'Tile', 'Flooring'] },
        { id: 'mep', name: 'MEP', categories: ['Electrical', 'Plumbing'], keywords: ['Electric', 'Pipe', 'Wiring', 'Sanitary'] },
        { id: 'handoff', name: 'Inspection & Handover', categories: ['Inspection'], keywords: ['Check', 'Quality', 'Handover'] },
    ];

    const getPhaseData = (phase) => {
        const phaseTasks = currentTasks.filter(t => {
            const matchCategory = phase.categories.includes(t.category);
            const matchKeyword = phase.keywords.some(k => t.task.toLowerCase().includes(k.toLowerCase()));
            return matchCategory || matchKeyword;
        });

        if (phaseTasks.length === 0) return { duration: 'TBD', progress: 0, status: 'Not Started' };

        const avgProgress = Math.round(phaseTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / phaseTasks.length);
        const hasHighRisk = phaseTasks.some(t => t.riskLevel === 'High');

        const minStart = new Date(Math.min(...phaseTasks.map(t => new Date(t.startDate))));
        const maxEnd = new Date(Math.max(...phaseTasks.map(t => new Date(t.endDate || t.startDate))));
        const durationDays = Math.ceil((maxEnd - minStart) / (1000 * 60 * 60 * 24)) || 0;

        return {
            duration: `${durationDays} Days`,
            progress: avgProgress,
            status: avgProgress === 100 ? 'Completed' : (hasHighRisk ? 'Delayed' : 'On Track')
        };
    };

    const handleAction = (task, type) => {
        setActiveAction({ task, type });
    };

    const submitAction = async (data) => {
        if (!activeAction) return;

        try {
            await axios.patch(`${API_BASE_URL}/tasks/${activeAction.task._id}`, data);

            const updatedTasks = currentTasks.map(t => {
                if (t._id === activeAction.task._id) {
                    return { ...t, ...data };
                }
                return t;
            });

            setLocalTasks(updatedTasks);
            setActiveAction(null);
            setNotification(`${activeAction.type.toUpperCase()} successful!`);
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error("Action error:", error);
            setNotification("Action failed to save.");
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleExport = () => {
        setIsExporting(true);
        // Simulate API delay
        setTimeout(() => {
            setIsExporting(false);
            setNotification('Schedule Report PDF Downloaded');
            setTimeout(() => setNotification(null), 3000);
        }, 1500);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setNotification('Live Schedule Link Copied');
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <>
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(16px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
                padding: '20px'
            }}>
                <div style={{
                    background: 'white', width: '100%', maxWidth: '1200px', maxHeight: '92vh',
                    borderRadius: '32px', boxShadow: '0 25px 70px -12px rgba(0, 0, 0, 0.35)',
                    display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
                    animation: 'modalSlideUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)'
                }}>
                    {/* Custom Gradient Header */}
                    <div style={{
                        padding: '32px 40px', borderBottom: '1px solid #f1f5f9',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <ShieldCheck size={18} weight="fill" color="var(--pivot-blue)" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pivot-blue)', textTransform: 'uppercase', letterSpacing: '1px' }}>Enterprise Project Intelligence</span>
                                </div>
                                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '4px 0', letterSpacing: '-0.02em' }}>Master Project Schedule</h2>
                                <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>Global monitoring & resource optimization for <span style={{ color: '#0047AB', fontWeight: 700 }}>{project.name}</span></p>
                            </div>
                            <button onClick={onClose} style={{
                                background: '#f1f5f9', border: 'none', width: '48px', height: '48px',
                                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#64748b', transition: 'all 0.2s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <X size={24} weight="bold" />
                            </button>
                        </div>

                        {/* Navigation Tabs - Added Resources & Risks */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '18px', width: 'fit-content' }}>
                                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<ChartLineUp size={20} />} label="Summary" />
                                <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} icon={<ListChecks size={20} />} label="Work Packages" />
                                <TabButton active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} icon={<Package size={20} />} label="Resources & Risks" />
                                <TabButton active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} icon={<Timer size={20} />} label="Delay Analysis" />
                            </div>

                            {(user?.role === 'Admin' || user?.role === 'Builder') && (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={handleExport}
                                        disabled={isExporting}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                                            background: isExporting ? '#64748b' : '#0f172a', color: 'white', border: 'none', borderRadius: '12px',
                                            fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(15,23,42,0.2)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {isExporting ? <ArrowsClockwise size={18} className="spin" /> : <FilePdf size={18} weight="fill" />}
                                        {isExporting ? 'Exporting...' : 'Export PDF'}
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px',
                                            background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '12px',
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                        title="Share Link"
                                    >
                                        <Link size={18} weight="bold" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notification Toast */}
                    {notification && (
                        <div style={{
                            position: 'absolute', top: '100px', left: '50%', transform: 'translateX(-50%)',
                            background: '#1e293b', color: 'white', padding: '12px 24px', borderRadius: '12px',
                            zIndex: 10002, fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)', animation: 'notifyFade 0.3s ease'
                        }}>
                            <CheckCircle size={20} color="#10b981" weight="fill" />
                            {notification}
                        </div>
                    )}

                    {/* Content Area */}
                    <div style={{ padding: '0 40px', overflowY: 'auto', flex: 1, scrollBehavior: 'smooth', background: '#ffffff' }}>

                        {activeTab === 'overview' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '32px 0' }}>
                                {/* Executive Summary Cards */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '24px' }}>
                                    {/* Timeline Hero */}
                                    <div style={{
                                        padding: '32px', background: 'linear-gradient(135deg, #0047AB, #001f4d)', borderRadius: '28px',
                                        color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px -5px rgba(0, 71, 171, 0.3)'
                                    }}>
                                        <Pulse size={120} weight="thin" style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, color: 'white' }} />
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', marginBottom: '8px' }}>Project Duration</div>
                                            <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '24px' }}>{totalDays} <span style={{ fontSize: '1.2rem', fontWeight: 500, opacity: 0.8 }}>Days</span></div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.1)', padding: '16px 20px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                                                <div>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ade80' }}>{daysCompleted}</div>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>COMPLETED</div>
                                                </div>
                                                <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa' }}>{daysRemaining}</div>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>REMAINING</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Visualizer */}
                                    <div style={{
                                        padding: '32px', background: '#f8fafc', borderRadius: '28px', border: '1px solid #e2e8f0',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '20px' }}>
                                            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                                <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                                                <circle cx="18" cy="18" r="16" fill="none" stroke="#0047AB" strokeWidth="3" strokeDasharray={`${overallProgress}, 100`} strokeLinecap="round" />
                                            </svg>
                                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 900, fontSize: '1.5rem', color: '#0f172a' }}>{overallProgress}%</div>
                                        </div>
                                        <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem' }}>Overall Progress</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Total Construction Lifecycle</div>
                                    </div>

                                    {/* Risk Thermal Map (New) */}
                                    <div style={{
                                        padding: '32px', background: atRiskTasksCount > 0 ? '#fff1f2' : '#f0fdf4', borderRadius: '28px',
                                        border: `1px solid ${atRiskTasksCount > 0 ? '#fecdd3' : '#dcfce7'}`,
                                        display: 'flex', flexDirection: 'column', gap: '20px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <WarningOctagon size={24} color={atRiskTasksCount > 0 ? '#e11d48' : '#16a34a'} weight="fill" />
                                            <span style={{ fontWeight: 800, color: atRiskTasksCount > 0 ? '#9f1239' : '#166534' }}>Risk Level: {atRiskTasksCount > 0 ? 'High' : 'Optimal'}</span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <div style={{ padding: '12px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#e11d48' }}>{atRiskTasksCount}</div>
                                                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>AT-RISK TASKS</div>
                                            </div>
                                            <div style={{ padding: '12px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e293b' }}>{criticalTasksCount}</div>
                                                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>CRITICAL PATH</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: atRiskTasksCount > 0 ? '#be123c' : '#15803d', fontWeight: 600 }}>
                                            {atRiskTasksCount > 0 ? 'Action required on delayed work packages.' : 'All systems reporting healthy status.'}
                                        </div>
                                    </div>
                                </div>

                                {/* Phase Master View */}
                                <div style={{ padding: '32px', background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Flag size={24} weight="fill" color="var(--pivot-blue)" /> Key Project Checkpoints
                                        </h3>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Phase Completion Summary</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {PHASES.map(phase => {
                                            const data = getPhaseData(phase);
                                            return (
                                                <div key={phase.id} style={{
                                                    padding: '24px 28px', background: '#f8fafc', borderRadius: '20px',
                                                    display: 'flex', alignItems: 'center', gap: '32px', border: '1px solid transparent'
                                                }}>
                                                    <div style={{ width: '200px', fontWeight: 800, color: '#334155', fontSize: '1rem' }}>{phase.name}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '130px', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                                                        <Clock size={18} /> {data.duration}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                                                            <span style={{ color: '#64748b' }}>Operational Progress</span>
                                                            <span style={{ color: 'var(--pivot-blue)' }}>{data.progress}%</span>
                                                        </div>
                                                        <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${data.progress}%`, height: '100%', background: 'linear-gradient(to right, #0047AB, #3b82f6)', borderRadius: '5px', transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                                                        </div>
                                                    </div>
                                                    <div style={{ width: '130px', textAlign: 'right' }}>
                                                        <StatusBadge status={data.status} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div style={{ padding: '32px 0' }}>
                                {/* Filter Bar */}
                                <div style={{
                                    background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0',
                                    marginBottom: '24px', transition: 'all 0.3s ease'
                                }}>
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                                            <MagnifyingGlass size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input
                                                type="text"
                                                placeholder="Search tasks by name..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '12px 12px 12px 42px', borderRadius: '14px',
                                                    border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 600, fontSize: '0.9rem', outline: 'none'
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <FilterSelect value={statusFilter} onChange={setStatusFilter} label="Status" options={['All', 'Pending', 'In Progress', 'Completed', 'Delayed', 'Blocked']} />
                                            <FilterSelect value={phaseFilter} onChange={setPhaseFilter} label="Phase" options={['All', 'Foundation', 'Superstructure', 'Finishing', 'MEP', 'Other']} />
                                            <FilterSelect value={teamFilter} onChange={setTeamFilter} label="Team" options={['All', 'Structural', 'Electrical', 'Plumbing', 'Civil', 'Finishing']} />
                                            <button
                                                onClick={() => setShowFilters(!showFilters)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                                                    background: showFilters ? '#e0e7ff' : 'white', border: '1.5px solid #e2e8f0',
                                                    borderRadius: '14px', color: showFilters ? '#4338ca' : '#64748b', fontWeight: 700, cursor: 'pointer'
                                                }}
                                            >
                                                <Funnel size={18} weight={showFilters ? 'fill' : 'bold'} />
                                                Dates
                                            </button>
                                        </div>
                                    </div>
                                    {showFilters && (
                                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid #eff6ff' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Date Range:</span>
                                                <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }} />
                                                <ArrowRight size={16} />
                                                <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }} />
                                                <button onClick={() => setDateRange({ start: '', end: '' })} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, cursor: 'pointer', marginLeft: '12px' }}>Clear</button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b' }}>Detailed Task Schedule</h3>
                                        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Live work package monitoring for site execution</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                                            <Star size={18} weight="fill" color="#eab308" /> Critical Path
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b', background: '#f1f5f9', padding: '8px 16px', borderRadius: '10px', fontWeight: 700 }}>
                                            {filteredTasks.length} Result{filteredTasks.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                                    <thead>
                                        <tr style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            <th style={{ textAlign: 'left', padding: '0 16px' }}>Task Description</th>
                                            <th style={{ textAlign: 'left', padding: '0 16px' }}>Site Context</th>
                                            <th style={{ textAlign: 'left', padding: '0 16px' }}>Timeline</th>
                                            <th style={{ textAlign: 'left', padding: '0 16px' }}>Execution Team</th>
                                            <th style={{ textAlign: 'center', padding: '0 16px' }}>Status</th>
                                            <th style={{ textAlign: 'right', padding: '0 16px' }}>Action & Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTasks.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                                        <MagnifyingGlass size={48} weight="thin" />
                                                        <div style={{ fontWeight: 800 }}>No tasks match your filters</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredTasks.map(task => (
                                            <tr key={task._id} className="task-row" style={{
                                                background: 'white', borderRadius: '16px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9',
                                                transition: 'transform 0.2s ease'
                                            }}>
                                                <td style={{ padding: '20px 16px', borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {task.isCriticalPath && <Star size={18} weight="fill" color="#eab308" title="Critical Path Task" />}
                                                        <div style={{ fontWeight: 800, color: '#1e293b' }}>{task.task}</div>
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>ID: {task._id?.substring(18) || 'N/A'}</div>
                                                </td>
                                                <td style={{ padding: '20px 16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                                                        <MapPin size={18} color="#64748b" /> {task.locationArea || 'Main Site'}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '20px 16px' }}>
                                                    <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 700 }}>{task.duration || 1} Days</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ends: {task.endDate ? new Date(task.endDate).toLocaleDateString() : 'TBD'}</div>
                                                </td>
                                                <td style={{ padding: '20px 16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                                                        <Users size={18} weight="duotone" /> {task.assignedTeam || 'General'}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <StatusBadge status={task.status} />
                                                        <RiskDot level={task.riskLevel} />
                                                    </div>
                                                </td>
                                                <td style={{ padding: '20px 16px', textAlign: 'right', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                                                        <div style={{ display: 'flex', gap: '6px' }}>
                                                            {/* Role-Based Action Buttons */}
                                                            {user?.role === 'Site Manager' && (
                                                                <>
                                                                    <ActionButton icon={<ArrowsClockwise size={14} />} label="Update" title="Update Progress %" onClick={() => handleAction(task, 'update')} />
                                                                    <ActionButton icon={<FileText size={14} />} label="Remark" title="Add Daily Remarks" onClick={() => handleAction(task, 'remark')} />
                                                                </>
                                                            )}
                                                            {user?.role === 'Civil Engineer' && (
                                                                <>
                                                                    <ActionButton icon={<CalendarDots size={14} />} label="Duration" title="Modify Duration" onClick={() => handleAction(task, 'timeline')} />
                                                                    <ActionButton icon={<ArrowRight size={14} />} label="Deps" title="Adjust Dependencies" onClick={() => handleAction(task, 'deps')} />
                                                                </>
                                                            )}
                                                            {(user?.role === 'Admin' || user?.role === 'Builder') && (
                                                                <>
                                                                    <ActionButton icon={<LockIcon size={14} />} label="Approve" title="Approve Reschedule" color="#10b981" onClick={() => handleAction(task, 'approve')} />
                                                                    <ActionButton icon={<LockIcon size={14} />} label="Baseline" title="Lock Baseline" onClick={() => handleAction(task, 'baseline')} />
                                                                </>
                                                            )}
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ fontWeight: 900, fontSize: '0.9rem', color: '#1e293b' }}>{task.progress}%</span>
                                                            <div style={{ width: '60px', height: '6px', background: '#f1f5f9', borderRadius: '3px' }}>
                                                                <div style={{ width: `${task.progress}%`, height: '100%', background: 'var(--pivot-blue)', borderRadius: '3px' }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'resources' && (
                            <div style={{ padding: '32px 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b' }}>Resource Mapping & Risk Alerts</h3>
                                        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Labor, material allocation and dependency tracking</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <AlertSummary count={resourceShortageCount} label="Resource Conflicts" />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {currentTasks.map(task => (
                                        <div key={task._id} style={{
                                            padding: '24px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9',
                                            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '24px'
                                        }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: task.riskLevel === 'High' ? '#ef4444' : task.riskLevel === 'Medium' ? '#f59e0b' : '#10b981' }}></div>
                                                    <span style={{ fontWeight: 800, color: '#1e293b' }}>{task.task}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>{task.category}</span>
                                                    {task.isCriticalPath && <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#9a3412', background: '#ffedd5', padding: '4px 8px', borderRadius: '6px' }}>CRITICAL PATH</span>}
                                                </div>
                                            </div>

                                            {/* Labor Mapping */}
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <HardHat size={14} /> Labor Allocation
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {task.resources.labor.map((l, idx) => (
                                                        <span key={idx} style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#eff6ff', color: '#1e40af', borderRadius: '8px', fontWeight: 600 }}>{l}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Material Alerts */}
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Package size={14} /> Materials
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    {task.resources.materials.map((m, idx) => (
                                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                                                            <span style={{ fontWeight: 600, color: '#475569' }}>{m.item} ({m.qtyNeeded} {m.unit})</span>
                                                            {m.status === 'Shortage' ? (
                                                                <span style={{ color: '#ef4444', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}><Warning size={14} /> Shortage</span>
                                                            ) : (
                                                                <span style={{ color: '#10b981', fontWeight: 800 }}><CheckCircle size={14} /> OK</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Equipment Conflict */}
                                            <div>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Truck size={14} /> Equipment
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    {task.resources.equipment.map((e, idx) => (
                                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                                                            <span style={{ fontWeight: 600, color: '#475569' }}>{e.name}</span>
                                                            {e.status === 'Conflict' ? (
                                                                <span style={{ color: '#f59e0b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}><WarningOctagon size={14} /> Conflict</span>
                                                            ) : (
                                                                <span style={{ color: '#10b981', fontWeight: 800 }}><ShieldCheck size={14} /> Avail</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'analysis' && (
                            <div style={{ padding: '32px 0' }}>
                                <div style={{
                                    padding: '24px', background: '#fff1f2', borderRadius: '24px', border: '1px solid #fecdd3',
                                    marginBottom: '32px', display: 'flex', gap: '20px', alignItems: 'center'
                                }}>
                                    <TrendDown size={36} color="#e11d48" weight="duotone" />
                                    <div>
                                        <h4 style={{ color: '#9f1239', fontWeight: 900, margin: 0, fontSize: '1.2rem' }}>Baseline Performance Analysis</h4>
                                        <p style={{ color: '#be123c', fontSize: '0.9rem', margin: '4px 0 0', fontWeight: 500 }}>Advanced tracking of scheduled vs. actual delivery milestones.</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {currentTasks.map(task => {
                                        const plannedEnd = task.endDate ? new Date(task.endDate) : new Date();
                                        const isDelayed = task.status === 'Delayed' || (task.progress < 100 && plannedEnd < new Date());
                                        const delayDays = isDelayed ? Math.ceil((new Date() - plannedEnd) / (1000 * 60 * 60 * 24)) : 0;

                                        return (
                                            <div key={task._id} style={{
                                                padding: '24px 32px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9',
                                                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center',
                                                boxShadow: isDelayed ? '0 4px 12px rgba(239, 68, 68, 0.05)' : 'none'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem' }}>{task.task}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{task.category}</span>
                                                        {task.isCriticalPath && <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#eab308' }}>CRITICAL PATH</span>}
                                                    </div>
                                                </div>

                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Baseline Target</div>
                                                    <div style={{ fontWeight: 700, color: '#475569' }}>{task.endDate ? new Date(task.endDate).toLocaleDateString() : 'Unset'}</div>
                                                </div>

                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Deviation</div>
                                                    <div style={{
                                                        fontWeight: 900,
                                                        color: delayDays > 0 ? '#ef4444' : '#10b981',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                                        fontSize: '1.1rem'
                                                    }}>
                                                        {delayDays > 0 ? `+${delayDays} Days` : '0 Days'}
                                                    </div>
                                                </div>

                                                <div style={{ textAlign: 'right' }}>
                                                    {delayDays > 0 ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                                                            <span style={{ fontSize: '0.7rem', padding: '6px 12px', background: '#fee2e2', color: '#991b1b', borderRadius: '10px', fontWeight: 800 }}>SLIPPAGE DETECTED</span>
                                                            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                                                                <Info size={14} /> Potential over-run risk
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                            <ShieldCheck size={20} weight="fill" /> ON SCHEDULE
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Unified Footer */}
                    <div style={{
                        padding: '28px 40px', background: '#f8fafc', borderTop: '1px solid #f1f5f9',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                                <Pulse size={18} weight="duotone" color="var(--pivot-blue)" />
                                <span>System Sync: <span style={{ fontWeight: 700, color: '#0f172a' }}>Real-time</span></span>
                            </div>
                            <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }}></div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                                Critical Tasks: <span style={{ fontWeight: 700, color: '#eab308' }}>{criticalTasksCount}</span>
                            </div>
                            <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }}></div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <ReportChip
                                    icon={<FileText size={14} />}
                                    label="Delay Report"
                                    onClick={() => setActiveTab('analysis')}
                                />
                                <ReportChip
                                    icon={<ChartLineUp size={14} />}
                                    label="Progress Snapshot"
                                    onClick={() => setActiveTab('overview')}
                                />
                            </div>
                        </div>
                        <button onClick={onClose} style={{
                            padding: '14px 40px', background: 'white', border: '1px solid #e2e8f0',
                            borderRadius: '16px', fontWeight: 800, color: '#475569', cursor: 'pointer',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'all 0.2s',
                            fontSize: '0.95rem'
                        }}>
                            Close Master Schedule
                        </button>
                    </div>

                    {/* Quick Action Overlay */}
                    {activeAction && (
                        <ActionOverlay
                            action={activeAction}
                            onClose={() => setActiveAction(null)}
                            onSubmit={submitAction}
                        />
                    )}
                </div>
            </div>

            <style>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(80px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .task-row:hover {
                    box-shadow: 0 10px 20px -5px rgba(0,0,0,0.08) !important;
                    border-color: var(--pivot-blue) !important;
                    transform: translateY(-2px);
                }
                .report-chip:hover {
                    background: #f8fafc !important;
                    border-color: var(--pivot-blue) !important;
                    color: var(--pivot-blue) !important;
                    transform: translateY(-1px);
                }
                .action-button:hover {
                    border-color: var(--pivot-blue) !important;
                    color: var(--pivot-blue) !important;
                    background: #f0f7ff !important;
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes notifyFade {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </>
    );
};

// --- Action Overlay Component ---
const ActionOverlay = ({ action, onClose, onSubmit }) => {
    const [val, setVal] = useState(action.type === 'update' ? action.task.progress : '');

    const titles = {
        update: 'Update Progress %',
        remark: 'Add Site Remarks',
        timeline: 'Modify Duration (Days)',
        deps: 'Adjust Dependencies',
        approve: 'Approve Schedule Update',
        baseline: 'Lock Control Baseline'
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {};
        if (action.type === 'update') data.progress = parseInt(val);
        if (action.type === 'timeline') data.duration = parseInt(val);
        if (action.type === 'remark') data.remark = val;
        onSubmit(data);
    };

    return (
        <div style={{
            position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10005, animation: 'fadeIn 0.2s ease'
        }}>
            <div style={{
                background: 'white', width: '400px', padding: '32px', borderRadius: '24px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.2)', position: 'relative'
            }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <X size={20} weight="bold" />
                </button>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '8px', color: '#0f172a' }}>{titles[action.type]}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Task: <span style={{ fontWeight: 700, color: '#0047AB' }}>{action.task.task}</span></p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {(action.type === 'update' || action.type === 'timeline') && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                                New Value ({action.type === 'update' ? '%' : 'Days'})
                            </label>
                            <input
                                type="number"
                                autoFocus
                                value={val}
                                onChange={(e) => setVal(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '12px', border: '2.5px solid #edf2f7',
                                    fontSize: '1rem', fontWeight: 700, outline: 'none'
                                }}
                            />
                        </div>
                    )}

                    {action.type === 'remark' && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Remark Description</label>
                            <textarea
                                autoFocus
                                value={val}
                                onChange={(e) => setVal(e.target.value)}
                                rows={4}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '12px', border: '2.5px solid #edf2f7',
                                    fontSize: '0.9rem', fontWeight: 600, outline: 'none', resize: 'none'
                                }}
                                placeholder="Enter site observation..."
                            />
                        </div>
                    )}

                    {(action.type === 'approve' || action.type === 'baseline' || action.type === 'deps') && (
                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                            <Info size={20} color="#0047AB" />
                            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                                {action.type === 'approve' ? 'Confirm approval of the proposed rescheduling for this work package.' :
                                    action.type === 'baseline' ? 'Lock the current schedule as the official control baseline for auditing.' :
                                        'Enter advanced dependency adjustment mode (AI Engine enabled).'}
                            </p>
                        </div>
                    )}

                    <button type="submit" style={{
                        padding: '14px', background: '#0047AB', color: 'white', border: 'none',
                        borderRadius: '12px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,71,171,0.2)', marginTop: '8px'
                    }}>
                        {action.type === 'approve' ? 'Approve Now' : action.type === 'baseline' ? 'Lock Baseline' : 'Save Changes'}
                    </button>
                </form>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

const FilterSelect = ({ value, onChange, label, options }) => (
    <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', top: '-8px', left: '12px', background: 'white', padding: '0 4px', fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>{label}</span>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                padding: '10px 32px 10px 12px', borderRadius: '14px', border: '1.5px solid #e2e8f0',
                background: 'white', fontWeight: 700, fontSize: '0.85rem', color: '#334155', outline: 'none', appearance: 'none', cursor: 'pointer'
            }}
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <CaretDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
    </div>
);

const ActionButton = ({ icon, label, title, onClick, color = "#64748b" }) => (
    <button
        title={title}
        onClick={onClick}
        className="action-button"
        style={{
            padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white',
            fontSize: '0.7rem', fontWeight: 800, color: color, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
            transition: 'all 0.2s'
        }}
    >
        {icon} {label}
    </button>
);

const ReportChip = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="report-chip"
        style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px',
            background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px',
            fontSize: '0.75rem', fontWeight: 700, color: '#475569', cursor: 'pointer', transition: 'all 0.2s'
        }}
    >
        {icon} {label}
    </button>
);

const TabButton = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} style={{
        padding: '12px 24px', border: 'none', borderRadius: '14px',
        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
        background: active ? 'white' : 'transparent',
        color: active ? '#0f172a' : '#64748b',
        fontWeight: active ? 900 : 700,
        boxShadow: active ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontSize: '0.9rem'
    }}>
        {icon} {label}
    </button>
);

const RiskDot = ({ level }) => {
    const color = level === 'High' ? '#ef4444' : level === 'Medium' ? '#f59e0b' : '#10b981';
    const label = level === 'High' ? 'CRITICAL' : level === 'Medium' ? 'AT RISK' : 'HEALTHY';
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 10px ${color}44` }}></div>
            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: color }}>{label}</span>
        </div>
    );
};

const AlertSummary = ({ count, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: count > 0 ? '#fef2f2' : '#f0fdf4', padding: '8px 16px', borderRadius: '12px', border: `1px solid ${count > 0 ? '#fecaca' : '#dcfce7'}` }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: count > 0 ? '#ef4444' : '#10b981' }}>{count}</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>{label}</div>
    </div>
);

const StatusBadge = ({ status }) => {
    const config = {
        'Completed': { bg: '#dcfce7', text: '#15803d', icon: <CheckCircle weight="fill" /> },
        'On Track': { bg: '#eff6ff', text: '#3b82f6', icon: <ShieldCheck weight="fill" /> },
        'Delayed': { bg: '#fef2f2', text: '#ef4444', icon: <WarningOctagon weight="fill" /> },
        'Not Started': { bg: '#f1f5f9', text: '#64748b', icon: <Clock weight="fill" /> }
    }[status] || { bg: '#f1f5f9', text: '#64748b', icon: <Info weight="fill" /> };

    return (
        <span style={{
            fontSize: '0.75rem', padding: '6px 14px', borderRadius: '10px',
            background: config.bg, color: config.text, fontWeight: 900,
            display: 'inline-flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase'
        }}>
            {config.icon} {status}
        </span>
    );
};

export default ProjectScheduleModal;
