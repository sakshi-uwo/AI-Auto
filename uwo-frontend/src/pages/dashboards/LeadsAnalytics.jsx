import React, { useState, useEffect } from 'react';
import { Buildings, Calendar, ChartPieSlice, Info, ArrowRight, Cube } from '@phosphor-icons/react';
import { leadService, visitService, authService } from '../../services/api';
import socketService from '../../services/socket';

const LeadsAnalytics = () => {
    const [hoveredType, setHoveredType] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [leads, setLeads] = useState([]);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [simulating, setSimulating] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Safety & Role-based flags for Simulation
    const currentUser = authService.getCurrentUser();
    const canSimulate = !import.meta.env.PROD && currentUser?.role?.toLowerCase() === 'admin';

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leadsRes, visitsRes] = await Promise.all([
                    leadService.getAll(),
                    visitService.getAll()
                ]);
                console.log("📊 Leads fetched:", leadsRes?.length || 0);
                console.log("📍 Visits fetched:", visitsRes?.length || 0);
                setLeads(leadsRes || []);
                setVisits(visitsRes || []);
            } catch (error) {
                console.error("Analytics Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        socketService.on('lead-added', (newLead) => {
            console.log("🔥 Real-time lead received:", newLead);
            setLeads(prev => [newLead, ...prev]);
        });

        socketService.on('lead-updated', (updatedLead) => {
            setLeads(prev => prev.map(l => l._id === updatedLead._id ? updatedLead : l));
        });

        socketService.on('visit-scheduled', (newVisit) => {
            setVisits(prev => [...prev, newVisit]);
        });

        return () => {
            socketService.off('lead-added');
            socketService.off('lead-updated');
            socketService.off('visit-scheduled');
        };
    }, []);

    const handleSimulateLead = async () => {
        setSimulating(true);
        try {
            // This simulates a lead coming from the Linktree/External source
            const randomNames = ["Aarav Sharma", "Priya Patel", "Vikram Singh", "Ananya Iyer", "Rahul Verma"];
            const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];

            const platforms = ["Instagram", "WhatsApp", "LinkedIn", "Facebook", "Twitter"];
            const platform = platforms[Math.floor(Math.random() * platforms.length)];

            await leadService.create({
                name: `${randomName} (${platform})`,
                email: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
                phone: "8871190020",
                source: platform,
                status: "Warm",
                projectInterest: "Skyline Towers",
                isSimulated: true // FLAG for Production-safe Demo Check
            });
            // The list will update automatically via Socket.io!
        } catch (err) {
            console.error("Simulation failed:", err);
        } finally {
            setSimulating(false);
        }
    };

    const getStatusData = (status) => {
        // Exclude simulated leads from chart analytics explicitly
        const filteredLeads = leads.filter(l => (l.leadTemperature === status || (!l.leadTemperature && l.status === status)) && !l.isSimulated);
        const leadIds = filteredLeads.map(l => l._id);
        const statusVisits = visits.filter(v => leadIds.includes(v.lead?._id || v.lead));

        return {
            count: filteredLeads.length,
            visits: statusVisits.length,
            projects: [...new Set(filteredLeads.map(l => l.projectInterest).filter(Boolean))]
        };
    };

    const analyticsData = {
        Hot: {
            ...getStatusData('Hot'),
            color: '#ff6b6b',
            inventory: { soldPercent: 88, available: 12 }
        },
        Warm: {
            ...getStatusData('Warm'),
            color: '#ff9f4d',
            inventory: { soldPercent: 45, available: 55 }
        },
        Cold: {
            ...getStatusData('Cold'),
            color: '#4d9fff',
            inventory: { soldPercent: 12, available: 88 }
        }
    };

    const hasLeads = leads.length > 0;
    const chartData = [
        { type: 'Hot', value: analyticsData.Hot.count, color: analyticsData.Hot.color },
        { type: 'Warm', value: analyticsData.Warm.count, color: analyticsData.Warm.color },
        { type: 'Cold', value: analyticsData.Cold.count, color: analyticsData.Cold.color },
    ];

    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
    const size = isMobile ? 280 : 320;
    const radius = isMobile ? 100 : 120;
    const strokeWidth = isMobile ? 45 : 60;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulatedAngle = -90;

    if (loading) return <div style={{ padding: '2rem' }}>Loading Analytics...</div>;

    return (
        <div
            style={{ padding: isMobile ? '1rem' : '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}
            onDoubleClick={() => setSelectedType(null)}
        >
            <div style={{ marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }} className="h1">Leads Overview</h1>
                    <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '6px', fontWeight: 500 }} className="desktop-only">
                        Visual distribution of lead statuses and their impact on operational metrics.
                    </p>
                </div>
                <button
                    onClick={handleSimulateLead}
                    disabled={simulating || !canSimulate}
                    style={{
                        padding: '14px 24px',
                        background: '#0047AB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '14px',
                        fontWeight: 700,
                        cursor: (simulating || !canSimulate) ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 15px rgba(0, 71, 171, 0.25)',
                        transition: 'all 0.3s ease',
                        opacity: (simulating || !canSimulate) ? 0.5 : 1,
                        width: isMobile ? '100%' : 'auto',
                        fontSize: '0.95rem'
                    }}
                >
                    {simulating ? 'Processing...' : 'Simulate Real-time Lead'}
                </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '2rem', alignItems: 'stretch' }}>
                    <div className="card" style={{
                        flex: isMobile ? '1 1 auto' : '0 0 420px',
                        width: isMobile ? '100%' : undefined,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '2.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ flexShrink: 0, textAlign: 'center', transition: 'var(--transition)', zIndex: 1, width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Lead Status Distribution</h2>
                                {!hasLeads && (
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pivot-blue)', background: 'var(--pivot-blue-soft)', padding: '4px 10px', borderRadius: '12px' }}>DEMO DATA</span>
                                )}
                            </div>
                            <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
                                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                                    {chartData.map((item, index) => {
                                        const percentage = total === 0 ? 0 : (item.value / total) * 100;
                                        const dashoffset = circumference - (percentage / 100) * circumference;
                                        const rotation = accumulatedAngle;
                                        accumulatedAngle += (percentage / 100) * 360;

                                        const isHovered = hoveredType === item.type;
                                        const isSelected = selectedType === item.type;

                                        return (
                                            <circle
                                                key={index}
                                                cx={center}
                                                cy={center}
                                                r={radius}
                                                fill="transparent"
                                                stroke={item.color}
                                                strokeWidth={isSelected ? strokeWidth + 12 : (isHovered ? strokeWidth + 8 : strokeWidth)}
                                                strokeDasharray={`${(percentage / 100) * circumference} ${circumference}`}
                                                transform={`rotate(${rotation} ${center} ${center})`}
                                                style={{
                                                    transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                                    cursor: 'pointer',
                                                    filter: isSelected || isHovered ? `drop-shadow(0 0 10px ${item.color}cc)` : 'none',
                                                    opacity: selectedType !== null && !isSelected ? 0.3 : 1
                                                }}
                                                onMouseEnter={() => setHoveredType(item.type)}
                                                onMouseLeave={() => setHoveredType(null)}
                                                onClick={() => setSelectedType(selectedType === item.type ? null : item.type)}
                                            />
                                        );
                                    })}
                                </svg>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--soft-black)' }}>{total}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--charcoal)', textTransform: 'uppercase', letterSpacing: '2px' }}>Total</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '2.5rem' }}>
                                {chartData.map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        opacity: (hoveredType === null && selectedType === null) || hoveredType === item.type || selectedType === item.type ? 1 : 0.4,
                                        color: selectedType === item.type || hoveredType === item.type ? item.color : 'inherit',
                                    }}
                                        onMouseEnter={() => setHoveredType(item.type)}
                                        onMouseLeave={() => setHoveredType(null)}
                                        onClick={() => setSelectedType(selectedType === item.type ? null : item.type)}
                                    >
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }}></div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{
                        flex: 1,
                        opacity: hoveredType || selectedType ? 1 : 0.4,
                        padding: '2.5rem',
                        transition: 'all 0.4s ease',
                        border: (hoveredType || selectedType) ? `1px solid ${analyticsData[hoveredType || selectedType].color}40` : '1px solid var(--glass-border)',
                    }}>
                        {(hoveredType || selectedType) ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2.5rem' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: analyticsData[hoveredType || selectedType].color }}></div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{(hoveredType || selectedType)} <span className="desktop-only">Lead Impact</span></h3>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1.5rem' : '2.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                        <section>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: analyticsData[hoveredType || selectedType].color, marginBottom: '12px' }}>
                                                <Buildings size={22} weight="bold" />
                                                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Interests</h4>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--charcoal)', paddingLeft: '8px' }}>
                                                {analyticsData[hoveredType || selectedType].projects.length > 0 ?
                                                    analyticsData[hoveredType || selectedType].projects.join(', ') :
                                                    'General inquiry'}
                                            </div>
                                        </section>

                                        <section>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: analyticsData[hoveredType || selectedType].color, marginBottom: '12px' }}>
                                                <Calendar size={22} weight="bold" />
                                                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Visits</h4>
                                            </div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: analyticsData[hoveredType || selectedType].color, paddingLeft: '8px' }}>
                                                {analyticsData[hoveredType || selectedType].visits}
                                            </div>
                                        </section>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                        <section>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: analyticsData[hoveredType || selectedType].color }}>
                                                    <ChartPieSlice size={22} weight="bold" />
                                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Conversion Progress</h4>
                                                </div>
                                                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: analyticsData[hoveredType || selectedType].color }}>
                                                    {analyticsData[hoveredType || selectedType].inventory.soldPercent}%
                                                </span>
                                            </div>
                                            <div style={{ paddingLeft: '8px' }}>
                                                <div style={{ height: '10px', background: 'var(--light-grey)', borderRadius: '5px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${analyticsData[hoveredType || selectedType].inventory.soldPercent}%`, background: analyticsData[hoveredType || selectedType].color }}></div>
                                                </div>
                                            </div>
                                        </section>

                                        <section style={{ background: 'var(--pivot-blue-soft)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pivot-blue)', marginBottom: '8px' }}>Strategy Tip</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--charcoal)', lineHeight: '1.4' }}>
                                                {(hoveredType || selectedType) === 'Hot' ? 'Immediately assign high-priority sales executives for site closing.' :
                                                    (hoveredType || selectedType) === 'Warm' ? 'Send follow-up catalogs and invite for weekend project walkthroughs.' :
                                                        'Add to monthly newsletter for long-term brand awareness.'}
                                            </p>
                                        </section>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
                                <Info size={48} weight="duotone" color="var(--pivot-blue)" />
                                <h3 style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>Interactive Analytics</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--charcoal)' }}>Hover over the chart segments to reveal contextual insights</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lead Source Performance - NEW SECTION */}
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Lead Source Performance</h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--charcoal)', opacity: 0.7, marginTop: '4px' }}>Analyze which platforms are driving the most engagement for Yug AMC</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '3rem' }}>
                        {[
                            { label: 'WhatsApp', key: 'WhatsApp', color: '#25D366' },
                            { label: 'Instagram', key: 'Instagram', color: '#E4405F' },
                            { label: 'Linktree', key: 'Linktree', color: '#43E17D' },
                            { label: 'Website', key: 'Website', color: '#1877F2' }
                        ].map((platform, idx) => {
                            // Exclude simulated leads from conversion analytics
                            const realCount = leads.filter(l => l.source === platform.key && !l.isSimulated).length;
                            const totalRealLeads = leads.filter(l => !l.isSimulated).length;

                            const percentage = totalRealLeads > 0 ? (realCount / totalRealLeads) * 100 : [40, 25, 45, 15][idx];
                            const displayCount = hasLeads ? realCount : [12, 8, 15, 5][idx]; // Demo value if no absolute leads

                            return (
                                <div key={idx} style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--soft-black)' }}>{platform.label}</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, background: `${platform.color}15`, color: platform.color, padding: '2px 8px', borderRadius: '10px' }}>
                                                {percentage.toFixed(0)}% Conversion
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: platform.color }}>{displayCount} Leads</span>
                                    </div>
                                    <div style={{ height: '8px', width: '100%', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                                        <div
                                            style={{
                                                height: '100%',
                                                width: `${percentage}%`,
                                                background: platform.color,
                                                borderRadius: '4px',
                                                transition: 'width 1s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Leads Management</h2>
                    </div>

                    <div className="table-wrapper">
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: 'var(--charcoal)', opacity: 0.7 }}>
                                    <th style={{ padding: '0.8rem', fontSize: '0.9rem', fontWeight: 700 }}>Lead Name</th>
                                    <th style={{ padding: '0.8rem', fontSize: '0.9rem', fontWeight: 700 }}>Project Interest</th>
                                    <th style={{ padding: '0.8rem', fontSize: '0.9rem', fontWeight: 700 }}>Status</th>
                                    <th style={{ padding: '0.8rem', fontSize: '0.9rem', fontWeight: 700 }}>Last Activity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.slice(0, 10).map((lead, i) => (
                                    <tr key={i} className="table-row" style={{ fontSize: '0.95rem', background: 'rgba(255, 255, 255, 0.5)' }}>
                                        <td style={{ padding: '1rem 0.8rem', fontWeight: 700, color: 'var(--soft-black)', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {lead.name || lead.user?.name || 'Valued Lead'}
                                                {lead.isSimulated && (
                                                    <span style={{ fontSize: '0.65rem', background: '#ffe4e6', color: '#e11d48', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                                                        TEST LEAD
                                                    </span>
                                                )}
                                                {lead.leadScore > 0 && (
                                                    <span title={`Score: ${lead.leadScore}`} style={{ fontSize: '0.65rem', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '12px', fontWeight: 800, border: '1px solid #e2e8f0' }}>
                                                        {lead.leadScore} PTS
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem 0.8rem' }}>{lead.projectInterest || 'General Inquiry'}</td>
                                        <td style={{ padding: '1.2rem 0.8rem' }}>
                                            <span style={{
                                                padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                                                background: (lead.leadTemperature || lead.status) === 'Hot' ? '#ffebeb' : ((lead.leadTemperature || lead.status) === 'Warm' ? '#fff4eb' : '#ebf4ff'),
                                                color: (lead.leadTemperature || lead.status) === 'Hot' ? '#ff4d4d' : ((lead.leadTemperature || lead.status) === 'Warm' ? '#ff9f4d' : '#4d9fff'),
                                            }}>
                                                {lead.leadTemperature || lead.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem 0.8rem' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 3D Shapes (Decorative CSS) */}
            <div className="bg-decoration shape-1" style={{ bottom: '10%', left: '5%' }}></div>
            <div className="bg-decoration shape-2" style={{ top: '10%', right: '10%', transform: 'rotate(20deg)', background: 'linear-gradient(white, var(--pivot-blue-soft))' }}></div>
        </div>
    );
};

export default LeadsAnalytics;
