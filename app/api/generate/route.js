import { NextResponse } from 'next/server';

export async function POST(req) {
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Provide a paper title and abstract.' }, { status: 400 });
    }

    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const abstract = typeof body?.abstract === 'string' ? body.abstract.trim() : '';
    if (!title || !abstract) {
        return NextResponse.json({ error: 'Provide a paper title and abstract.' }, { status: 400 });
    }

    try {
        const n8nRes = await fetch('http://localhost:5678/webhook/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, abstract }),
            signal: AbortSignal.timeout(6000)
        });
        if (!n8nRes.ok) throw new Error(`n8n responded with ${n8nRes.status}`);

        const data = await n8nRes.json();
        if (!['xCaption', 'instaCaption', 'linkedinCaption'].every(
            key => typeof data?.[key] === 'string' && data[key].trim()
        )) {
            throw new Error('Generation workflow returned incomplete captions');
        }

        const stopWords = ['using', 'based', 'towards', 'learning', 'through', 'with', 'from', 'into', 'real', 'time', 'novel', 'approach', 'the', 'and', 'for', 'via', 'autonomous', 'robotic'];
        const keywords = title.toLowerCase().replace(/[^a-z\s]/g, '').split(' ')
            .filter(word => word.length > 3 && !stopWords.includes(word)).slice(0, 3);
        const mainTopic = keywords.join(' ') || 'robotics technology';
        const imagePrompt = `Hyperrealistic 3D render of futuristic ${mainTopic} concept, sleek minimalist glassmorphism design, volumetric purple and cyan neon lighting, floating holographic UI elements, dark gradient background, octane render quality, 8K resolution, photorealistic, ultra-modern tech startup aesthetic, soft ambient occlusion, cinematic composition, trending on Behance and Dribbble, no text no watermarks`;
        const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(imagePrompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
        return NextResponse.json({ ...data, imageUrl, imagePrompt });
    } catch (error) {
        console.error('[Generate API] Generation unavailable:', error.message);
        return NextResponse.json(
            { error: 'Caption generation is unavailable. Check the n8n generation workflow and try again.' },
            { status: 503 }
        );
    }
}
