'use client';
import { useEffect, useState } from 'react';
import GenerateCard from '@/components/GenerateCard';
import PaperCarousel from '@/components/PaperCarousel';
import StatsPanel from '@/components/StatsPanel';
import { RotateCw, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';

export default function Home() {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [feedError, setFeedError] = useState('');

    useEffect(() => {
        const cachedDate = localStorage.getItem('lastFetchDate');
        const today = new Date().toISOString().split('T')[0];

        if (cachedDate === today) {
            setLastUpdated(today);
        }
        fetchPapers();
    }, []);

    const fetchPapers = async (refresh = false) => {
        setLoading(true);
        setFeedError('');
        try {
            const res = await fetch(refresh ? '/api/papers?refresh=true' : '/api/papers');
            const data = await res.json();
            if (!res.ok || !Array.isArray(data)) {
                throw new Error(data.error || 'Research feed returned an invalid response.');
            }
            if (Array.isArray(data)) {
                setPapers(data);
                const today = new Date().toISOString().split('T')[0];
                localStorage.setItem('lastFetchDate', today);
                setLastUpdated(today);

                // Update stats in localStorage directly
                const statsRaw = localStorage.getItem('researchAutomationStats');
                const stats = statsRaw ? JSON.parse(statsRaw) : { papersLoaded: 0, contentGenerated: 0 };
                stats.papersLoaded = (stats.papersLoaded || 0) + 1;
                stats.lastSync = new Date().toISOString();
                localStorage.setItem('researchAutomationStats', JSON.stringify(stats));

                // Trigger re-render of StatsPanel
                window.dispatchEvent(new Event('statsUpdated'));
            }
        } catch (err) {
            console.error("Failed to fetch papers", err);
            setPapers([]);
            setSelectedPaper(null);
            setLastUpdated(null);
            localStorage.removeItem('lastFetchDate');
            setFeedError(err.message || 'Research feed unavailable. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = () => {
        localStorage.removeItem('lastFetchDate');
        fetchPapers(true);
    };

    const handleSelectPaper = (paper) => {
        setSelectedPaper(paper);
        setTimeout(() => {
            document.getElementById('generator-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minHeight: '100vh' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '1rem' }}>
                    <span className="text-gradient">Research</span>
                    <span className="text-gradient-purple" style={{ marginLeft: '1rem' }}>Automation</span>
                </h1>

                {/* Status Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)'
                }}>
                    {loading ? (
                        <span style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7 }}>
                            <RotateCw style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Syncing...
                        </span>
                    ) : feedError ? (
                        <span role="status" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5' }}>
                            <AlertTriangle style={{ width: 16, height: 16 }} /> Feed unavailable
                        </span>
                    ) : (
                        <span style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80' }}>
                            <CheckCircle style={{ width: 16, height: 16 }} />
                            {lastUpdated === new Date().toISOString().split('T')[0] ? "Synced Today" : "Outdated"}
                        </span>
                    )}

                    <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }}></div>

                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: loading ? 'rgba(255,255,255,0.3)' : '#c084fc',
                            background: 'rgba(168,85,247,0.1)',
                            border: '1px solid rgba(168,85,247,0.3)',
                            borderRadius: '9999px',
                            padding: '0.375rem 0.75rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <RefreshCw style={{ width: 12, height: 12 }} />
                        {loading ? 'Updating...' : 'Refresh'}
                    </button>
                </div>
            </header>

            {feedError && <p role="alert" style={{ color: '#fca5a5', textAlign: 'center' }}>{feedError}</p>}
            <StatsPanel />

            <PaperCarousel
                papers={papers}
                onSelect={handleSelectPaper}
                selectedPaper={selectedPaper}
            />

            <div id="generator-section" style={{ width: '100%', height: 1, background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.2), transparent)', margin: '4rem 0' }}></div>

            <GenerateCard selectedPaper={selectedPaper} />
        </div>
    );
}
