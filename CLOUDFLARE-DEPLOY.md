# Deploying LulaLens to Cloudflare Pages

## Option 1: Deploy via Cloudflare Dashboard (Easiest)

### Step 1: Upload to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account → **Workers & Pages**
3. Click **Create application** → **Pages** → **Upload assets**
4. Project name: `lulalens`
5. Upload the entire **dist** folder (drag and drop or browse)
6. Click **Deploy site**

### Step 2: Add Custom Domain

1. After deployment, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `lulalens.oneluckywave.co.za`
4. Click **Continue**
5. Cloudflare will automatically create the DNS record

Done! Your site will be live at `https://lulalens.oneluckywave.co.za`

---

## Option 2: Deploy via Git (Recommended for Updates)

### Step 1: Push to GitHub/GitLab

If you don't have a repo yet:

```powershell
cd C:\Projects\LulaLens
git init
git add .
git commit -m "Initial commit - LulaLens"
# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/lulalens.git
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages

1. Go to Cloudflare Dashboard → **Workers & Pages**
2. Click **Create application** → **Pages** → **Connect to Git**
3. Select your repository: `lulalens`
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (leave default)
5. Click **Save and Deploy**

### Step 3: Add Custom Domain
Same as Option 1, step 2

---

## Option 3: Deploy via Wrangler CLI

### Install Wrangler

```powershell
npm install -g wrangler
```

### Login to Cloudflare

```powershell
wrangler login
```

### Deploy

```powershell
cd C:\Projects\LulaLens
wrangler pages deploy dist --project-name=lulalens
```

### Add custom domain via dashboard after first deploy

---

## DNS Setup (Automatic with Cloudflare Pages)

When you add the custom domain `lulalens.oneluckywave.co.za`, Cloudflare automatically:
- Creates a CNAME record pointing to your Pages deployment
- Issues free SSL certificate
- Enables CDN caching
- Sets up automatic HTTPS redirects

---

## Quick Deploy Script (PowerShell)

Save as `deploy-cloudflare.ps1`:

```powershell
# Build the app
Write-Host "Building LulaLens..." -ForegroundColor Green
npm run build

# Check if wrangler is installed
$wranglerInstalled = Get-Command wrangler -ErrorAction SilentlyContinue

if ($wranglerInstalled) {
    Write-Host "Deploying to Cloudflare Pages..." -ForegroundColor Green
    wrangler pages deploy dist --project-name=lulalens
} else {
    Write-Host "Build complete!" -ForegroundColor Green
    Write-Host "Upload the 'dist' folder to Cloudflare Pages dashboard" -ForegroundColor Yellow
    Write-Host "https://dash.cloudflare.com/" -ForegroundColor Cyan
    
    # Open dist folder
    Invoke-Item dist
}
```

Run: `.\deploy-cloudflare.ps1`

---

## After Deployment

Your app will be available at:
- **Primary:** `https://lulalens.oneluckywave.co.za`
- **Cloudflare subdomain:** `https://lulalens.pages.dev`

### Benefits of Cloudflare Pages:
- ✅ Free SSL certificate (HTTPS)
- ✅ Global CDN (fast worldwide)
- ✅ Unlimited bandwidth
- ✅ Automatic deployments from Git
- ✅ Free hosting (500 builds/month)
- ✅ Preview deployments for branches

---

## Need Help?

**Recommended approach for you:**
1. Use **Option 1** (Dashboard upload) for quick first deployment
2. Takes 2-3 minutes total
3. Then set up Git integration later if you want automatic updates

Let me know if you need help with any step!
