import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Buildings, Warning, Eye } from '@phosphor-icons/react';
import { authService } from '../services/api';
import { ROLE_CREDENTIALS } from '../config/authConfig';

const Login = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('select-role');
    const [selectedRole, setSelectedRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const roles = [
        { label: 'Admin', role: 'admin', color: 'var(--pivot-blue)' },
        { label: 'Builder', role: 'builder', color: '#0047AB' },
        { label: 'Civil Engineer', role: 'civil_engineer', color: '#2E5BFF' },
        { label: 'Site Manager', role: 'project_site', color: '#4CAF50' },
        { label: 'Client/Buyer', role: 'client', color: '#ff9f4d' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Delegate all authentication to the API (which handles both hardcoded & DB users)
            const data = await authService.login({ email, password, role: selectedRole.role });

            // Store token and user data
            if (data.token) {
                localStorage.setItem('aiauto_token', data.token);
                localStorage.setItem('aiauto_user', JSON.stringify(data.user || data)); // Handle potentially different response structures
                // Force a reload to ensure all states (Context, Recoil, etc.) pick up the new user
                window.location.href = '/dashboard';
            } else {
                throw new Error("No token received from server");
            }


        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.error || 'Invalid credentials or connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleSelect = (roleObj) => {
        setSelectedRole(roleObj);
        setStep('enter-credentials');
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
                width: '100%', maxWidth: '450px', padding: '3rem', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '2rem', boxShadow: '0 20px 50px rgba(0, 71, 171, 0.1)',
                background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.5)', animation: 'fadeInUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)'
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
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#003380', letterSpacing: '-0.5px' }}>AI-AUTO</h1>
                    <p style={{ color: '#2c3e50', fontSize: '1rem', fontWeight: 600 }}>
                        {step === 'select-role' ? 'Select a role to enter' : (selectedRole?.label + ' Login')}
                    </p>
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

                {step === 'select-role' ? (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {roles.map((btn) => (
                            <button
                                key={btn.role}
                                onClick={() => handleRoleSelect(btn)}
                                style={{
                                    padding: '12px', borderRadius: '10px', background: btn.color, color: 'white',
                                    border: 'none', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s ease, filter 0.2s ease',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                Login as {btn.label}
                            </button>
                        ))}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2c3e50' }}>Email Address</label>
                            <div className="input-field" style={{
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                                background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', transition: 'all 0.2s'
                            }}>
                                <User size={20} color="#2c3e50" opacity={0.5} />
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
                                padding: '14px', borderRadius: '10px', background: selectedRole.color,
                                color: 'white', border: 'none', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(0, 71, 171, 0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Authenticating...' : 'Login to Dashboard'}
                            {!loading && <ArrowRight size={20} weight="bold" />}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setStep('select-role');
                                setError('');
                            }}
                            style={{
                                background: 'none', border: 'none', color: 'var(--pivot-blue)',
                                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', marginTop: '-0.5rem'
                            }}
                        >
                            Back to Role Selection
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', width: '100%', paddingTop: '1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                        Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: 'var(--pivot-blue)', fontWeight: 700, cursor: 'pointer' }}>Create Account</span>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .input-field:focus-within {
                    border-color: var(--pivot-blue) !important;
                    box-shadow: 0 0 0 4px var(--pivot-blue-soft);
                }
            `}</style>
        </div>
    );
};

export default Login;
