import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="theme-toggle-wrapper">
            <motion.button
                onClick={toggleTheme}
                className={`theme-toggle-btn ${isDark ? 'is-dark' : 'is-light'}`}
                whileTap={{ scale: 0.95 }}
            >
                {/* Sliding Knob */}
                <motion.div
                    layout
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                    }}
                    className={`toggle-knob ${isDark ? 'knob-dark' : 'knob-light'}`}
                    animate={{ x: isDark ? 24 : 0 }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isDark ? (
                            <motion.div
                                key="moon"
                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Moon className="knob-icon icon-moon" fill="currentColor" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sun"
                                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Sun className="knob-icon icon-sun" fill="currentColor" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Background Icons/Effects */}
                <div className="toggle-bg-icons">
                    <motion.div
                        animate={{
                            opacity: isDark ? 0 : 1,
                            x: isDark ? -10 : 0,
                            scale: isDark ? 0.8 : 1
                        }}
                        className="bg-icon-sun"
                    >
                        <Sun className="bg-lucide-icon" />
                    </motion.div>

                    <motion.div
                        animate={{
                            opacity: isDark ? 1 : 0,
                            x: isDark ? 0 : 10,
                            scale: isDark ? 1 : 0.8
                        }}
                        className="bg-icons-dark"
                    >
                        <Sparkles className="bg-lucide-icon-sm" />
                        <Moon className="bg-lucide-icon" />
                    </motion.div>
                </div>

                {/* Inner shadow for depth */}
                <div className="toggle-inner-shadow" />
            </motion.button>
        </div>
    );
};

export default ThemeToggle;
