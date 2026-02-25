import React, { useState } from 'react';

const LeadStatusChart = ({ data, onHover, onClick, selection, compact = false }) => {
    const [localHover, setLocalHover] = useState(null);

    if (!data || data.length === 0) return null;

    const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);
    const size = compact ? 120 : 220;
    const strokeWidth = compact ? 15 : 25;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;

    let accumulatedOffset = 0;

    const handleMouseEnter = (label) => {
        setLocalHover(label);
        if (onHover) onHover(label);
    };

    const handleMouseLeave = () => {
        setLocalHover(null);
        if (onHover) onHover(null);
    };

    return (
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background Ring */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke="#f3f4f6"
                    strokeWidth={strokeWidth}
                />

                {data.map((segment, index) => {
                    const percentage = segment.value / totalValue;
                    const strokeDasharray = `${percentage * circumference} ${circumference}`;
                    const strokeDashoffset = -accumulatedOffset;

                    accumulatedOffset += percentage * circumference;

                    const isHighlighted = localHover === segment.label || selection === segment.label;

                    return (
                        <circle
                            key={segment.label}
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke={segment.color}
                            strokeWidth={isHighlighted ? strokeWidth + 5 : strokeWidth}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{
                                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                cursor: 'pointer',
                                filter: isHighlighted ? `drop-shadow(0 0 8px ${segment.color}44)` : 'none'
                            }}
                            onMouseEnter={() => handleMouseEnter(segment.label)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => onClick && onClick(segment.label)}
                            transform={`rotate(-90 ${center} ${center})`}
                        />
                    );
                })}
            </svg>

            {/* Center Label */}
            {!compact && (
                <div style={{
                    position: 'absolute',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>
                        Total
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--soft-black)' }}>
                        {totalValue}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                        Leads
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadStatusChart;
