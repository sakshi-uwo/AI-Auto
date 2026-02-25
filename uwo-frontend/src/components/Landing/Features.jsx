import React from 'react';
import './Features.css';

const Features = () => {
    const features = [
        {
            icon: '🚀',
            title: 'Next-Gen Performance',
            description: 'Lightning-fast processing with optimized resource management and AI-powered efficiency.'
        },
        {
            icon: '🤖',
            title: 'AI-Powered Intelligence',
            description: 'Built-in AI assistance that learns and adapts to your workflow for maximum productivity.'
        },
        {
            icon: '🔒',
            title: 'Advanced Security',
            description: 'Enterprise-grade encryption and multi-layer security protocols to protect your data.'
        },
        {
            icon: '🌐',
            title: 'Seamless Integration',
            description: 'Connect with any platform, device, or service effortlessly with universal compatibility.'
        },
        {
            icon: '⚡',
            title: 'Real-Time Sync',
            description: 'Instant synchronization across all your devices with zero latency.'
        },
        {
            icon: '🎨',
            title: 'Customizable Interface',
            description: 'Design your perfect workspace with unlimited customization options and themes.'
        }
    ];

    return (
        <section className="features" id="features">
            <div className="container">
                <div className="features-header">
                    <h2 className="section-title">
                        Powerful <span className="text-gradient">Features</span>
                    </h2>
                    <p className="section-subtitle">
                        Everything you need to work smarter, faster, and better
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card glass landing-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
