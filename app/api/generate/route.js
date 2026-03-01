import { NextResponse } from 'next/server';

export async function POST(req) {
    let title = "Untitled Research";
    let abstract = "No abstract provided.";

    try {
        const body = await req.json();
        title = body.title || title;
        abstract = body.abstract || abstract;
    } catch (parseError) {
        console.warn("Could not parse request body:", parseError.message);
    }

    // 1. Premium Prompt Engineering
    const stopWords = ['using', 'based', 'towards', 'learning', 'through', 'with', 'from', 'into', 'real', 'time', 'novel', 'approach', 'the', 'and', 'for', 'via', 'autonomous', 'robotic'];
    const keywords = title.toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(' ')
        .filter(w => w.length > 3 && !stopWords.includes(w))
        .slice(0, 3);

    const mainTopic = keywords.join(' ') || 'robotics technology';

    const premiumPrompt = `Hyperrealistic 3D render of futuristic ${mainTopic} concept, sleek minimalist glassmorphism design, volumetric purple and cyan neon lighting, floating holographic UI elements, dark gradient background, octane render quality, 8K resolution, photorealistic, ultra-modern tech startup aesthetic, soft ambient occlusion, cinematic composition, trending on Behance and Dribbble, no text no watermarks`;
    const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(premiumPrompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

    try {
        // 2. Try fetching captions from n8n (Gemini)
        const n8nRes = await fetch('http://localhost:5678/webhook/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, abstract }),
            signal: AbortSignal.timeout(6000)
        });

        if (n8nRes.ok) {
            const data = await n8nRes.json();
            // Use n8n captions but override image with our premium Pollinations URL for reliability
            return NextResponse.json({
                ...data,
                imageUrl, // Use our high-quality direct URL
                imagePrompt: premiumPrompt
            });
        }
    } catch (e) {
        console.warn("[Generate API] n8n failed or timed out, using fallback captions.");
    }

    // 3. Fallback Captions (Internal Gemini or Static if everything fails)
    // FULL captions (No truncation)
    const xCaption = `🔬 Breakthrough: ${title}\n\nThis research represents a significant leap forward in ${mainTopic}. The implications for autonomous systems and human-robot collaboration are substantial.\n\n#Robotics #AI #Innovation #${keywords[0] || 'Tech'}`;

    const instaCaption = `🚀 CUTTING-EDGE RESEARCH SPOTLIGHT 🚀\n\n📄 "${title}"\n\n💡 WHY THIS MATTERS:\nThis advances our understanding of ${mainTopic} and could impact how we build future systems.\n\n🔬 THE IMPACT:\nThe techniques developed here could reshape current standards in engineering and AI.\n\n🔗 Link in bio\n\n#Robotics #ArtificialIntelligence #Innovation #ScienceTech #TechNews #${keywords[0] || 'Research'}`;

    const linkedinCaption = `🤖 Research Worth Reading\n\nI was impressed by this recent paper: "${title}"\n\nWhat makes this significant isn't just the technical achievement, but the practical approach to a long-standing challenge in ${mainTopic}.\n\nKey Insights:\n• Novel algorithmic framework\n• Rigorous field validation\n• Clear industrial applications\n\nWhat's your take on these findings? #Robotics #AI #TechLeadership #Innovation #Engineering`;

    return NextResponse.json({
        xCaption,
        instaCaption,
        linkedinCaption,
        caption: instaCaption,
        imageUrl,
        imageKeywords: mainTopic,
        imagePrompt: premiumPrompt
    });
}
