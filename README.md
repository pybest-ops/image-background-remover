# 🎨 Background Remover

A simple web app to remove image backgrounds using the [remove.bg API](https://www.remove.bg).

Built with:
- **Next.js 14** (App Router)
- **Cloudflare Pages** (Edge deployment)
- **remove.bg API** (Background removal)

## ✨ Features

- Drag & drop image upload
- Instant background removal
- Transparent PNG output
- Responsive design
- No file storage needed (memory-only processing)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Get remove.bg API Key

1. Go to [remove.bg](https://www.remove.bg/dashboard#api-key)
2. Sign up / Sign in
3. Create an API key

### 3. Set Environment Variable

#### For local development:
Create a `.env.local` file:
```bash
REMOVE_BG_API_KEY=your_api_key_here
```

#### For Cloudflare Pages:
Use wrangler CLI:
```bash
npx wrangler secret put REMOVE_BG_API_KEY
```

Or set in Cloudflare Dashboard:
- Pages > your project > Settings > Environment variables > Add variable

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🌐 Deploy to Cloudflare Pages

### Option 1: Using Wrangler CLI

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

### Option 2: Deploy from Git

1. Push your code to GitHub/GitLab
2. Connect your repository to Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `out`
5. Add `REMOVE_BG_API_KEY` as environment variable

### Option 3: Deploy via Dashboard

1. Go to Cloudflare Dashboard > Pages
2. Create a project > Upload assets
3. Or connect to Git provider
4. Set environment variable `REMOVE_BG_API_KEY`

## 📁 Project Structure

```
bg-remover/
├── app/
│   ├── api/
│   │   └── remove-bg/
│   │       └── route.ts    # API endpoint for background removal
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with upload UI
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── wrangler.toml           # Cloudflare Pages configuration
├── package.json
└── README.md
```

## 🔧 Configuration

### remove.bg API Options

The app uses the following defaults:
- Output format: PNG (transparent)
- Size: Auto (original size)

You can modify these in `app/api/remove-bg/route.ts`:
- Add query parameters to the API call
- See [remove.bg API docs](https://www.remove.bg/api)

## 💰 Pricing

remove.bg offers:
- **Free tier**: 50 credits/month
- **Paid plans**: Starting at $0.20/credit

Check [remove.bg pricing](https://www.remove.bg/pricing) for details.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📓 License

MIT License - feel free to use this for your projects!
