import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero" id="home">
            <div className="hero-background">
                <div className="grid-overlay"></div>
            </div>

            <div className="hero-content container">
                <div className="hero-text animate-slide-up">
                    <h1 className="hero-title">
                        Welcome to <br /><span className="text-gradient">AI-Auto</span>
                    </h1>
                    <p className="hero-subtitle">
                        Experience the future of operating systems.
                        Advanced. Intelligent. Seamless.
                    </p>
                    <div className="hero-cta">
                        <Link to="/builders-learn-more" className="btn btn-primary">Learn More</Link>
                        <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hologram-visual-container">
                        <div className="cube-wrapper">
                            <div className="cube-grid"></div>
                            <div className="cube">
                                <div className="cube-face front">
                                    <div className="hologram-card glass">
                                        <div className="stat-value text-gradient">99.9%</div>
                                        <div className="stat-label">Uptime</div>
                                    </div>
                                </div>
                                <div className="cube-face right">
                                    <div className="hologram-card glass">
                                        <div className="stat-value text-gradient">AI</div>
                                        <div className="stat-label">Powered</div>
                                    </div>
                                </div>
                                <div className="cube-face top">
                                    <div className="hologram-card glass">
                                        <div className="stat-value text-gradient">∞</div>
                                        <div className="stat-label">Possibilities</div>
                                    </div>
                                </div>
                                <div className="cube-face left glass-wireframe"></div>
                                <div className="cube-face back glass-wireframe"></div>
                                <div className="cube-face bottom glass-wireframe"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hero-gradient-overlay"></div>
        </section>
    );
};

export default Hero;
