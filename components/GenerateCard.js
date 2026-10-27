'use client';
import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Instagram, Copy, RefreshCw, Twitter, Linkedin, AlertTriangle, Check, FileText } from 'lucide-react';

export default function GenerateCard({ selectedPaper }) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState('instagram');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [generationError, setGenerationError] = useState('');

    useEffect(() => {
        setResult(null);
        setImageLoaded(false);
        setImageError(false);
        setGenerationError('');
    }, [selectedPaper]);

    const handleGenerate = async () => {
        if (!selectedPaper) return;

        setLoading(true);
        setGenerationError('');
        setResult(null);
        setImageLoaded(false);
        setImageError(false);

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: selectedPaper.title,
                    abstract: selectedPaper.summary
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Caption generation failed.');
            setResult(data);

            if (typeof window !== 'undefined' && window.updateStats) {
                window.updateStats('generate');
            }
        } catch (e) {
            console.error(e);
            setGenerationError(e.message || 'Caption generation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyCaption = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getCurrentCaption = () => {
        if (!result) return '';
        switch (activeTab) {
            case 'x': return result.xCaption || result.caption;
            case 'instagram': return result.instaCaption || result.caption;
            case 'linkedin': return result.linkedinCaption || result.caption;
            default: return result.caption;
        }
    };

    const tabConfig = [
        { key: 'x', icon: Twitter, label: 'X', color: '#1DA1F2' },
        { key: 'instagram', icon: Instagram, label: 'Instagram', color: '#E4405F' },
        { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: '#0A66C2' }
    ];

    if (!selectedPaper) {
        return (
            <div className="glass-card" style={{
                width: '100%',
                padding: '3rem',
                textAlign: 'center',
                borderStyle: 'dashed',
                borderWidth: '2px',
                borderColor: 'rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.7
            }}>
                <div style={{ background: 'rgba(168,85,247,0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                    <Sparkles style={{ width: 32, height: 32, color: '#c084fc' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Ready to amplify?</h3>
                <p style={{ maxWidth: '24rem', margin: '0 auto', opacity: 0.6, lineHeight: 1.6 }}>
                    Select a research paper from above to generate a premium social media toolkit.
                </p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', marginBottom: '6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 className="text-gradient-purple" style={{ fontSize: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Sparkles style={{ width: 32, height: 32 }} />
                    Content Studio
                </h2>
                <div style={{
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    background: 'rgba(168,85,247,0.1)',
                    border: '1px solid rgba(168,85,247,0.2)',
                    color: '#d8b4fe'
                }}>
                    <FileText style={{ width: 14, height: 14 }} />
                    <span>{selectedPaper.title.substring(0, 40)}...</span>
                </div>
            </div>

            {!result ? (
                <div className="glass-card" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(6,182,212,0.2))',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                        transform: 'rotate(-5deg)',
                        boxShadow: '0 0 30px rgba(168,85,247,0.3)'
                    }}>
                        <Sparkles style={{ width: 40, height: 40, color: '#c084fc' }} />
                    </div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Transform Research into Content</h3>
                    <p style={{ opacity: 0.6, maxWidth: '32rem', marginBottom: '2.5rem', lineHeight: 1.7, fontSize: '1.1rem' }}>
                        Generate high-engagement captions and a bespoke AI render designed for platform-specific reach.
                    </p>
                    {generationError && <p role="alert" style={{ color: '#fca5a5', marginBottom: '1rem' }}>{generationError}</p>}

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="glass-btn glass-btn-primary"
                        style={{ fontSize: '1.125rem', padding: '1.25rem 3rem', opacity: loading ? 0.7 : 1, minWidth: '280px' }}
                    >
                        {loading ? (
                            <>
                                <Loader2 style={{ width: 22, height: 22, animation: 'spin 1.s linear infinite' }} />
                                AI is crafting your posts...
                            </>
                        ) : (
                            <>
                                <Sparkles style={{ width: 22, height: 22 }} />
                                Generate Social Pack
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {/* AI Render Section */}
                    <div style={{
                        width: '100%',
                        aspectRatio: '16 / 9',
                        position: 'relative',
                        background: 'linear-gradient(135deg, #090912 0%, #1a1a2e 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        {result.imageUrl && !imageError ? (
                            <>
                                <img
                                    src={result.imageUrl}
                                    alt="AI Generated Visual"
                                    onLoad={() => setImageLoaded(true)}
                                    onError={() => setImageError(true)}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        opacity: imageLoaded ? 1 : 0,
                                        transition: 'opacity 0.8s ease'
                                    }}
                                />
                                {!imageLoaded && (
                                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ position: 'relative' }}>
                                            <Loader2 style={{ width: 48, height: 48, animation: 'spin 2s linear infinite', color: '#c084fc' }} />
                                            <Sparkles style={{ position: 'absolute', top: -5, right: -5, width: 20, height: 20, color: '#22d3ee', animation: 'pulse 1.5s infinite' }} />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>Generating AI Render...</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem' }}>
                                <AlertTriangle style={{ width: 40, height: 40, color: '#facc15', marginBottom: '1rem' }} />
                                <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Visual generation in progress. Click regenerate if it fails.</p>
                            </div>
                        )}

                        {/* Visual Tag */}
                        <div style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: 'rgba(255,255,255,0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <Sparkles style={{ width: 12, height: 12, color: '#c084fc' }} />
                            AI Synthesized
                        </div>
                    </div>

                    {/* Platform Navigation */}
                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {tabConfig.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    flex: 1,
                                    padding: '1.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    background: activeTab === tab.key ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    borderWidth: 0,
                                    borderBottom: `3px solid ${activeTab === tab.key ? tab.color : 'transparent'}`,
                                    color: activeTab === tab.key ? '#fff' : 'rgba(255,255,255,0.4)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 700
                                }}
                            >
                                <tab.icon style={{ width: 18, height: 18, color: activeTab === tab.key ? tab.color : 'inherit' }} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Caption Engine */}
                    <div style={{ padding: '2rem' }}>
                        <p style={{ color: '#fcd34d', marginBottom: '1rem' }}>
                            Draft generated from a shortened abstract. Verify its claims against the original paper before sharing.
                        </p>
                        <div
                            className="custom-scrollbar"
                            style={{
                                background: 'rgba(0,0,0,0.25)',
                                padding: '2rem',
                                borderRadius: '1.25rem',
                                minHeight: '300px',
                                maxHeight: '400px',
                                fontFamily: 'system-ui, -apple-system, sans-serif',
                                fontSize: '0.95rem',
                                whiteSpace: 'pre-wrap',
                                overflowY: 'auto',
                                border: '1px solid rgba(255,255,255,0.05)',
                                lineHeight: 1.8,
                                color: 'rgba(255,255,255,0.9)',
                                boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.4)'
                            }}
                        >
                            {getCurrentCaption()}
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
                            <button
                                onClick={() => copyCaption(getCurrentCaption())}
                                className="glass-btn"
                                style={{
                                    flex: 1.5,
                                    padding: '1.25rem',
                                    background: copied ? 'rgba(34,197,94,0.15)' : undefined,
                                    borderColor: copied ? 'rgba(34,197,94,0.4)' : undefined
                                }}
                            >
                                {copied ? (
                                    <>
                                        <Check style={{ width: 20, height: 20, color: '#4ade80' }} />
                                        Text Secured
                                    </>
                                ) : (
                                    <>
                                        <Copy style={{ width: 20, height: 20 }} />
                                        Copy Content
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => { setResult(null); setImageLoaded(false); setImageError(false); setCopied(false); }}
                                className="glass-btn"
                                style={{ flex: 1, padding: '1.25rem' }}
                            >
                                <RefreshCw style={{ width: 20, height: 20 }} />
                                Refine AI
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Aesthetic Scrollbar Style Injection */}
            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
          margin: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #a855f7 0%, #06b6d4 100%);
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #c084fc 0%, #22d3ee 100%);
        }
      `}</style>
        </div>
    );
}
