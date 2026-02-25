import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

const AboutModal = ({ isOpen, onClose }) => {
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
                        <h2 className="modal-title">About AI_Auto</h2>
                        <button
                            onClick={onClose}
                            className="modal-close-btn"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="modal-body">
                        <section>
                            <h3>Our Mission</h3>
                            <p>
                                AI_Auto is dedicated to revolutionizing automation through artificial intelligence. We empower individuals and businesses to streamline their workflows, enhance productivity, and unlock new possibilities with cutting-edge AI technology.
                            </p>
                        </section>

                        <section>
                            <h3>What We Offer</h3>
                            <p>
                                Our platform provides intelligent automation solutions designed to adapt to your needs. From simple task automation to complex workflow optimization, AI_Auto delivers powerful tools in an intuitive interface.
                            </p>
                        </section>

                        <section>
                            <h3>Our Technology</h3>
                            <p>
                                Built on advanced AI models and modern web technologies, AI_Auto combines speed, reliability, and intelligence. We continuously innovate to bring you the latest advancements in AI-powered automation.
                            </p>
                        </section>

                        <section>
                            <h3>Our Commitment</h3>
                            <p>
                                We are committed to your privacy, security, and success. Your data is protected with enterprise-grade security, and our team is dedicated to providing exceptional support and continuous improvement.
                            </p>
                        </section>

                        <section>
                            <h3>Get in Touch</h3>
                            <p>
                                Have questions or feedback? We'd love to hear from you. Reach out to us at admin@uwo24.com or call us at +91 83589 90909.
                            </p>
                        </section>

                        <section className="text-center pt-4" style={{ textAlign: 'center', paddingTop: '1rem' }}>
                            <p className="text-sm italic text-gray-500" style={{ fontSize: '0.875rem', fontStyle: 'italic', opacity: 0.7 }}>
                                Powered by UWO24 Technologies
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

export default AboutModal;
