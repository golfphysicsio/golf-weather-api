# PROMPT FOR CLAUDE CODE - Deploy Automated Lead System to Production

**Deploy the automated lead capture system to Railway production**

---

```
The automated lead system has been built locally and is ready for production deployment.

I need you to deploy all components to Railway and verify everything works.

---

## OVERVIEW OF WHAT WAS BUILT

Phase 1: Database schema (leads table)
Phase 2: SendGrid email service
Phase 3: API endpoints (API key request + contact form with email delivery)
Phase 4: Admin leads API (filtering, search, export)
Phase 5: Admin dashboard Leads page
Phase 6: Environment variables configured locally

Everything works locally. Now deploy to Railway production.

---

## MY RAILWAY PROJECT STRUCTURE

Project: Golf Physics API
Services:
1. PostgreSQL database
2. Backend API (FastAPI) - Domain: api.golfphysics.io
3. Admin Dashboard (may be part of backend or separate)

---

## DEPLOYMENT TASKS

### TASK 1: Run Database Migration on Railway PostgreSQL

The leads table needs to be created in the production database.

**Migration file location:**
`golf-weather-api/alembic/versions/add_leads_table.sql`

**How to run it:**
I'll provide you with Railway PostgreSQL connection details. You need to:

1. Connect to Railway PostgreSQL
2. Execute the SQL from add_leads_table.sql
3. Verify the table was created:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name = 'leads';
   ```
4. Confirm: "leads table created successfully"

**Railway PostgreSQL Connection:**
I'll provide the connection string when you're ready.

---

### TASK 2: Add Environment Variables to Railway

The backend service needs SendGrid credentials.

**Environment variables to add to Railway backend service:**

```
SENDGRID_API_KEY=[I'll provide]
FROM_EMAIL=noreply@golfphysics.io
REPLY_TO_EMAIL=[I'll provide]
ADMIN_EMAIL=[I'll provide]
```

**How to add them:**
Railway CLI or I can do it manually - just tell me exactly what to add and where.

---

### TASK 3: Deploy Backend Code to Railway

**Repository:** The code is already in the git repository
**What needs to be deployed:**
- New email service (app/services/email.py)
- Updated API endpoints (app/routers/)
- New admin API endpoints
- Updated dependencies (requirements.txt includes sendgrid)

**Actions:**
1. Verify all code changes are committed to git
2. Check current git status
3. If uncommitted changes exist, stage and commit them:
   ```bash
   git add .
   git commit -m "Deploy automated lead capture system with SendGrid"
   ```
4. Push to main branch (triggers Railway auto-deploy):
   ```bash
   git push origin main
   ```
5. Monitor Railway deployment logs
6. Confirm deployment successful

---

### TASK 4: Deploy Admin Dashboard

The admin dashboard has a new "Leads" page that needs to be deployed.

**Location:** `golf-admin/admin-dashboard/`

**What changed:**
- New component: src/components/Leads.jsx
- Updated: src/App.jsx (added Leads route)
- Updated: src/locales/en/common.json (translations)

**Deployment steps:**

1. Build production version:
   ```bash
   cd golf-admin/admin-dashboard
   npm run build
   ```

2. Deploy the built files to Railway:
   
   **If admin dashboard is a separate Railway service:**
   - Commit and push changes
   - Railway auto-deploys
   
   **If admin dashboard is served by backend:**
   - Determine where backend serves admin dashboard from
   - Copy dist/ to the correct location
   - May be part of backend static files

**Ask me:** "Is the admin dashboard a separate Railway service or served by the backend?"
Based on my answer, execute the appropriate deployment.

---

### TASK 5: Verify Production Environment

After deployment, verify:

**Backend:**
1. Check Railway deployment logs - no errors
2. Check backend health endpoint (if exists)
3. Verify new routes are accessible:
   - POST /api/request-api-key
   - POST /api/contact
   - GET /admin-api/leads
   - GET /admin-api/leads/stats

**Database:**
1. Confirm leads table exists
2. Check table schema is correct

**Admin Dashboard:**
1. Verify /admin loads
2. Check for new "Leads" tab
3. Check browser console for errors

---

### TASK 6: Test End-to-End in Production

**Test 1: API Key Request Email**

Simulate an API key request to test email delivery:

You can either:
- Use curl to call the endpoint directly
- Tell me to test it manually via the website

**If using curl:**
```bash
curl -X POST "https://api.golfphysics.io/api/request-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "[my email]",
    "company": "Test Company",
    "use_case": "Testing",
    "description": "Testing the deployment",
    "expected_volume": "< 10K",
    "agreed_to_terms": true,
    "recaptcha_token": "test"
  }'
```

**Expected:**
- API returns success
- Email sent to test user
- Email sent to admin
- Lead stored in database

**Tell me:** "I've tested the API endpoint. Please check your email for the API key and admin notification."

**Test 2: Check Admin Dashboard**

Navigate to: https://api.golfphysics.io/admin

**Verify:**
- Leads tab exists
- Can access Leads page
- Test lead appears in the table
- Stats show: Total: 1, New: 1
- Filters work
- Export CSV works

**Test 3: Contact Form (if deployed)**

Test the contact form endpoint:

```bash
curl -X POST "https://api.golfphysics.io/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "[my email]",
    "company": "Test Company",
    "subject": "Test Contact",
    "message": "Testing contact form deployment",
    "recaptcha_token": "test"
  }'
```

**Expected:**
- Confirmation email sent to user
- Notification sent to admin
- Lead stored in database
- Appears in admin dashboard

---

## TROUBLESHOOTING GUIDE

### Issue: Database migration fails

**Check:**
- PostgreSQL connection string is correct
- User has permissions to create tables
- No existing 'leads' table

**Solution:**
- Drop existing leads table if it exists: `DROP TABLE IF EXISTS leads CASCADE;`
- Re-run migration

---

### Issue: Emails not sending

**Check Railway logs for:**
```
[EMAIL] Sent to user@example.com, status: 202
```

**If seeing errors:**
- Verify SENDGRID_API_KEY is set correctly in Railway
- Check SendGrid dashboard for errors
- Verify domain is authenticated in SendGrid

**Common error messages:**
- "SendGrid not configured" → API key not set
- "403 Forbidden" → API key invalid
- "Sender not verified" → Domain not authenticated

---

### Issue: Admin dashboard not showing Leads tab

**Check:**
- Admin dashboard deployed with new code?
- Browser cache cleared?
- Check browser console for JavaScript errors
- Verify App.jsx has Leads route

**Solution:**
- Rebuild admin dashboard: `npm run build`
- Clear browser cache (Ctrl+Shift+Delete)
- Check deployment logs

---

### Issue: Railway deployment fails

**Check:**
- Git push successful?
- Railway build logs for errors
- requirements.txt includes sendgrid?

**Common issues:**
- Python package conflicts
- Missing dependencies
- Environment variables not set

---

## DEPLOYMENT CHECKLIST

When complete, verify all items:

**Database:**
- [ ] leads table created in Railway PostgreSQL
- [ ] Can query: SELECT * FROM leads;
- [ ] Table has all required columns

**Backend:**
- [ ] Code pushed to GitHub
- [ ] Railway auto-deployed
- [ ] No errors in deployment logs
- [ ] New API endpoints accessible
- [ ] Environment variables set (SendGrid credentials)

**Admin Dashboard:**
- [ ] Built (npm run build completed)
- [ ] Deployed to Railway
- [ ] Loads at https://api.golfphysics.io/admin
- [ ] Leads tab visible
- [ ] No console errors

**Email System:**
- [ ] Test API key request sent
- [ ] User received welcome email with API key
- [ ] Admin received notification email
- [ ] Test contact form sent
- [ ] User received confirmation email
- [ ] Admin received notification email

**Admin Dashboard Functionality:**
- [ ] Leads page loads
- [ ] Stats display correctly (Total, New, High Value, This Week)
- [ ] Test leads appear in table
- [ ] Filters work (Source, Status, High Value)
- [ ] Search works
- [ ] Export CSV works
- [ ] Mark as contacted works
- [ ] Email links work

**Production URLs:**
- [ ] https://api.golfphysics.io - API endpoints working
- [ ] https://api.golfphysics.io/admin - Admin dashboard working
- [ ] https://golfphysics.io - Website working (if deployed)

---

## CREDENTIALS I'LL PROVIDE

When you're ready to start, I'll provide:

1. **Railway PostgreSQL Connection String**
   - For running database migration

2. **SendGrid Credentials** (for environment variables)
   - SENDGRID_API_KEY
   - REPLY_TO_EMAIL (my Gmail)
   - ADMIN_EMAIL (my Gmail)

3. **My Email Address** (for testing)
   - To receive test emails

4. **Railway Project Access** (if needed)
   - CLI token or manual steps

---

## EXECUTION PLAN

**Step 1: Prepare**
- Ask me for Railway PostgreSQL connection string
- Ask me for SendGrid credentials
- Ask me: "Is admin dashboard a separate Railway service?"

**Step 2: Deploy Database**
- Connect to Railway PostgreSQL
- Run migration SQL
- Verify leads table created

**Step 3: Deploy Backend**
- Check git status
- Commit any uncommitted changes
- Push to GitHub
- Add environment variables to Railway (I may need to do this part)
- Monitor deployment
- Verify deployment successful

**Step 4: Deploy Admin Dashboard**
- Build production version
- Deploy based on setup (separate service or backend-served)
- Verify deployment

**Step 5: Test Production**
- Test API key request endpoint
- Test contact form endpoint
- Verify emails sent
- Check admin dashboard
- Verify all functionality

**Step 6: Report**
- Provide deployment summary
- List any issues encountered
- Confirm all checklist items complete

---

## DELIVERABLES

When complete, provide:

1. **Deployment Summary:**
   - What was deployed
   - Any issues encountered
   - How they were resolved

2. **Test Results:**
   - API endpoint test results
   - Email delivery confirmation
   - Admin dashboard verification

3. **Next Steps:**
   - Any manual steps I need to complete
   - Recommended monitoring
   - Ongoing maintenance notes

---

Let's deploy this system to production!

Report progress after each major step (Database, Backend, Admin, Testing).
```
