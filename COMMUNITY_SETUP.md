# 🔥 Vectra Tips — Community Setup Guide

## 📋 What You Get

| Feature | Status |
|---------|--------|
| ✅ Knowledge Base (existing) | Working |
| ✅ CMS Dashboard (existing) | Working |
| ✅ User Login/Register | ✅ New |
| ✅ Community Forum | ✅ New |
| ✅ Post Voting System | ✅ New |
| ✅ User Profiles | ✅ New |
| ✅ News & Leaks (HackerNews API) | ✅ New |
| ✅ Report System | ✅ New |
| ✅ Admin Panel | ✅ New |
| ✅ Multilingual (6 languages) | Existing |

---

## 🚀 Step 1: Set Up Supabase (Free)

1. Go to **https://supabase.com** and sign up (free tier = 500MB database, enough for thousands of users)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `offensive-community` (or anything)
   - **Database Password**: Save this somewhere safe!
   - **Region**: Pick the closest to you
4. Wait 1-2 minutes for the project to be created

## 📦 Step 2: Run the Database Schema

1. In your Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open the file **`supabase-schema.sql`** from this project
4. Copy ALL the SQL code
5. Paste into the SQL Editor
6. Click **"Run"** (▶️ button)
7. Wait for "Success. No rows returned" message

## 🔑 Step 3: Get Your API Keys

1. In Supabase Dashboard → **Project Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like `https://xxxxxxx.supabase.co`)
   - **Anon Public Key** (long string starting with `eyJ...`)

## 🔌 Step 4: Connect Your Site

### Option A: Run Locally (Python Server)

```powershell
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Then open **http://localhost:8000** and click the **Login** button in the navbar. Enter your Supabase URL and Anon Key on the login page (first time only — it saves in your browser).

### Option B: Run Locally (VS Code Live Server)

1. Open the project folder in VS Code
2. Install "Live Server" extension
3. Right-click `index.html` → Open with Live Server
4. Login and enter your Supabase credentials

### Option C: Deploy on Netlify (Same as your current site)

1. Push this folder to GitHub
2. Go to **Netlify** → Import from GitHub
3. Set **Build Command**: `echo "Static site - no build needed"`
4. Set **Publish Directory**: `/`
5. Deploy!

Then any user who logs in on the deployed site will enter their Supabase credentials.

> **⚠️ IMPORTANT**: For a production site, you'll want to hardcode your Supabase URL and Anon Key into the HTML files. Open each of these files and replace `'https://YOUR-PROJECT.supabase.co'` and `'YOUR-ANON-KEY'` with your real values:
> - `login.html`
> - `register.html`
> - `forum.html`
> - `new-post.html`
> - `post.html`
> - `profile.html`
> - `news.html`
> - `community-admin.html`

---

## 📚 How to Use Each Feature

### 👤 User Registration
1. Go to **register.html** — Create an account
2. Go to **login.html** — Sign in
3. Your profile is automatically created

### 💬 Forum
- **forum.html** — Browse all posts, search, filter
- **new-post.html** — Create a new discussion (must be logged in)
- **post.html?id=X** — View post, vote, reply, report

### 👤 Profile
- **profile.html?id=USER_ID** — View anyone's profile
- Click "Edit Profile" to add bio, GitHub, website

### 📰 News
- **news.html** — Live cybersecurity news from HackerNews API
- Click "Refresh" to fetch latest

### 🛡️ Admin Panel
- **community-admin.html** — Manage reports, users, posts
- Only users with `admin` role can access
- To make yourself admin:
  1. Go to Supabase Dashboard → **Table Editor** → **profiles**
  2. Find your user and change `role` from `member` to `admin`

---

## 🗄️ Migrate Existing Content to Supabase

If you want your knowledge base modules to also be searchable from the community features:

1. Open **index.html** in your browser
2. Open DevTools (F12 → Console)
3. Copy the content of **`scripts/migrate-to-supabase.js`**
4. Paste into the Console and press Enter
5. Wait for "Migration Complete!"

---

## 🔧 File Structure

```
offencivetips0/
├── index.html          ← Main site (SPA knowledge base)
├── script.js           ← Main site logic
├── style.css           ← Design system (shared across all pages)
├── data.js             ← Auto-generated content database
├── build.py            ← Content builder
├── main.py             ← Python FastAPI server (CMS)
│
├── login.html          ← 🔥 NEW: Login page
├── register.html       ← 🔥 NEW: Register page
├── forum.html          ← 🔥 NEW: Forum listing
├── new-post.html       ← 🔥 NEW: Create post
├── post.html           ← 🔥 NEW: View post + comments
├── profile.html        ← 🔥 NEW: User profile
├── news.html           ← 🔥 NEW: Cybersecurity news
├── community-admin.html ← 🔥 NEW: Admin panel
├── supabase-config.js  ← 🔥 NEW: Supabase helper functions
├── supabase-schema.sql ← 🔥 NEW: Database schema for Supabase
│
├── dashboard/          ← CMS dashboard (existing)
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── content/            ← Your knowledge base (Markdown files)
│   ├── active-directory/
│   ├── web-pentesting/
│   └── ... (20 categories)
│
├── scripts/
│   └── migrate-to-supabase.js  ← 🔥 NEW: Migration script
│
└── COMMUNITY_SETUP.md  ← This file!
```

---

## 🎯 Next Steps After Setup

1. ✅ **Test login** — Go to `login.html`, create an account
2. ✅ **Test forum** — Go to `forum.html`, create a post
3. ✅ **Test news** — Go to `news.html`, news loads automatically
4. ✅ **Make yourself admin** — Change role in Supabase Table Editor
5. ✅ **Test admin panel** — Go to `community-admin.html`
6. ✅ **Deploy to Netlify** — Push to GitHub + connect

---

*Built with 💀 by WormGPT for Abdulrahman Abu El-Naga*
