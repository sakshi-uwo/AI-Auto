import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleUser, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logo, name } from '../../config/constants';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="navbar-header">
            <div className="navbar-container">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="navbar-brand"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <img src={logo} alt={`${name} Logo`} className="navbar-logo" />
                    <span className="navbar-brand-name">{name}</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="navbar-actions"
                >
                    <ThemeToggle />

                    <div className="navbar-desktop-links">
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="login-btn"
                            >
                                <span>Log in</span>
                                <CircleUser className="login-icon" />
                            </motion.button>
                        </Link>
                    </div>

                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </motion.div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="mobile-menu"
                        style={{
                            position: 'absolute', top: '100%', left: '1rem', right: '1rem',
                            marginTop: '0.5rem', borderRadius: '1.25rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(20px)',
                            overflow: 'hidden'
                        }}
                    >
                        <div className="mobile-menu-content" style={{ padding: '1.5rem' }}>
                            <Link to="/login" className="mobile-login-btn" style={{
                                textDecoration: 'none', background: 'var(--primary, #4f46e5)',
                                color: 'white', padding: '1rem', borderRadius: '1rem',
                                display: 'flex', justifyContent: 'center', fontWeight: 800,
                                boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)'
                            }}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span>Get Started</span>
                                <CircleUser className="login-icon" style={{ color: 'white' }} />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
