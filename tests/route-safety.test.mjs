import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function loadRoute(path) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    const shim = "const NextResponse = { json: (body, init = {}) => Response.json(body, init) };";
    const executable = source.replace("import { NextResponse } from 'next/server';", shim);
    return import(`data:text/javascript;base64,${Buffer.from(executable).toString('base64')}`);
}

test('paper route returns real data, and errors without fabricated fallback data', async () => {
    const oldFetch = globalThis.fetch;
    const { GET } = await loadRoute('../app/api/papers/route.js');
    try {
        globalThis.fetch = async () => { throw new Error('offline'); };
        let response = await GET(new Request('http://example.test/api/papers?refresh=true'));
        assert.equal(response.status, 503);
        assert.match((await response.json()).error, /feed unavailable/i);

        const paper = { title: 'Known paper', summary: 'A summary', link: 'https://arxiv.org/abs/1234.56789', date: new Date().toISOString() };
        globalThis.fetch = async () => Response.json([paper]);
        response = await GET(new Request('http://example.test/api/papers?refresh=true'));
        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), [paper]);

        globalThis.fetch = async () => Response.json({ message: 'unexpected shape' });
        response = await GET(new Request('http://example.test/api/papers?refresh=true'));
        assert.equal(response.status, 503);
        const failed = await response.json();
        assert.match(failed.error, /feed unavailable/i);
        assert.equal(failed.papers, undefined);
    } finally {
        globalThis.fetch = oldFetch;
    }
});

test('generation route rejects missing input and upstream failures instead of invented captions', async () => {
    const oldFetch = globalThis.fetch;
    const { POST } = await loadRoute('../app/api/generate/route.js');
    const request = body => new Request('http://example.test/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    try {
        let calls = 0;
        globalThis.fetch = async () => { calls++; throw new Error('offline'); };
        let response = await POST(request({ title: 'Example' }));
        assert.equal(response.status, 400);
        assert.equal(calls, 0);

        response = await POST(request({ title: 'Example', abstract: 'Paper summary' }));
        assert.equal(response.status, 503);
        let data = await response.json();
        assert.match(data.error, /generation is unavailable/i);
        assert.equal(data.linkedinCaption, undefined);

        globalThis.fetch = async () => Response.json({ xCaption: 'partial' });
        response = await POST(request({ title: 'Example', abstract: 'Paper summary' }));
        assert.equal(response.status, 503);

        const captions = { xCaption: 'X', instaCaption: 'Instagram', linkedinCaption: 'LinkedIn' };
        globalThis.fetch = async (_url, options) => {
            assert.deepEqual(JSON.parse(options.body), { title: 'Example', abstract: 'Paper summary' });
            return Response.json(captions);
        };
        response = await POST(request({ title: 'Example', abstract: 'Paper summary' }));
        assert.equal(response.status, 200);
        data = await response.json();
        assert.equal(data.linkedinCaption, 'LinkedIn');
        assert.match(data.imageUrl, /^https:\/\/gen\.pollinations\.ai\/image\//);
    } finally {
        globalThis.fetch = oldFetch;
    }
});
