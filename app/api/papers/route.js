import { NextResponse } from 'next/server';

// In-memory cache for current session
let cachedPapers = null;
let cacheDate = null;

// Archive management
function getArchivedPapers() {
    if (typeof global.archivedPapers === 'undefined') {
        global.archivedPapers = [];
    }
    return global.archivedPapers;
}

function archiveOldPapers(papers) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const archived = getArchivedPapers();
    const currentPapers = [];

    for (const paper of papers) {
        const paperDate = paper.date ? new Date(paper.date) : new Date();
        if (paperDate < oneWeekAgo) {
            // Move to archive if not already there
            const exists = archived.some(p => p.link === paper.link);
            if (!exists) {
                archived.push({ ...paper, archivedAt: new Date().toISOString() });
            }
        } else {
            currentPapers.push(paper);
        }
    }

    // Keep only last 50 archived papers to prevent memory bloat
    global.archivedPapers = archived.slice(-50);

    return currentPapers;
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';
    const showArchive = searchParams.get('archive') === 'true';

    // Return archived papers if requested
    if (showArchive) {
        return NextResponse.json({
            type: 'archive',
            papers: getArchivedPapers(),
            count: getArchivedPapers().length
        });
    }

    const today = new Date().toISOString().split('T')[0];

    // Return cached data if fetched today (unless forced refresh)
    if (cachedPapers && cacheDate === today && !forceRefresh) {
        console.log("[Papers API] Returning cached papers (fetched today)");
        return NextResponse.json(cachedPapers);
    }

    console.log(`[Papers API] Fetching fresh papers... (force=${forceRefresh})`);

    try {
        const res = await fetch('http://localhost:5678/webhook/papers', {
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
            throw new Error(`n8n responded with ${res.status}`);
        }

        let data = await res.json();
        if (!Array.isArray(data)) {
            throw new Error('Unexpected response from papers workflow');
        }

        // Archive papers older than 1 week
        data = archiveOldPapers(data);

        // Update cache
        cachedPapers = data;
        cacheDate = today;

        return NextResponse.json(data);
    } catch (error) {
        console.error("[Papers API] Research feed unavailable:", error.message);
        return NextResponse.json(
            { error: "Research feed unavailable. Check the n8n papers workflow and try again." },
            { status: 503 }
        );
    }
}
