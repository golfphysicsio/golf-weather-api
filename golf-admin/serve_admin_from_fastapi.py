"""
Example: Serving Admin Dashboard from FastAPI
Add this to your main FastAPI application
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

app = FastAPI()

# Your existing admin API routes
from admin_backend import admin_router
app.include_router(admin_router)

# ==================== SERVE ADMIN DASHBOARD ====================

# Path to the built React app (dist folder from npm run build)
ADMIN_DASHBOARD_PATH = Path(__file__).parent / "admin-dashboard-dist"

# Serve static files (JS, CSS, images, etc.)
app.mount(
    "/admin-ui/assets", 
    StaticFiles(directory=ADMIN_DASHBOARD_PATH / "assets"), 
    name="admin-assets"
)

# Serve the main HTML file for all admin-ui routes
@app.get("/admin-ui/{full_path:path}")
async def serve_admin_dashboard(full_path: str):
    """
    Serve the React admin dashboard.
    This catches all /admin-ui/* routes and serves index.html,
    allowing React Router to handle client-side routing.
    """
    index_file = ADMIN_DASHBOARD_PATH / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"error": "Admin dashboard not found"}

# Also serve at /admin-ui root
@app.get("/admin-ui")
async def serve_admin_root():
    """Serve admin dashboard at /admin-ui"""
    index_file = ADMIN_DASHBOARD_PATH / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"error": "Admin dashboard not found"}

# ==================== YOUR EXISTING API ROUTES ====================

@app.get("/weather")
async def get_weather(lat: float, lon: float):
    # Your existing weather endpoint
    return {"weather": "sunny"}

@app.get("/")
async def root():
    return {
        "message": "Golf Physics API",
        "admin_dashboard": "/admin-ui",
        "api_docs": "/docs"
    }

# ==================== DEPLOYMENT NOTES ====================

"""
DIRECTORY STRUCTURE ON RAILWAY:

your-fastapi-app/
├── main.py (this file)
├── admin_backend.py
├── middleware_example.py
├── admin-dashboard-dist/     ← Built React app goes here
│   ├── index.html
│   ├── assets/
│   │   ├── index-xxxxx.js
│   │   ├── index-xxxxx.css
│   │   └── ...
│   └── ...
└── requirements.txt

DEPLOYMENT STEPS:

1. Build React app locally:
   cd admin-dashboard
   npm run build
   
2. Copy dist/ folder to your FastAPI project:
   cp -r admin-dashboard/dist ./admin-dashboard-dist
   
3. Commit and push to GitHub:
   git add admin-dashboard-dist/
   git commit -m "Add admin dashboard"
   git push
   
4. Railway will auto-deploy

5. Access at: https://api.golfphysics.io/admin-ui

BENEFITS:
- No CORS issues (same domain)
- No separate hosting costs
- Single deployment process
- Admin dashboard protected by same Railway authentication
"""
