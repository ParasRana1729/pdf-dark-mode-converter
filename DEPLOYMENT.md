# 🚀 Deployment Guide - PDF Dark Mode Converter

This guide covers various deployment options for the PDF Dark Mode Converter application.

## 🚀 Quick Deploy Options

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/pdf-dark-mode-converter)

**Why Vercel?**
- Optimized for Next.js applications
- Automatic builds and deployments
- Global CDN
- Zero configuration required

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/pdf-dark-mode-converter)

## 📋 Pre-deployment Checklist

- [ ] All dependencies installed and working locally
- [ ] Application builds successfully (`npm run build`)
- [ ] Environment variables configured (if any)
- [ ] PDF worker files in public directory
- [ ] Custom domain configured (optional)

## 🔧 Detailed Deployment Instructions

### 1. Vercel Deployment

#### Method A: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings:
     - **Framework Preset**: Next.js
     - **Node.js Version**: 18.x or later
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Get your live URL (e.g., `your-app.vercel.app`)

#### Method B: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

#### Vercel Configuration

Create `vercel.json` for advanced configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1", "sfo1"],
  "functions": {
    "src/pages/**/*.{js,ts,jsx,tsx}": {
      "maxDuration": 30
    }
  }
}
```

### 2. Netlify Deployment

#### Method A: GitHub Integration

1. **Connect Repository**
   - Sign in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add any required environment variables

#### Method B: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=.next
   ```

#### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Digital Ocean App Platform

1. **Create App**
   - Go to Digital Ocean Apps
   - Create new app from GitHub

2. **Configure**
   ```yaml
   name: pdf-dark-mode-converter
   services:
   - name: web
     source_dir: /
     github:
       repo: yourusername/pdf-dark-mode-converter
       branch: main
     run_command: npm start
     build_command: npm run build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
   ```

### 4. Railway

1. **Connect Repository**
   - Visit [Railway](https://railway.app)
   - Create new project from GitHub

2. **Configuration**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Start Command: `npm start`

### 5. Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Configure Package.json**
   ```json
   {
     "scripts": {
       "heroku-postbuild": "npm run build",
       "start": "next start -p $PORT"
     }
   }
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔧 Build Configuration

### Next.js Configuration

Ensure `next.config.js` is optimized for production:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  // Optimize for static export if needed
  trailingSlash: true,
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
```

### Environment Variables

For production deployment, set these if needed:

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🌐 Custom Domain Setup

### Vercel

1. Go to your project dashboard
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Netlify

1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS records

## 📊 Performance Optimization

### Build Optimizations

1. **Bundle Analysis**
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

2. **Check Bundle Size**
   ```bash
   ANALYZE=true npm run build
   ```

### CDN Configuration

Ensure static assets are served from CDN:
- Images optimized and compressed
- PDF worker files cached properly
- Font files optimized

## 🔒 Security Considerations

### Content Security Policy

Add CSP headers for production:

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

## 🚦 Health Checks

### Monitoring Setup

1. **Uptime Monitoring**
   - UptimeRobot
   - Pingdom
   - StatusPage

2. **Performance Monitoring**
   - Vercel Analytics
   - Google PageSpeed Insights
   - Web.dev Measure

### Health Check Endpoint

Create `pages/api/health.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **PDF Worker Issues**
   - Ensure `pdf.worker.mjs` is in public directory
   - Check worker path configuration

3. **Memory Issues**
   - Increase Node.js memory limit
   - Optimize PDF processing for large files

### Debug Commands

```bash
# Check build output
npm run build 2>&1 | tee build.log

# Test production build locally
npm run build && npm start

# Check for TypeScript errors
npx tsc --noEmit
```

## 📈 Post-Deployment

### Analytics Setup

1. **Google Analytics**
   ```bash
   npm install gtag
   ```

2. **Vercel Analytics**
   ```bash
   npm install @vercel/analytics
   ```

### SEO Optimization

- Set up proper meta tags
- Create sitemap.xml
- Configure robots.txt
- Add structured data

---

**Need help with deployment? Create an issue in the repository!** 