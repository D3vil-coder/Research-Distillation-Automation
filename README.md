<div align="center">

# 🤖 Research Automation

### AI-Powered Research Tracking & Social Media Content Generator

[![Next.js](https://img.shields.io/badge/Next.js-16.1-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![n8n](https://img.shields.io/badge/n8n-Workflow-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

*Automatically track cutting-edge robotics research and generate professional social media content for X, Instagram, and LinkedIn.*

[🚀 Demo](#demo) • [✨ Features](#features) • [🛠️ Installation](#installation) • [📖 Usage](#usage) • [🏗️ Architecture](#architecture)

---

</div>

## 📋 Overview

**Research Automation** is a full-stack web application that solves a common problem for researchers, tech enthusiasts, and content creators: staying up-to-date with the latest academic research while creating engaging social media content about it.

The app automatically fetches the latest robotics papers from **Arxiv**, presents them in an elegant glassmorphism UI, and uses **Google Gemini AI** to generate platform-optimized captions for **X (Twitter)**, **Instagram**, and **LinkedIn**—complete with relevant imagery.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📡 **Real-time Research Tracking** | Fetches latest robotics papers from Arxiv daily with smart caching |
| 🧠 **Multi-Platform AI Content** | Generates tailored captions for X, Instagram, and LinkedIn |
| 🎨 **Premium Glassmorphism UI** | Modern dark theme with animated gradients and blur effects |
| 📊 **API Usage Dashboard** | Track sync counts, generated posts, and system status |
| ⚡ **Smart Daily Caching** | Minimizes API calls by caching data for 24 hours |
| 🔄 **n8n Workflow Integration** | Extensible automation backend for custom workflows |
| 📱 **Responsive Design** | Works seamlessly across desktop and mobile devices |

---

## 🖼️ Screenshots

<div align="center">

| Research Dashboard | Content Generator |
|:------------------:|:-----------------:|
| Premium glass cards with full paper summaries | Multi-platform tabs with AI-generated content |

</div>

---

## �️ Installation

### Prerequisites

- **Node.js** 18.0 or higher
- **Docker Desktop** (for n8n automation server)
- **Google Gemini API Key** — [Get one free at Google AI Studio](https://aistudio.google.com/)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/research-automation.git
cd research-automation

# 2. Install dependencies
npm install

# 3. Start n8n automation server (requires Docker)
docker-compose up -d

# 4. Start the development server
npm run dev

# 5. Open http://localhost:3000
```

### n8n Configuration

1. Navigate to [http://localhost:5678](http://localhost:5678)
2. Create an account (local only)
3. **Import Workflows:**
   - `n8n/workflow_fetch_papers.json` — RSS feed processor
   - `n8n/workflow_generate_content.json` — AI content generator
4. **Add Credentials:**
   - Go to Credentials → Add Credential → Google Gemini API
   - Paste your API key
5. **Activate** both workflows

---

## 📖 Usage

### Basic Workflow

1. **View Research** — The dashboard automatically displays the latest robotics papers
2. **Select Paper** — Click "Create Post" on any paper card
3. **Generate Content** — Click "Generate Content" to create AI-powered captions
4. **Choose Platform** — Switch between X, Instagram, and LinkedIn tabs
5. **Copy & Post** — Copy the optimized caption for your platform

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/papers` | `GET` | Fetch latest robotics papers (cached daily) |
| `/api/generate` | `POST` | Generate multi-platform content for a paper |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js 16)                   │
├──────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │ StatsPanel  │  │   Paper     │  │   GenerateCard      │   │
│  │ (Dashboard) │  │  Carousel   │  │ (X/Insta/LinkedIn)  │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    API ROUTES (Next.js)                      │
│  ┌─────────────────────┐    ┌─────────────────────────────┐  │
│  │  /api/papers        │    │  /api/generate              │  │
│  │  • Daily caching    │    │  • Multi-platform captions  │  │
│  │  • Fallback data    │    │  • Image keyword extraction │  │
│  └─────────────────────┘    └─────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    n8n AUTOMATION SERVER                     │
│  ┌─────────────────────┐    ┌─────────────────────────────┐  │
│  │  Fetch Papers       │    │  Generate Content           │  │
│  │  • Arxiv RSS        │    │  • Gemini Text API          │  │
│  │  • XML Parsing      │    │  • Gemini Image API         │  │
│  └─────────────────────┘    └─────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
            ┌─────────────────┴─────────────────┐
            │                                   │
     ┌──────▼──────┐                   ┌────────▼────────┐
     │   Arxiv     │                   │  Google Gemini  │
     │   RSS API   │                   │   (AI Engine)   │
     └─────────────┘                   └─────────────────┘
```

---

## 📁 Project Structure

```
research-automation/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.js        # Multi-platform content generation
│   │   └── papers/
│   │       └── route.js        # Paper fetching with daily cache
│   ├── globals.css             # Glassmorphism design system (300+ utilities)
│   ├── layout.js               # Root layout with animated background
│   └── page.js                 # Main dashboard page
├── components/
│   ├── GenerateCard.js         # Multi-tab content generator (X/Insta/LinkedIn)
│   ├── PaperCarousel.js        # Horizontal scrolling paper cards
│   └── StatsPanel.js           # API usage statistics dashboard
├── n8n/
│   ├── workflow_fetch_papers.json      # Arxiv RSS workflow
│   └── workflow_generate_content.json  # Gemini AI workflow
├── docker-compose.yml          # n8n container configuration
├── package.json
└── README.md
```

---

## 🎨 Design System

The application features a custom **Glassmorphism** design system including:

- **Animated Gradient Blobs** — Ambient purple/cyan/pink background animation
- **Frosted Glass Cards** — `backdrop-filter: blur(24px)` with subtle borders
- **Premium Typography** — Inter font with gradient text effects
- **Micro-interactions** — Smooth hover states and transitions
- **Dark Theme** — Optimized for reduced eye strain

---

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```bash
# Build and run with Docker
docker build -t research-automation .
docker run -p 3000:3000 research-automation
```


## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.



