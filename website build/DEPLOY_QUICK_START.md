# Quick Start: Deploy with Claude Code

**Everything you need to give Claude Code to deploy the automated lead system**

---

## 📋 WHAT TO GIVE CLAUDE CODE

### 1. THE PROMPT FILE

**File:** DEPLOY_AUTOMATED_LEAD_SYSTEM_PROMPT.md

**Where:** I'll provide it in the outputs folder

---

### 2. PROJECT ACCESS

**Working Directory:**
```
C:\Users\Vtorr\OneDrive\GolfWeatherAPI\
```

**Project Structure:**
- Backend: `golf-weather-api/`
- Admin Dashboard: `golf-admin/admin-dashboard/`
- Website: `golfphysics-website/`

---

### 3. RAILWAY POSTGRESQL CONNECTION

**Get this from Railway Dashboard:**

1. Go to https://railway.app
2. Open your Golf Physics project
3. Click on **PostgreSQL** service
4. Click **"Connect"** tab
5. Copy **"Postgres Connection URL"**

**It looks like:**
```
postgresql://postgres:PASSWORD@HOST:PORT/railway
```

**Give this to Claude Code when they ask for it.**

---

### 4. SENDGRID CREDENTIALS

**You already have:**
- ✅ SENDGRID_API_KEY: [your SendGrid API key]
- ✅ FROM_EMAIL: noreply@golfphysics.io
- ✅ REPLY_TO_EMAIL: [your Gmail]
- ✅ ADMIN_EMAIL: [your Gmail]

**Give these to Claude Code when they ask.**

---

### 5. ANSWER THIS QUESTION

Claude Code will ask:

**"Is the admin dashboard a separate Railway service or served by the backend?"**

**Your answer:**
Check your Railway project:
- If you see 2 services (Backend + Admin Dashboard) → "Separate service"
- If you see 1 service (just Backend) → "Served by backend"

**Most likely:** Served by backend (FastAPI serves the admin dashboard)

---

## 🚀 EXACT PROMPT TO GIVE CLAUDE CODE

Copy and paste this:

```
I need you to deploy the automated lead capture system to Railway production.

Read and execute: DEPLOY_AUTOMATED_LEAD_SYSTEM_PROMPT.md

Working directory: C:\Users\Vtorr\OneDrive\GolfWeatherAPI\

When you need credentials, ask me and I'll provide:
- Railway PostgreSQL connection string
- SendGrid credentials
- My test email address

Follow the 6-step deployment plan and report progress after each step.

Let's start!
```

---

## 📁 FILES TO ATTACH

**Required:**
1. ✅ DEPLOY_AUTOMATED_LEAD_SYSTEM_PROMPT.md (I'll provide)

**Claude Code will find these automatically:**
- Migration SQL: `golf-weather-api/alembic/versions/add_leads_table.sql`
- Backend code: `golf-weather-api/app/`
- Admin dashboard: `golf-admin/admin-dashboard/`

---

## 💬 WHAT CLAUDE CODE WILL ASK YOU

### Question 1: Railway PostgreSQL Connection
**Claude Code asks:** "Please provide the Railway PostgreSQL connection string"

**You provide:**
```
postgresql://postgres:PASSWORD@HOST:PORT/railway
```
(Get this from Railway dashboard → PostgreSQL → Connect)

---

### Question 2: SendGrid Credentials
**Claude Code asks:** "Please provide SendGrid credentials for environment variables"

**You provide:**
```
SENDGRID_API_KEY=[paste your key]
REPLY_TO_EMAIL=[your Gmail]
ADMIN_EMAIL=[your Gmail]
```

---

### Question 3: Admin Dashboard Setup
**Claude Code asks:** "Is the admin dashboard a separate Railway service or served by the backend?"

**You answer:**
- "Separate service" (if 2 Railway services)
- "Served by backend" (if 1 Railway service) ← Most likely

---

### Question 4: Test Email
**Claude Code asks:** "Please provide your email address for testing"

**You provide:**
```
[your Gmail address]
```

---

## ✅ WHAT CLAUDE CODE WILL DO

1. **Run database migration** on Railway PostgreSQL
2. **Add environment variables** to Railway backend (may need your help)
3. **Deploy backend code** (git commit + push)
4. **Deploy admin dashboard** (build + deploy)
5. **Test everything** (API endpoints, emails, admin dashboard)
6. **Report results** (deployment summary + checklist)

---

## ⏱️ TIMELINE

- Claude Code works: 30-60 minutes
- Your involvement: Answer 4 questions (5 minutes total)
- **Total: ~1 hour to full production deployment**

---

## 🎯 WHEN COMPLETE

You'll have:
- ✅ Database migration complete
- ✅ Backend deployed to Railway
- ✅ Admin dashboard deployed
- ✅ Email system working (SendGrid)
- ✅ Leads page live in admin
- ✅ Full automated lead capture running in production

---

## 📋 QUICK CHECKLIST

Before starting with Claude Code:

- [ ] Have Railway account login ready
- [ ] Can access Railway PostgreSQL connection string
- [ ] Have SendGrid API key ready
- [ ] Know your Gmail address for testing
- [ ] Know if admin dashboard is separate or backend-served
- [ ] Have DEPLOY_AUTOMATED_LEAD_SYSTEM_PROMPT.md ready

---

**Ready? Give Claude Code the deployment prompt and let them handle the rest!** 🚀
