import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Envelope, Lock, ArrowRight, Warning, CheckCircle, Briefcase, Eye } from '@phosphor-icons/react';
import { authService } from '../services/api';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Client');
    const [password, setPassword] = useState(''); // Backend doesn't seem to use password yet but good for UI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [success, setSuccess] = useState(false);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.signup({ name, email, password, role });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error("Signup Error:", err);
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8faff 0%, #e8efff 100%)', position: 'fixed', top: 0, left: 0, zIndex: 9999
        }}>
            {/* Background Decoration */}
            <div style={{
                position: 'fixed', width: '600px', height: '600px', borderRadius: '50%',
                background: 'radial-gradient(circle, var(--pivot-blue-soft) 0%, transparent 70%)',
                top: '-10%', right: '-10%', zIndex: -1, opacity: 0.5
            }}></div>
            <div style={{
                position: 'fixed', width: '400px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(circle, var(--pivot-blue-soft) 0%, transparent 70%)',
                bottom: '-5%', left: '-5%', zIndex: -1, opacity: 0.3
            }}></div>

            <div className="card" style={{
                width: '100%', maxWidth: '450px', padding: isMobile ? '2rem 1.5rem' : '3rem', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '2rem', boxShadow: '0 20px 50px rgba(0, 71, 171, 0.1)',
                background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.5)', animation: 'fadeInUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
                margin: '0 1rem', overflowY: 'auto', maxHeight: '95vh'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '70px', height: '70px',
                        borderRadius: '18px',
                        background: '#ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '1.2rem',
                        boxShadow: '0 8px 30px rgba(0, 71, 171, 0.15)',
                        border: '1px solid rgba(0, 71, 171, 0.1)'
                    }}>
                        <img src="/logo/AI-Auto.png" alt="AI-AUTO Logo" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
                    </div>
                    <h1 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 900, color: '#003380', letterSpacing: '-0.5px' }}>AI-AUTO</h1>
                    <p style={{ color: '#2c3e50', fontSize: '1rem', fontWeight: 600 }}>Create your account</p>
                </div>

                {error && (
                    <div style={{
                        width: '100%', padding: '12px', background: '#fff5f5', border: '1px solid #feb2b2',
                        borderRadius: '8px', color: '#c53030', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <Warning size={18} weight="bold" />
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        width: '100%', padding: '12px', background: '#f0fff4', border: '1px solid #9ae6b4',
                        borderRadius: '8px', color: '#276749', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <CheckCircle size={18} weight="bold" />
                        Account created successfully! Redirecting to login...
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2c3e50' }}>Full Name</label>
                            <div className="input-field" style={{
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                                background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', transition: 'all 0.2s'
                            }}>
                                <User size={20} color="#2c3e50" opacity={0.5} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2c3e50' }}>Email Address</label>
                            <div className="input-field" style={{
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                                background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', transition: 'all 0.2s'
                            }}>
                                <Envelope size={20} color="#2c3e50" opacity={0.5} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2c3e50' }}>Role</label>
                            <div className="input-field" style={{
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                                background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', transition: 'all 0.2s'
                            }}>
                                <Briefcase size={20} color="#2c3e50" opacity={0.5} />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', background: 'transparent', cursor: 'pointer', color: '#334155' }}
                                >
                                    <option value="Client">Client/Buyer</option>
                                    <option value="Builder">Builder</option>
                                    <option value="Civil Engineer">Civil Engineer</option>
                                    <option value="Site Manager">Site Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2c3e50' }}>Password</label>
                            <div className="input-field" style={{
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                                background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', transition: 'all 0.2s',
                                position: 'relative'
                            }}>
                                <Lock size={20} color="#2c3e50" opacity={0.5} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', paddingRight: '30px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#2c3e50', opacity: 0.5, display: 'flex', alignItems: 'center' }}
                                >
                                    <Eye size={20} weight={showPassword ? "fill" : "regular"} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '14px', borderRadius: '10px', background: '#0047AB',
                                color: 'white', border: 'none', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(0, 71, 171, 0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Creating Account...' : 'Get Started'}
                            {!loading && <ArrowRight size={20} weight="bold" />}
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', width: '100%', paddingTop: '1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                        Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#0047AB', fontWeight: 700, cursor: 'pointer' }}>Login</span>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .input-field:focus-within {
                    border-color: #0047AB !important;
                    box-shadow: 0 0 0 4px rgba(0, 71, 171, 0.1);
                }
            `}</style>
        </div>
    );
};

export default Signup;
