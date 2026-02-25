import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    X, Package, WarningCircle, CheckCircle, ArrowDown,
    ArrowUp, FloppyDisk, Truck, Clipboard, User,
    CalendarBlank, ListChecks, Note, PaperclipHorizontal,
    ArrowsClockwise
} from '@phosphor-icons/react';
import { API_BASE_URL } from '../config/api';

const MATERIAL_CATALOG = [
    { item: 'Cement (Grade 43)', category: 'Cement', unit: 'Bags' },
    { item: 'Cement (Grade 53)', category: 'Cement', unit: 'Bags' },
    { item: 'Steel Rods (8mm)', category: 'Steel', unit: 'Kg' },
    { item: 'Steel Rods (12mm)', category: 'Steel', unit: 'Kg' },
    { item: 'Steel Rods (16mm)', category: 'Steel', unit: 'Kg' },
    { item: 'River Sand', category: 'Sand', unit: 'Cubic Meter' },
    { item: 'M-Sand', category: 'Sand', unit: 'Cubic Meter' },
    { item: 'Coarse Aggregate (20mm)', category: 'Aggregate', unit: 'Ton' },
    { item: 'Fine Aggregate (10mm)', category: 'Aggregate', unit: 'Ton' },
    { item: 'Bricks (Red)', category: 'Bricks', unit: 'Nos' },
    { item: 'AAC Blocks', category: 'Bricks', unit: 'Nos' },
    { item: 'Cement Plaster', category: 'Finishing', unit: 'Bags' },
    { item: 'Paint (Exterior)', category: 'Finishing', unit: 'Litre' },
    { item: 'Tiles', category: 'Finishing', unit: 'Nos' },
    { item: 'PVC Pipes', category: 'Other', unit: 'Nos' },
    { item: 'Electrical Wire', category: 'Other', unit: 'Nos' },
];

const PURPOSE_OPTIONS = ['Foundation', 'Slab Casting', 'Column Work', 'Brickwork', 'Plastering', 'Repair', 'Other'];
const SOURCE_OPTIONS = ['From Site Inventory', 'From New Delivery', 'Borrowed'];
const STATUS_COLORS = {
    Available: { bg: '#f0fdf4', color: '#16a34a' },
    Requested: { bg: '#fff1f2', color: '#e11d48' },
    'Low Stock': { bg: '#fffbeb', color: '#d97706' },
    'In Transit': { bg: '#eff6ff', color: '#2563eb' },
    Arrived: { bg: '#f0fdf4', color: '#16a34a' },
};

const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '12px',
    border: '1.5px solid #e2e8f0', background: '#f8fafc',
    fontWeight: 600, fontSize: '0.9rem', outline: 'none',
    color: '#1e293b', boxSizing: 'border-box', transition: 'border 0.2s'
};
const labelStyle = {
    display: 'block', fontSize: '0.72rem', fontWeight: 800,
    color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px'
};
const sectionTitle = {
    fontSize: '0.8rem', fontWeight: 900, color: '#0047AB',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    display: 'flex', alignItems: 'center', gap: '6px',
    paddingBottom: '10px', borderBottom: '2px solid #eff6ff', marginBottom: '1rem'
};

const RecordUsageModal = ({ onClose, onSuccess, materials = [], tasks = [] }) => {
    // ── Form State ──────────────────────────────────────────────────────────
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [quantityUsed, setQuantityUsed] = useState('');
    const [purpose, setPurpose] = useState('Foundation');
    const [source, setSource] = useState('From Site Inventory');
    const [linkedTask, setLinkedTask] = useState('');
    const [remarks, setRemarks] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [recordedBy, setRecordedBy] = useState('Site Manager');
    const [projectSite, setProjectSite] = useState('Current Site');
    const [loading, setLoading] = useState(false);

    // ── Computed ─────────────────────────────────────────────────────────────
    const openingStock = selectedMaterial?.remainingQty ?? selectedMaterial?.qty ?? 0;
    const qty = parseFloat(quantityUsed) || 0;
    const remainingStock = Math.max(0, openingStock - qty);
    const isOverStock = qty > openingStock && qty > 0;
    const isLowStock = !isOverStock && remainingStock <= (selectedMaterial?.lowStockThreshold ?? 10) && qty > 0;

    useEffect(() => {
        if (selectedMaterialId) {
            const mat = materials.find(m => m._id === selectedMaterialId);
            setSelectedMaterial(mat || null);
        } else {
            setSelectedMaterial(null);
        }
    }, [selectedMaterialId, materials]);

    const handleSubmit = async (requestRefill = false) => {
        if (!selectedMaterialId) return alert('Please select a material.');
        if (!quantityUsed || qty <= 0) return alert('Please enter a valid quantity.');

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/materials/record-usage`, {
                materialId: selectedMaterialId,
                quantityUsed: qty,
                purpose, source, linkedTask, remarks,
                recordedBy, projectSite,
                date: new Date(date).toISOString(),
                requestRefill
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Usage record error:', err);
            alert(err.response?.data?.message || 'Failed to record usage.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 10100, padding: '16px'
        }}>
            <div style={{
                background: 'white', width: '100%', maxWidth: '760px',
                maxHeight: '95vh', borderRadius: '28px', overflow: 'hidden',
                boxShadow: '0 32px 64px -12px rgba(0,0,0,0.4)',
                display: 'flex', flexDirection: 'column',
                border: '1px solid #e2e8f0'
            }}>
                {/* ── Header ── */}
                <div style={{
                    background: 'linear-gradient(135deg, #0047AB 0%, #1e3a8a 100%)',
                    padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                            width: '46px', height: '46px', borderRadius: '14px',
                            background: 'rgba(255,255,255,0.15)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Package size={26} weight="fill" color="white" />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'white' }}>
                                Record Material Usage
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                                Site Inventory Deduction Entry
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.15)', border: 'none',
                        borderRadius: '50%', width: '38px', height: '38px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'background 0.2s'
                    }}>
                        <X size={20} color="white" weight="bold" />
                    </button>
                </div>

                {/* ── Body ── */}
                <div style={{ overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Section 1: Basic Details */}
                    <div>
                        <div style={sectionTitle}>
                            <User size={16} /> Basic Details
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Project / Site</label>
                                <input style={inputStyle} value={projectSite}
                                    onChange={e => setProjectSite(e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Date</label>
                                <input type="date" style={inputStyle} value={date}
                                    onChange={e => setDate(e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Recorded By</label>
                                <input style={inputStyle} value={recordedBy}
                                    onChange={e => setRecordedBy(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Material Selection */}
                    <div>
                        <div style={sectionTitle}>
                            <Package size={16} /> Material Selection
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Material Name</label>
                                <select style={inputStyle} value={selectedMaterialId}
                                    onChange={e => setSelectedMaterialId(e.target.value)}>
                                    <option value="">— Select from inventory —</option>
                                    {materials.length > 0 ? (
                                        materials.map(m => (
                                            <option key={m._id} value={m._id}>
                                                {m.item} ({m.remainingQty ?? m.qty ?? 0} {m.unit || 'units'} left)
                                            </option>
                                        ))
                                    ) : (
                                        MATERIAL_CATALOG.map(m => (
                                            <option key={m.item} value={m.item}>{m.item}</option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Category</label>
                                <input style={{ ...inputStyle, background: '#f1f5f9', color: '#64748b' }}
                                    value={selectedMaterial?.category || '—'} disabled />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Usage Details */}
                    <div>
                        <div style={sectionTitle}>
                            <ArrowDown size={16} /> Usage Details
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Quantity Used Today</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="number" min="0" step="0.1"
                                        style={{ ...inputStyle, paddingRight: '60px' }}
                                        placeholder="0"
                                        value={quantityUsed}
                                        onChange={e => setQuantityUsed(e.target.value)} />
                                    <span style={{
                                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                        fontSize: '0.75rem', fontWeight: 800, color: '#0047AB', background: '#eff6ff',
                                        padding: '2px 8px', borderRadius: '6px'
                                    }}>
                                        {selectedMaterial?.unit || 'Unit'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Purpose / Work Type</label>
                                <select style={inputStyle} value={purpose} onChange={e => setPurpose(e.target.value)}>
                                    {PURPOSE_OPTIONS.map(p => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Source of Material</label>
                                <select style={inputStyle} value={source} onChange={e => setSource(e.target.value)}>
                                    {SOURCE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Inventory Impact */}
                    {selectedMaterial && qty > 0 && (
                        <div style={{
                            background: isOverStock ? '#fff1f2' : '#f8fafc',
                            borderRadius: '20px', padding: '1.5rem',
                            border: `2px solid ${isOverStock ? '#fecdd3' : isLowStock ? '#fde68a' : '#e2e8f0'}`
                        }}>
                            <div style={sectionTitle}>
                                <ArrowsClockwise size={16} /> Inventory Impact (Auto Calculated)
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                <div style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Opening Stock</div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e293b' }}>{openingStock}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{selectedMaterial?.unit}</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '1rem', background: '#fff1f2', borderRadius: '14px', border: '1px solid #fecdd3' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#e11d48', textTransform: 'uppercase', marginBottom: '6px' }}>Used Quantity</div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#e11d48' }}>−{qty}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{selectedMaterial?.unit}</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '1rem', background: isOverStock ? '#fff1f2' : isLowStock ? '#fffbeb' : '#f0fdf4', borderRadius: '14px', border: `1px solid ${isOverStock ? '#fecdd3' : isLowStock ? '#fde68a' : '#bbf7d0'}` }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: isOverStock ? '#e11d48' : isLowStock ? '#d97706' : '#16a34a', textTransform: 'uppercase', marginBottom: '6px' }}>Remaining Stock</div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: isOverStock ? '#e11d48' : isLowStock ? '#d97706' : '#16a34a' }}>{remainingStock}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{selectedMaterial?.unit}</div>
                                </div>
                            </div>

                            {isOverStock && (
                                <div style={{ marginTop: '1rem', padding: '12px 16px', background: '#fff1f2', borderRadius: '12px', border: '1px solid #fecdd3', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <WarningCircle size={20} color="#e11d48" weight="fill" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#be123c' }}>
                                        ⚠️ Usage exceeds available stock! Status will be marked as <strong>Requested</strong>.
                                    </span>
                                </div>
                            )}
                            {isLowStock && !isOverStock && (
                                <div style={{ marginTop: '1rem', padding: '12px 16px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <WarningCircle size={20} color="#d97706" weight="fill" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e' }}>
                                        Low stock alert! Remaining stock is below threshold.
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Section 5: Linked Task */}
                    <div>
                        <div style={sectionTitle}>
                            <ListChecks size={16} /> Linked Work / Task (Optional)
                        </div>
                        <select style={inputStyle} value={linkedTask} onChange={e => setLinkedTask(e.target.value)}>
                            <option value="">— None —</option>
                            {tasks.length > 0 ? (
                                tasks.map(t => (
                                    <option key={t._id} value={t.task}>{t.task}</option>
                                ))
                            ) : (
                                ['Slab work – Block A', 'Column casting – Floor 2', 'Foundation – Zone B', 'Brickwork – Level 3'].map(t => (
                                    <option key={t}>{t}</option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Section 6: Remarks */}
                    <div>
                        <div style={sectionTitle}>
                            <Note size={16} /> Remarks / Notes
                        </div>
                        <textarea
                            rows={3}
                            placeholder='e.g. "Extra cement used due to uneven surface"'
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                            style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
                        />
                    </div>
                </div>

                {/* ── Footer ── */}
                <div style={{
                    padding: '1.2rem 2rem', borderTop: '1px solid #f1f5f9',
                    display: 'flex', justifyContent: 'flex-end', gap: '12px',
                    background: '#fafafa', flexShrink: 0
                }}>
                    <button onClick={onClose} style={{
                        padding: '11px 22px', borderRadius: '12px', border: '1.5px solid #e2e8f0',
                        background: 'white', fontWeight: 700, cursor: 'pointer', color: '#475569', fontSize: '0.9rem'
                    }}>
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSubmit(true)}
                        disabled={loading}
                        style={{
                            padding: '11px 22px', borderRadius: '12px', border: 'none',
                            background: loading ? '#94a3b8' : '#f59e0b', color: 'white',
                            fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        <Truck size={18} /> Save & Request Refill
                    </button>
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={loading}
                        style={{
                            padding: '11px 28px', borderRadius: '12px', border: 'none',
                            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0047AB, #1e3a8a)',
                            color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 4px 12px rgba(0,71,171,0.3)',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        <FloppyDisk size={18} /> {loading ? 'Saving...' : 'Save Usage'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecordUsageModal;
