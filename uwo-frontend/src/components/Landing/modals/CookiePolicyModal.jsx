import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

const CookiePolicyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="modal-content"
                >
                    <div className="modal-header">
                        <h2 className="modal-title">Cookie Policy</h2>
                        <button
                            onClick={onClose}
                            className="modal-close-btn"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="modal-body">
                        <section>
                            <h3>What Are Cookies?</h3>
                            <p>
                                Cookies are small text files that are placed on your device when you visit AI_Auto. They help us provide you with a better experience and allow certain features to function properly.
                            </p>
                        </section>

                        <section>
                            <h3>How We Use Cookies</h3>
                            <p>
                                We use cookies to understand how you use our platform, remember your preferences, and improve your experience. This includes essential cookies for functionality and analytics cookies for performance monitoring.
                            </p>
                        </section>

                        <section>
                            <h3>Types of Cookies We Use</h3>
                            <ul className="list-disc list-inside space-y-2" style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                                <li><strong>Essential Cookies:</strong> Required for the platform to function properly</li>
                                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our platform</li>
                                <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                            </ul>
                        </section>

                        <section>
                            <h3>Managing Cookies</h3>
                            <p>
                                You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of AI_Auto.
                            </p>
                        </section>

                        <section>
                            <h3>Updates to This Policy</h3>
                            <p>
                                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
                            </p>
                        </section>

                        <section>
                            <h3>Contact Us</h3>
                            <p>
                                If you have questions about our use of cookies, please contact us at admin@uwo24.com.
                            </p>
                        </section>
                    </div>

                    <div className="modal-footer">
                        <button
                            onClick={onClose}
                            className="modal-action-btn"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CookiePolicyModal;
