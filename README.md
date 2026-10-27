# Research Distillation Automation

A Next.js dashboard for browsing recent robotics research and drafting social media captions. The application calls n8n workflows for arXiv paper metadata and Gemini-generated captions for X, Instagram and LinkedIn. A generated image URL is constructed using Pollinations. The interface provides a copy action; it does not publish posts to social networks.

## How it works

```text
Dashboard -> /api/papers -> n8n papers webhook -> arXiv cs.RO feed
          -> /api/generate -> n8n generation webhook -> Gemini captions
                           -> Pollinations image URL
```

The papers workflow requests up to eight recently updated `cs.RO` entries. Its formatting node shortens the feed summary to 300 characters. The generation workflow sends the selected title and summary in a single prompt to Gemini for platform-specific captions. The Next.js generation route constructs its own image URL from title keywords and overrides the URL returned by n8n.

Paper data and the small archive are held in server process memory. The paper cache is keyed to the current UTC calendar day and can be refreshed; it is not a persistent database. Workflows are triggered by HTTP requests from the application, not by an included daily scheduled job. Usage counters in the dashboard are browser-local.

## Important limitations

- **Fallback papers are example data, not verified research.** If the papers webhook fails, the server returns hard-coded fallback titles, descriptions and links without identifying them in the response as examples. The date-based archive filter may leave no current papers. Do not share them as actual research; check every title and link against arXiv.
- **Generated text requires review.** If the generation webhook fails or exceeds the six-second timeout, the API returns generic prewritten captions. These can contain claims about validation or impact that do not come from the paper, and the response does not identify them as a fallback. Even a successful Gemini response may be inaccurate. Read the original paper and verify every claim before publishing.
- **Image generation is an external service.** The app returns a Pollinations image URL, rather than using a Gemini image model. The title-derived prompt is sent to the image service when the image is requested. Availability and output are not guaranteed.
- The paper summaries supplied to the caption prompt are shortened, not full-paper analysis. There is no evaluation of summary or claim accuracy in this repository.
- The API routes connect to `http://localhost:5678`; this assumes the Next.js process and n8n are accessible at that address on the same host. Deployments with separate containers or hosts need networking and URL changes.
- The Compose file uses `n8nio/n8n:latest` without a pinned version, and the generation workflow contains a placeholder credential reference. Configure credentials after import. The complete setup and live arXiv/Gemini/Pollinations workflow have not been independently reproduced for this README.

## Intended local setup

The following steps reflect the files in this repository; a clean end-to-end run has not been verified. You need Git, Node.js 20.9 or newer (the minimum declared by the locked Next.js version), npm, Docker with Compose, and a Gemini credential for generated captions.

```bash
git clone https://github.com/D3vil-coder/Research-Distillation-Automation.git
cd Research-Distillation-Automation
npm ci
docker compose up -d
npm run dev
```

Open the app at `http://localhost:3000` and n8n at `http://localhost:5678`. In n8n, import [`workflow_fetch_papers.json`](n8n/workflow_fetch_papers.json) and [`workflow_generate_content.json`](n8n/workflow_generate_content.json), configure the Gemini credential on the generation node, and activate both workflows so their production webhooks can receive requests. Compatibility of the unpinned n8n image with these exported nodes and current Gemini credentials has not been checked.

Starting the app without working n8n webhooks can show fallback data or generic captions as described above. `npm run build`, `npm start`, and `npm run lint` are defined in [`package.json`](package.json). The Compose configuration runs n8n only; this repository has no application Dockerfile.

## Repository guide

| Path | Purpose |
| --- | --- |
| [`app/page.js`](app/page.js) and [`components/`](components) | Dashboard, paper cards and caption interface |
| [`app/api/papers/route.js`](app/api/papers/route.js) | Paper webhook, in-memory cache and fallback data |
| [`app/api/generate/route.js`](app/api/generate/route.js) | Caption webhook, fallback text and image URL |
| [`n8n/`](n8n) | Exported papers and generation workflows |
| [`docker-compose.yml`](docker-compose.yml) | Local n8n service and persistent volume |

## Next improvements

Replace unlabeled fabricated fallbacks with explicit error states, validate paper links and generated claims, pin and test the n8n version and credentials setup, make service URLs configurable, and add a reproducible end-to-end test with a known paper.

## License

[MIT](LICENSE)

