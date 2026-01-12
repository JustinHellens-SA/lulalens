# Quick Cloudflare Pages Deploy Script
# Run: .\deploy-cloudflare.ps1

Write-Host "`n🔍 LulaLens - Cloudflare Pages Deployment`n" -ForegroundColor Cyan

# Build the app
Write-Host "📦 Building production version..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build complete!`n" -ForegroundColor Green

# Check if wrangler is installed
$wranglerInstalled = Get-Command wrangler -ErrorAction SilentlyContinue

if ($wranglerInstalled) {
    Write-Host "🚀 Deploying to Cloudflare Pages..." -ForegroundColor Green
    wrangler pages deploy dist --project-name=lulalens
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
        Write-Host "🌐 Your app is live!" -ForegroundColor Cyan
        Write-Host "   Primary: https://lulalens.oneluckywave.co.za" -ForegroundColor Yellow
        Write-Host "   Pages: https://lulalens.pages.dev" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  Wrangler CLI not found." -ForegroundColor Yellow
    Write-Host "`n📤 Manual upload options:" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://dash.cloudflare.com/" -ForegroundColor White
    Write-Host "   2. Workers & Pages → Create → Upload assets" -ForegroundColor White
    Write-Host "   3. Upload the 'dist' folder" -ForegroundColor White
    Write-Host "   4. Project name: lulalens" -ForegroundColor White
    Write-Host "   5. Deploy!" -ForegroundColor White
    
    Write-Host "`n🔧 Or install Wrangler CLI:" -ForegroundColor Cyan
    Write-Host "   npm install -g wrangler" -ForegroundColor White
    
    Write-Host "`n📁 Opening dist folder..." -ForegroundColor Green
    Invoke-Item dist
}

Write-Host "`n✨ Done!`n" -ForegroundColor Green
