import React, { useState, useEffect, useRef } from 'react';
import { ChatCircleDots, X, PaperPlaneTilt, Robot, User, DotsThreeOutline, Paperclip, FileArrowUp, FilmReel } from '@phosphor-icons/react';
import { chatService, authService } from '../services/api';

const Chatbot = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentUser = user || authService.getCurrentUser();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: currentUser?.role === 'builder'
                ? `Hello ${currentUser.name || 'Builder'}! I am your Construction Assistant. How can I help with your materials, inventory, or site logs today?`
                : `Hello! I am AI-AUTO AI. How can I help you with your property dashboard today?`
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const getRolePrompt = (user) => {
        const name = user?.name || "User";
        const role = user?.role || "User";

        const basePrompt = `You are AI-AUTO AI, the intelligent assistant for the AI-AUTO Builder Platform. 
        Current User: ${name}, Role: ${role}.
        Tone: Professional, helpful, and concise.`;

        switch (role.toLowerCase()) {
            case 'admin':
                return `${basePrompt}
                Your focus is SYSTEM OVERSIGHT. You have full access to all data.
                - Help the admin track total leads, user activities, and project statuses.
                - Provide high-level analytics and identify platform-wide risks.
                - Assist with user management and sales team performance summaries.`;
            case 'builder':
                return `${basePrompt}
                Your primary focus is CONSTRUCTION MANAGEMENT and INVENTORY.
                - Assist with material tracking, equipment inventory, and site logs.
                - Provide updates on project progress and budget management.
                - Focus on technical construction details and operational efficiency.`;
            case 'civil engineer':
                return `${basePrompt}
                Your focus is TECHNICAL QUALITY and SITE VISITS.
                - Assist with site visit logs, structural milestones, and safety compliance.
                - Help track masonry, flooring, and other engineering-specific tasks.
                - Provide technical guidance on construction standards.`;
            case 'site manager':
                return `${basePrompt}
                Your focus is DAILY OPERATIONS and LABOR.
                - Assist with daily attendance, material usage logs, and incident reports.
                - Help organize daily tasks and worker schedules.
                - Focus on what's happening ON-GROUND today.`;
            case 'client':
                return `${basePrompt}
                Your focus is PROPERTY UPDATES and TRANSPARENCY.
                - Help the client track their own project progress and payment schedule.
                - Show site visit photos and upcoming milestones for their specific units.
                - Be supportive and clear, avoid overly technical jargon.`;
            default:
                return `${basePrompt} Help the user navigate the dashboard and manage their properties.`;
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, attachments]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachments(prev => [...prev, {
                    name: file.name,
                    mimeType: file.type,
                    data: reader.result.split(',')[1], // Just the base64 part
                    preview: file.type.startsWith('image/') ? reader.result : null,
                    type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'doc'
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if (!input.trim() && attachments.length === 0) return;

        const currentUser = user || authService.getCurrentUser();
        const userMessage = {
            role: 'user',
            content: input,
            hasAttachments: attachments.length > 0
        };
        setMessages(prev => [...prev, userMessage]);

        const currentAttachments = [...attachments];
        setInput('');
        setAttachments([]);
        setIsTyping(true);

        try {
            const rolePrompt = getRolePrompt(currentUser);

            const response = await chatService.sendMessage({
                content: input,
                history: messages.map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                })),
                systemInstruction: rolePrompt,
                files: currentAttachments.map(a => ({
                    mimeType: a.mimeType,
                    data: a.data
                }))
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the construction database. Please try again in a moment." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: 'Inter, sans-serif' }}>
            {/* Chat Bubble */}
            {!isOpen && (
                <div
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--pivot-blue), #003087)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0, 71, 171, 0.3)',
                        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <ChatCircleDots size={32} weight="bold" />
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '380px', height: '550px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    overflow: 'hidden',
                    animation: 'slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1.5rem', background: 'linear-gradient(135deg, var(--pivot-blue), #003087)',
                        color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Robot size={24} weight="bold" />
                            </div>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 700 }}>AI-AUTO AI</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.8, display: 'center', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF50' }}></div>
                                    Online Assistant
                                </div>
                            </div>
                        </div>
                        <X size={24} weight="bold" style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => setIsOpen(false)} />
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-end',
                                gap: '8px'
                            }}>
                                {msg.role === 'assistant' && (
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--pivot-blue-soft)', color: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Robot size={16} weight="bold" />
                                    </div>
                                )}
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '12px 16px',
                                    borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                                    background: msg.role === 'user' ? 'var(--pivot-blue)' : '#f0f2f5',
                                    color: msg.role === 'user' ? 'white' : 'var(--soft-black)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}>
                                    {msg.content}
                                    {msg.hasAttachments && (
                                        <div style={{ marginTop: '8px', fontSize: '0.75rem', opacity: 0.8, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Paperclip size={14} /> Attachment analyzed
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--pivot-blue-soft)', color: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Robot size={16} weight="bold" />
                                </div>
                                <div style={{ background: '#f0f2f5', padding: '12px 16px', borderRadius: '16px', color: 'var(--charcoal)' }}>
                                    <DotsThreeOutline size={20} weight="bold" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1.2rem', borderTop: '1px solid #efefef', background: 'white' }}>
                        {/* Selected Attachments Preview */}
                        {attachments.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {attachments.map((file, i) => (
                                    <div key={i} style={{
                                        position: 'relative', minWidth: '60px', height: '60px',
                                        borderRadius: '8px', background: '#f0f2f5',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden', border: '1px solid #ddd'
                                    }}>
                                        {file.preview ? (
                                            <img src={file.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                                {file.type === 'video' ? <FilmReel size={20} /> : <FileArrowUp size={20} />}
                                                <span style={{ fontSize: '10px', maxWidth: '50px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                                            </div>
                                        )}
                                        <X
                                            size={14}
                                            style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', cursor: 'pointer', padding: '2px' }}
                                            onClick={() => removeAttachment(i)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', background: '#f8f9fa', borderRadius: '14px', padding: '12px 16px', border: '1px solid #eee', alignItems: 'center' }}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                                multiple
                                accept="image/*,video/*,.pdf,.doc,.docx"
                            />
                            <Paperclip
                                size={22}
                                style={{ cursor: 'pointer', opacity: 0.6 }}
                                onClick={() => fileInputRef.current?.click()}
                            />
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message or upload files..."
                                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }}
                            />
                            <PaperPlaneTilt
                                size={22}
                                weight="bold"
                                color={(input.trim() || attachments.length > 0) ? 'var(--pivot-blue)' : '#ccc'}
                                style={{ cursor: (input.trim() || attachments.length > 0) ? 'pointer' : 'default', transition: 'color 0.3s' }}
                                onClick={handleSend}
                            />
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '0.65rem', color: '#999', marginTop: '10px' }}>
                            AI may generate inaccurate information.
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Chatbot;
