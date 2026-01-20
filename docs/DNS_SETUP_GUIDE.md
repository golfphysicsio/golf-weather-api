# DNS Setup Guide - Golf Physics API

**DNS Provider:** GoDaddy
**Domain:** golfphysics.io

---

## Current DNS Configuration

### Production Setup (Already Configured)

| Record Type | Host | Points To | Purpose |
|-------------|------|-----------|---------|
| CNAME | www | oacn52qe.up.railway.app | Main website |
| CNAME | api | golf-weather-api-production.up.railway.app | Production API |
| Forward | @ (root) | https://www.golfphysics.io | Root domain redirect |

**Result:**
- www.golfphysics.io → Website
- api.golfphysics.io → Production API
- golfphysics.io → Redirects to www.golfphysics.io

---

## Add Staging Subdomain (New)

### Step 1: Login to GoDaddy

1. Go to https://www.godaddy.com
2. Sign in to your account
3. Navigate to: **My Products** → **Domains** → **golfphysics.io**
4. Click **DNS** (or **Manage DNS**)

### Step 2: Add Staging CNAME Record

Click **Add Record** and enter:

| Field | Value |
|-------|-------|
| Type | CNAME |
| Host | staging |
| Points to | golf-weather-api-staging.up.railway.app |
| TTL | 1 Hour (3600 seconds) |

Click **Save**.

**Result:** `staging.golfphysics.io` → Staging environment

### Step 3: Wait for DNS Propagation

DNS changes can take 1-48 hours to propagate. Typically:
- GoDaddy: 1 hour (with 1-hour TTL)
- Global propagation: Up to 48 hours

**Check propagation status:**
```bash
nslookup staging.golfphysics.io
```

Should return: `golf-weather-api-staging.up.railway.app`

### Step 4: Update Railway Custom Domain

1. Go to Railway dashboard: https://railway.app
2. Select project: **soothing-happiness**
3. Go to **staging** environment
4. Click **golf-weather-api** service
5. Go to **Settings** tab
6. Scroll to **Domains** section
7. Click **Add Custom Domain**
8. Enter: `staging.golfphysics.io`
9. Click **Add Domain**

Railway will:
- Provision SSL certificate (automatic)
- Configure routing

**Wait 5-10 minutes for SSL provisioning.**

### Step 5: Verify Staging Subdomain

```bash
# Check DNS resolution
nslookup staging.golfphysics.io

# Check HTTPS works
curl https://staging.golfphysics.io/api/v1/health

# Check API docs
open https://staging.golfphysics.io/docs
```

Expected results:
- DNS resolves to Railway
- HTTPS certificate valid
- API responds
- Docs page loads

---

## Optional: Add Additional Subdomains

### Developer Portal (Future)

If you build a customer portal:

| Type | Host | Points To | Purpose |
|------|------|-----------|---------|
| CNAME | portal | [railway-portal-url] | Customer dashboard |

### Documentation Site (Future)

If you move docs to separate service:

| Type | Host | Points To | Purpose |
|------|------|-----------|---------|
| CNAME | docs | [docs-hosting-url] | API documentation |

---

## DNS Management Best Practices

### TTL Settings
- **Production records:** 1 hour (allows changes if needed)
- **After stable:** Can increase to 24 hours

### SSL Certificates
- Railway auto-provisions Let's Encrypt certificates
- Auto-renews every 90 days
- No manual intervention needed

### DNS Propagation Testing

**Check globally:**
- https://www.whatsmydns.net/#CNAME/staging.golfphysics.io

**Check locally:**
```bash
# Windows
nslookup staging.golfphysics.io

# Mac/Linux
dig staging.golfphysics.io
```

### Troubleshooting

**Problem: "DNS not resolving"**
- Wait longer (up to 48 hours)
- Check record type is CNAME (not A)
- Verify host is exactly "staging" (no dots)
- Check for typos in Railway URL

**Problem: "SSL certificate error"**
- Wait 10 minutes for Railway to provision
- Verify custom domain added in Railway
- Check Railway deployment logs

**Problem: "404 Not Found"**
- Verify Railway service is running
- Check Railway deployment status
- Test Railway URL directly first

---

## Current Complete DNS Configuration

After adding staging subdomain:

```
Domain: golfphysics.io

Records:
+----------+---------+----------------------------------------+---------------------+
| Type     | Host    | Points To                              | Purpose             |
+----------+---------+----------------------------------------+---------------------+
| CNAME    | www     | oacn52qe.up.railway.app               | Main website        |
| CNAME    | api     | golf-weather-api-production.up.railway | Production API      |
| CNAME    | staging | golf-weather-api-staging.up.railway    | Staging/testing     |
| Forward  | @       | https://www.golfphysics.io (301)       | Root redirect       |
+----------+---------+----------------------------------------+---------------------+

Result:
- golfphysics.io → www.golfphysics.io (redirect)
- www.golfphysics.io → Website
- api.golfphysics.io → Production API
- staging.golfphysics.io → Staging API (internal use)
```

---

## Security Notes

**Staging Subdomain:**
- Use for internal testing only
- Don't advertise publicly
- Can add HTTP auth if needed (Railway supports)
- Monitor usage logs

**API Keys:**
- Staging uses separate API keys from production
- Never use production keys in staging
- Rotate keys regularly

---

## Next Steps After Setup

1. **Update internal documentation** to use staging.golfphysics.io
2. **Update team tools** (Postman, testing scripts) with new URL
3. **Keep customer documentation** using only api.golfphysics.io (production)
4. **Monitor DNS** propagation globally
5. **Test all endpoints** on new staging subdomain
