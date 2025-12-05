#!/bin/bash
set -e

echo "🔨 Building for GitHub Pages..."
pnpm run predeploy

echo "📦 Preparing gh-pages branch..."
git checkout --orphan gh-pages 2>/dev/null || git checkout gh-pages
git rm -rf . 2>/dev/null || true

echo "📂 Copying dist-advanced files..."
cp -r dist-advanced/* .
cp dist-advanced/.gitignore . 2>/dev/null || true

echo "📝 Committing..."
git add .
git commit -m "Deploy advanced version" || echo "No changes to commit"

echo "🚀 Pushing to gh-pages..."
git push origin gh-pages --force

echo "✅ Deployment complete!"
echo "Returning to main branch..."
git checkout main

echo "🌐 Site will be available at: https://naringst.github.io/front_7th_chapter3-2/"
