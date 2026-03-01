'use client';
import { useState, useEffect } from 'react';
import { Activity, Image, FileText, Clock, Zap } from 'lucide-react';

export default function StatsPanel() {
    const [stats, setStats] = useState({
        papersLoaded: 0,
        contentGenerated: 0,
        lastSync: null
    });

    const loadStats = () => {
        const saved = localStorage.getItem('researchAutomationStats');
        if (saved) {
            setStats(JSON.parse(saved));
        }
    };

    useEffect(() => {
        loadStats();

        // Listen for stats updates
        const handleUpdate = () => loadStats();
        window.addEventListener('statsUpdated', handleUpdate);

        return () => window.removeEventListener('statsUpdated', handleUpdate);
    }, []);

    // Also expose update function globally
    useEffect(() => {
        window.updateStats = (type) => {
            const statsRaw = localStorage.getItem('researchAutomationStats');
            const current = statsRaw ? JSON.parse(statsRaw) : { papersLoaded: 0, contentGenerated: 0 };

            if (type === 'generate') {
                current.contentGenerated = (current.contentGenerated || 0) + 1;
            }

            localStorage.setItem('researchAutomationStats', JSON.stringify(current));
            setStats(current);
        };
    }, []);

    const formatLastSync = () => {
        if (!stats.lastSync) return 'Never';
        const date = new Date(stats.lastSync);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div style={{ width: '100%', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Activity style={{ width: 20, height: 20, color: '#c084fc' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>API Dashboard</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(6,182,212,0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <FileText style={{ width: 20, height: 20, color: '#22d3ee' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.papersLoaded || 0}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Syncs</div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(168,85,247,0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <Image style={{ width: 20, height: 20, color: '#c084fc' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.contentGenerated || 0}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Generated</div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(34,197,94,0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <Clock style={{ width: 20, height: 20, color: '#4ade80' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1rem', fontWeight: 700 }}>{formatLastSync()}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Last Sync</div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(250,204,21,0.2)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <Zap style={{ width: 20, height: 20, color: '#facc15' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#4ade80' }}>Online</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Status</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
