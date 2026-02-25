import React, { useState, useEffect } from 'react';
import {
    Plus, Buildings, Users, Gear, ChartLineUp,
    CurrencyDollar, PencilSimple, Trash, UserPlus,
    ArrowRight, CheckCircle, WarningCircle, Sparkle,
    FileArrowUp, Calendar, Clock, Checks, FileText,
    Robot, HardDrive, MagnifyingGlass, HardHat,
    TreasureChest, ShieldCheck, ChatCircleText, TrendUp
} from '@phosphor-icons/react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';
import CreateProjectModal from '../../components/CreateProjectModal';
import AIPlanningModal from '../../components/AIPlanningModal';
import ScheduleGenerationModal from '../../components/ScheduleGenerationModal';
import MilestoneManagementModal from '../../components/MilestoneManagementModal';
import UploadDocsModal from '../../components/UploadDocsModal';

const BuilderDashboard = () => {
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const [showAIPlanningModal, setShowAIPlanningModal] = useState(false);
    const [showScheduleGenerationModal, setShowScheduleGenerationModal] = useState(false);
    const [showMilestoneModal, setShowMilestoneModal] = useState(false);
    const [showUploadDocsModal, setShowUploadDocsModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [subContractors, setSubContractors] = useState([]);
    const [financialSummary, setFinancialSummary] = useState({ totalBudget: 0, totalSpent: 0 });
    const [loading, setLoading] = useState(true);

    const inventoryAlerts = [
        { id: 1, item: 'Cement Bags', status: 'Low Stock', project: 'Skyline Towers' },
        { id: 2, item: 'Steel Rods', status: 'Reorder Now', project: 'Green Valley' }
    ];

    const purchaseOrders = [
        { id: 101, item: 'HVAC Units', amount: '$12,000', status: 'Pending Approval', vendor: 'AirCool Systems' },
        { id: 102, item: 'Safety Gear', amount: '$2,500', status: 'Approved', vendor: 'SafeBuild Inc.' }
    ];

    const safetyReports = [
        { id: 1, site: 'Downtown A', status: 'Compliant', date: '2026-02-18' },
        { id: 2, site: 'West Wing', status: 'Action Required', date: '2026-02-17' },
    ];

    const [attStats, setAttStats] = useState({ totalWorkers: 0, present: 0 });

    useEffect(() => {
        fetchDashboardData();

        // Real-time listeners
        socketService.on('project-added', fetchDashboardData);
        socketService.on('project-updated', fetchDashboardData);
        socketService.on('attendanceUpdated', fetchDashboardData);

        return () => {
            socketService.off('project-added');
            socketService.off('project-updated');
            socketService.off('attendanceUpdated');
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [projectsRes, subsRes, attStatsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/projects`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/users?role=subcontractor`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/attendance/stats`).catch(() => ({ data: { totalWorkers: 0, present: 0 } }))
            ]);

            setProjects(projectsRes.data || []);
            setSubContractors(subsRes.data || []);
            setAttStats(attStatsRes.data);

            const totalBudget = (projectsRes.data || []).reduce((acc, curr) => acc + (curr.budget || 0), 0);
            const totalSpent = (projectsRes.data || []).reduce((acc, curr) => acc + (curr.spent || 0), 0);
            setFinancialSummary({ totalBudget, totalSpent });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (projectData) => {
        try {
            const payload = {
                name: projectData.projectName,
                location: projectData.siteAddress || projectData.location,
                budget: projectData.estimatedCost ? `$${parseFloat(projectData.estimatedCost).toLocaleString()}` : "$0",
                description: projectData.description,
                status: projectData.status || 'Active',
                startDate: projectData.startDate,
                endDate: projectData.endDate
            };

            if (selectedProject) {
                // Update existing project
                const response = await axios.patch(`${API_BASE_URL}/projects/${selectedProject._id}`, payload);
                setProjects(prev => prev.map(p => p._id === selectedProject._id ? response.data : p));
                console.log('✅ Project updated successfully');
            } else {
                // Create new project
                const response = await axios.post(`${API_BASE_URL}/projects`, payload);
                setProjects([response.data, ...projects]);
                console.log('✅ Project created successfully');
            }

            setShowCreateProjectModal(false);
            setSelectedProject(null);
        } catch (error) {
            console.error('Error saving project:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
            alert(`Failed to save project: ${errorMsg}`);
        }
    };

    const FeatureCard = ({ title, icon, children, action, actionIcon }) => (
        <div className="dashboard-card" style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '20px',
            border: '1px solid #f0f0f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b', margin: 0 }}>
                    {icon} {title}
                </h3>
                {action && (
                    <button style={{
                        background: 'transparent', border: 'none', color: 'var(--pivot-blue)',
                        fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px'
                    }}>
                        {action} {actionIcon && <ArrowRight size={14} weight="bold" />}
                    </button>
                )}
            </div>
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#003380', margin: 0 }}>Project Portfolio</h2>
                    <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1rem', marginTop: '4px' }}>Manage your construction projects and resources</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setShowUploadDocsModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                            background: 'white', color: '#003380', border: '1px solid #003380',
                            borderRadius: '12px', fontWeight: 700, cursor: 'pointer'
                        }}
                    >
                        <FileArrowUp size={20} weight="bold" /> Upload Docs
                    </button>
                    <button
                        onClick={() => {
                            setSelectedProject(null);
                            setShowCreateProjectModal(true);
                        }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                            background: '#0047AB', color: 'white', border: 'none',
                            borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0, 71, 171, 0.2)'
                        }}
                    >
                        <Plus size={20} weight="bold" /> Start New Project
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '2rem' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Quick Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        <div style={{
                            background: '#0047AB', padding: '2rem', borderRadius: '24px',
                            color: 'white', boxShadow: '0 10px 25px rgba(0, 71, 171, 0.2)'
                        }}>
                            <TrendUp size={32} weight="bold" style={{ marginBottom: '1rem' }} />
                            <div style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 600 }}>Portfolio Progress</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 900 }}>
                                    {projects.length > 0 ? (projects.reduce((a, b) => a + (b.progress || 0), 0) / projects.length).toFixed(1) : 0}%
                                </span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Avg</span>
                            </div>
                        </div>
                        <div style={{
                            background: 'white', padding: '2rem', borderRadius: '24px',
                            border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}>
                            <CurrencyDollar size={32} weight="bold" color="#0047AB" style={{ marginBottom: '1rem' }} />
                            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Total Budget Allocated</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>
                                ${(financialSummary.totalBudget / 1000).toFixed(1)}k
                            </div>
                        </div>
                        <div style={{
                            background: 'white', padding: '2rem', borderRadius: '24px',
                            border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}>
                            <Users size={32} weight="bold" color="#6366f1" style={{ marginBottom: '1rem' }} />
                            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Active Resource Count</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>{attStats.present} Pax</div>
                        </div>
                    </div>

                    {/* Active Construction Projects */}
                    <div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Buildings size={24} weight="fill" color="#0047AB" /> Active Construction Projects
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {projects.length > 0 ? projects.map((project, idx) => (
                                <div key={project._id || idx} style={{
                                    background: 'white', padding: '2rem', borderRadius: '24px',
                                    border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{project.name}</h4>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProject(project);
                                                        setShowCreateProjectModal(true); // Reusing CreateProjectModal for editing
                                                    }}
                                                    style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                                >
                                                    <PencilSimple size={16} weight="bold" />
                                                </button>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>{project.location || 'Location not specified'}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0047AB' }}>{project.progress || 0}%</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Progress</div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Calendar size={18} /> Project Timeline
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedProject(project);
                                                    setShowMilestoneModal(true);
                                                }}
                                                style={{ background: 'none', border: 'none', color: '#0047AB', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                                            >
                                                Manage Milestones
                                            </button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                            {(project.timeline || [
                                                { label: 'Planning', date: 'TBD', color: '#f1f5f9', textColor: '#64748b' },
                                                { label: 'Foundation', date: 'TBD', color: '#f1f5f9', textColor: '#64748b' },
                                                { label: 'Structure', date: 'TBD', color: '#f1f5f9', textColor: '#64748b' }
                                            ]).slice(0, 3).map((item, midx) => (
                                                <div key={midx} style={{
                                                    padding: '12px', background: item.color || '#f1f5f9', borderRadius: '12px',
                                                    border: item.active ? '1px solid #0047AB' : 'none'
                                                }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: item.textColor || '#64748b' }}>{item.label}</div>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: item.textColor || '#64748b', opacity: 0.8 }}>{item.date}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Financial Snapshot</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                <div>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>{project.spent || '$0'}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Spent of {project.budget || '$0'}</div>
                                                </div>
                                                <CurrencyDollar size={24} color="#0047AB" />
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Assignment</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%', background: '#0047AB',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'white', fontSize: '0.75rem', fontWeight: 800
                                                }}>
                                                    {project.assignedTo?.name?.charAt(0) || 'U'}
                                                </div>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{project.assignedTo?.name || 'Unassigned'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                                    <p style={{ color: '#64748b', fontWeight: 600 }}>No active projects found. Use the buttons above or the AI Advisor to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* AI Project Advisor */}
                    <div style={{
                        background: '#001a4d', padding: '2rem', borderRadius: '24px',
                        color: 'white', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                            <Sparkle size={24} weight="fill" color="#ffd700" />
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>AI Project Advisor</h4>
                        </div>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.9, fontWeight: 500, marginBottom: '1.5rem' }}>
                            "Based on the steel shortage in North Suburbs, I recommend pre-stocking rebar for **Green Valley residency** within the next 48 hours to avoid a 12% cost hike."
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <button
                                onClick={() => setShowAIPlanningModal(true)}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '12px',
                                    background: 'white', color: '#001a4d', border: 'none',
                                    fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
                                }}>Analyze Planning</button>
                            <button
                                onClick={() => setShowScheduleGenerationModal(true)}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '12px',
                                    background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)',
                                    fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
                                }}>Generate Schedule</button>
                        </div>
                        <Robot size={100} weight="light" style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1 }} />
                    </div>

                    {/* Expense Approvals */}
                    <div style={{
                        background: 'white', padding: '1.8rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Checks size={20} color="#16a34a" weight="bold" /> Expense Approvals
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { item: 'Steel Reinforcement', amount: '45,000', project: 'Skyline Towers', time: 'Today' },
                                { item: 'Labor Overtime (W12)', amount: '12,400', project: 'Green Valley', time: 'Yesterday' }
                            ].map((expense, idx) => (
                                <div key={idx} style={{ padding: '1.2rem', border: '1px solid #f1f5f9', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{expense.item}</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0047AB' }}>${expense.amount}</div>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, margin: '0 0 12px 0' }}>{expense.project} • {expense.time}</p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={{ flex: 1, padding: '8px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Approve</button>
                                        <button style={{ padding: '8px 16px', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Decline</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Project Documents */}
                    <div style={{
                        background: 'white', padding: '1.8rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HardDrive size={20} color="#0047AB" weight="bold" /> Project Documents
                        </h4>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <MagnifyingGlass size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Search files..."
                                style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { name: 'Blueprint_Final_v2.pdf', meta: 'Technical • Skyline Towers' },
                                { name: 'Structural_Audit_Report.docx', meta: 'Compliance • Green Valley' }
                            ].map((doc, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '8px', color: '#0047AB' }}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{doc.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{doc.meta}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Retaining AI Modals */}
            {showCreateProjectModal && (
                <CreateProjectModal
                    project={selectedProject}
                    onClose={() => {
                        setShowCreateProjectModal(false);
                        setSelectedProject(null);
                    }}
                    onSave={handleCreateProject}
                />
            )}
            {showAIPlanningModal && <AIPlanningModal onClose={() => setShowAIPlanningModal(false)} />}
            {showScheduleGenerationModal && <ScheduleGenerationModal onClose={() => setShowScheduleGenerationModal(false)} />}
            {showMilestoneModal && (
                <MilestoneManagementModal
                    project={selectedProject}
                    onClose={() => {
                        setShowMilestoneModal(false);
                        setSelectedProject(null);
                    }}
                />
            )}
            {showUploadDocsModal && (
                <UploadDocsModal onClose={() => setShowUploadDocsModal(false)} />
            )}
        </div>
    );
};

export default BuilderDashboard;
