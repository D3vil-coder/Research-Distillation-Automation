'use client';
import { BookOpen, ExternalLink, Calendar, Sparkles } from 'lucide-react';

function formatDate(dateStr) {
    if (!dateStr) return 'Today';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

export default function PaperCarousel({ papers = [], onSelect, selectedPaper }) {
    return (
        <div style={{ width: '100%', marginBottom: '4rem', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', padding: '0 0.5rem' }}>
                <h2 className="text-gradient" style={{ fontSize: '2.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <BookOpen style={{ width: 32, height: 32, color: '#c084fc' }} />
                    Fresh Research
                </h2>
                <span style={{ fontSize: '0.875rem', fontFamily: 'monospace', opacity: 0.5 }}>
                    {papers.length} Papers
                </span>
            </div>

            {papers.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem', opacity: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <Sparkles style={{ width: 48, height: 48, color: 'rgba(168,85,247,0.5)', animation: 'spin 3s linear infinite' }} />
                    <p>Fetching the latest intelligence...</p>
                </div>
            ) : (
                <div className="custom-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '2rem', paddingBottom: '3rem', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '1rem' }}>
                    {papers.map((paper, idx) => {
                        const isSelected = selectedPaper?.link === paper.link;
                        return (
                            <div
                                key={idx}
                                className="glass-card"
                                style={{
                                    minWidth: '380px',
                                    maxWidth: '380px',
                                    padding: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '520px',
                                    position: 'relative',
                                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                                    border: isSelected ? '1px solid #a855f7' : undefined,
                                    boxShadow: isSelected ? '0 0 50px rgba(168,85,247,0.4)' : undefined,
                                    background: isSelected ? 'rgba(255,255,255,0.1)' : undefined
                                }}
                            >
                                {/* Top Gradient Bar */}
                                <div style={{ height: 4, width: '100%', background: 'linear-gradient(to right, #a855f7, #ec4899, #06b6d4)', opacity: 0.8 }}></div>

                                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    {/* Header */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.75rem',
                                                fontFamily: 'monospace',
                                                color: '#67e8f9',
                                                background: 'rgba(22,78,99,0.3)',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                border: '1px solid rgba(6,182,212,0.3)'
                                            }}>
                                                <Calendar style={{ width: 12, height: 12 }} />
                                                {formatDate(paper.date)}
                                            </span>
                                            <a
                                                href={paper.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
                                                title="Read on Arxiv"
                                            >
                                                <ExternalLink style={{ width: 20, height: 20 }} />
                                            </a>
                                        </div>

                                        <h3 style={{ fontWeight: 700, fontSize: '1.375rem', lineHeight: 1.3, marginBottom: '0.75rem', color: '#fff', letterSpacing: '-0.01em' }}>
                                            {paper.title}
                                        </h3>

                                        {/* Hashtags - LIGHTER and SMALLER */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                                            {['robotics', 'ai', 'research'].map(tag => (
                                                <span key={tag} style={{
                                                    fontSize: '0.625rem',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.05em',
                                                    color: 'rgba(255,255,255,0.25)',
                                                    padding: '0.125rem 0'
                                                }}>
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
                                        <p style={{ fontSize: '0.875rem', color: '#d1d5db', lineHeight: 1.7, fontWeight: 300 }}>
                                            {paper.summary || "No summary available."}
                                        </p>
                                    </div>

                                    {/* CTA Button */}
                                    <div style={{ marginTop: 'auto' }}>
                                        <button
                                            onClick={() => onSelect(paper)}
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                borderRadius: '0.75rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                fontWeight: 700,
                                                fontSize: '0.875rem',
                                                transition: 'all 0.3s',
                                                cursor: 'pointer',
                                                border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                                background: isSelected
                                                    ? 'linear-gradient(to right, #9333ea, #db2777)'
                                                    : 'rgba(255,255,255,0.05)',
                                                color: isSelected ? '#fff' : 'rgba(255,255,255,0.8)',
                                                boxShadow: isSelected ? '0 4px 20px rgba(147,51,234,0.4)' : 'none'
                                            }}
                                        >
                                            {isSelected ? (
                                                <>
                                                    <Sparkles style={{ width: 18, height: 18 }} />
                                                    Selected for Generation
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles style={{ width: 18, height: 18 }} />
                                                    Create Post
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
