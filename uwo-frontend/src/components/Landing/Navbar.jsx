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
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mobile-menu"
                    >
                        <div className="mobile-menu-content">
                            <Link to="/login" className="mobile-login-btn" style={{ textDecoration: 'none' }}>
                                <span>Log in</span>
                                <CircleUser className="login-icon" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
