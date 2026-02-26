import React, { useState } from 'react';
import {
    FilePdf, FileXls, ArrowsClockwise,
    CalendarBlank, CaretDown, Funnel,
    ChartBar, ChartLineUp, FileText,
    DownloadSimple, CheckCircle, Clock,
    Buildings, UsersThree, CurrencyDollar,
    Lightning, WarningCircle, ChartPie,
    Brain, TrendUp, ShieldCheck, HardHat,
    Storefront, Truck, Handshake, Receipt,
    Bank, Wallet, UserCircle, Desktop, Pulse, Lock as LockIcon
} from '@phosphor-icons/react';
import { authService } from '../../services/api';

const GlobalReports = ({ setCurrentPage }) => {
    const [dateRange, setDateRange] = useState('This Month');
    const [projectFilter, setProjectFilter] = useState('All Projects');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeTab, setActiveTab] = useState('Overview');
    const [exportStatus, setExportStatus] = useState(null); // null | 'pdf' | 'excel' | 'success'
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 820);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 820);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const tabs = [
        'Overview', 'Cost & Budget', 'Automation',
        'AI Insights', 'Quality & Safety', 'Vendors',
        'Finance', 'Users & System', 'Audit (Progress Data)'
    ];

    const dateOptions = ['Today', 'Weekly', 'Monthly', 'Custom'];
    const projectOptions = ['All Projects', 'Downtown Heights', 'Green Valley Estate', 'Skyline Towers'];

    const toggleDropdown = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const handleExport = (type) => {
        setExportStatus(type);
        setTimeout(() => {
            setExportStatus('success');

            if (type === 'excel') {
                const csvData = [
                    ['Report Type', 'Global Enterprise Performance'],
                    ['Project Filter', projectFilter],
                    ['Date Range', dateRange],
                    ['Generated On', new Date().toLocaleString()],
                    [],
                    ['Tab', 'Metric', 'Value'],
                    ['Overview', 'Total Projects', '42'],
                    ['Overview', 'Efficiency', '92%'],
                    ['Cost', 'Total Budget', '$12,000,000'],
                    ['Cost', 'Total Spend', '$8,400,000'],
                    ['Quality', 'Avg QC Score', '92.4%']
                ].map(e => e.join(",")).join("\n");

                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `Global_Report_${new Date().toISOString().slice(0, 10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (type === 'pdf') {
                // PDF Export via Browser Print Engine (Highest Quality)
                // We show the overlay, then trigger print
                setTimeout(() => {
                    window.print();
                    setExportStatus('success');
                }, 500);
            }

            setTimeout(() => setExportStatus(null), 3000);
        }, 2000);
    };

    return (
        <div className="report-container" style={{ padding: '2.5rem', maxWidth: '1400px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
            {/* 📄 PDF Cover Page (Print-Only) */}
            <div className="pdf-cover-page" style={{ display: 'none' }}>
                <div style={{ height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', border: '15px solid #0047AB', margin: '20px', padding: '40px' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#0047AB', letterSpacing: '-2px' }}>AI-AUTO™</div>
                        <div style={{ height: '4px', width: '60px', background: '#0047AB', margin: '15px auto' }}></div>
                    </div>

                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Global Site Performance Report
                    </h1>

                    <div style={{ fontSize: '1.5rem', color: '#64748b', fontWeight: 700, marginBottom: '60px' }}>
                        Detailed Enterprise Analytics & Operational Insights
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', width: '100%', maxWidth: '600px', textAlign: 'left', background: '#f8fafc', padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Date Range</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>{dateRange} — Feb 2026</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Project Scope</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>{projectFilter}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Generated On</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Generated By</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>{authService.getCurrentUser()?.name || 'Admin'} (Enterprise Access)</div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>
                        © 2026 AI-AUTO Operational Systems. All rights reserved. Confidential Property.
                    </div>
                </div>
            </div>

            {/* 📑 PDF Executive Summary (Print-Only) */}
            <div className="pdf-exec-summary" style={{ display: 'none' }}>
                <div style={{ padding: '40px', minHeight: '90vh' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', borderBottom: '4px solid #0047AB', paddingBottom: '10px', marginBottom: '30px' }}>Executive Summary</h2>

                    <p style={{ fontSize: '1.2rem', color: '#475569', lineHeight: '1.6', marginBottom: '40px', fontWeight: 500 }}>
                        This report provides a management-level overview of operational performance across the enterprise for the {dateRange} period.
                        The following data summarizes key milestones, financial health, and safety compliance for {projectFilter}.
                    </p>

                    {/* Operational KPIs Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '50px' }}>
                        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ color: '#64748b', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>Projects Covered</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0047AB' }}>42</div>
                            <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 700 }}>↑ 4 Since last report</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ color: '#64748b', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>Avg. Completion</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0047AB' }}>85.4%</div>
                            <div style={{ fontSize: '0.9rem', color: '#0047AB', fontWeight: 700 }}>On track for Q1 targets</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ color: '#64748b', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>Budget Utilization</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0047AB' }}>70.2%</div>
                            <div style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: 700 }}>$8.4M of $12M spent</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        {/* Risks & Delays Section */}
                        <div style={{ background: '#fffbeb', padding: '30px', borderRadius: '20px', border: '1px solid #fef3c7' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#92400e', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                Critical Risks & Delays
                            </h3>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400e', fontWeight: 600, fontSize: '1rem', lineHeight: '1.8' }}>
                                <li>Supply chain delays in structural steel (Est. 12-day lag).</li>
                                <li>Skyline Towers foundation audit pending approval.</li>
                                <li>Labor availability fluctuating in Eastern projects.</li>
                            </ul>
                        </div>

                        {/* Safety Summary Section */}
                        <div style={{ background: '#f0fdf4', padding: '30px', borderRadius: '20px', border: '1px solid #dcfce7' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#166534', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                Safety & Hazard Summary
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ textAlign: 'center', padding: '15px', background: 'white', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#166534' }}>14</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3f6212' }}>ACTIVE HAZARDS</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '15px', background: 'white', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#dc2626' }}>2</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991b1b' }}>CRITICAL INCIDENTS</div>
                                </div>
                            </div>
                            <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#166534', fontWeight: 600 }}>
                                Zero Lost Time Injuries (LTI) recorded this period. Safety compliance remains at 96% across sites.
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: '60px', padding: '30px', background: '#f1f5f9', borderRadius: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Management Recommendation</h3>
                        <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.6', fontWeight: 500 }}>
                            Immediate focus should be directed towards procurement acceleration for the structural phase. Financial utilization is healthy, but safety audits at downtown locations must be prioritized to avoid regulatory bottlenecks.
                        </p>
                    </div>
                </div>
            </div>

            {/* 📊 PDF Project-Wise Summary (Print-Only) */}
            <div className="pdf-project-summary" style={{ display: 'none' }}>
                <div style={{ padding: '40px', minHeight: '90vh' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', borderBottom: '4px solid #0047AB', paddingBottom: '10px', marginBottom: '30px' }}>Project-Wise Performance Summary</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {[
                            { name: 'Downtown Heights', progress: 82, status: 'On Track', variance: '-$12k', phase: 'Structural B3', color: '#10b981' },
                            { name: 'Skyline Towers', progress: 12, status: 'Delayed', variance: '+$240k', phase: 'Foundation', color: '#ef4444' },
                            { name: 'Green Valley Estate', progress: 45, status: 'On Track', variance: '-$4.5k', phase: 'Finishing', color: '#10b981' },
                            { name: 'Marina Hub', progress: 68, status: 'On Track', variance: '+$85k', phase: 'MEP Works', color: '#f59e0b' }
                        ].map((proj, idx) => (
                            <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr', alignItems: 'center', gap: '15px' }}>
                                <div>
                                    <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>{proj.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Phase: {proj.phase}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>PROGRESS</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${proj.progress}%`, height: '100%', background: '#0047AB' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{proj.progress}%</span>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>STATUS</div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: proj.color }}>{proj.status.toUpperCase()}</span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>COST VAR.</div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: proj.variance.startsWith('+') ? '#ef4444' : '#10b981' }}>{proj.variance}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ width: '40px', height: '40px', border: `3px solid ${proj.color}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: proj.color }}>{proj.progress}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🕒 PDF Schedule & Execution Analysis (Print-Only) */}
            <div className="pdf-schedule-analysis" style={{ display: 'none' }}>
                <div style={{ padding: '40px', minHeight: '90vh' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', borderBottom: '4px solid #0047AB', paddingBottom: '10px', marginBottom: '30px' }}>Schedule & Execution Analysis</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', marginBottom: '40px' }}>
                        <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Task Distribution</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16a34a' }}>842</div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>COMPLETED</div>
                                </div>
                                <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', padding: '0 30px' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0047AB' }}>156</div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>IN PROGRESS</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#dc2626' }}>24</div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>DELAYED</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ background: '#fff1f1', padding: '30px', borderRadius: '24px', border: '1px solid #fee2e2', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#991b1b', marginBottom: '5px' }}>Average Activity Delay</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#dc2626' }}>4.2 Days</div>
                            <div style={{ fontSize: '0.85rem', color: '#b91c1c', fontWeight: 600 }}>Critical path impact: 12 days total</div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Top Delayed Activities</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                                <th style={{ padding: '15px', fontSize: '0.85rem' }}>ACTIVITY DESCRIPTION</th>
                                <th style={{ padding: '15px', fontSize: '0.85rem' }}>EST. END</th>
                                <th style={{ padding: '15px', fontSize: '0.85rem' }}>VARIANCE</th>
                                <th style={{ padding: '15px', fontSize: '0.85rem' }}>IMPACT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', fontWeight: 700 }}>Reinforcement - Slab 4</td>
                                <td style={{ padding: '15px' }}>Feb 18</td>
                                <td style={{ padding: '15px', color: '#dc2626', fontWeight: 800 }}>-6 Days</td>
                                <td style={{ padding: '15px', color: '#dc2626', fontWeight: 800 }}>High</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', fontWeight: 700 }}>Tower Crane 2 Maintenance</td>
                                <td style={{ padding: '15px' }}>Feb 22</td>
                                <td style={{ padding: '15px', color: '#f59e0b', fontWeight: 800 }}>-3 Days</td>
                                <td style={{ padding: '15px', color: '#f59e0b', fontWeight: 800 }}>Medium</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Gantt Snapshot (Critical Path)</h3>
                    <div style={{ background: '#f8fafc', height: '200px', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {[
                            { name: 'Earthwork', start: 0, width: 40, color: '#16a34a' },
                            { name: 'Foundation', start: 40, width: 30, color: '#0047AB' },
                            { name: 'Structural', start: 70, width: 20, color: '#dc2626' }
                        ].map((bar, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '100px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{bar.name}</div>
                                <div style={{ flex: 1, position: 'relative', height: '14px', background: '#e2e8f0', borderRadius: '7px' }}>
                                    <div style={{ position: 'absolute', left: `${bar.start}%`, width: `${bar.width}%`, height: '100%', background: bar.color, borderRadius: '7px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 💰 PDF Financial Overview (Print-Only) */}
            <div className="pdf-financial-overview" style={{ display: 'none' }}>
                <div style={{ padding: '40px', minHeight: '90vh' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', borderBottom: '4px solid #0047AB', paddingBottom: '10px', marginBottom: '30px' }}>Financial Overview</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '40px' }}>
                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>TOTAL BUDGET</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>$12.0M</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>TOTAL SPENT</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#dc2626' }}>$8.4M</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>REMAINING</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a' }}>$3.6M</div>
                        </div>
                        <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '16px', border: '1px solid #dcfce7', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534' }}>OVERDUE INV.</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#991b1b' }}>3</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '20px', padding: '25px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Category-Wise Cost Breakdown</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { name: 'Materials', pct: 45, val: '$3.78M', color: '#0047AB' },
                                    { name: 'Labor', pct: 30, val: '$2.52M', color: '#10b981' },
                                    { name: 'Equipment', pct: 15, val: '$1.26M', color: '#f59e0b' },
                                    { name: 'Overheads', pct: 10, val: '$0.84M', color: '#6366f1' }
                                ].map((cat, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
                                            <span>{cat.name}</span>
                                            <span>{cat.val} ({cat.pct}%)</span>
                                        </div>
                                        <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                                            <div style={{ width: `${cat.pct}%`, height: '100%', background: cat.color }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '20px', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', width: '100%', textAlign: 'left' }}>Budget Allocation Chart</h3>
                            <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'conic-gradient(#0047AB 0% 70%, #f1f5f9 70% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                <div style={{ width: '140px', height: '140px', background: 'white', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>70%</span>
                                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748b' }}>UTILLIZED</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Project-Wise Spending Tracker</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                                <th style={{ padding: '12px 15px', fontSize: '0.8rem' }}>PROJECT</th>
                                <th style={{ padding: '12px 15px', fontSize: '0.8rem' }}>APPROVED</th>
                                <th style={{ padding: '12px 15px', fontSize: '0.8rem' }}>SPENT</th>
                                <th style={{ padding: '12px 15px', fontSize: '0.8rem' }}>REMAINING</th>
                                <th style={{ padding: '12px 15px', fontSize: '0.8rem' }}>PENDING INV.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Downtown Heights', app: '$4.5M', spent: '$3.7M', rem: '$0.8M', pen: '1' },
                                { name: 'Skyline Towers', app: '$2.8M', spent: '$3.1M', rem: '-$0.3M', pen: '2' },
                                { name: 'Green Valley', app: '$1.2M', spent: '$0.6M', rem: '$0.6M', pen: '0' }
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 15px', fontWeight: 700 }}>{row.name}</td>
                                    <td style={{ padding: '12px 15px' }}>{row.app}</td>
                                    <td style={{ padding: '12px 15px', fontWeight: 800 }}>{row.spent}</td>
                                    <td style={{ padding: '12px 15px', fontWeight: 800, color: row.rem.startsWith('-') ? '#dc2626' : '#16a34a' }}>{row.rem}</td>
                                    <td style={{ padding: '12px 15px' }}>{row.pen}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 👷 PDF Resource & Attendance Summary (Print-Only) */}
            <div className="pdf-resource-summary" style={{ display: 'none' }}>
                <div style={{ padding: '40px', minHeight: '90vh' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', borderBottom: '4px solid #0047AB', paddingBottom: '10px', marginBottom: '30px' }}>Resource & Attendance Summary</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '50px' }}>
                        <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '10px' }}>TOTAL MANPOWER</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0047AB' }}>1,240</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Deployed across sites</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '10px' }}>AVG. ATTENDANCE</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981' }}>94.2%</div>
                            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Optimal range (+2.1%)</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '10px' }}>OVERTIME HOURS</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b' }}>128h</div>
                            <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>Structural phase rush</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px', marginBottom: '40px' }}>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '20px', padding: '25px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Attendance Trend (Weekly)</h3>
                            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '10px' }}>
                                {[92, 94, 91, 96, 95, 94, 98].map((h, i) => (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '100%', height: `${h}%`, background: '#0047AB', borderRadius: '4px 4px 0 0' }}></div>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ background: '#fff1f1', border: '1px solid #fee2e2', borderRadius: '20px', padding: '25px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#991b1b', marginBottom: '15px' }}>Labor Shortage Alerts</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {[
                                    { project: 'Skyline Towers', role: 'Steel Fixers', short: 12, severity: 'High' },
                                    { project: 'Downtown Heights', role: 'Carpenters', short: 6, severity: 'Medium' }
                                ].map((alert, i) => (
                                    <div key={i} style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1a1a1a' }}>{alert.project}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Needs {alert.short} {alert.role}</div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#dc2626' }}>{alert.severity.toUpperCase()} IMPACT</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Manpower Deployment Matrix</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                                <th style={{ padding: '12px 15px', fontSize: '0.8rem' }}>TRADE / CATEGORY</th>
                                <th style={{ padding: '12px 15px', fontSize: '0.8rem' }}>PLANNED</th>
                                <th style={{ padding: '12px 15px', fontSize: '0.8rem' }}>ACTUAL</th>
                                <th style={{ padding: '12px 15px', fontSize: '0.8rem' }}>ATTENDANCE %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { trade: 'Civil Workers (General)', plan: 450, act: 442, att: '98%' },
                                { trade: 'Steel Reinforcement', plan: 120, act: 108, att: '90%' },
                                { trade: 'Electricians', plan: 85, act: 82, att: '96%' },
                                { trade: 'Supervisors / Foremen', plan: 42, act: 42, att: '100%' }
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 15px', fontWeight: 700 }}>{row.trade}</td>
                                    <td style={{ padding: '12px 15px' }}>{row.plan}</td>
                                    <td style={{ padding: '12px 15px' }}>{row.act}</td>
                                    <td style={{ padding: '12px 15px', fontWeight: 800, color: parseInt(row.att) < 95 ? '#f59e0b' : '#16a34a' }}>{row.att}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🏗️ PDF Material Usage & Inventory (Print-Only) */}
            <div className="pdf-material-inventory" style={{ display: 'none' }}>
                <div style={{ padding: '40px', minHeight: '90vh' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', borderBottom: '4px solid #0047AB', paddingBottom: '10px', marginBottom: '30px' }}>Material Usage & Inventory</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', marginBottom: '40px' }}>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '24px', padding: '25px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Key Material Consumption</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                                        <th style={{ padding: '12px', fontSize: '0.75rem' }}>MATERIAL</th>
                                        <th style={{ padding: '12px', fontSize: '0.75rem' }}>PLANNED</th>
                                        <th style={{ padding: '12px', fontSize: '0.75rem' }}>ACTUAL</th>
                                        <th style={{ padding: '12px', fontSize: '0.75rem' }}>VARIANCE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Steel Reinforcement', plan: '500 Tons', act: '522 Tons', var: '+4.4%', color: '#dc2626' },
                                        { name: 'RMC (M35 Grade)', plan: '2400 m³', act: '2310 m³', var: '-3.7%', color: '#16a34a' },
                                        { name: 'Cement (OPC)', plan: '12500 Bags', act: '13100 Bags', var: '+4.8%', color: '#dc2626' },
                                        { name: 'Aggregates (20mm)', plan: '850 m³', act: '862 m³', var: '+1.4%', color: '#f59e0b' }
                                    ].map((m, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '12px', fontWeight: 700 }}>{m.name}</td>
                                            <td style={{ padding: '12px' }}>{m.plan}</td>
                                            <td style={{ padding: '12px', fontWeight: 800 }}>{m.act}</td>
                                            <td style={{ padding: '12px', fontWeight: 800, color: m.color }}>{m.var}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ background: '#fff1f1', border: '1px solid #fee2e2', borderRadius: '24px', padding: '25px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#991b1b', marginBottom: '15px' }}>Low-Stock Alerts</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #fee2e2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Chemical Admixtures</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Remaining: 420 Liters</div>
                                        </div>
                                        <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900 }}>3 DAYS LEFT</span>
                                    </div>
                                    <div style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #fee2e2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>PVC Conduits (25mm)</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Remaining: 150 Units</div>
                                        </div>
                                        <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900 }}>CRITICAL</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '25px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '15px' }}>High-Wastage Materials</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.8rem', fontWeight: 700 }}>
                                            <span>Sand / Aggregates</span>
                                            <span style={{ color: '#ef4444' }}>8.2% Wastage</span>
                                        </div>
                                        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: '82%', height: '100%', background: '#ef4444' }}></div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Note: Spillages recorded at Skyline project during unloading phase.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🛡️ PDF Safety & Compliance Report (Print-Only) */}
            <div className="pdf-safety-report" style={{ display: 'none' }}>
                <div style={{ padding: '40px', minHeight: '90vh' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', borderBottom: '4px solid #0047AB', paddingBottom: '10px', marginBottom: '30px' }}>Safety & Compliance Report</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>TOTAL HAZARDS</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>64</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>CLOSED</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#16a34a' }}>52</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>OPEN / ACTIVE</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#dc2626' }}>12</div>
                        </div>
                        <div style={{ background: '#f1f5f9', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0047AB' }}>COMPLIANCE SCORE</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0047AB' }}>96.4%</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '24px', padding: '25px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Hazard Severity Distribution</h3>
                            <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '30px', padding: '10px' }}>
                                {[
                                    { name: 'Critical', val: 5, color: '#dc2626' },
                                    { name: 'High', val: 18, color: '#ea580c' },
                                    { name: 'Medium', val: 26, color: '#f59e0b' },
                                    { name: 'Low', val: 15, color: '#16a34a' }
                                ].map((h, i) => (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '100%', height: `${(h.val / 30) * 100}%`, background: h.color, borderRadius: '6px 6px 0 0' }}></div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{h.val}</div>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>{h.name}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '24px', padding: '25px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Critical Safety Issues</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ borderLeft: '4px solid #dc2626', padding: '0 15px' }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Fall Protection Breach</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Towers 3 & 4 | Scaffolding instability reported.</div>
                                </div>
                                <div style={{ borderLeft: '4px solid #dc2626', padding: '0 15px' }}>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Electrical Live-Wire Exposure</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Basement Level 2 | Water logging near DB panels.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>Safety Incident Trend (Last 12 Weeks)</h3>
                    <div style={{ background: '#f8fafc', height: '150px', borderRadius: '16px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: '10px 20px', gap: '8px' }}>
                        {[8, 6, 9, 4, 3, 2, 5, 4, 2, 1, 3, 2].map((val, i) => (
                            <div key={i} style={{ flex: 1, background: '#cbd5e1', height: `${val * 10}%`, borderRadius: '3px' }}></div>
                        ))}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textAlign: 'center', marginTop: '10px' }}>W1 → W12 Incident Frequency Map</div>
                </div>
            </div>

            {/* ✅ PDF Quality & Inspection Status (Print-Only) */}
            <div className="pdf-quality-status" style={{ display: 'none' }}>
                <div style={{ padding: '40px', minHeight: '90vh' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', borderBottom: '4px solid #0047AB', paddingBottom: '10px', marginBottom: '30px' }}>Quality & Inspection Status</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>TOTAL INSPECTIONS</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>142</div>
                        </div>
                        <div style={{ background: '#f0fdf4', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534' }}>PASSED</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#16a34a' }}>128</div>
                        </div>
                        <div style={{ background: '#fff1f1', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991b1b' }}>FAILED / REWORK</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#dc2626' }}>9</div>
                        </div>
                        <div style={{ background: '#fefce8', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#854d0e' }}>PENDING</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f59e0b' }}>5</div>
                        </div>
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '24px', padding: '25px', marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Rework Instances & Defects</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                                    <th style={{ padding: '15px', fontSize: '0.85rem' }}>PROJECT / AREA</th>
                                    <th style={{ padding: '15px', fontSize: '0.85rem' }}>DEFECT DESCRIPTION</th>
                                    <th style={{ padding: '15px', fontSize: '0.85rem' }}>ROOT CAUSE</th>
                                    <th style={{ padding: '15px', fontSize: '0.85rem' }}>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px', fontWeight: 700 }}>Skyline Towers (Lobby)</td>
                                    <td style={{ padding: '15px' }}>Concrete Honeycombing</td>
                                    <td style={{ padding: '15px' }}>Improper Vibration</td>
                                    <td style={{ padding: '15px', color: '#dc2626', fontWeight: 800 }}>In Progress</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px', fontWeight: 700 }}>Marina Hub (Level 2)</td>
                                    <td style={{ padding: '15px' }}>Plumbing Leaks</td>
                                    <td style={{ padding: '15px' }}>Pressure Test Failure</td>
                                    <td style={{ padding: '15px', color: '#16a34a', fontWeight: 800 }}>Resolved</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 📁 PDF Document & Approval Status (Print-Only) */}
            <div className="pdf-document-status" style={{ display: 'none' }}>
                <div style={{ padding: '40px', minHeight: '90vh' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', borderBottom: '4px solid #0047AB', paddingBottom: '10px', marginBottom: '30px' }}>Document & Approval Status</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>FILES SUBMITTED</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>428</div>
                        </div>
                        <div style={{ background: '#f0fdf4', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534' }}>APPROVED</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#16a34a' }}>382</div>
                        </div>
                        <div style={{ background: '#fefce8', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#854d0e' }}>PENDING</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f59e0b' }}>32</div>
                        </div>
                        <div style={{ background: '#fff1f1', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991b1b' }}>REJECTED</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#dc2626' }}>14</div>
                        </div>
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '24px', padding: '25px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Recent Approval Workflow</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {[
                                { doc: 'Structural B3 - Slab Casting Plan', sub: 'Feb 15', status: 'Pending Approval', by: 'Chief Engineer' },
                                { doc: 'MEP Schematics - Level 4', sub: 'Feb 12', status: 'Revision Requested', by: 'Project Manager' },
                                { doc: 'Safety Clearance - Tower Crane 2', sub: 'Feb 10', status: 'Approved', by: 'Safety Officer' }
                            ].map((d, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: i % 2 === 0 ? '#f8fafc' : 'white', borderRadius: '12px' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{d.doc}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Submitted on {d.sub} | Awaiting: {d.by}</div>
                                    </div>
                                    <span style={{
                                        padding: '6px 14px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900,
                                        background: d.status === 'Approved' ? '#dcfce7' : (d.status.includes('Pending') ? '#fefce8' : '#fee2e2'),
                                        color: d.status === 'Approved' ? '#166534' : (d.status.includes('Pending') ? '#854d0e' : '#dc2626')
                                    }}>
                                        {d.status.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 🚩 PDF Key Risks & Action Items (Print-Only) */}
            <div className="pdf-risks-actions" style={{ display: 'none' }}>
                <div style={{ padding: '40px', minHeight: '90vh' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', borderBottom: '4px solid #0047AB', paddingBottom: '10px', marginBottom: '30px' }}>Key Risks & Action Items</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', marginBottom: '40px' }}>
                        <div style={{ border: '1px solid #fee2e2', background: '#fff1f1', borderRadius: '24px', padding: '30px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991b1b', marginBottom: '20px' }}>High-Risk Priority Areas</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { title: 'Skyline Towers Progress Lag', impact: 'Critical Path', risk: 'Supply Chain steel delays', action: 'Diversify vendors immediately' },
                                    { title: 'Marina Hub Cost Overrun', impact: 'Budgetary', risk: 'Electrical scope creep', action: 'Re-audit MEP invoices' }
                                ].map((r, i) => (
                                    <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span style={{ fontWeight: 900, fontSize: '1rem', color: '#0f172a' }}>{r.title}</span>
                                            <span style={{ background: '#dc2626', color: 'white', fontSize: '0.65rem', fontWeight: 900, padding: '4px 10px', borderRadius: '20px' }}>{r.impact.toUpperCase()}</span>
                                        </div>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#64748b' }}><strong>Risk:</strong> {r.risk}</p>
                                        <div style={{ background: '#fefce8', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#854d0e', border: '1px solid #fef3c7' }}>
                                            Recommended: {r.action}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '15px' }}>Critical Pending Approvals</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }}></div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Structural Design V3 (12 Days Over)</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Dewatering Plan (6 Days Over)</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ background: '#f0fdf4', padding: '25px', borderRadius: '24px', border: '1px solid #dcfce7' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', marginBottom: '10px' }}>Management Outlook</h3>
                                <p style={{ fontSize: '0.9rem', color: '#166534', lineHeight: '1.6', fontWeight: 500 }}>
                                    Overall performance is stable but requires procurement acceleration. Quality control metrics are exceeding benchmarks, but fiscal vigilance on Tier-2 projects is advised for next quarter.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 📑 PDF Appendix (Print-Only) */}
            <div className="pdf-appendix" style={{ display: 'none' }}>
                <div style={{ padding: '40px', minHeight: '90vh' }}>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', borderBottom: '4px solid #0047AB', paddingBottom: '10px', marginBottom: '30px' }}>Appendix</h2>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Dataset Summary (Raw Figures)</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', background: '#f1f5f9' }}>
                                <th style={{ padding: '12px' }}>Category</th>
                                <th style={{ padding: '12px' }}>Unit</th>
                                <th style={{ padding: '12px' }}>Enterprise Total</th>
                                <th style={{ padding: '12px' }}>Confidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}><td style={{ padding: '12px' }}>Total Concrete Vol</td><td style={{ padding: '12px' }}>m³</td><td style={{ padding: '12px' }}>14,240</td><td style={{ padding: '12px' }}>High</td></tr>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}><td style={{ padding: '12px' }}>Structural Inspections</td><td style={{ padding: '12px' }}>Count</td><td style={{ padding: '12px' }}>1,102</td><td style={{ padding: '12px' }}>Medium</td></tr>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}><td style={{ padding: '12px' }}>Active Users</td><td style={{ padding: '12px' }}>ID</td><td style={{ padding: '12px' }}>648</td><td style={{ padding: '12px' }}>High</td></tr>
                        </tbody>
                    </table>

                    <div style={{ padding: '25px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '10px' }}>Notes & Remarks</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6' }}>
                            Data in this report is aggregated from synchronized site logs as of {new Date().toLocaleDateString()}.
                            Manual overrides for Skyline Towers Foundation progress have been applied due to sensor recalibration.
                            Audit trail available upon system request.
                        </p>
                    </div>
                </div>
            </div>

            {/* 🔐 PDF Footer (Every Page - Print-Only) */}
            <div className="pdf-page-footer" style={{ display: 'none' }}>
                <div style={{
                    position: 'fixed', bottom: 0, left: 0, width: '100%',
                    padding: '15px 40px', background: 'white', borderTop: '1px solid #e2e8f0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700
                }}>
                    <div>CONFIDENTIAL: AI-AUTO ENTERPRISE PROPERTY</div>
                    <div>Generated by AI-AUTO Operational System | Phase: Operational Q1</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0047AB' }}></div>
                        SECURED PDF REPORT
                    </div>
                </div>
            </div>

            {/* Print-only Header (Regular pages) */}
            <div className="print-header" style={{ display: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0047AB', paddingBottom: '10px', marginBottom: '30px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0047AB' }}>AI-AUTO™</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Project Scope: {projectFilter} | {dateRange}</div>
                </div>
            </div>

            {/* Navigation Back */}
            <button
                onClick={() => setCurrentPage('dashboard')}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
                    color: 'var(--pivot-blue)', fontWeight: 800, cursor: 'pointer', marginBottom: '1.5rem',
                    fontSize: '0.9rem', padding: 0
                }}
            >
                <div style={{ transform: 'rotate(180deg)', display: 'flex' }}><CaretDown size={18} weight="bold" /></div>
                Back to Dashboard
            </button>

            {/* 🔹 1. Top Header */}
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: '2rem',
                background: 'white',
                padding: isMobile ? '1.5rem' : '2rem',
                borderRadius: '24px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f0f4f8',
                gap: '1.5rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#000000', margin: 0, letterSpacing: '-1px' }}>Global Reports</h1>
                    <p style={{ color: '#7a7a7a', fontSize: '0.95rem', marginTop: '4px', fontWeight: 600 }}>Enterprise site performance analytics</p>
                </div>

                <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: '1.2rem', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
                    {/* Date Range Picker */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative', flex: isMobile ? '1 1 140px' : 'initial' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginLeft: '4px', letterSpacing: '0.5px' }}>DATE RANGE</label>
                        <div
                            onClick={() => toggleDropdown('date')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px',
                                background: '#f8fafc', borderRadius: '14px', border: activeDropdown === 'date' ? '1.5px solid var(--pivot-blue)' : '1.5px solid #edf2f7',
                                cursor: 'pointer', minWidth: isMobile ? '100%' : '160px', transition: 'all 0.2s'
                            }}
                        >
                            <CalendarBlank size={20} color="var(--pivot-blue)" weight="bold" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a202c' }}>{dateRange}</span>
                            <CaretDown size={14} weight="bold" style={{ marginLeft: 'auto', transform: activeDropdown === 'date' ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                        </div>

                        {activeDropdown === 'date' && (
                            <div style={{ position: 'absolute', top: '75px', left: 0, right: 0, background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden' }}>
                                {dateOptions.map(opt => (
                                    <div
                                        key={opt}
                                        onClick={() => { setDateRange(opt); setActiveDropdown(null); }}
                                        style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: '0.2s', background: dateRange === opt ? '#f0f7ff' : 'transparent', color: dateRange === opt ? 'var(--pivot-blue)' : '#4a5568' }}
                                        onMouseOver={(e) => { if (dateRange !== opt) e.currentTarget.style.background = '#f8fafc' }}
                                        onMouseOut={(e) => { if (dateRange !== opt) e.currentTarget.style.background = 'transparent' }}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Project Filter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative', flex: isMobile ? '1 1 180px' : 'initial' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginLeft: '4px', letterSpacing: '0.5px' }}>PROJECT SELECTION</label>
                        <div
                            onClick={() => toggleDropdown('project')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px',
                                background: '#f8fafc', borderRadius: '14px', border: activeDropdown === 'project' ? '1.5px solid var(--pivot-blue)' : '1.5px solid #edf2f7',
                                cursor: 'pointer', minWidth: isMobile ? '100%' : '180px', transition: 'all 0.2s'
                            }}
                        >
                            <Funnel size={20} color="var(--pivot-blue)" weight="bold" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a202c' }}>{projectFilter}</span>
                            <CaretDown size={14} weight="bold" style={{ marginLeft: 'auto', transform: activeDropdown === 'project' ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                        </div>

                        {activeDropdown === 'project' && (
                            <div style={{ position: 'absolute', top: '75px', left: 0, right: 0, background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden' }}>
                                {projectOptions.map(opt => (
                                    <div
                                        key={opt}
                                        onClick={() => { setProjectFilter(opt); setActiveDropdown(null); }}
                                        style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: '0.2s', background: projectFilter === opt ? '#f0f7ff' : 'transparent', color: projectFilter === opt ? 'var(--pivot-blue)' : '#4a5568' }}
                                        onMouseOver={(e) => { if (projectFilter !== opt) e.currentTarget.style.background = '#f8fafc' }}
                                        onMouseOut={(e) => { if (projectFilter !== opt) e.currentTarget.style.background = 'transparent' }}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Export Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: isMobile ? '1 1 100%' : 'initial' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#7a7a7a', marginLeft: '4px' }}>EXPORT</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleExport('pdf')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                                    background: '#fff5f5', color: '#c53030', border: '1.5px solid #feb2b2',
                                    borderRadius: '14px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer',
                                    transition: 'all 0.2s', opacity: exportStatus ? 0.6 : 1, flex: isMobile ? 1 : 'initial', justifyContent: 'center'
                                }}
                                disabled={!!exportStatus}
                            >
                                <FilePdf size={22} weight="bold" /> PDF
                            </button>
                            <button
                                onClick={() => handleExport('excel')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                                    background: '#f0fff4', color: '#22543d', border: '1.5px solid #c6f6d5',
                                    borderRadius: '14px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer',
                                    transition: 'all 0.2s', opacity: exportStatus ? 0.6 : 1, flex: isMobile ? 1 : 'initial', justifyContent: 'center'
                                }}
                                disabled={!!exportStatus}
                            >
                                <FileXls size={22} weight="bold" /> Excel
                            </button>
                        </div>
                    </div>

                    {/* Refresh Icon */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', flex: isMobile ? '0 0 auto' : 'initial' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>SYNC</label>
                        <button
                            onClick={() => {
                                const btn = document.getElementById('sync-btn');
                                btn.style.transform = 'rotate(360deg) scale(1.1)';
                                setTimeout(() => { btn.style.transform = 'none'; alert('Global Report Data Synchronized Successfully!'); }, 800);
                            }}
                            id="sync-btn"
                            style={{
                                width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'var(--pivot-blue)', color: 'white', border: 'none',
                                borderRadius: '16px', cursor: 'pointer', transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                boxShadow: '0 8px 20px rgba(0, 71, 171, 0.2)'
                            }} title="Sync Global Data">
                            <ArrowsClockwise size={24} weight="bold" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔹 2. Summary Cards (Top Row) */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, 1fr)', gap: '1.2rem', marginBottom: '2.5rem' }}>
                {[
                    { label: 'Total Projects', value: '42', detail: 'Across all regions', icon: <Buildings size={26} />, color: 'var(--pivot-blue)' },
                    { label: 'Active / Delayed', value: '38 / 4', detail: '90.4% On-track', icon: <Clock size={26} />, color: '#4CAF50' },
                    { label: 'Budget vs Spend', value: '$12M / $8.4M', detail: '70% Utilization', icon: <CurrencyDollar size={26} />, color: '#F59E0B' },
                    { label: 'Automation Savings', value: '1,420 hrs', detail: '+$142k Saved', icon: <Lightning size={26} weight="fill" />, color: '#7C3AED' },
                    { label: 'High-Risk Alerts', value: '2', detail: 'Immediate action', icon: <WarningCircle size={26} weight="bold" />, color: '#e53e3e' }
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="summary-card"
                        style={{
                            padding: '1.2rem', background: 'white', borderRadius: '22px',
                            border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '1rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 71, 171, 0.1)';
                            e.currentTarget.style.borderColor = 'var(--pivot-blue-soft)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                            e.currentTarget.style.borderColor = '#f0f0f0';
                        }}
                    >
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: `${stat.color}15`, color: stat.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.5px' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.7rem', color: stat.label === 'High-Risk Alerts' ? '#e53e3e' : '#94a3b8', fontWeight: 700, marginTop: '2px' }}>{stat.detail}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔹 3. Main Report Tabs (Center Section) */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '2.5rem',
                padding: '6px',
                background: '#f1f5f9',
                borderRadius: '16px',
                width: isMobile ? '100%' : 'fit-content',
                border: '1px solid #e2e8f0',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none' /* Firefox */
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: activeTab === tab ? 'white' : 'transparent',
                            color: activeTab === tab ? 'var(--pivot-blue)' : '#64748b',
                            boxShadow: activeTab === tab ? '0 4px 12px rgba(0, 71, 171, 0.08)' : 'none',
                            transform: activeTab === tab ? 'scale(1.02)' : 'scale(1)'
                        }}
                        onMouseOver={(e) => {
                            if (activeTab !== tab) {
                                e.currentTarget.style.color = 'var(--pivot-blue)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (activeTab !== tab) {
                                e.currentTarget.style.color = '#64748b';
                            }
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {/* Tab Content */}
            {
                activeTab === 'Overview' ? (
                    <>
                        {/* 🔹 4. Tab-wise Layout - Overview Tab */}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                            {/* Project Status Bar Chart */}
                            <div className="card" style={{ minHeight: isMobile ? '300px' : '400px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Project Status Portfolio</h3>
                                    <div style={{ fontSize: '0.8rem', color: '#7a7a7a', fontWeight: 700 }}>Regional Breakdown • 2026</div>
                                </div>
                                <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', position: 'relative' }}>
                                    <div style={{ position: 'absolute', inset: '40px', display: 'flex', alignItems: 'flex-end', gap: '20px', justifyContent: 'center' }}>
                                        {[60, 85, 45, 95, 70].map((h, i) => (
                                            <div key={i} style={{ width: '40px', height: `${h}%`, background: i === 3 ? 'var(--pivot-blue)' : '#cbd5e1', borderRadius: '8px 8px 0 0', position: 'relative' }}>
                                                <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>{h}%</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                                        <ChartBar size={32} opacity={0.3} weight="bold" />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '8px' }}>Project Status Bar Chart</span>
                                    </div>
                                </div>
                            </div>

                            {/* On-time vs Delayed Pie Chart */}
                            <div className="card" style={{ minHeight: isMobile ? '300px' : '400px', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '2rem' }}>On-time vs Delayed</h3>
                                <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', position: 'relative' }}>
                                    <div style={{
                                        width: '180px', height: '180px', borderRadius: '50%',
                                        background: 'conic-gradient(var(--pivot-blue) 0% 85%, #fee2e2 85% 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
                                    }}>
                                        <div style={{ width: '130px', height: '130px', background: '#f8fafc', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--pivot-blue)' }}>85%</span>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>On Time</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--pivot-blue)' }}></div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>On-Time</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#fee2e2' }}></div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Delayed</span>
                                        </div>
                                    </div>
                                    <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                                        <ChartPie size={24} opacity={0.3} weight="bold" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Comparison Table */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Progress Comparison Table</h3>
                                <button
                                    onClick={() => setActiveTab('Audit (Progress Data)')}
                                    style={{ background: 'none', border: 'none', color: 'var(--pivot-blue)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                                >
                                    Generate Full Audit
                                </button>
                            </div>
                            <div className="table-wrapper">
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                            {['Project Title', 'Category', 'Status', 'Efficiency', 'Timeline'].map((h, i) => (
                                                <th key={i} style={{ padding: '12px 16px', color: '#7a7a7a', fontSize: '0.8rem', fontWeight: 700 }}>{h.toUpperCase()}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { title: 'Downtown Heights', cat: 'Residential', status: 'On Track', eff: '94%', time: '82% Done' },
                                            { title: 'Green Valley Estate', cat: 'Luxury Villa', status: 'Accelerated', eff: '98%', time: '45% Done' },
                                            { title: 'Skyline Towers', cat: 'Commercial', status: 'Critical', eff: '62%', time: '12% Done' }
                                        ].map((row, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                                <td style={{ padding: '16px', fontWeight: 800, color: '#1a1a1a' }}>{row.title}</td>
                                                <td style={{ padding: '16px', fontWeight: 600, color: '#4a5568', fontSize: '0.9rem' }}>{row.cat}</td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{
                                                        padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800,
                                                        background: row.status === 'Critical' ? '#fee2e2' : '#e6f4ea',
                                                        color: row.status === 'Critical' ? '#dc2626' : '#1e7e34'
                                                    }}>{row.status}</span>
                                                </td>
                                                <td style={{ padding: '16px', fontWeight: 700, color: 'var(--pivot-blue)' }}>{row.eff}</td>
                                                <td style={{ padding: '16px' }}>
                                                    <div style={{ width: '100px', height: '6px', background: '#edf2f7', borderRadius: '3px', overflow: 'hidden' }}>
                                                        <div style={{ width: row.time.split('%')[0] + '%', height: '100%', background: 'var(--pivot-blue)' }}></div>
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: '#7a7a7a', marginTop: '4px', fontWeight: 600 }}>{row.time}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : activeTab === 'Cost & Budget' ? (
                    <>
                        {/* 🔹 Cost & Budget Tab Layout */}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                            {/* 1. Budget vs actual line chart */}
                            <div className="card" style={{ minHeight: isMobile ? '300px' : '400px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Budget vs Actual Spend</h3>
                                    <div style={{ fontSize: '0.8rem', color: '#7a7a7a', fontWeight: 700 }}>Monthly Cumulative • FY 2026</div>
                                </div>
                                <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', position: 'relative', overflow: 'hidden' }}>
                                    {/* SVG Line Chart Placeholder */}
                                    <svg width="100%" height="100%" viewBox="0 0 800 300" style={{ padding: '20px' }}>
                                        {/* Grid Lines */}
                                        {[0, 1, 2, 3].map(i => <line key={i} x1="0" y1={75 * i} x2="800" y2={75 * i} stroke="#edf2f7" strokeWidth="1" />)}
                                        {/* Budget Line (Dashed) */}
                                        <path d="M0,250 L100,220 L200,200 L300,150 L400,120 L500,100 L600,70 L800,30" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
                                        {/* Actual Line (Primary Blue) */}
                                        <path d="M0,250 L100,230 L200,215 L300,180 L400,150 L500,110 L600,90" fill="none" stroke="var(--pivot-blue)" strokeWidth="4" />
                                        {/* Current Point */}
                                        <circle cx="600" cy="90" r="6" fill="var(--pivot-blue)" />
                                    </svg>
                                    <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '12px', height: '2px', background: '#94a3b8', borderStyle: 'dashed' }}></div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Planned Budget</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '12px', height: '4px', background: 'var(--pivot-blue)' }}></div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Actual Spend</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Cost overrun project list */}
                            <div className="card" style={{ minHeight: isMobile ? 'auto' : '400px', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '1.5rem' }}>Top Cost Overruns</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {[
                                        { project: 'Skyline Towers', overrun: '+$240k', pct: '12%', severity: 'High' },
                                        { project: 'Marina Hub', overrun: '+$85k', pct: '4.2%', severity: 'Medium' },
                                        { project: 'East Gate Villa', overrun: '+$12k', pct: '0.8%', severity: 'Low' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ padding: '1rem', background: '#fff5f5', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: 800, color: '#1a1a1a', fontSize: '0.9rem' }}>{item.project}</span>
                                                <span style={{ fontWeight: 900, color: '#dc2626', fontSize: '0.9rem' }}>{item.overrun}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Over budget by {item.pct}</span>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>{item.severity} Risk</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2. BOQ planned vs used table */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>BOQ Analysis: Planned vs Used</h3>
                                <button
                                    onClick={() => handleExport('excel')}
                                    style={{ background: 'var(--pivot-blue-soft)', border: 'none', color: 'var(--pivot-blue)', padding: '8px 16px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                    Export BOQ
                                </button>
                            </div>
                            <div className="table-wrapper">
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                            {['Material Item', 'Unit', 'Planned Qty', 'Used Qty', 'Variance', 'Cost Impact'].map((h, i) => (
                                                <th key={i} style={{ padding: '12px 16px', color: '#7a7a7a', fontSize: '0.8rem', fontWeight: 700 }}>{h.toUpperCase()}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { item: 'Structural Steel', unit: 'Tons', planned: '450', used: '462', var: '+12', cost: '$18,400' },
                                            { item: 'Ready-Mix Concrete', unit: 'm³', planned: '2,200', used: '2,150', var: '-50', cost: '-$4,500' },
                                            { item: 'Cement Bags', unit: 'Bags', planned: '12,000', used: '13,200', var: '+1,200', cost: '$7,200' },
                                            { item: 'Electrical Cabling', unit: 'Meters', planned: '8,500', used: '9,100', var: '+600', cost: '$2,100' }
                                        ].map((row, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                                <td style={{ padding: '16px', fontWeight: 800, color: '#1a1a1a' }}>{row.item}</td>
                                                <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>{row.unit}</td>
                                                <td style={{ padding: '16px', fontWeight: 700 }}>{row.planned}</td>
                                                <td style={{ padding: '16px', fontWeight: 700 }}>{row.used}</td>
                                                <td style={{ padding: '16px', fontWeight: 800, color: row.var.startsWith('+') ? '#dc2626' : '#16a34a' }}>{row.var}</td>
                                                <td style={{ padding: '16px', fontWeight: 900, color: '#1a1a1a' }}>{row.cost}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : activeTab === 'Automation' ? (
                    <>
                        {/* 🔹 Automation Tab Layout */}
                        {/* 1. Automation execution count (Highlights) */}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1.2rem', marginBottom: '2.5rem' }}>
                            {[
                                { label: 'Total AI Executions', value: '12,842', detail: 'Last 30 days', color: 'var(--pivot-blue)' },
                                { label: 'Average Task Duration', value: '1.2s', detail: '-85% vs human manual', color: '#4CAF50' },
                                { label: 'System Reliability', value: '99.8%', detail: 'Zero critical leaks', color: '#7C3AED' }
                            ].map((stat, i) => (
                                <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</span>
                                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#1a1a1a' }}>{stat.value}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: stat.color }}>{stat.detail}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                            {/* 2. Time saved graph */}
                            <div className="card" style={{ minHeight: isMobile ? '300px' : '400px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Efficiency: Time Saved (Cumulative)</h3>
                                    <div style={{ fontSize: '0.8rem', color: '#7a7a7a', fontWeight: 700 }}>Weekly Growth • Hours</div>
                                </div>
                                <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                    <svg width="100%" height="80%" viewBox="0 0 800 200" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0 }}>
                                        <defs>
                                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.3" />
                                                <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M0,200 L0,180 C100,160 200,170 300,120 C400,100 500,80 600,40 C700,30 800,10 L800,200 Z" fill="url(#areaGradient)" />
                                        <path d="M0,180 C100,160 200,170 300,120 C400,100 500,80 600,40 C700,30 800,10" fill="none" stroke="#4CAF50" strokeWidth="4" />
                                    </svg>
                                    <div style={{ zIndex: 1, textAlign: 'center' }}>
                                        <Lightning size={48} color="#4CAF50" opacity={0.5} weight="fill" />
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a', marginTop: '1rem' }}>+1,420 Hours Saved</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Projected: 2,500 hrs by year end</div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Automation success vs failure chart */}
                            <div className="card" style={{ minHeight: isMobile ? 'auto' : '400px', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '2rem' }}>Execution Integrity</h3>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                                            <span style={{ color: '#16a34a' }}>SUCCESSFUL RUNS</span>
                                            <span>99.8%</span>
                                        </div>
                                        <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                            <div style={{ width: '99.8%', height: '100%', background: '#16a34a' }}></div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                                            <span style={{ color: '#dc2626' }}>FAILED RUNS</span>
                                            <span>0.2%</span>
                                        </div>
                                        <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                            <div style={{ width: '0.2%', height: '100%', background: '#dc2626' }}></div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 700 }}>
                                        Most failures were due to external API timeouts (resolved via retry logic).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : activeTab === 'AI Insights' ? (
                    <>
                        {/* 🔹 AI Insights Tab Layout */}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                            {/* 1. Delay risk heatmap */}
                            <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: isMobile ? 'auto' : '400px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Delay Risk Heatmap</h3>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>Predictive bottleneck analysis across modules</p>
                                    </div>
                                    <Brain size={24} color="var(--pivot-blue)" weight="duotone" />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #edf2f7' }}>
                                    {['Procurement', 'Foundation', 'Structural', 'Finishing', 'Safety'].map((col, idx) => (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textAlign: 'center', marginBottom: '4px' }}>{col.toUpperCase()}</span>
                                            {[0, 1, 2, 3].map(row => {
                                                const risk = Math.random();
                                                const color = risk > 0.8 ? '#fee2e2' : risk > 0.5 ? '#fef3c7' : '#f0fdf4';
                                                const border = risk > 0.8 ? '#fecaca' : risk > 0.5 ? '#fde68a' : '#dcfce7';
                                                const textColor = risk > 0.8 ? '#dc2626' : risk > 0.5 ? '#d97706' : '#16a34a';
                                                return (
                                                    <div key={row} style={{
                                                        height: '40px', background: color, border: `1.5px solid ${border}`,
                                                        borderRadius: '8px', display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900,
                                                        color: textColor, cursor: 'pointer', transition: '0.2s'
                                                    }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                                        {Math.round(risk * 100)}%
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
                                        <div style={{ width: '12px', height: '12px', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '3px' }}></div> Stable
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
                                        <div style={{ width: '12px', height: '12px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '3px' }}></div> Elevated
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
                                        <div style={{ width: '12px', height: '12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '3px' }}></div> Critical
                                    </div>
                                </div>
                            </div>

                            {/* 2. Cost overrun predictions */}
                            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Cost Projections (AI)</h3>
                                    <div style={{ background: '#f0f7ff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>Confidence: 94%</div>
                                </div>
                                <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', position: 'relative', overflow: 'hidden', padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Est. Final Cost</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a' }}>$14.2M</div>
                                        </div>
                                        <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Variance (Predicted)</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626' }}>+$1.2M</div>
                                        </div>
                                    </div>
                                    {/* Simplified Trend Chart */}
                                    <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                                        {[30, 45, 40, 60, 75, 90].map((h, i) => (
                                            <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? '#fee2e2' : 'var(--pivot-blue-soft)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                                                {i === 5 && <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)' }}><TrendUp size={16} color="#dc2626" /></div>}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>
                                        <span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV (PRED)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. AI alerts list (color-coded) */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Intelligent Alerts Engine</h3>
                                <button style={{ background: 'none', border: 'none', color: 'var(--pivot-blue)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>Mark All as Processed</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                {[
                                    { title: 'Supply Chain Delay', msg: 'Steel shipments for Skyline Towers are lagging by 12 days. Suggesting alternative local supplier.', color: '#dc2626', bg: '#fff5f5', icon: <WarningCircle size={22} /> },
                                    { title: 'Budget Optimization', msg: 'Current concrete usage is 4% below estimate. Reallocating $14k saved to finishing phase.', color: '#16a34a', bg: '#f0fdf4', icon: <CheckCircle size={22} /> },
                                    { title: 'Audit Required', msg: 'Safety audit at Downtown Heights is overdue by 48h. Critical for phase 3 transition.', color: '#d97706', bg: '#fffbeb', icon: <Clock size={22} /> }
                                ].map((alert, i) => (
                                    <div key={i} style={{ padding: '1.5rem', background: alert.bg, border: `1px solid ${alert.color}30`, borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: alert.color }}>
                                            {alert.icon}
                                            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{alert.title}</span>
                                        </div>
                                        <p style={{ color: '#4a5568', fontSize: '0.85rem', lineHeight: '1.5', margin: 0, fontWeight: 600 }}>{alert.msg}</p>
                                        <button style={{
                                            marginTop: 'auto', alignSelf: 'flex-start', padding: '6px 14px',
                                            background: 'white', border: `1px solid ${alert.color}50`,
                                            borderRadius: '8px', color: alert.color, fontSize: '0.75rem',
                                            fontWeight: 800, cursor: 'pointer'
                                        }}>
                                            Take Action
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : activeTab === 'Quality & Safety' ? (
                    <>
                        {/* 🔹 Quality & Safety Tab Layout */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            {[
                                { label: 'Avg QC Score', value: '92.4%', detail: 'Target: 90%+', color: '#16a34a', icon: <ShieldCheck size={24} /> },
                                { label: 'Inspections Done', value: '342', detail: 'This month', color: 'var(--pivot-blue)', icon: <CheckCircle size={24} /> },
                                { label: 'Total Man-Hours', value: '184k', detail: 'Without LTI', color: '#7C3AED', icon: <HardHat size={24} /> }
                            ].map((stat, i) => (
                                <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                    <div style={{ width: '48px', height: '48px', background: `${stat.color}15`, color: stat.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a' }}>{stat.value}</div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: stat.color }}>{stat.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2rem', marginBottom: '2.5rem' }}>
                            {/* 2. NCR open vs closed */}
                            <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '2rem' }}>NCR Resolution Tracking</h3>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
                                    <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
                                        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#16a34a" strokeWidth="3" strokeDasharray="82 18" strokeDashoffset="0" />
                                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="3" strokeDasharray="18 82" strokeDashoffset="-82" />
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a' }}>82%</span>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b' }}>CLOSED</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }}></div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Closed (42)</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Open (9)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Safety incident trend */}
                            <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Safety Incident Trend</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: '#f0fdf4', borderRadius: '20px', color: '#16a34a', fontSize: '0.75rem', fontWeight: 800 }}>
                                        <ShieldCheck size={16} /> Zero Major LTI
                                    </div>
                                </div>
                                <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', position: 'relative', overflow: 'hidden', padding: '20px' }}>
                                    <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                                        <path d="M0,180 L100,160 L200,170 L300,140 L400,150 L500,130 L600,140 L700,110 L800,120" fill="none" stroke="#f59e0b" strokeWidth="3" />
                                        {[0, 100, 200, 300, 400, 500, 600, 700, 800].map((x, i) => (
                                            <circle key={i} cx={x} cy={[180, 160, 170, 140, 150, 130, 140, 110, 120][i]} r="4" fill="white" stroke="#f59e0b" strokeWidth="2" />
                                        ))}
                                    </svg>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>
                                        {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map(m => <span key={m}>{m}</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 1. QC inspection summary (Table) */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Recent QC Inspection Summary</h3>
                                <button
                                    onClick={() => setActiveTab('Audit (Progress Data)')}
                                    style={{ background: 'none', border: 'none', color: 'var(--pivot-blue)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                                >
                                    View All Audits
                                </button>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                        {['Inspection Area', 'Project', 'Inspector', 'Score', 'Status'].map((h, i) => (
                                            <th key={i} style={{ padding: '12px 16px', color: '#7a7a7a', fontSize: '0.8rem', fontWeight: 700 }}>{h.toUpperCase()}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { area: 'Foundation Leveling', proj: 'Downtown Heights', user: 'Engr. David', score: '98/100', status: 'Passed' },
                                        { area: 'Structural Steel Weld', proj: 'Skyline Towers', user: 'Engr. Sarah', score: '82/100', status: 'Conditional' },
                                        { area: 'Electrical Safety', proj: 'Green Valley', user: 'Engr. Mike', score: '94/100', status: 'Passed' }
                                    ].map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                            <td style={{ padding: '16px', fontWeight: 800 }}>{row.area}</td>
                                            <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>{row.proj}</td>
                                            <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>{row.user}</td>
                                            <td style={{ padding: '16px', fontWeight: 800, color: 'var(--pivot-blue)' }}>{row.score}</td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, background: row.status === 'Passed' ? '#e6f4ea' : '#fffbeb', color: row.status === 'Passed' ? '#16a34a' : '#d97706' }}>{row.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : activeTab === 'Vendors' ? (
                    <>
                        {/* 🔹 Vendors Tab Layout */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            {[
                                { label: 'Active Vendors', value: '124', detail: 'Across 12 categories', color: 'var(--pivot-blue)', icon: <Storefront size={24} /> },
                                { label: 'On-Time Delivery', value: '88.2%', detail: '+2.4% vs last Q', color: '#16a34a', icon: <Truck size={24} /> },
                                { label: 'Avg Vendor Rating', value: '4.8/5', detail: '94% retention rate', color: '#7C3AED', icon: <Handshake size={24} /> }
                            ].map((stat, i) => (
                                <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                    <div style={{ width: '48px', height: '48px', background: `${stat.color}15`, color: stat.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a' }}>{stat.value}</div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: stat.color }}>{stat.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                            {/* 2. Delivery delay chart */}
                            <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '2rem' }}>Top Delivery Delays (by Vendor)</h3>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
                                    {[
                                        { vendor: 'Apex Steel Corp', days: 14, color: '#dc2626' },
                                        { vendor: 'Global Logistics', days: 9, color: '#f59e0b' },
                                        { vendor: 'Prime Cement', days: 4, color: '#16a34a' },
                                        { vendor: 'East Elec Supplies', days: 2, color: '#16a34a' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                                                <span>{item.vendor}</span>
                                                <span style={{ color: item.color }}>{item.days} Days Delay</span>
                                            </div>
                                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${(item.days / 15) * 100}%`, height: '100%', background: item.color, borderRadius: '4px' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Cost comparison graph */}
                            <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '2rem' }}>Quote vs Actual Cost Analysis</h3>
                                <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', position: 'relative', overflow: 'hidden', padding: '20px', display: 'flex', alignItems: 'flex-end', gap: '24px', justifyContent: 'center' }}>
                                    {[
                                        { cat: 'Steel', quoted: 60, actual: 80 },
                                        { cat: 'Cement', quoted: 40, actual: 35 },
                                        { cat: 'Cabling', quoted: 55, actual: 65 },
                                        { cat: 'Wood', quoted: 30, actual: 28 }
                                    ].map((bar, i) => (
                                        <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100%' }}>
                                            <div style={{ width: '12px', height: `${bar.quoted}%`, background: '#cbd5e1', borderRadius: '4px 4px 0 0' }} title="Quoted"></div>
                                            <div style={{ width: '12px', height: `${bar.actual}%`, background: 'var(--pivot-blue)', borderRadius: '4px 4px 0 0' }} title="Actual"></div>
                                            <div style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 800, color: '#64748b', whiteSpace: 'nowrap' }}>{bar.cat}</div>
                                        </div>
                                    ))}
                                    <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '1rem', fontSize: '0.65rem', fontWeight: 800 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#cbd5e1', borderRadius: '2px' }}></div> Quoted</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: 'var(--pivot-blue)', borderRadius: '2px' }}></div> Actual</div>
                                    </div>
                                </div>
                                <div style={{ height: '30px' }}></div> {/* Spacer for labels */}
                            </div>
                        </div>

                        {/* 1. Vendor performance table */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Strategic Vendor Performance Portfolio</h3>
                                <button style={{ background: 'none', border: 'none', color: 'var(--pivot-blue)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>Manage Vendors</button>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                        {['Vendor Name', 'Category', 'Rating', 'Reliability', 'Spend (YTD)', 'Status'].map((h, i) => (
                                            <th key={i} style={{ padding: '12px 16px', color: '#7a7a7a', fontSize: '0.8rem', fontWeight: 700 }}>{h.toUpperCase()}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Apex Steel Corp', cat: 'Structural', rating: '4.8', rel: '94%', spend: '$1.2M', status: 'Active' },
                                        { name: 'Global Logistics', cat: 'Transport', rating: '3.9', rel: '72%', spend: '$420k', status: 'Warning' },
                                        { name: 'Prime Cement', cat: 'Raw Material', rating: '4.9', rel: '98%', spend: '$850k', status: 'Active' },
                                        { name: 'East Elec Supplies', cat: 'Electrical', rating: '4.5', rel: '91%', spend: '$210k', status: 'Under Review' }
                                    ].map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                            <td style={{ padding: '16px', fontWeight: 800 }}>{row.name}</td>
                                            <td style={{ padding: '16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>{row.cat}</td>
                                            <td style={{ padding: '16px', fontWeight: 800, color: '#f59e0b' }}>★ {row.rating}</td>
                                            <td style={{ padding: '16px', fontWeight: 700 }}>{row.rel}</td>
                                            <td style={{ padding: '16px', fontWeight: 900, color: '#1a1a1a' }}>{row.spend}</td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800,
                                                    background: row.status === 'Active' ? '#e6f4ea' : row.status === 'Warning' ? '#fee2e2' : '#fffbeb',
                                                    color: row.status === 'Active' ? '#16a34a' : row.status === 'Warning' ? '#dc2626' : '#d97706'
                                                }}>{row.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : activeTab === 'Finance' ? (
                    <>
                        {/* 🔹 1. Invoices Paid / Pending (KPI Highlights) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            {[
                                { label: 'Total Invoiced', value: '$22.3M', detail: 'This Fiscal Year', color: 'var(--pivot-blue)', icon: <Receipt size={24} /> },
                                { label: 'Paid Invoices', value: '$18.2M', detail: '81.6% Collections', color: '#16a34a', icon: <CheckCircle size={24} /> },
                                { label: 'Pending / Unpaid', value: '$4.1M', detail: '28 Active Bills', color: '#f59e0b', icon: <Clock size={24} /> },
                                { label: 'Overdue Alerts', value: '$1.2M', detail: 'Action Required', color: '#dc2626', icon: <WarningCircle size={24} /> }
                            ].map((stat, i) => (
                                <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                    <div style={{ width: '48px', height: '48px', background: `${stat.color}15`, color: stat.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a1a1a' }}>{stat.value}</div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: stat.color }}>{stat.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                            {/* 🔹 2. Cash Flow Summary (Trend Chart) */}
                            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Cash Flow Trajectory</h3>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>Inflow vs Outflow Real-time Monitoring</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16a34a' }}>+$2.42M</div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b' }}>NET POSITION THIS MONTH</div>
                                    </div>
                                </div>
                                <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
                                    <svg width="100%" height="100%" viewBox="0 0 800 250" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="financeArea" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--pivot-blue)" stopOpacity="0.15" />
                                                <stop offset="100%" stopColor="var(--pivot-blue)" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        {/* Grid Lines */}
                                        {[0, 50, 100, 150, 200].map(y => <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#f1f5f9" />)}
                                        {/* Cumulative Path */}
                                        <path d="M0,220 C100,200 200,210 300,160 C400,140 500,120 600,80 C700,60 800,40 L800,250 L0,250 Z" fill="url(#financeArea)" />
                                        <path d="M0,220 C100,200 200,210 300,160 C400,140 500,120 600,80 C700,60 800,40" fill="none" stroke="var(--pivot-blue)" strokeWidth="4" />
                                        {[0, 300, 600, 800].map(x => (
                                            <circle key={x} cx={x} cy={x === 0 ? 220 : x === 300 ? 160 : x === 600 ? 80 : 40} r="6" fill="white" stroke="var(--pivot-blue)" strokeWidth="3" />
                                        ))}
                                    </svg>
                                    <div style={{ position: 'absolute', bottom: '20px', left: '25px', display: 'flex', gap: '1.5rem' }}>
                                        {['Inflow', 'Outflow'].map(t => (
                                            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: t === 'Inflow' ? 'var(--pivot-blue)' : '#94a3b8' }}></div>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>{t}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 🔹 3. Revenue vs Expense Chart (Bar Format) */}
                            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '2rem' }}>Revenue vs Expenses</h3>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
                                    {[
                                        { label: 'Operating Revenue', value: '$24.8M', pct: 100, color: 'var(--pivot-blue)' },
                                        { label: 'COGS / Material', value: '$12.4M', pct: 50, color: '#94a3b8' },
                                        { label: 'Labor & Logistics', value: '$6.2M', pct: 25, color: '#cbd5e1' },
                                        { label: 'Net Operating Income', value: '$6.2M', pct: 25, color: '#16a34a' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                                                <span style={{ color: '#475569' }}>{item.label}</span>
                                                <span style={{ color: item.color === '#16a34a' ? '#16a34a' : '#1a1a1a' }}>{item.value}</span>
                                            </div>
                                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '4px' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #e0f2fe', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Bank size={20} color="var(--pivot-blue)" />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>EBITDA Margin is currently at <b style={{ fontWeight: 900 }}>33.2%</b>, exceeding quarterly targets.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 🔹 4. Invoices Detailed Table (Workable View) */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Project Invoicing Ledger</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>Real-time payment status across all construction clusters</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                    <button style={{ padding: '10px 18px', background: '#f8fafc', border: '1px solid #edf2f7', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, color: '#444', cursor: 'pointer' }}>Filter by Status</button>
                                    <button
                                        onClick={() => handleExport('excel')}
                                        style={{ padding: '10px 18px', background: 'var(--pivot-blue)', border: 'none', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <DownloadSimple size={18} /> Download Ledger
                                    </button>
                                </div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                        {['Invoice Ref', 'Project', 'Issued Date', 'Due Date', 'Amount', 'Status'].map((h, i) => (
                                            <th key={i} style={{ padding: '12px 16px', color: '#7a7a7a', fontSize: '0.75rem', fontWeight: 800 }}>{h.toUpperCase()}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { ref: 'P-INV-2026-001', proj: 'Downtown Heights', issued: '01 Feb 2026', due: '15 Feb 2026', amt: '$420,000', status: 'Paid', color: '#16a34a' },
                                        { ref: 'P-INV-2026-002', proj: 'Skyline Towers', issued: '04 Feb 2026', due: '18 Feb 2026', amt: '$1,240,000', status: 'Pending', color: '#f59e0b' },
                                        { ref: 'P-INV-2026-003', proj: 'Green Valley', issued: '10 Jan 2026', due: '24 Jan 2026', amt: '$85,000', status: 'Overdue', color: '#dc2626' },
                                        { ref: 'P-INV-2026-004', proj: 'Marina Hub', issued: '08 Feb 2026', due: '22 Feb 2026', amt: '$210,000', status: 'Pending', color: '#f59e0b' },
                                        { ref: 'P-INV-2026-005', proj: 'East Gate Villa', issued: '12 Feb 2026', due: '26 Feb 2026', amt: '$12,500', status: 'Paid', color: '#16a34a' }
                                    ].map((row, i) => (
                                        <tr key={i} className="tab-item" style={{ borderBottom: '1px solid #f8f9fa' }}>
                                            <td style={{ padding: '16px', fontWeight: 800, color: 'var(--pivot-blue)' }}>{row.ref}</td>
                                            <td style={{ padding: '16px', fontWeight: 700, color: '#1a1a1a' }}>{row.proj}</td>
                                            <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>{row.issued}</td>
                                            <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>{row.due}</td>
                                            <td style={{ padding: '16px', fontWeight: 900, color: '#1a1a1a' }}>{row.amt}</td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900,
                                                    background: `${row.color}15`, color: row.color, display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                    border: `1px solid ${row.color}30`
                                                }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: row.color }}></div>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>

                ) : activeTab === 'Audit (Progress Data)' ? (
                    <>
                        {/* 1️⃣ Audit Header (Auto Generated) */}
                        <div className="card" style={{ marginBottom: '2.5rem', borderLeft: '8px solid var(--pivot-blue)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem 0' }}>Progress Comparison Audit</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem 4rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Project Name</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>{projectFilter === 'All Projects' ? 'Enterprise Core Portfolio' : projectFilter}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Phase / Task Scope</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>Full Project Lifecycle</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Date Range Used</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>{dateRange} (Snapshot: Feb 20, 2026)</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Generated By</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>{authService.getCurrentUser()?.name || 'Admin'} (Superuser Role)</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Generated On</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>{new Date().toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                    <div style={{ padding: '8px 16px', background: '#f1f5f9', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <ShieldCheck size={18} weight="fill" color="var(--pivot-blue)" />
                                        Official Audit Record #AUD-2026-X
                                    </div>
                                    <div style={{ padding: '8px 16px', background: '#ecfdf5', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <LockIcon size={18} weight="fill" />
                                        Baseline Locked
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2️⃣ Baseline Schedule Snapshot */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Baseline Schedule Snapshot</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>Original Approved Project Plan (Read-Only & Locked)</p>
                                </div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', background: '#f8fafc', padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    LAST SEALED: JAN 01, 2026
                                </div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left' }}>
                                        {['Task name', 'Planned start', 'Planned end', 'Planned duration', 'Planned Progress %'].map((h, i) => (
                                            <th key={i} style={{ padding: '0 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { task: 'Site Clearance & Leveling', start: 'Jan 01, 2026', end: 'Jan 10, 2026', dur: '10 Days', prog: '100%' },
                                        { task: 'Foundation Excavation', start: 'Jan 11, 2026', end: 'Jan 25, 2026', dur: '15 Days', prog: '100%' },
                                        { task: 'Raft Foundation Casting', start: 'Jan 26, 2026', end: 'Feb 10, 2026', dur: '16 Days', prog: '85%' },
                                        { task: 'Column Reinforcement (Ground)', start: 'Feb 11, 2026', end: 'Feb 28, 2026', dur: '18 Days', prog: '42%' },
                                        { task: 'Basement Slabbing', start: 'Mar 01, 2026', end: 'Mar 15, 2026', dur: '15 Days', prog: '0%' },
                                        { task: 'MEP Rough-ins (Basement)', start: 'Mar 16, 2026', end: 'Mar 30, 2026', dur: '15 Days', prog: '0%' }
                                    ].map((row, i) => (
                                        <tr key={i} className="tab-item" style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '20px 16px', fontWeight: 800, color: '#0f172a', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>{row.task}</td>
                                            <td style={{ padding: '20px 16px', color: '#475569', fontWeight: 700 }}>{row.start}</td>
                                            <td style={{ padding: '20px 16px', color: '#475569', fontWeight: 700 }}>{row.end}</td>
                                            <td style={{ padding: '20px 16px', color: '#0047AB', fontWeight: 900 }}>{row.dur}</td>
                                            <td style={{ padding: '20px 16px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ fontWeight: 900, color: '#1e293b', fontSize: '0.9rem', minWidth: '40px' }}>{row.prog}</span>
                                                    <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', maxWidth: '100px', overflow: 'hidden' }}>
                                                        <div style={{ width: row.prog, height: '100%', background: 'var(--pivot-blue)', borderRadius: '4px' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fffbeb', borderRadius: '16px', border: '1px solid #fef3c7', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <WarningCircle size={24} color="#d97706" />
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e', fontWeight: 700 }}>
                                    Audit Note: These baseline values are synchronized from the official Master Schedule sealed on January 1st. Any divergence in ACTUAL data will be highlighted in the Progress Variance section.
                                </p>
                            </div>
                        </div>

                        {/* 3️⃣ Progress Variance Analysis */}
                        <div className="card" style={{ marginTop: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Progress Variance Analysis</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>Actual Work Done vs. Baseline Performance</p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div style={{ padding: '8px 16px', background: '#fee2e2', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, color: '#dc2626' }}>VAR: -12.4%</div>
                                    <div style={{ padding: '8px 16px', background: '#fef3c7', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, color: '#d97706' }}>SLIPPAGE: 8 DAYS</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                {[
                                    { label: 'Baseline Progress', value: '45.2%', color: '#94a3b8' },
                                    { label: 'Actual Progress', value: '32.8%', color: '#dc2626' },
                                    { label: 'Efficiency Index', value: '0.72', color: '#f59e0b' },
                                    { label: 'Projected Finish', value: 'Apr 12, 2026', color: '#1a1a1a' }
                                ].map((stat, i) => (
                                    <div key={i} style={{ padding: '1.2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>{stat.label}</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                        {['Activity', 'Baseline %', 'Actual %', 'Variance', 'Status'].map((h, i) => (
                                            <th key={i} style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800 }}>{h.toUpperCase()}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { task: 'Raft Foundation Casting', base: '100%', act: '100%', var: '0%', status: 'Complete', color: '#16a34a' },
                                        { task: 'Column Reinforcement', base: '85%', act: '42%', var: '-43%', status: 'Delayed', color: '#dc2626' },
                                        { task: 'Formwork for Basement', base: '20%', act: '5%', var: '-15%', status: 'Critical', color: '#dc2626' },
                                        { task: 'Site Logistics Setup', base: '100%', act: '100%', var: '0%', status: 'Complete', color: '#16a34a' }
                                    ].map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '16px', fontWeight: 800, color: '#1a1a1a' }}>{row.task}</td>
                                            <td style={{ padding: '16px', fontWeight: 700, color: '#64748b' }}>{row.base}</td>
                                            <td style={{ padding: '16px', fontWeight: 700, color: row.color }}>{row.act}</td>
                                            <td style={{ padding: '16px', fontWeight: 900, color: row.var.startsWith('-') ? '#dc2626' : '#16a34a' }}>{row.var}</td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900, background: `${row.color}15`, color: row.color }}>{row.status.toUpperCase()}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 4️⃣ Bottleneck & Delay Diagnostics */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginTop: '2.5rem' }}>
                            <div className="card">
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Brain size={24} weight="duotone" color="var(--pivot-blue)" />
                                    Delay Attribution & Root Cause
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    {[
                                        { cause: 'Material Supply Lag (Steel)', impact: 'High', pct: 45, detail: '12-day delay in rebars delivery' },
                                        { cause: 'Labor Shortage (Skilled)', impact: 'Medium', pct: 30, detail: 'Specialized welders unavailable' },
                                        { cause: 'Weather Disruption', impact: 'Low', pct: 15, detail: 'Heavy rain on Feb 12-14' },
                                        { cause: 'Design Revisions', impact: 'Low', pct: 10, detail: 'Foundation V2.1 revision' }
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{item.cause}</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: item.impact === 'High' ? '#dc2626' : '#f59e0b' }}>{item.impact} IMPACT</span>
                                            </div>
                                            <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden', marginBottom: '6px' }}>
                                                <div style={{ width: `${item.pct}%`, height: '100%', background: item.impact === 'High' ? '#dc2626' : 'var(--pivot-blue)', borderRadius: '5px' }}></div>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{item.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card" style={{ background: '#f0f7ff', border: '1px solid #e0f2fe' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0369a1', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Pulse size={24} color="#0369a1" />
                                    Dynamic Bottleneck Alerts
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #dc2626' }}>
                                        <div style={{ fontWeight: 900, color: '#1a1a1a', fontSize: '0.9rem', marginBottom: '4px' }}>Steel Procurement Critical</div>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>Current stock will deplete in 48h. Critical path impact: 6 days per day of stockout.</p>
                                    </div>
                                    <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                                        <div style={{ fontWeight: 900, color: '#1a1a1a', fontSize: '0.9rem', marginBottom: '4px' }}>Concrete Curing Lag</div>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>Slab 4 structural tests delayed due to core temperature fluctuations.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5️⃣ Action Plan & Recommendations */}
                        <div className="card" style={{ marginTop: '2.5rem', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#166534', margin: 0 }}>Recovery Action Plan</h3>
                                <CheckCircle size={32} color="#166534" weight="duotone" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                {[
                                    { title: 'Resource Acceleration', action: 'Deploy 12 additional skilled laborers for column reinforcement work starting Feb 22.', icon: <UsersThree size={24} /> },
                                    { title: 'Procurement Diversion', action: 'Authorize emergency purchase of 40 tons of steel from Local Supplier B at 4% premium.', icon: <Truck size={24} /> },
                                    { title: 'Schedule Compression', action: 'Implement 24/7 overlap for MEP rough-ins to recover 4 days of foundations delay.', icon: <Clock size={24} /> }
                                ].map((step, i) => (
                                    <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '18px', border: '1px solid #dcfce7', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ color: '#166534', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {step.icon} {step.title}
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', fontWeight: 600 }}>{step.action}</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                <button
                                    onClick={() => handleExport('pdf')}
                                    style={{ padding: '12px 24px', background: '#166534', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                                >
                                    <FilePdf size={20} weight="bold" /> Export Official Audit Report
                                </button>
                            </div>
                        </div>
                    </>
                ) : activeTab === 'Users & System' ? (
                    <>
                        {/* 🔹 Users & System Tab Layout */}


                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>

                            {/* 1. Active Users by Role */}
                            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '1.5rem' }}>Active Users by Role</h3>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                                    {/* Donut Chart Representation */}
                                    <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                                        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="5" />
                                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--pivot-blue)" strokeWidth="5" strokeDasharray="40 60" strokeDashoffset="0" /> {/* Admins */}
                                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="5" strokeDasharray="30 70" strokeDashoffset="-40" /> {/* Builders */}
                                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="5" strokeDasharray="20 80" strokeDashoffset="-70" /> {/* Engineers */}
                                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#6366f1" strokeWidth="5" strokeDasharray="10 90" strokeDashoffset="-90" /> {/* Clients */}
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a' }}>248</span>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b' }}>TOTAL USERS</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {[
                                            { label: 'Admin & Mgmt', count: 98, color: 'var(--pivot-blue)' },
                                            { label: 'Site Builders', count: 74, color: '#10b981' },
                                            { label: 'Engineers', count: 52, color: '#f59e0b' },
                                            { label: 'Clients', count: 24, color: '#6366f1' }
                                        ].map((role, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: role.color }}></div>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', minWidth: '100px' }}>{role.label}</div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1a1a1a' }}>{role.count}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Feature Usage Stats */}
                            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Top Feature Usage</h3>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Weekly Interactions</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    {[
                                        { name: 'Blueprint Viewer', count: '14.2k', pct: 92, color: 'var(--pivot-blue)' },
                                        { name: 'Financial Reports', count: '8.5k', pct: 65, color: '#8b5cf6' },
                                        { name: 'Site Daily Logs', count: '6.1k', pct: 45, color: '#10b981' },
                                        { name: 'AI Cost Predictor', count: '3.8k', pct: 30, color: '#f59e0b' }
                                    ].map((feat, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
                                                <span style={{ color: '#334155' }}>{feat.name}</span>
                                                <span style={{ color: '#1a1a1a' }}>{feat.count}</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${feat.pct}%`, height: '100%', background: feat.color, borderRadius: '4px' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. System Logs & Errors */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>System Logs & Health Events</h3>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button style={{ padding: '6px 12px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.75rem', fontWeight: 800 }}>Errors (2)</button>
                                    <button style={{ padding: '6px 12px', borderRadius: '8px', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 800 }}>All Logs</button>
                                </div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                        {['Timestamp', 'Level', 'Module', 'Message', 'User'].map((h, i) => (
                                            <th key={i} style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { time: '10:42 AM', level: 'Error', module: 'Auth Service', msg: 'Failed login attempt (Invalid Token)', user: 'Unknown IP', color: '#dc2626', bg: '#fee2e2' },
                                        { time: '10:38 AM', level: 'Info', module: 'Project API', msg: 'New project "Skyline Phase 2" created', user: 'Admin.John', color: '#10b981', bg: '#ecfdf5' },
                                        { time: '10:15 AM', level: 'Warning', module: 'Database', msg: 'Query execution time exceeded 200ms', user: 'System', color: '#f59e0b', bg: '#fffbeb' },
                                        { time: '09:55 AM', level: 'Info', module: 'Reports', msg: 'Monthly financial report generated', user: 'CFO.Sarah', color: '#3b82f6', bg: '#eff6ff' },
                                        { time: '09:12 AM', level: 'Error', module: 'Integration', msg: 'SAP Sync Timeout (Retrying...)', user: 'System', color: '#dc2626', bg: '#fee2e2' }
                                    ].map((log, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{log.time}</td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ padding: '4px 8px', borderRadius: '6px', background: log.bg, color: log.color, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{log.level}</span>
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: '0.85rem', fontWeight: 700, color: '#1a1a1a' }}>{log.module}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>{log.msg}</td>
                                            <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{log.user}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>) : (
                    <div style={{
                        padding: '5rem', background: 'white', borderRadius: '24px',
                        textAlign: 'center', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{
                            width: '80px', height: '80px', background: '#f0f7ff', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                            color: 'var(--pivot-blue)'
                        }}>
                            <FileText size={40} weight="duotone" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '0.5rem' }}>{activeTab} Module</h2>
                        <p style={{ color: '#7a7a7a', fontWeight: 600 }}>Deep-dive analytics for {activeTab.toLowerCase()} are currently synchronizing.</p>
                        <button
                            onClick={() => setActiveTab('Overview')}
                            style={{
                                marginTop: '1.5rem', padding: '10px 24px', background: 'var(--pivot-blue)',
                                color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer'
                            }}
                        >
                            Return to Overview
                        </button>
                    </div>
                )
            }

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes pulse-soft {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }

                .card {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    box-shadow: 0 4px 25px rgba(0,0,0,0.03);
                    border: 1px solid #f0f0f0;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .card:hover {
                    box-shadow: 0 15px 45px rgba(0, 71, 171, 0.08);
                    border-color: rgba(0, 71, 171, 0.1);
                    transform: translateY(-4px);
                }

                .tab-item {
                    transition: all 0.2s ease;
                }

                .tab-item:hover {
                    background: rgba(0, 71, 171, 0.05);
                }
            `}</style>

            {/* Export Overlay / Status */}
            {
                (exportStatus === 'pdf' || exportStatus === 'excel') && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, animation: 'fadeIn 0.3s ease'
                    }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '24px',
                            background: exportStatus === 'pdf' ? '#fff5f5' : '#f0fff4',
                            color: exportStatus === 'pdf' ? '#c53030' : '#22543d',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            animation: 'pulse-soft 2s infinite'
                        }}>
                            {exportStatus === 'pdf' ? <FilePdf size={40} weight="fill" /> : <FileXls size={40} weight="fill" />}
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a', margin: '0 0 10px 0' }}>
                            Generating {exportStatus.toUpperCase()} Report
                        </h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <ArrowsClockwise size={20} className="spin-icon" style={{ animation: 'spin 2s linear infinite' }} />
                            <span style={{ color: '#64748b', fontWeight: 700 }}>Processing enterprise datasets...</span>
                        </div>
                    </div>
                )
            }

            {
                exportStatus === 'success' && (
                    <div style={{
                        position: 'fixed', bottom: '40px', right: '40px',
                        background: '#22543d', color: 'white', padding: '16px 28px',
                        borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)', zIndex: 1001,
                        animation: 'fadeIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <CheckCircle size={24} weight="fill" />
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1rem' }}>Export Successful</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.9 }}>Your file is ready and downloading.</div>
                        </div>
                    </div>
                )
            }

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin-icon { color: var(--pivot-blue); }

                @media print {
                    /* Show the cover page only in print */
                    .pdf-cover-page {
                        display: block !important;
                        page-break-after: always;
                    }
                    .pdf-exec-summary {
                        display: block !important;
                        page-break-after: always;
                    }
                    .pdf-project-summary, .pdf-schedule-analysis {
                        display: block !important;
                        page-break-after: always;
                    }
                    .pdf-financial-overview, .pdf-resource-summary {
                        display: block !important;
                        page-break-after: always;
                    }
                    .pdf-material-inventory, .pdf-safety-report {
                        display: block !important;
                        page-break-after: always;
                    }
                    .pdf-quality-status, .pdf-document-status {
                        display: block !important;
                        page-break-after: always;
                    }
                    .pdf-risks-actions, .pdf-appendix {
                        display: block !important;
                        page-break-after: always;
                    }
                    .pdf-page-footer {
                        display: block !important;
                    }
                    .print-header {
                        display: block !important;
                    }
                    button, .export-controls, .sync-area, .nav-back, .tabs-row, header, .summary-detail, label, .sync-label, #sync-btn, .navigation-back, .export-group {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                    }
                    .report-container {
                        padding: 0 !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                    }
                    .card {
                        box-shadow: none !important;
                        border: 1px solid #f0f0f0 !important;
                        break-inside: avoid;
                        margin-bottom: 2rem !important;
                    }
                }
            `}</style>
        </div >
    );
};

export default GlobalReports;
