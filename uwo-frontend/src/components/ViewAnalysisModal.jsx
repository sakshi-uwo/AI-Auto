import React, { useState } from 'react';
import {
    X, ChartBar, CalendarBlank, Users, Package,
    ShieldCheck, Warning, CurrencyInr, Megaphone,
    GitDiff, HardHat, FileText, DownloadSimple, ShareNetwork,
    Lightning, CaretRight, Funnel, MagnifyingGlass, Plus,
    TrendUp, Clock, WarningCircle, CheckCircle, Info, LockOpen, Lock
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

const ViewAnalysisModal = ({ onClose, projects = [] }) => {
    const [activeSection, setActiveSection] = useState('Progress');
    const [filters, setFilters] = useState({
        project: projects[0]?._id || '',
        site: 'All Sites',
        dateRange: 'Last 30 Days',
        activity: 'Structural',
        trade: 'Civil',
        priority: 'All'
    });

    const [isExporting, setIsExporting] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [postedRemarks, setPostedRemarks] = useState([]);
    const [actionFeedback, setActionFeedback] = useState(null);

    const handlePostRemark = () => {
        if (!remarks.trim()) return;
        const newRemark = {
            id: Date.now(),
            text: remarks,
            user: 'Lead Civil Engineer',
            time: 'Just now'
        };
        setPostedRemarks([newRemark, ...postedRemarks]);
        setRemarks('');
        setActionFeedback('Remark posted successfully!');
        setTimeout(() => setActionFeedback(null), 3000);
    };

    const handleShareInsights = () => {
        setIsSharing(true);
        setTimeout(() => {
            setIsSharing(false);
            setActionFeedback('Insights shared with Builder & Project Admin!');
            setTimeout(() => setActionFeedback(null), 3000);
        }, 1500);
    };

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            setActionFeedback('Analysis report exported successfully!');
            setTimeout(() => setActionFeedback(null), 3000);
        }, 2000);
    };

    const sections = [
        { id: 'Progress', label: 'Project Progress', icon: <TrendUp size={20} /> },
        { id: 'Schedule', label: 'Schedule & Delay', icon: <CalendarBlank size={20} /> },
        { id: 'Resources', label: 'Resource Utilization', icon: <Users size={20} /> },
        { id: 'Materials', label: 'Material Consumption', icon: <Package size={20} /> },
        { id: 'Quality', label: 'Quality & Compliance', icon: <ShieldCheck size={20} /> },
        { id: 'Safety', label: 'Safety & Risk', icon: <Warning size={20} /> },
        { id: 'Cost', label: 'Cost Impact', icon: <CurrencyInr size={20} /> },
        { id: 'Issues', label: 'Issue & Instruction', icon: <Megaphone size={20} /> },
        { id: 'Comparison', label: 'Comparative Analysis', icon: <GitDiff size={20} /> },
        { id: 'AI', label: 'AI Insights', icon: <Lightning size={20} /> }
    ];

    const renderProgressSection = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                <div className="stat-card">
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem' }}>Overall Progress (Planned vs Actual)</div>
                    <div style={{ display: 'flex', flexDirection: 'center', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, width: '60px' }}>PLANNED</span>
                        <div style={{ flex: 1, height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                            <div style={{ width: '75%', height: '100%', background: '#2563eb' }}></div>
                        </div>
                        <span style={{ fontWeight: 800, color: '#2563eb' }}>75%</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'center', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, width: '60px' }}>ACTUAL</span>
                        <div style={{ flex: 1, height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                            <div style={{ width: '62%', height: '100%', background: '#ef4444' }}></div>
                        </div>
                        <span style={{ fontWeight: 800, color: '#ef4444' }}>62%</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem' }}>Milestone Variance</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444' }}>-12 Days</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Project Slippage</div>
                        </div>
                        <WarningCircle size={40} color="#ef4444" weight="fill" />
                    </div>
                </div>
            </div>

            <div className="table-container">
                <h4 style={{ margin: '0 0 1rem 0' }}>Activity-wise Completion Status</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '12px' }}>Activity</th>
                            <th style={{ padding: '12px' }}>Status</th>
                            <th style={{ padding: '12px' }}>Progress</th>
                            <th style={{ padding: '12px' }}>Reason if Delayed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px', fontWeight: 700 }}>Foundation Slab</td>
                            <td style={{ padding: '12px' }}><span className="badge-green">Completed</span></td>
                            <td style={{ padding: '12px' }}>100%</td>
                            <td style={{ padding: '12px', color: '#64748b' }}>—</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '12px', fontWeight: 700 }}>Column Reinforcement (GF)</td>
                            <td style={{ padding: '12px' }}><span className="badge-orange">Delayed</span></td>
                            <td style={{ padding: '12px' }}>45%</td>
                            <td style={{ padding: '12px', color: '#ef4444', fontWeight: 600 }}>Material Shortage</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderScheduleSection = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="alert-box-warning">
                <Info size={24} color="#d97706" />
                <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Critical Path Delay Alert</div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>Beam casting for Floor 1 is on the critical path and delayed by 4 days. Total project delay at risk: 6 days.</p>
                </div>
            </div>

            <div className="stat-card">
                <h4 style={{ margin: '0 0 1.5rem 0' }}>Task Slippage Analysis</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                        { task: 'Excavation', planned: '10 Feb', actual: '12 Feb', slippage: '+2d' },
                        { task: 'PCC Work', planned: '15 Feb', actual: '20 Feb', slippage: '+5d' },
                        { task: 'Steel Bending', planned: '22 Feb', actual: 'Ongoing', slippage: '+3d' }
                    ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                            <div>
                                <div style={{ fontWeight: 800, color: '#1e293b' }}>{item.task}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Planned: {item.planned} • Execution: {item.actual}</div>
                            </div>
                            <div style={{ fontWeight: 800, color: '#ef4444' }}>{item.slippage}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ padding: '1.5rem', background: '#eff6ff', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <Lightning size={24} color="#2563eb" weight="fill" />
                    <h4 style={{ margin: 0, color: '#1e3a8a' }}>AI Recovery Plan Suggestion</h4>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#1e40af', lineHeight: 1.5 }}>
                    To offset the 4-day delay in beam casting, we recommend increasing the rebar crew size from 8 to 12 for the next 5 days.
                </p>
                <button className="btn-secondary" style={{ marginTop: '1rem', background: 'white' }}>Apply Recommendation</button>
            </div>
        </div>
    );

    const renderResourcesSection = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="mini-card">
                    <Users size={24} weight="duotone" color="#2563eb" />
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>LABOR UTILIZATION</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>92%</div>
                    </div>
                </div>
                <div className="mini-card">
                    <Users size={24} weight="duotone" color="#ea580c" />
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>CREW PRODUCTIVITY</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>8.4/10</div>
                    </div>
                </div>
                <div className="mini-card">
                    <ChartBar size={24} weight="duotone" color="#059669" />
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>EQUIPMENT UPTIME</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>98.5%</div>
                    </div>
                </div>
            </div>

            <div className="stat-card">
                <h4 style={{ margin: '0 0 1rem 0' }}>Crew Performance Analysis</h4>
                {[
                    { crew: 'Carpentry', efficiency: 95, status: 'Overutilized' },
                    { crew: 'Plumbing', efficiency: 65, status: 'Underutilized' },
                    { crew: 'Structural/Steel', efficiency: 88, status: 'On Track' }
                ].map((c, i) => (
                    <div key={i} style={{ padding: '12px 0', borderBottom: i === 2 ? 'none' : '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 700 }}>{c.crew}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: c.status === 'Underutilized' ? '#ef4444' : '#2563eb' }}>{c.status}</span>
                        </div>
                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${c.efficiency}%`, height: '100%', background: c.efficiency > 90 ? '#ef4444' : '#2563eb' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderMaterialsSection = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="table-container">
                <h4 style={{ margin: '0 0 1.5rem 0' }}>BOQ vs Actual Material Utilization</h4>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                <th style={{ padding: '12px' }}>Material</th>
                                <th style={{ padding: '12px' }}>Planned (BOQ)</th>
                                <th style={{ padding: '12px' }}>Actual Used</th>
                                <th style={{ padding: '12px' }}>Wastage</th>
                                <th style={{ padding: '12px' }}>Alert</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px', fontWeight: 700 }}>Grade 53 Cement</td>
                                <td style={{ padding: '12px' }}>500 Bags</td>
                                <td style={{ padding: '12px' }}>525 Bags</td>
                                <td style={{ padding: '12px', color: '#ef4444' }}>5%</td>
                                <td style={{ padding: '12px' }}><span className="dot-red"></span> Efficiency Issue</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '12px', fontWeight: 700 }}>12mm Rebar</td>
                                <td style={{ padding: '12px' }}>12 Tons</td>
                                <td style={{ padding: '12px' }}>11.8 Tons</td>
                                <td style={{ padding: '12px', color: '#059669' }}>1.2%</td>
                                <td style={{ padding: '12px' }}><CheckCircle size={16} color="#059669" /> Efficient</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderRiskHeatmap = () => {
        const matrix = [
            ['#fef2f2', '#fef2f2', '#fee2e2', '#fecaca', '#f87171'],
            ['#fffbeb', '#fef2f2', '#fef2f2', '#fee2e2', '#fecaca'],
            ['#f0fdf4', '#fffbeb', '#fef2f2', '#fef2f2', '#fee2e2'],
            ['#f0fdf4', '#f0fdf4', '#fffbeb', '#fef2f2', '#fef2f2'],
            ['#f0fdf4', '#f0fdf4', '#f0fdf4', '#fffbeb', '#fef2f2'],
        ];
        return (
            <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', marginBottom: '10px' }}>PROBABILITY VS SEVERITY HEATMAP</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                    {matrix.flat().map((color, i) => (
                        <div key={i} style={{ aspectRatio: '1', background: color, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {i === 3 && <div style={{ width: '8px', height: '8px', background: '#dc2626', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(220, 38, 38, 0.2)' }}></div>}
                            {i === 12 && <div style={{ width: '8px', height: '8px', background: '#ea580c', borderRadius: '50%' }}></div>}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.6rem', fontWeight: 700, color: '#94a3b8' }}>
                    <span>LOW PROBABILITY</span>
                    <span>HIGH PROBABILITY</span>
                </div>
            </div>
        );
    };

    const renderSafetySection = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="stat-card">
                        <h4 style={{ margin: '0 0 1rem 0' }}>Risk Severity Distribution</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { label: 'Critical / High', count: 2, color: '#ef4444', percent: 15 },
                                { label: 'Medium', count: 8, color: '#f59e0b', percent: 60 },
                                { label: 'Low', count: 3, color: '#10b981', percent: 25 }
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                                        <span>{item.label}</span>
                                        <span>{item.count} Cases</span>
                                    </div>
                                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${item.percent}%`, height: '100%', background: item.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="stat-card">
                        {renderRiskHeatmap()}
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="stat-card">
                        <h4 style={{ margin: '0 0 1rem 0' }}>Safety KPIs</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '16px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991b1b' }}>NEAR-MISSES</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444' }}>04</div>
                            </div>
                            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '16px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534' }}>UNSAFE ACTS</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>12</div>
                            </div>
                        </div>
                    </div>
                    <div className="stat-card" style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 1rem 0' }}>Incident Log (Last 7 Days)</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ fontSize: '0.8rem', padding: '10px', background: '#fafafa', borderRadius: '10px', borderLeft: '4px solid #ef4444' }}>
                                <div style={{ fontWeight: 800 }}>Missing PPE - Site B</div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Status: Corrected • 2 days ago</div>
                            </div>
                            <div style={{ fontSize: '0.8rem', padding: '10px', background: '#fafafa', borderRadius: '10px', borderLeft: '4px solid #f59e0b' }}>
                                <div style={{ fontWeight: 800 }}>Unshored Pit Edge</div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Status: Under Action • 1 day ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <h4 style={{ margin: '0 0 1rem 0' }}>High-Risk Zone Identification</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    {['Excavation Pit A', 'Tower 1 Roof', 'Material Elevator'].map(zone => (
                        <div key={zone} style={{ padding: '1rem', background: 'white', border: '1px solid #fee2e2', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <WarningCircle size={24} color="#ef4444" weight="fill" />
                            <span style={{ fontWeight: 800, color: '#1e293b' }}>{zone}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCostSection = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {[
                    { label: 'Rework Cost Est.', value: '$4,200', trend: '↑', color: '#ef4444' },
                    { label: 'Delay Impact', value: '$12,500', trend: '↑', color: '#ef4444' },
                    { label: 'Budget Usage', value: '68%', trend: 'Norm', color: '#10b981' },
                    { label: 'Material Variance', value: '-$1,200', trend: '↓', color: '#10b981' }
                ].map((stat, idx) => (
                    <div key={idx} className="mini-card">
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>{stat.label.toUpperCase()}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '5px', color: '#1e293b' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="stat-card">
                <h4 style={{ margin: '0 0 1rem 0' }}>Activity-wise Cost Impact (Top 3)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                        { activity: 'Structural Steel', impact: '$8,000', reason: 'Market Price Fluctuation', bar: 100 },
                        { activity: 'Piling Work', impact: '$5,500', reason: 'Subsoil condition variation', bar: 70 },
                        { activity: 'Concrete Casting', impact: '$2,100', reason: 'Overtime labor requirement', bar: 40 }
                    ].map((item, idx) => (
                        <div key={idx} style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 800 }}>{item.activity}</span>
                                <span style={{ fontWeight: 900, color: '#ef4444' }}>{item.impact}</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Reason: {item.reason}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderIssuesSection = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="stat-card">
                    <h4 style={{ margin: '0 0 1rem 0' }}>Instruction Compliance</h4>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px' }}>
                        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="85, 100" />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>85%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <h4 style={{ margin: '0 0 1rem 0' }}>Issue Resolution Cycle</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1, padding: '10px', background: '#f0fdf4', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#166534' }}>24</div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#15803d' }}>CLOSED</div>
                            </div>
                            <div style={{ flex: 1, padding: '10px', background: '#fff7ed', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#9a3412' }}>05</div>
                                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#c2410c' }}>OPEN</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <h4 style={{ margin: '0 0 1rem 0' }}>Escalation Analysis</h4>
                {[
                    { issue: 'Slab reinforcement inspection rejected twice', days: '4 Days', level: 'Project Head' },
                    { issue: 'Concrete quality mismatch at Site B', days: '2 Days', level: 'Quality Manager' }
                ].map((esc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
                        <WarningCircle size={24} color="#ef4444" weight="fill" />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, color: '#1e293b' }}>{esc.issue}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pending for {esc.days} • Escalated to: {esc.level}</div>
                        </div>
                        <button className="btn-secondary">View Thread</button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderComparisonSection = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="table-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: 0 }}>Site-to-Site Performance Comparison</h4>
                    <button className="toolbar-btn" style={{ background: '#0f172a', color: 'white', border: 'none' }}>
                        <GitDiff size={18} /> Generate Comparative Audit
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[
                        { site: 'Project Alpha - Block A', progress: 85, cost: -5, safety: 98, status: 'On Track' },
                        { site: 'Project Alpha - Block B', progress: 62, cost: 12, safety: 85, status: 'At Risk' },
                        { site: 'The Heights - Site B', progress: 40, cost: 0, safety: 92, status: 'Starting' }
                    ].map((s, idx) => (
                        <div key={idx} style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', gap: '1rem', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{s.site}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>Lead Engineer: Er. Rajesh</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginBottom: '4px' }}>PROGRESS VS BASELINE</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', position: 'relative' }}>
                                            <div style={{ width: `${s.progress}%`, height: '100%', background: s.progress > 80 ? '#10b981' : s.progress > 50 ? '#2563eb' : '#f59e0b', borderRadius: '3px' }}></div>
                                            <div style={{ position: 'absolute', right: `${100 - (s.progress + 5)}%`, top: '-4px', bottom: '-4px', width: '2px', background: '#94a3b8', zIndex: 5 }} title="Baseline Target"></div>
                                        </div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>{s.progress}% / Target: {s.progress + 5}%</div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginBottom: '4px' }}>COST VAR</div>
                                    <div style={{ color: s.cost > 0 ? '#ef4444' : '#10b981', fontWeight: 900 }}>{s.cost > 0 ? '+' : ''}{s.cost}%</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', marginBottom: '4px' }}>SAFETY SCORE</div>
                                    <div style={{ fontWeight: 900 }}>{s.safety}%</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button className="btn-secondary" style={{ fontSize: '0.65rem' }}>View Detail</button>
                                    <button className="toolbar-btn" style={{ padding: '6px 10px', fontSize: '0.65rem', background: 'white' }}>
                                        <FileText size={14} /> Full Audit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAISecton = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '2rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                <Lightning size={60} color="#fbbf24" weight="fill" style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1 }} />
                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Lightning size={24} color="#fbbf24" weight="fill" /> Engineer AI Intel
                </h3>
                <p style={{ color: '#94a3b8', margin: '0 0 2rem 0' }}>Predictive models analyzing site logs and historical data.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.2rem', borderRadius: '16px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>DELAY PREDICTION</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fbbf24' }}>HIGH RISK</div>
                            <TrendUp size={24} color="#ef4444" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="stat-card">
                <h4 style={{ margin: '0 0 1rem 0' }}>Suggested Corrective Actions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {[
                        { title: 'Re-sequence Block B Plumbing', desc: 'Overlap electrical and plumbing schedules to save 3 days.', icon: <Clock size={18} /> },
                        { title: 'In-situ Concrete Optimization', desc: 'Swap to pre-mix for North wall to reduce site congestion.', icon: <CheckCircle size={18} /> },
                        { title: 'Resource Realignment (Steel)', desc: 'Shift 4 bar-benders to Block A to hit Friday milestone.', icon: <Users size={18} /> }
                    ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '12px', alignItems: 'flex-start' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{step.title}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{step.desc}</div>
                            </div>
                            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>Create Task</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderQualitySection = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="stat-card">
                <h4 style={{ margin: '0 0 1rem 0' }}>Quality Audit Score</h4>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981' }}>94.2%</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Project average quality compliance based on last 50 checklists.</div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'Progress': return renderProgressSection();
            case 'Schedule': return renderScheduleSection();
            case 'Resources': return renderResourcesSection();
            case 'Materials': return renderMaterialsSection();
            case 'Quality': return renderQualitySection();
            case 'Safety': return renderSafetySection();
            case 'Cost': return renderCostSection();
            case 'Issues': return renderIssuesSection();
            case 'Comparison': return renderComparisonSection();
            case 'AI': return renderAISecton();
            default: return <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}><ChartBar size={48} /><p>Analysis for {activeSection} is loading...</p></div>;
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200, backdropFilter: 'blur(10px)' }}>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ width: '1250px', height: '90vh', background: '#f8fafc', borderRadius: '28px', display: 'flex', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4)' }}
            >
                {/* Sidebar Navigation */}
                <div style={{ width: '280px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '1.5rem 0' }}>
                    <div style={{ padding: '0 2rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--pivot-blue)' }}>
                            <ChartBar size={28} weight="fill" />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>Deep Analysis</h2>
                        </div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>Civil Engineer POV</p>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: '12px', border: 'none', background: activeSection === section.id ? '#eff6ff' : 'transparent',
                                    display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s',
                                    color: activeSection === section.id ? '#2563eb' : '#475569',
                                    fontWeight: activeSection === section.id ? 800 : 600,
                                    fontSize: '0.9rem', marginBottom: '4px'
                                }}
                            >
                                <div style={{ opacity: activeSection === section.id ? 1 : 0.6 }}>{section.icon}</div>
                                {section.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', marginBottom: '8px' }}>ENGINEER REMARKS</div>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Add observations..."
                                style={{ width: '100%', minHeight: '60px', border: 'none', background: 'transparent', fontSize: '0.75rem', outline: 'none', resize: 'none' }}
                            ></textarea>
                            <button className="btn-save-remarks" onClick={handlePostRemark}>Post Remarks</button>
                        </div>
                        {postedRemarks.length > 0 && (
                            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {postedRemarks.map(rmk => (
                                    <div key={rmk.id} style={{ padding: '8px', background: 'white', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                        <p style={{ fontSize: '0.7rem', margin: '0 0 4px 0', color: '#1e293b' }}>{rmk.text}</p>
                                        <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700 }}>{rmk.time}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Toolbar with Filters */}
                    <div style={{ padding: '1rem 2rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <select
                                    className="filter-select"
                                    value={filters.project}
                                    onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                                >
                                    <option value="">Select Project</option>
                                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                                <select
                                    className="filter-select"
                                    value={filters.site}
                                    onChange={(e) => setFilters({ ...filters, site: e.target.value })}
                                >
                                    <option>All Sites</option>
                                    <option>Block A</option>
                                    <option>Block B</option>
                                </select>
                                <select
                                    className="filter-select"
                                    value={filters.trade}
                                    onChange={(e) => setFilters({ ...filters, trade: e.target.value })}
                                >
                                    <option>Civil</option>
                                    <option>Electrical</option>
                                    <option>Plumbing</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="toolbar-btn"><MagnifyingGlass weight="bold" /> Drill Down</button>
                                <button className="toolbar-btn" onClick={handleExport} disabled={isExporting}>
                                    {isExporting ? <Clock weight="bold" /> : <DownloadSimple weight="bold" />}
                                    {isExporting ? 'Exporting...' : 'Export Report'}
                                </button>
                                <button
                                    className="toolbar-btn"
                                    style={{ background: '#2563eb', color: 'white', border: 'none' }}
                                    onClick={handleShareInsights}
                                    disabled={isSharing}
                                >
                                    {isSharing ? <Clock weight="bold" /> : <ShareNetwork weight="bold" />}
                                    {isSharing ? 'Sharing...' : 'Share Insights'}
                                </button>
                                <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={18} weight="bold" />
                                </button>
                            </div>
                        </div>
                        <AnimatePresence>
                            {actionFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    style={{
                                        padding: '10px 16px',
                                        background: '#dcfce7',
                                        border: '1px solid #bbf7d0',
                                        borderRadius: '12px',
                                        color: '#166534',
                                        fontSize: '0.8rem',
                                        fontWeight: 800,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <CheckCircle size={18} weight="fill" />
                                    {actionFeedback}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Module Render */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
                        <div style={{ maxWidth: '950px', margin: '0 auto' }}>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0 0 2rem 0' }}>{sections.find(s => s.id === activeSection)?.label}</h1>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 24px;
                    border: 1px solid #e2e8f0;
                }
                .mini-card {
                    background: white;
                    padding: 1.25rem;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                }
                .filter-select {
                    padding: 8px 12px;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    font-size: 0.8rem;
                    font-weight: 700;
                    background: #f8fafc;
                }
                .btn-save-remarks {
                    width: 100%;
                    margin-top: 10px;
                    padding: 8px;
                    border-radius: 10px;
                    background: #2563eb;
                    color: white;
                    border: none;
                    font-size: 0.75rem;
                    font-weight: 800;
                    cursor: pointer;
                }
                .table-container {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 24px;
                    border: 1px solid #e2e8f0;
                }
                .dot-red {
                    width: 8px; height: 8px; background: #ef4444; border-radius: 50%; display: inline-block;
                }
                .badge-green {
                    padding: 4px 10px; background: #dcfce7; color: #166534; border-radius: 8px; font-size: 0.7rem; font-weight: 800;
                }
                .badge-orange {
                    padding: 4px 10px; background: #fff7ed; color: #9a3412; border-radius: 8px; font-size: 0.7rem; font-weight: 800;
                }
                .toolbar-btn {
                    padding: 8px 14px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; font-weight: 800; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 6px; color: #475569;
                }
                .btn-secondary {
                    padding: 6px 12px; border-radius: 8px; border: 1px solid #bfdbfe; color: #2563eb; background: white; font-weight: 800; font-size: 0.7rem; cursor: pointer;
                }
                .alert-box-warning {
                    padding: 1rem; background: #fffbeb; border: 1px solid #fde68a; border-radius: 16px; display: flex; gap: 1rem; color: #92400e;
                }
            `}</style>
        </div>
    );
};

export default ViewAnalysisModal;
