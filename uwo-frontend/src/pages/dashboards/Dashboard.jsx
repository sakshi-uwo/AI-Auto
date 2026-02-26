import React, { useState, useEffect } from 'react';
import { UserPlus, Lightning, Calendar, CurrencyDollar, Plus, Robot, Globe } from '@phosphor-icons/react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import LeadStatusChart from '../../components/LeadStatusChart';

import { dashboardService, leadService, projectService } from '../../services/api';
import socketService from '../../services/socket';

const MetricCard = ({ icon: Icon, title, value, detail, detailColor, action }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div
            className="card overview-card"
            style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--pivot-blue-soft)', color: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <Icon size={24} weight="bold" />
                </div>
                {action && (
                    <div style={{
                        cursor: 'pointer',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--pivot-blue-soft)',
                        transition: 'all 0.3s ease',
                        color: 'var(--pivot-blue)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }} className="metric-action-btn">
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{action.label}</span>
                    </div>
                )}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--charcoal)', fontWeight: 500 }}>{title}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{value}</div>
            <div style={{ fontSize: '0.75rem', marginTop: '5px', color: detailColor || 'inherit' }}>
                {typeof detail === 'string' ? detail : detail(isHovered)}
            </div>
        </div>
    );
};

const Dashboard = ({ setCurrentPage }) => {
    const [stats, setStats] = useState(null);
    const [redirectStats, setRedirectStats] = useState([]);
    const [leads, setLeads] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredStatus, setHoveredStatus] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, leadsRes, projectsRes, redirectRes] = await Promise.all([
                    dashboardService.getStats(),
                    leadService.getAll(),
                    projectService.getAll(),
                    axios.get(`${API_BASE_URL}/redirect/stats/all`)
                ]);

                setStats(statsRes);
                setLeads(leadsRes || []);
                setProjects(projectsRes || []);
                setRedirectStats(redirectRes.data || []);
            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

        // Real-time listener
        socketService.on('dashboard-update', (newStats) => {
            setStats(newStats);
        });

        socketService.on('redirectUpdate', (updatedRedirect) => {
            console.log('[REAL-TIME] Redirect Update Received:', updatedRedirect);
            setRedirectStats(prev => {
                const index = prev.findIndex(r => r.source === updatedRedirect.source);
                if (index !== -1) {
                    const newStats = [...prev];
                    newStats[index] = updatedRedirect;
                    return newStats;
                }
                return [updatedRedirect, ...prev];
            });
        });

        socketService.on('lead-added', (lead) => {
            setLeads(prev => [lead, ...prev]);
        });

        socketService.on('lead-updated', (updatedLead) => {
            setLeads(prev => prev.map(l => l._id === updatedLead._id ? updatedLead : l));
        });

        socketService.on('project-added', (project) => {
            setProjects(prev => [project, ...prev]);
        });

        socketService.on('project-updated', (updatedProject) => {
            setProjects(prev => prev.map(p => p._id === updatedProject._id ? updatedProject : p));
        });

        return () => {
            socketService.off('dashboard-update');
            socketService.off('lead-added');
            socketService.off('lead-updated');
            socketService.off('project-added');
            socketService.off('project-updated');
        };
    }, []);

    const activeStatus = hoveredStatus || selectedStatus;

    const chartData = stats ? [
        { label: 'Hot', value: stats.distribution.Hot, color: '#ff4d4d', detail: 'High conversion potential' },
        { label: 'Warm', value: stats.distribution.Warm, color: '#ff9f4d', detail: 'Active engagement' },
        { label: 'Cold', value: stats.distribution.Cold, color: '#4d9fff', detail: 'Initial contact made' },
    ] : null;

    const renderLeadsDetail = (isHovered) => (
        <div style={{ display: 'flex', gap: '8px', transition: 'all 0.3s ease' }}>
            <span style={{ color: isHovered ? '#ff4d4d' : 'inherit', fontWeight: isHovered ? 700 : 500 }}>{stats?.distribution.Hot || 0} Hot</span>
            <span style={{ opacity: 0.3 }}>•</span>
            <span style={{ color: isHovered ? '#ff9f4d' : 'inherit', fontWeight: isHovered ? 700 : 500 }}>{stats?.distribution.Warm || 0} Warm</span>
            <span style={{ opacity: 0.3 }}>•</span>
            <span style={{ color: isHovered ? '#4d9fff' : 'inherit', fontWeight: isHovered ? 700 : 500 }}>{stats?.distribution.Cold || 0} Cold</span>
        </div>
    );

    if (loading) return <div style={{ padding: '2rem' }}>Loading Dashboard...</div>;

    return (
        <div style={{ padding: isMobile ? '1rem' : '2rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)', gap: '1.5rem' }}>
            <MetricCard
                icon={UserPlus}
                title="Total Leads"
                value={stats?.totalLeads || 0}
                detail={renderLeadsDetail}
            />
            <MetricCard
                icon={Lightning}
                title="Active Projects"
                value={stats?.activeProjects || 0}
                detail="Across all regions"
                detailColor="#4CAF50"
            />
            <MetricCard
                icon={Calendar}
                title="Site Visits"
                value={stats?.siteVisits || 0}
                detail="Scheduled for today"
                detailColor="var(--pivot-blue)"
            />
            <MetricCard
                icon={CurrencyDollar}
                title="Projected Revenue"
                value={stats?.projectedRevenue || "$0"}
                detail="From Hot leads"
                detailColor="#4CAF50"
            />
            <MetricCard
                icon={Globe}
                title="Social Traffic"
                value={redirectStats.reduce((acc, curr) => acc + curr.count, 0)}
                detail={`${redirectStats.length} active sources`}
                detailColor="var(--pivot-blue)"
            />

            {/* Leads Distribution & Management Section */}
            <div className="card"
                style={{
                    gridColumn: isMobile ? 'span 1' : 'span 3',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}
            >

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Leads Distribution & Analysis</h2>
                    <span
                        style={{ color: 'var(--pivot-blue)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                        onClick={() => setCurrentPage('leads')}
                    >
                        View Full Analytics
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '2rem', minHeight: '260px', alignItems: 'center', background: 'rgba(0, 71, 171, 0.02)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                    <div style={{ flexShrink: 0 }}>
                        <LeadStatusChart
                            compact={false}
                            onHover={setHoveredStatus}
                            onClick={setSelectedStatus}
                            selection={selectedStatus}
                            data={chartData}
                        />
                    </div>

                    <div style={{
                        flex: 1,
                        opacity: activeStatus ? 1 : 0.5,
                        transition: 'all 0.4s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '1rem',
                        borderLeft: '1px solid var(--glass-border)'
                    }}>
                        {activeStatus ? (
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: activeStatus === 'Hot' ? '#ff4d4d' : activeStatus === 'Warm' ? '#ff9f4d' : '#4d9fff', marginBottom: '0.5rem' }}>
                                    {activeStatus} Status Impact
                                </h3>
                                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', marginTop: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '5px' }}>Current Count</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{stats?.distribution[activeStatus]} Leads</div>
                                </div>
                                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--charcoal)', opacity: 0.7 }}>
                                    {activeStatus === 'Hot' ? 'Primary focus for sales closure this week.' :
                                        activeStatus === 'Warm' ? 'Requires follow-up calls and site visit invitations.' :
                                            'Potential for long-term nurturing.'}
                                </p>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--charcoal)', opacity: 0.6 }}>
                                <div style={{ fontSize: '1rem', fontWeight: 500 }}>Hover over chart segments</div>
                                <div style={{ fontSize: '0.8rem' }}>to view contextual lead insights</div>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--soft-black)', marginBottom: '1rem', padding: '0 0.5rem' }}>Recent Leads Performance</h3>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--charcoal)', opacity: 0.6 }}>
                                <th style={{ padding: '0.8rem', fontSize: '0.8rem', fontWeight: 600 }}>Lead Name</th>
                                <th style={{ padding: '0.8rem', fontSize: '0.8rem', fontWeight: 600 }}>Status</th>
                                <th style={{ padding: '0.8rem', fontSize: '0.8rem', fontWeight: 600 }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.slice(0, 5).map((lead, i) => (
                                <tr key={i} style={{ fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.4)' }} className="table-row">
                                    <td style={{ padding: '1rem 0.8rem', fontWeight: 700, color: 'var(--soft-black)', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                                        {lead.name || lead.user?.name || 'Valued Lead'}
                                    </td>
                                    <td style={{ padding: '1rem 0.8rem' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            background: lead.status === 'Hot' ? '#ffebeb' : (lead.status === 'Warm' ? '#fff4eb' : '#ebf4ff'),
                                            color: lead.status === 'Hot' ? '#ff4d4d' : (lead.status === 'Warm' ? '#ff9f4d' : '#4d9fff')
                                        }}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 0.8rem', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Property Summary & Traffic Sources */}
            <div className="card" style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Inventory & Traffic</h2>

                {/* Traffic Sources Mini-List */}
                <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--pivot-blue-soft)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pivot-blue)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Globe size={16} /> Live Sources
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {redirectStats.slice(0, 3).map((r, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ textTransform: 'capitalize' }}>{r.source}</span>
                                <span style={{ fontWeight: 700 }}>{r.count}</span>
                            </div>
                        ))}
                        {redirectStats.length === 0 && <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>No external traffic tracked yet.</div>}
                    </div>
                </div>

                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Inventory Status</h3>

                {projects.slice(0, 5).map((p, i) => {
                    const soldPercent = Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100) || 0;
                    return (
                        <div key={i} style={{ marginBottom: '1.2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                                <span>{p.name}</span>
                                <span style={{ fontWeight: 700 }}>{soldPercent}% Sold</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--light-grey)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${soldPercent}%`, background: 'var(--pivot-blue)', borderRadius: '4px' }}></div>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--charcoal)', marginTop: '4px', textAlign: 'right' }}>
                                {p.availableUnits} units left
                            </div>
                        </div>
                    );
                })}
                {projects.length === 0 && <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>No active projects</div>}
            </div>

        </div>
    );
};

export default Dashboard;
