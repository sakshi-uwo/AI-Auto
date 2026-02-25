import React from 'react';
import './TechnologySection.css';

const TechnologySection = () => {
    const stats = [
        { value: '10M+', label: 'Active Users' },
        { value: '99.9%', label: 'Uptime SLA' },
        { value: '150+', label: 'Countries' },
        { value: '24/7', label: 'Support' }
    ];

    const techStack = [
        'Advanced AI Core',
        'Quantum Processing',
        'Cloud-Native Architecture',
        'Edge Computing',
        'Neural Networks',
        'Blockchain Security'
    ];

    return (
        <section className="technology" id="technology">
            <div className="container">
                <div className="technology-header">
                    <h2 className="section-title">
                        Cutting-Edge <span className="text-gradient">Technology</span>
                    </h2>
                    <p className="section-subtitle">
                        Built on the most advanced technology stack in the industry
                    </p>
                </div>

                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card glass-strong" style={{ animationDelay: `${index * 0.15}s` }}>
                            <div className="stat-value text-gradient">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="tech-stack">
                    <h3 className="tech-stack-title">Powered By</h3>
                    <div className="tech-badges">
                        {techStack.map((tech, index) => (
                            <div key={index} className="tech-badge glass">
                                <span>{tech}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechnologySection;
