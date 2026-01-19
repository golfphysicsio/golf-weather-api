# PROMPT FOR CLAUDE CODE - Build Golf Physics Website

**Give this prompt to Claude Code AFTER it completes the Production Readiness tasks**

---

```
I need you to build a professional marketing website for Golf Physics API.

**IMPORTANT: Read the complete specification first**
Location: C:\Users\Vtorr\OneDrive\GolfWeatherAPI\golf-admin\WEBSITE_SPECIFICATION.md

This document contains EVERYTHING you need:
- Complete page layouts and content
- Design specifications (colors, typography, spacing)
- Graphics requirements
- Technical requirements
- Copywriting guidelines
- Deployment instructions

**PROJECT OVERVIEW:**

Build a 4-page website for golfphysics.io:
1. Home page - Marketing landing page
2. Documentation - API reference and guides
3. Pricing - Tier comparison and sign-up
4. Contact - Lead generation form

**TARGET AUDIENCE:**
Primary: Golf technology companies like inRange (launch monitors)
Secondary: Golf course management software
Tertiary: Independent golf app developers

**KEY MESSAGING:**
- Scientific precision meets practical application
- Easy 30-minute integration
- Physics-backed insights enhance golfer experience
- Validated data trusted by professionals

**DESIGN INSPIRATION:**
WeatherAPI.com (clean, developer-focused, modern)

---

## YOUR TASKS:

### TASK 1: Review & Planning (30 min)

1. Read the entire WEBSITE_SPECIFICATION.md thoroughly
2. Review all sections:
   - Page structures
   - Content copy
   - Design specs
   - Graphics requirements
   - Technical requirements
3. Create a project plan with milestones
4. Ask me any clarifying questions you have:
   - Do we have existing brand assets?
   - What are the exact API endpoints to document?
   - Any specific companies we can reference?
   - Preferred hosting (GoDaddy, Railway, or Vercel)?

### TASK 2: Setup Project (30 min)

1. Create a new React + Vite project
2. Install dependencies:
   - Tailwind CSS
   - React Router
   - Lucide React (icons)
   - Prism.js (code highlighting)
   - React Hook Form (forms)
3. Set up project structure per spec:
   ```
   src/
   ├── pages/
   ├── components/
   ├── assets/
   └── styles/
   ```
4. Configure Tailwind with custom colors from spec
5. Set up routing for all 4 pages

### TASK 3: Build Home Page (2-3 hours)

Build the home page following the spec exactly:

1. **Hero Section**
   - Headline: "Weather Data + Physics Calculations Purpose-Built for Golf"
   - Subheadline as specified
   - Primary CTA: "Get Free API Key"
   - Secondary CTA: "View Documentation"

2. **Problem/Solution Section**
   - Two-column layout
   - Challenge vs. Solution comparison

3. **Scientific Approach Section**
   - Three-column feature cards:
     * Atmospheric Modeling
     * Trajectory Modeling  
     * Playability Metrics
   - Scientific validation box

4. **Enhancing Golfer Experience**
   - 4 use cases as carousel or tabs:
     * inRange-style integration
     * Mobile app real-time advice
     * Tournament planning
     * Coaching & training

5. **Integration Showcase**
   - "Integrate in 30 Minutes" section
   - Three-step visual
   - Code examples in multiple languages

6. **Visual Examples**
   - Create mockups per spec:
     * inRange-style interface showing conditions impact
     * Before/After comparison
     * Data flow diagram
     * Shot distance adjustment chart

7. **Features Grid**
   - Six feature boxes

8. **Social Proof**
   - Testimonials (use placeholders for now)
   - Stats box

9. **Pricing Preview**
   - Three-tier cards
   - Link to full pricing page

10. **Lead Generation Section**
    - Self-service signup
    - Enterprise contact
    - Forms with validation

11. **Footer**
    - Four-column layout
    - Links to all pages

### TASK 4: Build Documentation Page (3-4 hours)

Create comprehensive API docs:

1. **Layout**
   - Left sidebar: Navigation
   - Main content: Documentation
   - Right sidebar: Code examples

2. **Sections to include:**
   - Getting Started (Quick Start)
   - Authentication
   - API Endpoints:
     * GET /weather
     * POST /calculate/shot-distance
     * (Add others based on actual API)
   - SDK Documentation (JavaScript, Python, Swift)
   - Guides & Tutorials
   - API Reference

3. **Features:**
   - Syntax-highlighted code blocks
   - Copy-to-clipboard buttons
   - Interactive API explorer (if time permits)
   - Search functionality

4. **Style:**
   - Follow Stripe Docs aesthetic
   - Clear, scannable, developer-friendly

### TASK 5: Build Pricing Page (1 hour)

Create pricing comparison:

1. **Three-tier pricing cards:**
   - Free: $0/month
   - Standard: $49/month
   - Enterprise: Custom

2. **Feature comparison table**
3. **FAQ section**
4. **Enterprise contact form**

### TASK 6: Build Contact Page (1 hour)

Create contact page:

1. **Contact options cards:**
   - Sales
   - Support
   - Partnership

2. **General contact form**
   - Name, email, company, category, message
   - Form validation
   - Email integration (SendGrid/Mailgun or form endpoint)

3. **Office information** (if applicable)

### TASK 7: Create Graphics (2-3 hours)

Create or source all required graphics:

1. **inRange-Style Interface Mockup**
   - Show launch monitor with conditions impact
   - Color scheme: Golf green + Sky blue
   - Include all elements from spec

2. **Before/After Comparison**
   - Split-screen showing value of API

3. **Data Flow Diagram**
   - Show API in golf tech ecosystem

4. **Shot Distance Chart**
   - Interactive chart showing condition impacts

5. **Feature Icons**
   - Real-time, Hyperlocal, Physics, etc.
   - Line style, 2px stroke, green color

6. **Hero Background**
   - Subtle golf course or gradient

### TASK 8: Polish & Optimization (2 hours)

1. **Responsive Design**
   - Test on mobile, tablet, desktop
   - Fix any layout issues

2. **Performance**
   - Optimize images
   - Lazy load images
   - Code splitting
   - Target Lighthouse score > 90

3. **Accessibility**
   - WCAG 2.1 AA compliance
   - Alt text on images
   - Keyboard navigation
   - Screen reader friendly

4. **SEO**
   - Meta tags per spec
   - Open Graph tags
   - Structured data
   - Sitemap.xml

5. **Cross-browser Testing**
   - Chrome, Safari, Firefox
   - Fix any compatibility issues

### TASK 9: Forms & Lead Capture (1-2 hours)

1. **API Key Signup Form**
   - Capture: Company, Email, Use Case
   - Generate API key or store lead
   - Send welcome email
   - Show thank you page with key

2. **Contact Form**
   - Validate inputs
   - Send to email or save to DB
   - Show success message

3. **Enterprise Form**
   - Capture detailed requirements
   - Notify sales team

### TASK 10: Deploy (1 hour)

Deploy to chosen platform:

**Option A: Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

**Option B: Railway (with FastAPI)**
- Build React app
- Serve as static files from FastAPI
- Route `/` to website, `/api/*` to API

**Option C: GoDaddy**
- Build and upload files
- Configure DNS

### TASK 11: Testing & Launch (1 hour)

1. **Functional Testing**
   - All links work
   - Forms submit correctly
   - No console errors
   - All pages load

2. **Content Review**
   - Proofread all copy
   - Test code examples
   - Check API docs accuracy

3. **Performance Check**
   - Lighthouse audit
   - Page speed test
   - Mobile speed test

4. **Launch Checklist**
   - SSL active
   - Analytics installed
   - Sitemap submitted
   - DNS configured

---

## DELIVERABLES:

When complete, provide:

1. **Live website URL** (e.g., https://golfphysics.io)
2. **GitHub repository** with code
3. **Build instructions** (README.md)
4. **Deployment guide**
5. **Content update guide** (how to change text/images)
6. **Analytics setup** (Google Analytics or Plausible)
7. **Maintenance checklist**

---

## IMPORTANT NOTES:

**What to do if you need info not in the spec:**

- **API endpoints:** Ask me for the actual API structure
- **Brand assets:** Use placeholders, mark as TODO
- **Testimonials:** Use realistic but fictional quotes
- **Company logos:** Use placeholder images
- **Specific metrics:** Use realistic sample numbers

**Design decisions:**

- **Follow the spec as closely as possible**
- **Use WeatherAPI.com as style reference**
- **Golf green (#2E7D32) is primary color**
- **Mobile-first responsive design**
- **Professional but approachable tone**

**Code quality:**

- Clean, well-commented code
- Component reusability
- Semantic HTML
- Accessible by default

**If you get stuck:**

- Refer back to WEBSITE_SPECIFICATION.md
- Ask for clarification
- Make reasonable assumptions and document them
- Mark TODOs for things that need user input

---

## TIMELINE ESTIMATE:

- Review & Planning: 30 min
- Setup: 30 min
- Home Page: 2-3 hours
- Documentation: 3-4 hours
- Pricing: 1 hour
- Contact: 1 hour
- Graphics: 2-3 hours
- Polish: 2 hours
- Forms: 1-2 hours
- Deploy: 1 hour
- Testing: 1 hour

**Total: ~15-20 hours**

You can work through this over a day or two. Take breaks as needed.

---

## START NOW:

Begin by reading WEBSITE_SPECIFICATION.md, then let me know:
1. Any questions you have
2. Which hosting option you recommend
3. If you need any additional information
4. Your project plan/timeline

Let's build an amazing website for Golf Physics API! 🚀⛳
```

---

**Note:** Save this prompt and give it to Claude Code after they finish the Production Readiness tasks.
