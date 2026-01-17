# Claude Code Prompts for Golf Physics Admin Dashboard

Use these prompts in sequence with Claude Code to build and deploy your admin dashboard.

---

## PROMPT 1: Setup Backend (Database + FastAPI)

```
I have a Golf Physics API running on Railway (FastAPI + PostgreSQL + Redis). I need to add an admin dashboard backend to it.

Location of files: C:\Users\Vtorr\OneDrive\GolfWeatherAPI\golf-admin

Tasks:
1. First, read C:\Users\Vtorr\OneDrive\GolfWeatherAPI\golf-admin\DEPLOYMENT_GUIDE.md to understand the architecture
2. Connect to my Railway PostgreSQL database and apply the schema from C:\Users\Vtorr\OneDrive\GolfWeatherAPI\golf-admin\schema.sql
3. Integrate the admin backend:
   - Add the code from C:\Users\Vtorr\OneDrive\GolfWeatherAPI\golf-admin\admin_backend.py to my FastAPI application
   - Add the middleware from C:\Users\Vtorr\OneDrive\GolfWeatherAPI\golf-admin\middleware_example.py for API key validation
   - Note: CORS not needed since admin dashboard will be served from same domain
4. Set these environment variables in Railway:
   - GOOGLE_CLIENT_ID (I'll provide this)
   - ADMIN_EMAIL=golfphysicsio@gmail.com
5. Test the admin endpoints:
   - GET /admin/health (should require auth)
   - Make sure the endpoints are accessible

My API repo is at: https://github.com/golfphysicsio/golf-weather-api

Please show me what changes you're making and ask for confirmation before deploying.
```

---

## PROMPT 2: Setup Google OAuth

```
I need to set up Google OAuth for the admin dashboard.

Tasks:
1. Guide me through creating OAuth credentials in Google Cloud Console
2. Tell me exactly what to set for:
   - Application type: Web application
   - Authorized JavaScript origins:
     * http://localhost:3000 (for local development)
     * https://api.golfphysics.io (for production)
   - Authorized redirect URIs:
     * http://localhost:3000 (for local development)
     * https://api.golfphysics.io (for production)
3. Once I have the Client ID, add it to the Railway environment variables
4. Test that the authentication works by calling the /admin/health endpoint

Note: The admin dashboard will be served from the same domain as the API (api.golfphysics.io), so we only need one set of origins.
```

---

## PROMPT 3: Build Frontend Locally

```
I need to build and test the React admin dashboard locally.

Location: C:\Users\Vtorr\OneDrive\GolfWeatherAPI\golf-admin\admin-dashboard

Tasks:
1. Navigate to C:\Users\Vtorr\OneDrive\GolfWeatherAPI\golf-admin\admin-dashboard
2. Install all dependencies from package.json
3. Create .env file from .env.example with:
   - VITE_GOOGLE_CLIENT_ID=[the one from Google]
   - VITE_API_BASE_URL=https://api.golfphysics.io (or my Railway URL)
4. Run the development server: `npm run dev`
5. Open http://localhost:3000 and verify:
   - Login page appears
   - Can log in with golfphysicsio@gmail.com
   - All tabs load (Dashboard, API Keys, Usage, Logs, API Test)
6. Create a test API key and verify it appears in the database

If there are any errors, debug them and show me what you fixed.
```

---

## PROMPT 4: Build and Deploy Frontend to Railway

```
I need to build the React admin dashboard and serve it from my FastAPI app on Railway.

Location: C:\Users\Vtorr\OneDrive\GolfWeatherAPI\golf-admin\admin-dashboard

Tasks:
1. Navigate to C:\Users\Vtorr\OneDrive\GolfWeatherAPI\golf-admin\admin-dashboard
2. Update .env for production:
   - VITE_GOOGLE_CLIENT_ID=[from Google]
   - VITE_API_BASE_URL=https://api.golfphysics.io
3. Run `npm run build` to create production build (creates /dist folder)
4. Integrate the built frontend into my FastAPI app:
   - Copy the /dist folder to my FastAPI project
   - Add StaticFiles mount to serve the admin dashboard
   - Example code:
     ```python
     from fastapi.staticfiles import StaticFiles
     
     # Serve admin dashboard static files
     app.mount("/admin-ui", StaticFiles(directory="dist", html=True), name="admin-ui")
     ```
5. Update Google OAuth credentials:
   - Add https://api.golfphysics.io to authorized JavaScript origins
   - Add https://api.golfphysics.io to authorized redirect URIs
6. Deploy to Railway (push changes to GitHub or use Railway CLI)
7. Test the live admin dashboard at: https://api.golfphysics.io/admin-ui

Note: No CORS configuration needed since everything is on the same domain!

Show me when the deployment is complete and the URL to access the dashboard.
```

---

## PROMPT 5: End-to-End Testing

```
Now that everything is deployed, let's do comprehensive testing.

Tasks:
1. Test Authentication:
   - Go to the live admin dashboard
   - Log in with golfphysicsio@gmail.com
   - Verify I can access all pages

2. Test API Key Management:
   - Create a new API key for a test client
   - Copy the key that's shown (only shown once)
   - Verify it appears in the API Keys list
   - Try updating its tier from Free to Standard
   - Try disabling it, then re-enabling it

3. Test API Playground:
   - Go to the API Test tab
   - Enter the API key you just created
   - Test the /weather endpoint with lat=33.7&lon=-84.4
   - Verify you get a successful response
   - Check that the request appears in the Logs tab

4. Test Analytics:
   - Make several API requests using the test key
   - Go to Usage tab
   - Verify you see usage data for your test client
   - Export CSV and verify it contains the data

5. Test Rate Limiting:
   - Create a Free tier API key (60 req/min)
   - Use a script to make 100 requests quickly
   - Verify that requests start getting 429 errors after 60

6. Test Request Logs:
   - Go to Logs tab
   - Filter by your test client
   - Verify you can see all the requests you just made
   - Check that error messages appear for 429 errors

Report any issues you find and suggest fixes.
```

---

## PROMPT 6: Production Readiness Checklist

```
Let's make sure everything is production-ready.

Tasks:
1. Security Review:
   - Verify API keys are hashed in the database (not plaintext)
   - Check that admin endpoints require authentication
   - Verify CORS is properly configured (not allowing all origins)
   - Confirm only golfphysicsio@gmail.com can access admin
   - Check that HTTPS is enforced

2. Performance:
   - Test dashboard load time (should be <1 second)
   - Verify charts render smoothly with 1000+ data points
   - Check that logs auto-refresh works
   - Test CSV export with large datasets

3. Database Maintenance:
   - Set up automatic cleanup of old request logs (48 hours)
   - Verify database has proper indexes
   - Check that last_used timestamp updates correctly

4. Monitoring:
   - Set up alerts for high error rates (>5%)
   - Monitor API latency
   - Track rate limit violations
   - Set up database backup schedule in Railway

5. Documentation:
   - Create a README for the GitHub repo
   - Document the deployment process
   - Add troubleshooting guide
   - Create onboarding guide for new team members

6. Backup Plan:
   - Export current database schema
   - Document rollback procedure
   - Create backup of environment variables

Provide a checklist of what's done and what still needs attention.
```

---

## BONUS PROMPT: Add Features (Optional)

```
I want to enhance the admin dashboard with some additional features.

Pick any of these to implement:

1. Email Notifications:
   - Send welcome email when API key is created
   - Alert admin when a key is revoked
   - Weekly usage reports

2. Webhooks:
   - Slack notification when new client signs up
   - Discord notification for high error rates
   - Webhook for rate limit violations

3. Advanced Analytics:
   - Endpoint popularity chart
   - Geographic distribution of requests
   - Peak usage times heatmap
   - Client growth over time

4. API Documentation:
   - Embed interactive API docs in dashboard
   - Auto-generate client SDKs
   - Code examples for each endpoint

5. Billing Integration:
   - Automatically generate invoices based on usage
   - Stripe integration for payments
   - Usage-based pricing tiers

Which feature would you recommend adding first, and can you implement it?
```

---

## TROUBLESHOOTING PROMPTS

If things go wrong, use these:

### If login fails:
```
The admin dashboard login isn't working. Please debug:
1. Check Railway logs for /admin/health endpoint errors
2. Verify Google Client ID is correct in Vercel env vars
3. Check that authorized origins include the Vercel URL
4. Test the /admin/health endpoint directly with curl
5. Show me the browser console errors
```

### If API keys don't work:
```
API keys created in the dashboard aren't working when used with the API. Please debug:
1. Check how keys are being hashed in the database
2. Verify the middleware is validating keys correctly
3. Test with a manually created key in the database
4. Check Railway logs for authentication errors
5. Show me the exact error message
```

### If charts show no data:
```
The Usage charts aren't showing any data. Please debug:
1. Verify request_logs table has data
2. Check the date range being queried
3. Test the /admin/usage/daily endpoint directly
4. Verify the React component is fetching data correctly
5. Check browser console for errors
```

---

## QUICK REFERENCE

**Railway Commands:**
- `railway logs` - View application logs
- `railway run psql` - Connect to database
- `railway variables` - View environment variables
- `railway up` - Deploy current code to Railway

**Frontend Build:**
- `npm run dev` - Run development server (localhost:3000)
- `npm run build` - Build for production (creates /dist folder)
- Copy /dist to FastAPI project and deploy to Railway

**Testing Endpoints:**
```bash
# Test health check (should require auth)
curl https://api.golfphysics.io/admin/health \
  -H "Authorization: Bearer [google-token]"

# Test API with key
curl https://api.golfphysics.io/weather?lat=33.7&lon=-84.4 \
  -H "X-API-Key: golf_xxxxx"

# Access admin dashboard
# Visit: https://api.golfphysics.io/admin-ui
```

---

## IMPORTANT NOTES FOR CLAUDE CODE

1. **Always read DEPLOYMENT_GUIDE.md first** - It has all the context
2. **Ask before deploying** - Show me the changes first
3. **Test locally before deploying** - Catch issues early
4. **Keep me informed** - Tell me what you're doing at each step
5. **Save credentials** - Ask me to save any API keys or tokens shown

Good luck! 🚀
