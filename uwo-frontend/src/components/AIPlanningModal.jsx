import React, { useState } from 'react';
import {
    X, ChartPieSlice, Coin, Calendar, Users, Cube, ShieldWarning, Robot, ArrowsLeftRight, FileText,
    TrendUp, Warning, CheckCircle, Clock, Info
} from '@phosphor-icons/react';

const AIPlanningModal = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('Overview');

    const tabs = [
        { id: 'Overview', icon: <ChartPieSlice />, label: 'Overview' },
        { id: 'Cost', icon: <Coin />, label: 'Cost Planning' },
        { id: 'Timeline', icon: <Calendar />, label: 'Timeline Planning' },
        { id: 'Resource', icon: <Users />, label: 'Resource Planning' },
        { id: 'Material', icon: <Cube />, label: 'Material Planning' },
        { id: 'Risk', icon: <ShieldWarning />, label: 'Risk & Compliance' },
        { id: 'AI', icon: <Robot />, label: 'AI Insights' },
        { id: 'WhatIf', icon: <ArrowsLeftRight />, label: 'What-If Scenarios' },
        { id: 'Reports', icon: <FileText />, label: 'Reports' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        {/* Project Health Score */}
                        <div className="card" style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Project Planning Health</h3>
                                    <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Based on budget, timeline, and resource availability.</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981' }}>85/100</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>STRONG FEASIBILITY</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>BUDGET VARIANCE</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>+2.5% (Safe)</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>TIMELINE BUFFER</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>14 Days</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>RISK LEVEL</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>Medium</div>
                                </div>
                            </div>
                        </div>

                        {/* Key Alerts */}
                        <div className="card" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
                            <h4 style={{ color: '#be123c', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Warning weight="fill" /> Critical Alerts
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ fontSize: '0.85rem', color: '#881337', padding: '8px', background: 'white', borderRadius: '6px' }}>
                                    <strong>Material Delay:</strong> Steel delivery likely delayed by 3 days.
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#881337', padding: '8px', background: 'white', borderRadius: '6px' }}>
                                    <strong>Cost Overrun:</strong> Concrete prices up by 4% in local market.
                                </div>
                            </div>
                        </div>

                        {/* Recent AI Suggestions */}
                        <div className="card" style={{ gridColumn: 'span 3', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                            <h4 style={{ color: '#0369a1', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Robot weight="fill" /> Recent AI Recommendations
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ background: 'white', padding: '1rem', borderRadius: '10px' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0c4a6e' }}>Optimize Labor Schedule</div>
                                    <p style={{ fontSize: '0.85rem', color: '#334155', marginTop: '4px' }}>Shift 2 masons from Block A to Block B next week to align with material arrival.</p>
                                </div>
                                <div style={{ background: 'white', padding: '1rem', borderRadius: '10px' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0c4a6e' }}>Bulk Material Purchase</div>
                                    <p style={{ fontSize: '0.85rem', color: '#334155', marginTop: '4px' }}>Pre-order cement now to lock in current rates before projected hike.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Cost':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* 1. Top Cards: Budget Buffer & Overrun Risk */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h4 style={{ color: '#1e293b', margin: 0, fontWeight: 800 }}>Budget Buffer</h4>
                                    <div style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>HEALTHY</div>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a' }}>$85,000</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Remaining Contingency (12% of Total)</div>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: '75%', height: '100%', background: '#16a34a', borderRadius: '4px' }}></div>
                                </div>
                            </div>

                            <div className="card" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h4 style={{ color: '#991b1b', margin: 0, fontWeight: 800 }}>Cost Overrun Risk</h4>
                                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>HIGH RISK</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '0.5rem' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626' }}>22%</div>
                                    <div style={{ fontSize: '0.9rem', color: '#7f1d1d', fontWeight: 600, paddingBottom: '6px' }}>Probability</div>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: 0 }}>High chance of exceeding budget in <strong>Structure Phase</strong> due to rising steel prices.</p>
                            </div>
                        </div>

                        {/* 2. Phase-wise Cost Breakdown */}
                        <div className="card">
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Coin size={24} color="var(--pivot-blue)" /> Phase-wise Cost Breakdown
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                                {[
                                    { phase: 'Foundation', planned: '$120k', actual: '$118k', status: 'On Track', color: '#10b981' },
                                    { phase: 'Structure', planned: '$450k', actual: '$480k', status: 'Over Budget', color: '#ef4444' },
                                    { phase: 'Finishing', planned: '$300k', actual: '$0', status: 'Upcoming', color: '#64748b' },
                                    { phase: 'MEP', planned: '$150k', actual: '$0', status: 'Upcoming', color: '#64748b' }
                                ].map((item, i) => (
                                    <div key={i} style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>{item.phase}</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{item.planned}</div>
                                        <div style={{ fontSize: '0.8rem', color: item.color, fontWeight: 600 }}>{item.status}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Middle Section: BOQ & AI Optimization */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                            {/* BOQ Planned Quantities */}
                            <div className="card">
                                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>BOQ Planned Quantities</h4>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                    <thead style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                                        <tr>
                                            <th style={{ padding: '8px', borderRadius: '6px 0 0 6px' }}>Item</th>
                                            <th style={{ padding: '8px' }}>Quantity</th>
                                            <th style={{ padding: '8px' }}>Unit Cost</th>
                                            <th style={{ padding: '8px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { item: 'Cement (Grade 53)', qty: '5,000 Bags', unit: '$6.5', total: '$32,500' },
                                            { item: 'Steel Rebar (TMT)', qty: '120 Tons', unit: '$850', total: '$102,000' },
                                            { item: 'Bricks (Red Clay)', qty: '200,000 Pcs', unit: '$0.15', total: '$30,000' }
                                        ].map((row, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '10px 8px', fontWeight: 600, color: '#334155' }}>{row.item}</td>
                                                <td style={{ padding: '10px 8px', color: '#64748b' }}>{row.qty}</td>
                                                <td style={{ padding: '10px 8px', color: '#64748b' }}>{row.unit}</td>
                                                <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>{row.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* AI Cost Suggestions */}
                            <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e40af', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Robot weight="fill" /> AI Optimization
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <li style={{ background: 'white', padding: '12px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '4px' }}>Vendor Negotiation Opportunity</div>
                                        <div style={{ fontSize: '0.8rem', color: '#475569' }}>Bulk ordering <strong>Steel Rebar</strong> now could save <strong>$4,200</strong> due to upcoming market dip.</div>
                                    </li>
                                    <li style={{ background: 'white', padding: '12px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '4px' }}>Substitute Material</div>
                                        <div style={{ fontSize: '0.8rem', color: '#475569' }}>Switching to <strong>Fly Ash Bricks</strong> for non-load bearing walls reduces cost by <strong>15%</strong>.</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case 'Timeline':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* 1. Timeline Overview & Risks */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                            <div className="card">
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Clock size={24} color="var(--pivot-blue)" /> Project Schedule
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Month Header */}
                                    <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                                        <div style={{ width: '20%', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Phase</div>
                                        <div style={{ width: '20%', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Jan</div>
                                        <div style={{ width: '20%', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Feb</div>
                                        <div style={{ width: '20%', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Mar</div>
                                        <div style={{ width: '20%', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Apr</div>
                                    </div>
                                    {/* Timeline Bars */}
                                    {[
                                        { name: 'Foundation', start: 0, width: 30, color: '#10b981', status: 'Done' },
                                        { name: 'Structure', start: 25, width: 40, color: '#3b82f6', status: 'Active' },
                                        { name: 'Electrical', start: 60, width: 20, color: '#cbd5e1', status: 'Pending' },
                                        { name: 'Finishing', start: 75, width: 25, color: '#cbd5e1', status: 'Pending' }
                                    ].map((t, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                                            <div style={{ width: '20%', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{t.name}</div>
                                            <div style={{ width: '80%', position: 'relative', height: '100%' }}>
                                                <div style={{
                                                    position: 'absolute', left: `${t.start}%`, width: `${t.width}%`,
                                                    height: '24px', background: t.color, borderRadius: '6px', opacity: 0.8,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.7rem', color: 'white', fontWeight: 700
                                                }}>
                                                    {t.status}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card" style={{ background: '#fff7ed', border: '1px solid #ffedd5' }}>
                                <h4 style={{ color: '#c2410c', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Warning weight="fill" /> Delay Risk Prediction
                                </h4>
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ea580c', lineHeight: 1 }}>
                                    4 Days
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#9a3412', fontWeight: 700, marginBottom: '1rem' }}>Predicted Delay</div>
                                <div style={{ fontSize: '0.85rem', color: '#9a3412', lineHeight: '1.5' }}>
                                    <strong>Primary Cause:</strong> Shortage of specialized labor predicted for 'Structure' phase in week 3 of Feb.
                                    <br /><br />
                                    <strong>Impact:</strong> Will push 'Electrical' start date by 4 days.
                                </div>
                            </div>
                        </div>

                        {/* 2. Critical Path & Buffer Analysis */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="card">
                                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Critical Path View</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { step: 'Excavation', date: 'Jan 10', critical: true },
                                        { step: 'Foundation Pouring', date: 'Jan 25', critical: true },
                                        { step: 'Ground Floor Columns', date: 'Feb 15', critical: true },
                                        { step: 'First Floor Slab', date: 'Mar 05', critical: true },
                                        { step: 'Brickwork', date: 'Mar 20', critical: false }
                                    ].map((step, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '12px', height: '12px', borderRadius: '50%',
                                                background: step.critical ? '#ef4444' : '#94a3b8',
                                                border: step.critical ? '2px solid #fee2e2' : 'none'
                                            }}></div>
                                            <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: step.critical ? 700 : 500, color: step.critical ? '#1e293b' : '#64748b' }}>
                                                {step.step} {step.critical && <span style={{ fontSize: '0.7rem', color: '#ef4444', marginLeft: '6px' }}>(CRITICAL)</span>}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{step.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card" style={{ background: '#f0fdf4', border: '1px solid #dcfce7' }}>
                                <h4 style={{ color: '#15803d', fontWeight: 800, marginBottom: '1rem' }}>Buffer Time Analysis</h4>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534' }}>Total Project Buffer</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#15803d' }}>14 Days Remaining</span>
                                    </div>
                                    <div style={{ width: '100%', height: '10px', background: '#bbf7d0', borderRadius: '5px' }}>
                                        <div style={{ width: '70%', height: '100%', background: '#16a34a', borderRadius: '5px' }}></div>
                                    </div>
                                </div>
                                <div style={{ background: 'white', padding: '1rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', marginBottom: '5px' }}>AI Suggestion</div>
                                    <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0 }}>
                                        Based on current velocity, you can safely utilize <strong>3 buffer days</strong> to expedite 'Ground Floor Columns' without impacting the final handover date.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                );
            case 'Resource':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* 1. Engineer & Key Staff Allocation */}
                        <div className="card">
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Users size={24} color="var(--pivot-blue)" /> Key Staff Allocation
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                {[
                                    { role: 'Senior Civil Engineer', name: 'Alice Smith', allocation: '100%', status: 'Dedicated', color: '#10b981' },
                                    { role: 'Site Manager', name: 'David Chen', allocation: '50%', status: 'Shared (2 Projects)', color: '#f59e0b' },
                                    { role: 'Safety Officer', name: 'Mike Ross', allocation: '25%', status: 'Visiting', color: '#3b82f6' }
                                ].map((staff, i) => (
                                    <div key={i} style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{staff.role}</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{staff.name}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Alloc: {staff.allocation}</span>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: staff.color, background: `${staff.color}20`, padding: '2px 8px', borderRadius: '4px' }}>{staff.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Labor Forecast & Equipment */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                            <div className="card">
                                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Labor Requirement Forecast (Next 4 Weeks)</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { type: 'Masons', current: 12, required: 15, deficit: 3 },
                                        { type: 'Helpers', current: 20, required: 25, deficit: 5 },
                                        { type: 'Electricians', current: 4, required: 4, deficit: 0 },
                                        { type: 'Carpenters', current: 6, required: 8, deficit: 2 }
                                    ].map((labor, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>
                                            <div style={{ width: '30%', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{labor.type}</div>
                                            <div style={{ width: '40%', fontSize: '0.85rem', color: '#64748b' }}>Current: {labor.current} / Req: {labor.required}</div>
                                            <div style={{ width: '30%', textAlign: 'right' }}>
                                                {labor.deficit > 0 ? (
                                                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>Shortage: {labor.deficit}</span>
                                                ) : (
                                                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>Optimal</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card">
                                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Equipment Planning</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { name: 'Excavator JCB-3DX', status: 'On Site', util: '85%' },
                                        { name: 'Concrete Mixer', status: 'Available', util: '40%' },
                                        { name: 'Tower Crane', status: 'Scheduled (Feb 20)', util: '0%' }
                                    ].map((eq, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>{eq.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{eq.status}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>{eq.util}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Utilization</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. Resource Conflicts Alert */}
                        <div className="card" style={{ background: '#fff1f2', border: '1px solid #fecdd3', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '50%', color: '#991b1b' }}>
                                <Warning size={32} weight="fill" />
                            </div>
                            <div>
                                <h4 style={{ color: '#991b1b', fontWeight: 800, margin: '0 0 4px 0' }}>Resource Availability Conflict Detected</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f1d1d' }}>
                                    <strong>Site Manager David Chen</strong> is double-booked on <strong>Feb 18th</strong> for inspection at both <em>Skyline Towers</em> and <em>Green Valley Residency</em>.
                                </p>
                            </div>
                            <button style={{ marginLeft: 'auto', background: 'white', border: '1px solid #fecaca', color: '#991b1b', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Resolve Conflict</button>
                        </div>
                    </div>
                );
            case 'Material':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* 1. Procurement Schedule */}
                        <div className="card">
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Cube size={24} color="var(--pivot-blue)" /> Material Procurement Schedule
                            </h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                                    <tr>
                                        <th style={{ padding: '12px', borderRadius: '6px 0 0 6px' }}>Material</th>
                                        <th style={{ padding: '12px' }}>Required Qty</th>
                                        <th style={{ padding: '12px' }}>Order By Date</th>
                                        <th style={{ padding: '12px' }}>Delivery Date</th>
                                        <th style={{ padding: '12px' }}>Vendor Status</th>
                                        <th style={{ padding: '12px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: 'Steel Rebar (12mm)', qty: '40 Tons', order: 'Feb 15', deliver: 'Feb 22', vendor: 'SteelCo Ltd (Confirmed)', statusColor: '#10b981' },
                                        { name: 'Cement (OPC 53)', qty: '1200 Bags', order: 'Feb 18', deliver: 'Feb 25', vendor: 'BuildMat (Pending)', statusColor: '#f59e0b' },
                                        { name: 'River Sand', qty: '800 Cu.ft', order: 'Feb 20', deliver: 'Feb 22', vendor: 'Local Supplier (Confirmed)', statusColor: '#10b981' }
                                    ].map((mat, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '12px', fontWeight: 700, color: '#334155' }}>{mat.name}</td>
                                            <td style={{ padding: '12px', color: '#64748b' }}>{mat.qty}</td>
                                            <td style={{ padding: '12px', color: '#64748b' }}>{mat.order}</td>
                                            <td style={{ padding: '12px', color: '#64748b' }}>{mat.deliver}</td>
                                            <td style={{ padding: '12px', color: mat.statusColor, fontWeight: 600 }}>{mat.vendor}</td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                                <button style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--pivot-blue)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>Order Now</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 2. Price Alerts & Storage */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="card" style={{ background: '#fff7ed', border: '1px solid #ffedd5' }}>
                                <h4 style={{ color: '#c2410c', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <TrendUp weight="bold" /> Price Fluctuation Alerts
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ background: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#9a3412' }}>Steel Prices Rising</div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ea580c' }}>+8.5%</div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#7c2d12' }}>Predicted to increase further by next week. Recommended to lock prices today.</div>
                                    </div>
                                    <div style={{ background: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#9a3412' }}>Copper Wiring Dip</div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a' }}>-2.1%</div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#7c2d12' }}>Prices have dipped slightly. Good time to procure for Electrical phase.</div>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Storage Requirement Estimate</h4>
                                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>1,200 sq.ft</div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Covered Storage Needed</div>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#334155', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <CheckCircle size={18} color="#10b981" weight="fill" />
                                    <span>Current Site Capacity: <strong>1,500 sq.ft</strong> (Sufficient)</span>
                                </div>
                            </div>
                        </div>

                    </div>
                );
            case 'Risk':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* 1. Risk Overview Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                    <Warning size={20} color="#f59e0b" weight="fill" />
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b' }}>Technical Risks</h4>
                                </div>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8rem', color: '#475569' }}>
                                    <li style={{ marginBottom: '6px' }}>Soil strata variation expected in Block C.</li>
                                    <li>Water table higher than initial survey.</li>
                                </ul>
                            </div>
                            <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                    <ShieldWarning size={20} color="#ef4444" weight="fill" />
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b' }}>Safety Risks</h4>
                                </div>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8rem', color: '#475569' }}>
                                    <li style={{ marginBottom: '6px' }}><strong>Critical:</strong> Deep excavation without shoring.</li>
                                    <li>Electrical grounding issue near temp. shelter.</li>
                                </ul>
                            </div>
                            <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                    <CheckCircle size={20} color="#10b981" weight="fill" />
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b' }}>Quality Indicators</h4>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>92/100</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Project Quality Score (Great)</div>
                            </div>
                        </div>

                        {/* 2. Compliance & Legal Checklist */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                            <div className="card">
                                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Legal & Approval Checklist</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[
                                        { item: 'Environmental Clearance', status: 'Obtained', date: 'Jan 10, 2024' },
                                        { item: 'Fire Safety NOC (Provisional)', status: 'Pending', date: 'Due: Feb 28, 2024' },
                                        { item: 'Structural Stability Certificate', status: 'In Review', date: 'Submitted: Feb 12' },
                                        { item: 'Local Municipal Approval (Plan)', status: 'Obtained', date: 'Dec 05, 2023' }
                                    ].map((check, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '8px', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {check.status === 'Obtained' ? (
                                                    <CheckCircle size={20} weight="fill" color="#10b981" />
                                                ) : check.status === 'Pending' ? (
                                                    <Warning size={20} weight="fill" color="#f59e0b" />
                                                ) : (
                                                    <Clock size={20} weight="fill" color="#3b82f6" />
                                                )}
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{check.item}</span>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                <span style={{
                                                    background: check.status === 'Obtained' ? '#d1fae5' : check.status === 'Pending' ? '#fef3c7' : '#dbeafe',
                                                    color: check.status === 'Obtained' ? '#065f46' : check.status === 'Pending' ? '#92400e' : '#1e40af',
                                                    padding: '2px 8px', borderRadius: '4px', fontWeight: 700, marginRight: '8px'
                                                }}>{check.status}</span>
                                                {check.date}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '1rem' }}>
                                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="75, 100" />
                                    </svg>
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>75%</div>
                                </div>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>Compliance Readiness</h4>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>3 approvals pending for next phase.</p>
                                <button style={{ marginTop: '1rem', padding: '8px 16px', borderRadius: '8px', background: 'var(--pivot-blue)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>View Requirements</button>
                            </div>
                        </div>

                    </div>
                );
            case 'AI':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="card" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: 'white', padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                                    <Robot size={32} weight="fill" color="#c7d2fe" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>AI Project Insights</h3>
                                    <p style={{ margin: '4px 0 0 0', opacity: 0.8, fontSize: '0.9rem' }}>Real-time analysis tailored for Green Valley Residency</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                            {/* Insight Cards */}
                            {[
                                {
                                    type: 'Cost Saving', icon: <Coin weight="fill" />, color: '#10b981', bg: '#ecfdf5',
                                    title: 'Bulk Procurement Opportunity',
                                    desc: 'Ordering remaining 40% of standard bricks now can save approx $3,200 due to predicted supplier price hike next month.',
                                    action: 'View Suppliers'
                                },
                                {
                                    type: 'Timeline Optimization', icon: <Calendar weight="fill" />, color: '#3b82f6', bg: '#eff6ff',
                                    title: 'Schedule Crash Analysis',
                                    desc: 'Adding 2 extra laborers to the "Plastering" team can recover the 4-day delay in the Structure phase without critical path impact.',
                                    action: 'Update Schedule'
                                },
                                {
                                    type: 'Risk Mitigation', icon: <ShieldWarning weight="fill" />, color: '#f59e0b', bg: '#fffbeb',
                                    title: 'Weather Alert Impact',
                                    desc: 'Heavy rains predicted Feb 22-24. Recommend advancing "Roof Waterproofing" or pausing external painting to prevent rework.',
                                    action: 'Adjust Plan'
                                },
                                {
                                    type: 'Automation Suggestion', icon: <Robot weight="fill" />, color: '#8b5cf6', bg: '#f5f3ff',
                                    title: 'Automate Vendor Payments',
                                    desc: '3 recurring vendor payments for "Security" and "Water Supply" are eligible for automated release based on delivery confirmation.',
                                    action: 'Enable Auto-Pay'
                                }
                            ].map((insight, i) => (
                                <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ padding: '6px', borderRadius: '6px', background: insight.bg, color: insight.color }}>
                                                {insight.icon}
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: insight.color }}>{insight.type}</span>
                                        </div>
                                    </div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>{insight.title}</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>{insight.desc}</p>
                                    <button style={{
                                        marginTop: 'auto', alignSelf: 'flex-start', padding: '8px 16px', borderRadius: '8px',
                                        border: `1px solid ${insight.bg}`, background: 'white', color: insight.color, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                                    }}>
                                        {insight.action}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'WhatIf':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* 1. Scenario Selection */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            <div className="card" style={{ cursor: 'pointer', border: '2px solid var(--pivot-blue)', background: '#eff6ff' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                    <ArrowsLeftRight size={20} color="var(--pivot-blue)" weight="bold" />
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b' }}>Budget Change</h4>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Simulate impact of budget cuts or increases on material quality and timeline.</p>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pivot-blue)' }}>ACTIVE SCENARIO</div>
                            </div>
                            <div className="card" style={{ cursor: 'pointer', opacity: 0.7 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                    <Clock size={20} color="#64748b" weight="bold" />
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b' }}>Timeline Compression</h4>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Analyze resource costs if deadline is advanced by 2 weeks.</p>
                            </div>
                            <div className="card" style={{ cursor: 'pointer', opacity: 0.7 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                    <ShieldWarning size={20} color="#64748b" weight="bold" />
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b' }}>Material Delay</h4>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Forecast impact if steel delivery is delayed by 10 days.</p>
                            </div>
                        </div>

                        {/* 2. Simulation Controls & Impact Analysis */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                            <div className="card">
                                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>Adjust Parameters</h4>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Budget Variance</label>
                                    <input type="range" min="-20" max="20" defaultValue="-10" style={{ width: '100%', cursor: 'pointer' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                                        <span>-20%</span>
                                        <span style={{ fontWeight: 700, color: '#ef4444' }}>-10% (Selected)</span>
                                        <span>+20%</span>
                                    </div>
                                </div>
                                <button style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--pivot-blue)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Run Simulation</button>
                            </div>

                            <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Impact Analysis: -10% Budget Cut</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px', background: 'white', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>Material Quality Downgrade</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Flooring tiles changed from 'Premium Italian' to 'Standard Vitrified'.</div>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ef4444' }}>High Impact</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px', background: 'white', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>Scope Reduction</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Landscape garden feature removed from Phase 1.</div>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b' }}>Medium Impact</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px', background: 'white', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>Timeline Unaffected</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Project handover date remains unchanged.</div>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>Positive</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'Reports':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>Project Reports & Exports</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                    <FileText size={18} /> Export as PDF
                                </button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                    <FileText size={18} /> Export as Excel
                                </button>
                            </div>
                        </div>

                        <div className="card">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                                {[
                                    { name: 'Planning Summary Report', desc: 'Comprehensive overview of budget, timeline, and resources.', date: 'Generated: Feb 14, 2024' },
                                    { name: 'Cost Planning & BOQ', desc: 'Detailed breakdown of material costs and quantities.', date: 'Generated: Feb 12, 2024' },
                                    { name: 'Timeline & Milestone Report', desc: 'Gantt chart view with critical path analysis.', date: 'Generated: Feb 10, 2024' },
                                    { name: 'Resource Allocation Log', desc: 'Staff and labor utilization report for last month.', date: 'Generated: Feb 01, 2024' },
                                    { name: 'Risk Assessment Audit', desc: 'Technical and safety risk compliance checklist.', date: 'Generated: Jan 28, 2024' }
                                ].map((report, i) => (
                                    <div key={i} style={{
                                        padding: '1.5rem',
                                        borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none',
                                        borderRight: i % 2 === 0 ? '1px solid #f1f5f9' : 'none',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>{report.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>{report.desc}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{report.date}</div>
                                        </div>
                                        <button style={{ padding: '8px 16px', borderRadius: '6px', background: '#f1f5f9', color: 'var(--pivot-blue)', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>Download</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                        <Info size={48} weight="duotone" style={{ marginBottom: '1rem' }} />
                        <h3>{tabs.find(t => t.id === activeTab)?.label} Content Placeholder</h3>
                        <p>This section is under construction.</p>
                    </div>
                );
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
            <div style={{ width: '1100px', height: '85vh', background: '#f8fafc', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ padding: '1.5rem 2rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Robot size={24} weight="fill" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>AI Planning & Analysis</h2>
                            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.8rem' }}>Project: Green Valley Residency</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <X size={18} weight="bold" />
                    </button>
                </div>

                {/* Main Content Area */}
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                    {/* Sidebar Tabs */}
                    <div style={{ width: '250px', background: 'white', borderRight: '1px solid #e2e8f0', padding: '1.5rem 1rem', overflowY: 'auto' }}>
                        {tabs.map(tab => (
                            <div
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px',
                                    marginBottom: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                                    background: activeTab === tab.id ? 'var(--pivot-blue-soft)' : 'transparent',
                                    color: activeTab === tab.id ? 'var(--pivot-blue)' : '#475569',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab.icon}
                                {tab.label}
                            </div>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                        {renderContent()}
                    </div>
                </div>

            </div>
            <style>{`
                .card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
            `}</style>
        </div>
    );
};

export default AIPlanningModal;
