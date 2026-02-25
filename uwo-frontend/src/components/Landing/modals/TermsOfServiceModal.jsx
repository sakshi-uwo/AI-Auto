import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

const TermsOfServiceModal = ({ isOpen, onClose }) => {
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
                        <h2 className="modal-title">Terms of Service</h2>
                        <button
                            onClick={onClose}
                            className="modal-close-btn"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="modal-body">
                        <section>
                            <h3>Acceptance of Terms</h3>
                            <p>
                                By accessing and using AI_Auto, you accept and agree to be bound by the terms and provisions of this agreement.
                            </p>
                        </section>

                        <section>
                            <h3>Use License</h3>
                            <p>
                                Permission is granted to temporarily use AI_Auto for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                            </p>
                        </section>

                        <section>
                            <h3>Disclaimer</h3>
                            <p>
                                The materials on AI_Auto are provided on an 'as is' basis. AI_Auto makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
                            </p>
                        </section>

                        <section>
                            <h3>Limitations</h3>
                            <p>
                                In no event shall AI_Auto or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use AI_Auto.
                            </p>
                        </section>

                        <section>
                            <h3>Revisions</h3>
                            <p>
                                AI_Auto may revise these terms of service at any time without notice. By using this platform, you are agreeing to be bound by the current version of these terms.
                            </p>
                        </section>

                        <section>
                            <h3>Governing Law</h3>
                            <p>
                                These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably submit to the exclusive jurisdiction of the courts.
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

export default TermsOfServiceModal;
