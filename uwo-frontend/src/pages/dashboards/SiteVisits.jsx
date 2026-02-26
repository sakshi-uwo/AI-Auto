import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Phone, Clock, CaretLeft, CaretRight, Info } from '@phosphor-icons/react';
import './SiteVisits.css';
import { visitService, leadService, projectService } from '../../services/api';
import socketService from '../../services/socket';

const SummaryCard = ({ icon: Icon, title, value }) => (
    <div className="card summary-card">
        <div className="icon-box">
            <Icon size={28} weight="bold" />
        </div>
        <div className="summary-info">
            <h3>{title}</h3>
            <div className="value">{value}</div>
        </div>
    </div>
);

const CalendarPreview = ({ visits = [] }) => {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState(new Date().getDate());
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const getMonthData = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        return { firstDay, daysInMonth, today, year, month };
    };

    const { firstDay, daysInMonth, today, year, month } = getMonthData(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        setSelectedDate(day);
    };

    const getVisitsForDate = (day) => {
        return visits.filter(visit => {
            const vDate = new Date(visit.visitDate);
            return vDate.getDate() === day && vDate.getMonth() === month && vDate.getFullYear() === year;
        });
    };

    const selectedDateVisits = getVisitsForDate(selectedDate);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="card calendar-card">
            <div className="calendar-header">
                <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Calendar</h2>
                <div style={{ display: 'flex', gap: '8px', color: 'var(--pivot-blue)' }}>
                    <CaretLeft size={18} weight="bold" style={{ cursor: 'pointer' }} onClick={previousMonth} />
                    <CaretRight size={18} weight="bold" style={{ cursor: 'pointer' }} onClick={nextMonth} />
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 700, fontSize: '0.9rem' }}>
                {months[month]} {year}
            </div>

            <div className="calendar-grid">
                {days.map(day => (
                    <div key={day} className="calendar-day-label">{day}</div>
                ))}
                {blanks.map(blank => (
                    <div key={`blank-${blank}`} className="calendar-day blank"></div>
                ))}
                {dates.map(date => (
                    <div
                        key={date}
                        className={`calendar-day ${getVisitsForDate(date).length > 0 ? 'has-visit' : ''} ${selectedDate === date ? 'selected' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDateClick(date)}
                    >
                        {date}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--pivot-blue-soft)', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', color: 'var(--pivot-blue)' }}>
                    {selectedDate ? `${months[month]} ${selectedDate}, ${year}` : 'SELECT A DATE'}
                </h4>
                {selectedDateVisits.length > 0 ? (
                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {selectedDateVisits.map((visit, index) => (
                            <div key={visit._id} style={{ marginBottom: index < selectedDateVisits.length - 1 ? '6px' : '0' }}>
                                • {new Date(visit.visitDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {visit.project?.name}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.6 }}>
                        No site visits scheduled
                    </div>
                )}
            </div>
        </div>
    );
};

const SiteVisits = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);

        const fetchVisits = async () => {
            try {
                const response = await visitService.getAll();
                setVisits(response.data || []);
            } catch (error) {
                console.error("Visit Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVisits();

        socketService.on('visit-scheduled', (newVisit) => {
            setVisits(prev => [...prev, newVisit]);
        });

        socketService.on('visit-status-updated', (updatedVisit) => {
            setVisits(prev => prev.map(v => v._id === updatedVisit._id ? updatedVisit : v));
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            socketService.off('visit-scheduled');
            socketService.off('visit-status-updated');
        };
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Scheduled': return 'status-scheduled';
            case 'Completed': return 'status-completed';
            case 'Rescheduled': return 'status-rescheduled';
            default: return '';
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading Visits...</div>;

    const todayVisits = visits.filter(v => new Date(v.visitDate).toDateString() === new Date().toDateString()).length;
    const upcomingVisits = visits.filter(v => new Date(v.visitDate) >= new Date()).length;

    return (
        <div className="site-visits-container">
            <header className="page-header">
                <h1>Upcoming Site Visits</h1>
                <p>Scheduled property visits and client meetings</p>
            </header>

            <div className="summary-row">
                <SummaryCard icon={Calendar} title="Total Upcoming Visits" value={upcomingVisits} />
                <SummaryCard icon={Clock} title="Today's Visits" value={todayVisits} />
                <SummaryCard icon={Users} title="All Visits" value={visits.length} />
            </div>

            <div className="main-content-grid">
                <div className="card visits-list-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Visit Schedule</h2>
                    </div>

                    <div className="table-wrapper">
                        <table className="visits-table" style={{ minWidth: isMobile ? '700px' : 'auto' }}>
                            <thead>
                                <tr>
                                    <th>Lead Name</th>
                                    <th>Project Name</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Assigned Executive</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visits.map((visit) => (
                                    <tr key={visit._id} className="visit-row">
                                        <td style={{ fontWeight: 600 }}>{visit.lead?.name || 'N/A'}</td>
                                        <td>{visit.project?.name || 'N/A'}</td>
                                        <td>{new Date(visit.visitDate).toLocaleDateString()}</td>
                                        <td>{new Date(visit.visitDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>{visit.executive}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(visit.status)}`}>
                                                {visit.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <CalendarPreview visits={visits} />
            </div>
        </div>
    );
};

export default SiteVisits;
