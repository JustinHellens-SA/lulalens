# Deploying LulaLens to lulalens.oneluckywave.co.za

## Step 1: Build for Production

Run this command to create the production build:

```powershell
npm run build
```

This creates a `dist` folder with all optimized files.

## Step 2: Server Setup Options

### Option A: Using IIS (Windows Server)

1. **Install IIS URL Rewrite Module**
   - Download from: https://www.iis.net/downloads/microsoft/url-rewrite

2. **Create web.config in dist folder:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
      <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
    </staticContent>
  </system.webServer>
</configuration>
```

3. **Configure IIS Site:**
   - Open IIS Manager
   - Create new site or use existing
   - Set Physical path to: `C:\Projects\LulaLens\dist`
   - Set Bindings:
     - Type: http
     - Host name: lulalens.oneluckywave.co.za
     - Port: 80
   - Add HTTPS binding if you have SSL certificate

### Option B: Using Nginx (Linux/Windows)

1. **Install Nginx** (if not already installed)

2. **Create Nginx config:**

```nginx
server {
    listen 80;
    server_name lulalens.oneluckywave.co.za;
    
    root C:/Projects/LulaLens/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. **For HTTPS (recommended):**

```nginx
server {
    listen 443 ssl http2;
    server_name lulalens.oneluckywave.co.za;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root C:/Projects/LulaLens/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name lulalens.oneluckywave.co.za;
    return 301 https://$server_name$request_uri;
}
```

### Option C: Using Apache

1. **Create .htaccess in dist folder:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

2. **Configure Apache VirtualHost:**

```apache
<VirtualHost *:80>
    ServerName lulalens.oneluckywave.co.za
    DocumentRoot "C:/Projects/LulaLens/dist"
    
    <Directory "C:/Projects/LulaLens/dist">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog "logs/lulalens-error.log"
    CustomLog "logs/lulalens-access.log" common
</VirtualHost>
```

## Step 3: DNS Configuration

Point your domain to your server:

1. Go to your DNS provider (where oneluckywave.co.za is registered)
2. Add an A record:
   - **Name:** lulalens
   - **Type:** A
   - **Value:** 192.168.23.101 (or your public IP if external)
   - **TTL:** 3600

**Note:** If this is for external access, use your public IP. If internal only, use 192.168.23.101.

## Step 4: Deploy

1. **Build the app:**
```powershell
npm run build
```

2. **Copy dist folder to server** (if deploying to different machine)

3. **Start/Restart web server:**

For IIS:
```powershell
iisreset
```

For Nginx:
```powershell
nginx -s reload
```

For Apache:
```powershell
httpd -k restart
```

## Step 5: Test

Visit: http://lulalens.oneluckywave.co.za

## SSL Certificate (Recommended)

For HTTPS, you can:

1. **Use Let's Encrypt (Free):**
   - For Windows: Use win-acme
   - For Linux: Use certbot

2. **Use existing SSL certificate:**
   - If you have a wildcard cert for *.oneluckywave.co.za, use that

## Quick Deploy Script (PowerShell)

Save this as `deploy.ps1`:

```powershell
# Build the app
Write-Host "Building LulaLens..." -ForegroundColor Green
npm run build

# Stop IIS (if using IIS)
# iisreset /stop

# Copy to web server directory (adjust path as needed)
# $targetPath = "C:\inetpub\lulalens"
# if (Test-Path $targetPath) {
#     Remove-Item "$targetPath\*" -Recurse -Force
# }
# Copy-Item "dist\*" -Destination $targetPath -Recurse -Force

# Start IIS
# iisreset /start

Write-Host "Build complete! Dist folder ready at: dist\" -ForegroundColor Green
Write-Host "Deploy the contents of the 'dist' folder to your web server." -ForegroundColor Yellow
```

Run: `.\deploy.ps1`

## Current Development vs Production

- **Development:** http://192.168.23.136:3000 (npm run dev)
- **Production:** http://lulalens.oneluckywave.co.za (after deployment)

## What Web Server Are You Using?

Let me know which web server you're using (IIS, Nginx, Apache) and I can provide specific commands for your setup!
