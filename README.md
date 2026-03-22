# 🤖 AI Resume Reader

An intelligent resume analysis tool powered by Claude AI. Upload your resume to get instant skill extraction, ATS compatibility scoring, and job match analysis.

## ✨ Features

- **📄 PDF/TXT Parsing** — Extract text from uploaded resumes automatically
- **🧠 AI Skill Extraction** — Identifies technical skills, tools, soft skills, and languages
- **🛡️ ATS Compatibility Checker** — Scores your resume for Applicant Tracking Systems with actionable fixes
- **📊 Job Match Scoring** — Paste a job description to see how well your resume matches
- **📈 Overall Resume Score** — Comprehensive scoring with strengths & weaknesses

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-reader.git
cd ai-resume-reader
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get your API key at: https://console.anthropic.com/

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

### Option A: One-click deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ai-resume-reader)

### Option B: CLI deploy
```bash
npm install -g vercel
vercel
```

### Option C: GitHub + Vercel (Recommended)
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repository
4. Add environment variable: `ANTHROPIC_API_KEY`
5. Click **Deploy**

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | ✅ Yes |

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: Claude claude-sonnet-4-20250514 via Anthropic SDK
- **PDF Parsing**: pdf-parse
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📁 Project Structure

```
ai-resume-reader/
├── src/
│   └── app/
│       ├── api/
│       │   └── analyze/
│       │       └── route.ts      # AI analysis API endpoint
│       ├── globals.css            # Global styles
│       ├── layout.tsx             # Root layout
│       └── page.tsx               # Main UI
├── .env.example                   # Environment template
├── next.config.js                 # Next.js config
├── vercel.json                    # Vercel deployment config
└── package.json
```

## 📝 License

MIT
