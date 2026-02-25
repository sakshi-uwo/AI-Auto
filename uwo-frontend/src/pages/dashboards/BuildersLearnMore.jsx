import React, { useEffect } from 'react';
import Navbar from '../../components/Landing/Navbar';
import Footer from '../../components/Landing/Footer/Footer';
import { ThemeProvider } from '../../context/ThemeContext';
import '../../landing.css';

const BuildersLearnMore = () => {
    useEffect(() => {
        document.body.classList.add('landing-page');
        window.scrollTo(0, 0);
        return () => {
            document.body.classList.remove('landing-page');
        };
    }, []);

    return (
        <ThemeProvider>
            <div className="landing-wrapper">
                <Navbar />

                <main className="learn-more-content" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
                    <div className="container">

                        {/* 1. Introduction */}
                        <section className="learn-section animate-slide-up" style={{ marginBottom: '60px' }}>
                            <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '20px' }}>AI-Auto for Builders</h1>
                            <p className="glass" style={{ padding: '30px', borderRadius: '15px', fontSize: '1.2rem' }}>
                                AI-Auto is a cutting-edge platform designed to revolutionize the construction industry. We help builders manage complex construction projects digitally using smart automation and advanced AI. By bridging the gap between traditional site management and modern technology, AI-Auto provides a seamless operating system for the physical world.
                            </p>
                        </section>

                        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>

                            {/* 2. Problems Faced by Builders */}
                            <div className="landing-card glass">
                                <h2 className="text-gradient" style={{ marginBottom: '15px' }}>Common Challenges</h2>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ marginBottom: '10px' }}>• Constant project delays</li>
                                    <li style={{ marginBottom: '10px' }}>• Lack of real-time site updates</li>
                                    <li style={{ marginBottom: '10px' }}>• Inefficient manual tracking</li>
                                    <li style={{ marginBottom: '10px' }}>• Poor communication between teams</li>
                                    <li style={{ marginBottom: '10px' }}>• Unexpected cost overruns</li>
                                </ul>
                            </div>

                            {/* 3. How AI-Auto Helps Builders */}
                            <div className="landing-card glass">
                                <h2 className="text-gradient" style={{ marginBottom: '15px' }}>Our Solution</h2>
                                <p>AI-Auto solves these pain points by providing:</p>
                                <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                                    <li style={{ marginBottom: '10px' }}>• Real-time project tracking</li>
                                    <li style={{ marginBottom: '10px' }}>• Intelligent resource planning</li>
                                    <li style={{ marginBottom: '10px' }}>• Centralized data management</li>
                                    <li style={{ marginBottom: '10px' }}>• AI-based actionable insights</li>
                                </ul>
                            </div>

                            {/* 4. Key Benefits */}
                            <div className="landing-card glass">
                                <h2 className="text-gradient" style={{ marginBottom: '15px' }}>Key Benefits</h2>

                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ marginBottom: '10px' }}>• Improved Efficiency: Do more with less.</li>
                                    <li style={{ marginBottom: '10px' }}>• Better Decisions: Data-driven logic.</li>
                                    <li style={{ marginBottom: '10px' }}>• Reduced Errors: Automated checks.</li>
                                    <li style={{ marginBottom: '10px' }}>• Time Savings: Automated reporting.</li>
                                    <li style={{ marginBottom: '10px' }}>• Cost Control: Real-time budget tracking.</li>
                                </ul>
                            </div>
                        </div>

                        {/* 5. Daily Use in Construction Projects */}
                        <section className="glass" style={{ padding: '40px', borderRadius: '20px', marginBottom: '60px' }}>
                            <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '20px' }}>Daily Operations Simplified</h2>
                            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
                                Builders can use AI-Auto daily to maintain a bird's-eye view of all operations:
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
                                    <h3>Site Progress</h3>
                                    <p>Monitor real-time updates from every site corner.</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
                                    <h3>Workforce</h3>
                                    <p>Manage activity and attendance effortlessly.</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
                                    <h3>Materials</h3>
                                    <p>Track inventory and prevent shortages before they happen.</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px' }}>
                                    <h3>Reporting</h3>
                                    <p>Generate comprehensive project reports in one click.</p>
                                </div>
                            </div>
                        </section>

                        {/* 6. AI-Powered Smart Features */}
                        <section style={{ marginBottom: '60px', textAlign: 'center' }}>
                            <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Smart Intelligence</h2>
                            <p className="glass" style={{ display: 'inline-block', maxWidth: '800px', padding: '30px', borderRadius: '15px' }}>
                                Our AI engine analyzes your project data in real-time to predict potential delays, optimize resource allocation, and provide intelligent recommendations. It's like having a senior engineer monitoring your projects 24/7, ensuring everything stays on track and within budget.
                            </p>
                        </section>

                        {/* 7. Conclusion */}
                        <section className="glass-strong" style={{ padding: '50px', borderRadius: '20px', textAlign: 'center' }}>

                            <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '20px' }}>Ready to Build Smarter?</h2>
                            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
                                AI-Auto is more than just a tool; it's your partner in construction excellence. Complete your projects faster, smarter, and more efficiently with the power of automation and AI.
                            </p>
                            <button className="btn btn-primary" onClick={() => window.location.href = '/signup'}>Join AI-Auto</button>
                        </section>

                    </div>
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
};

export default BuildersLearnMore;