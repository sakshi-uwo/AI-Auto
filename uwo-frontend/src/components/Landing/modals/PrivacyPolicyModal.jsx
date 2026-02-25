import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
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
                        <h2 className="modal-title">Privacy Policy</h2>
                        <button
                            onClick={onClose}
                            className="modal-close-btn"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="modal-body">
                        <section>
                            <h3>Introduction</h3>
                            <p>
                                At AI_Auto, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                            </p>
                        </section>

                        <section>
                            <h3>Information We Collect</h3>
                            <p>
                                We may collect personal information such as your name, email address, and usage data when you interact with our services. This information helps us provide and improve our platform.
                            </p>
                        </section>

                        <section>
                            <h3>How We Use Your Information</h3>
                            <p>
                                Your information is used to operate, maintain, and improve our services, communicate with you, and ensure the security of our platform.
                            </p>
                        </section>

                        <section>
                            <h3>Data Security</h3>
                            <p>
                                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                            </p>
                        </section>

                        <section>
                            <h3>Your Rights</h3>
                            <p>
                                You have the right to access, update, or delete your personal information. Contact us at admin@uwo24.com for any privacy-related requests.
                            </p>
                        </section>

                        <section>
                            <h3>Contact Us</h3>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at admin@uwo24.com or +91 83589 90909.
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

export default PrivacyPolicyModal;
