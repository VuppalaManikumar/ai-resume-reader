#!/bin/bash
# AI Resume Reader - Quick Setup & Push Script

echo "🤖 AI Resume Reader - Setup Script"
echo "===================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "📦 Initializing git repository..."
  git init
  git branch -M main
fi

# Check for API key
if grep -q "your_anthropic_api_key_here" .env.local 2>/dev/null; then
  echo ""
  echo "⚠️  ACTION REQUIRED: Add your Anthropic API key to .env.local"
  echo "   Get your key at: https://console.anthropic.com/"
  echo ""
fi

echo "📥 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local — add your ANTHROPIC_API_KEY"
echo "  2. Run: npm run dev  (test locally at http://localhost:3000)"
echo "  3. Push to GitHub:"
echo "     git add ."
echo '     git commit -m "Initial commit: AI Resume Reader"'
echo "     git remote add origin https://github.com/YOUR_USERNAME/ai-resume-reader.git"
echo "     git push -u origin main"
echo "  4. Deploy to Vercel:"
echo "     - Go to vercel.com → New Project → Import GitHub repo"
echo "     - Add env var: ANTHROPIC_API_KEY"
echo "     - Click Deploy!"
echo ""
