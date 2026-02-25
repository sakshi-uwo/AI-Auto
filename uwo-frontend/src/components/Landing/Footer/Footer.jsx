import React, { useState } from 'react';
import {
    Mail, MapPin, Phone, X, ChevronDown, ChevronUp, HelpCircle, ArrowRight,
    Linkedin, Twitter, Facebook, Instagram, Youtube, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { logo, name, faqs } from '../../../config/constants';
import { apis } from '../../../config/api';
import { authService } from '../../../services/api';
import PrivacyPolicyModal from '../modals/PrivacyPolicyModal';
import TermsOfServiceModal from '../modals/TermsOfServiceModal';
import CookiePolicyModal from '../modals/CookiePolicyModal';
import AboutModal from '../modals/AboutModal';
import './Footer.css';
import '../modals/Modal.css';

const Footer = () => {
    const [isFaqOpen, setIsFaqOpen] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);
    const [activeTab, setActiveTab] = useState('faq');
    const [issueType, setIssueType] = useState('General Inquiry');
    const [issueText, setIssueText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState(null);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    // Visitor Identification
    const [isIdModalOpen, setIsIdModalOpen] = useState(false);
    const [visitorName, setVisitorName] = useState(localStorage.getItem('aiauto_visitor_name') || '');
    const [pendingPlatform, setPendingPlatform] = useState(null);
    const [supportName, setSupportName] = useState('');

    const issueOptions = [
        "General Inquiry",
        "Payment Issue",
        "Refund Request",
        "Technical Support",
        "Account Access",
        "Other"
    ];

    const handleSocialClick = async (platform) => {
        const currentUser = authService.getCurrentUser();
        const activeName = currentUser?.name || visitorName;

        if (!activeName) {
            setPendingPlatform(platform);
            setIsIdModalOpen(true);
            return;
        }

        try {
            await axios.post(apis.lead, {
                source: platform,
                name: activeName === visitorName ? `${activeName} (${platform})` : activeName,
                status: 'Warm',
                projectInterest: 'Landing Page Interest'
            });
            console.log(`Lead tracked for ${platform}`);
        } catch (error) {
            console.error(`Failed to track lead for ${platform}`, error);
        }
    };

    const handleIdentificationSubmit = (e) => {
        e.preventDefault();
        if (!visitorName.trim()) return;
        localStorage.setItem('aiauto_visitor_name', visitorName);
        setIsIdModalOpen(false);
        if (pendingPlatform) {
            handleSocialClick(pendingPlatform);
            setPendingPlatform(null);
        }
    };

    const handleSupportSubmit = async () => {
        if (!issueText.trim()) return;
        setIsSending(true);
        setSendStatus(null);

        const currentUser = authService.getCurrentUser();
        const activeName = currentUser?.name || supportName || visitorName || 'Anonymous Guest';
        const activeEmail = currentUser?.email || (activeName === visitorName ? "guest-visitor@ai-auto.com" : "support-guest@ai-auto.com");

        try {
            await axios.post(apis.support, {
                email: activeEmail,
                name: activeName,
                issueType,
                message: issueText,
                userId: currentUser?._id || null
            });
            setSendStatus('success');
            setIssueText('');
            setSupportName('');
            setTimeout(() => setSendStatus(null), 3000);
        } catch (error) {
            console.error("Support submission failed", error);
            setSendStatus('error');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <motion.footer
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="footer-container"
            >
                <div className="footer-gradient-overlay" />
                <div className="footer-content">
                    <div className="footer-grid">
                        {/* Brand Column */}
                        <div className="footer-brand">
                            <div className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                <img src={logo} alt={`${name} Logo`} />
                                <span className="brand-name">{name} <sup className="tm-symbol">TM</sup></span>
                            </div>

                            <div className="social-links">
                                {[
                                    { Icon: Linkedin, href: "https://www.linkedin.com/in/aimall-global/", label: "LinkedIn" },
                                    { Icon: Twitter, href: "https://x.com/aimallglobal", label: "Twitter" },
                                    { Icon: Facebook, href: "https://www.facebook.com/aimallglobal/", label: "Facebook" },
                                    { Icon: Instagram, href: "https://www.instagram.com/aimall.global/", label: "Instagram" },
                                    { Icon: Youtube, href: "https://www.youtube.com/@aimallglobal", label: "YouTube" },
                                    { Icon: MessageCircle, href: "https://api.whatsapp.com/send?phone=918359890909", label: "WhatsApp" }
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-icon"
                                        aria-label={social.label}
                                        onClick={() => handleSocialClick(social.label)}
                                    >
                                        <social.Icon size={20} color="currentColor" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Support Column */}
                        <div className="footer-links-column">
                            <h4 className="column-title">Support</h4>
                            <ul className="footer-links-list">
                                <li>
                                    <button onClick={() => setIsFaqOpen(true)} className="footer-link-btn">
                                        Help Center
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setIsAboutModalOpen(true)} className="footer-link-btn">
                                        About {name}
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div className="footer-contact">
                            <h4 className="column-title">Contact</h4>
                            <div className="contact-info">
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Jabalpur+Madhya+Pradesh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-item"
                                    onClick={() => handleSocialClick('Google Maps')}
                                >
                                    <MapPin className="contact-icon" />
                                    <p>Jabalpur, Madhya Pradesh, India</p>
                                </a>
                                <a href="mailto:admin@uwo24.com" className="contact-item" onClick={() => handleSocialClick('Email')}>
                                    <Mail className="contact-icon" />
                                    <span>admin@uwo24.com</span>
                                </a>
                                <a href="tel:+918358990909" className="contact-item" onClick={() => handleSocialClick('Phone')}>
                                    <Phone className="contact-icon" />
                                    <span>+91 83589 90909</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="footer-bottom">
                        <p className="copyright">
                            © {new Date().getFullYear()} {name} <sup className="tm-symbol">TM</sup>. All Rights Reserved
                        </p>
                        <div className="policy-links">
                            <button onClick={() => setIsPrivacyModalOpen(true)} className="policy-link-btn">Privacy Policy</button>
                            <button onClick={() => setIsTermsModalOpen(true)} className="policy-link-btn">Terms of Service</button>
                            <button onClick={() => setIsCookieModalOpen(true)} className="policy-link-btn">Cookie Policy</button>
                        </div>
                    </div>
                </div>
            </motion.footer>

            {/* FAQ Modal */}
            <AnimatePresence>
                {isFaqOpen && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="faq-modal-container"
                        >
                            <div className="faq-modal-header">
                                <div className="tab-pill">
                                    <button
                                        onClick={() => setActiveTab('faq')}
                                        className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
                                    >
                                        FAQ
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('help')}
                                        className={`tab-btn ${activeTab === 'help' ? 'active' : ''}`}
                                    >
                                        Help
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsFaqOpen(false)}
                                    className="close-modal-btn"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="faq-modal-body">
                                {activeTab === 'faq' ? (
                                    <div className="faq-list">
                                        <p className="faq-subtitle">Everything you need to know about {name}.</p>
                                        {faqs.map((faq, index) => (
                                            <div key={index} className="faq-item">
                                                <button
                                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                                    className="faq-question-btn"
                                                >
                                                    <span>{faq.question}</span>
                                                    {openFaqIndex === index ? (
                                                        <ChevronUp className="faq-chevron" />
                                                    ) : (
                                                        <ChevronDown className="faq-chevron" />
                                                    )}
                                                </button>
                                                <div
                                                    className={`faq-answer-content ${openFaqIndex === index ? 'open' : ''}`}
                                                >
                                                    <div className="faq-answer-inner">
                                                        {faq.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="help-form">
                                        <div className="form-group">
                                            <label>Select Category</label>
                                            <div className="custom-select-wrapper">
                                                <select
                                                    value={issueType}
                                                    onChange={(e) => setIssueType(e.target.value)}
                                                    className="form-select"
                                                >
                                                    {issueOptions.map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="select-chevron" />
                                            </div>
                                        </div>
                                        {!authService.getCurrentUser() && (
                                            <div className="form-group">
                                                <label>Your Name</label>
                                                <input
                                                    type="text"
                                                    className="form-select" // Reusing styles
                                                    style={{ cursor: 'text' }}
                                                    placeholder="Enter your name"
                                                    value={supportName || visitorName}
                                                    onChange={(e) => setSupportName(e.target.value)}
                                                />
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <label>Describe Your Issue</label>
                                            <textarea
                                                className="form-textarea"
                                                placeholder="Tell us what's happening..."
                                                value={issueText}
                                                onChange={(e) => setIssueText(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={handleSupportSubmit}
                                            disabled={isSending || !issueText.trim()}
                                            className={`submit-ticket-btn ${isSending || !issueText.trim() ? 'disabled' : ''}`}
                                        >
                                            {isSending ? (
                                                <span className="btn-loader" />
                                            ) : (
                                                <>
                                                    <HelpCircle className="w-5 h-5" />
                                                    Submit Ticket
                                                </>
                                            )}
                                        </button>
                                        {sendStatus === 'success' && (
                                            <div className="status-msg success">
                                                Support ticket created successfully!
                                            </div>
                                        )}
                                        {sendStatus === 'error' && (
                                            <div className="status-msg error">
                                                Failed to send ticket. Please try again.
                                            </div>
                                        )}
                                        <p className="form-footer-note">
                                            Or email us at <a href="mailto:admin@uwo24.com">admin@uwo24.com</a>
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="faq-modal-footer">
                                <button
                                    onClick={() => setIsFaqOpen(false)}
                                    className="close-faq-btn"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Visitor Identification Modal */}
            <AnimatePresence>
                {isIdModalOpen && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="id-modal-container"
                        >
                            <button onClick={() => setIsIdModalOpen(false)} className="close-modal-btn" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                                <X size={20} />
                            </button>

                            <div className="id-modal-icon">
                                <ArrowRight size={32} />
                            </div>

                            <h3 className="id-modal-title">Welcome to {name}</h3>
                            <p className="id-modal-desc">Tell us who's visiting so we can better assist you.</p>

                            <form onSubmit={handleIdentificationSubmit}>
                                <div className="id-input-group">
                                    <label>What's your name?</label>
                                    <input
                                        type="text"
                                        className="id-input"
                                        placeholder="Enter your name"
                                        autoFocus
                                        value={visitorName}
                                        onChange={(e) => setVisitorName(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="id-modal-submit" disabled={!visitorName.trim()}>
                                    Continue to {pendingPlatform}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
            <TermsOfServiceModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
            <CookiePolicyModal isOpen={isCookieModalOpen} onClose={() => setIsCookieModalOpen(false)} />
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
        </>
    );
};

export default Footer;
