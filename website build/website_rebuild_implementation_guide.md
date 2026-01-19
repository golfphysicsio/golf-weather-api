# Golf Physics API - Website Rebuild Implementation Guide

**Date:** January 18, 2026  
**Version:** 2.0 (Strategic Rebuild)  
**Current Site:** http://localhost:5174 (React + Vite)  
**Approach:** Complete rebuild with strategic content migration

---

## 🎯 EXECUTIVE SUMMARY

### Current State
You have an existing React + Vite website built for a **single-market strategy**:
- Target: Golf technology companies only (inRange, TrackMan)
- Focus: Weather API + physics calculations
- Pages: Home, Docs, Pricing, Contact
- Messaging: Technical, developer-focused

### Strategic Shift
Your business has evolved to a **dual-market strategy**:
- **Market A - Professional:** Tour-accurate training (inRange, TrackMan, instructors)
- **Market B - Gaming:** Extreme entertainment (Topgolf, Drive Shack, Five Iron)
- **Key Innovation:** Same physics engine, two different applications
- **Major Features:** 10 extreme weather game modes, differentiated validation ranges

### Recommendation: COMPLETE REBUILD

**Why not just update?**
1. Information architecture fundamentally different (needs dual market paths)
2. Entire Gaming API content doesn't exist (50% new content)
3. Value proposition shifted (golfer experience vs technical features)
4. Messaging requires rewrite for dual positioning
5. New pages required (Gaming API, dual Pricing, Science credibility)

**What we preserve:**
- React + Vite tech stack (works well)
- Contact form patterns
- Some scientific content (migrate to Science page)
- Code example structures (for Docs)
- Professional design aesthetic

---

## 📊 CONTENT MIGRATION MAP

### From Current Site → New Site

| Current Page | Current Content | Migration Strategy |
|--------------|----------------|-------------------|
| **Home** | Single-market hero, weather + physics messaging | **REBUILD** - New dual-market hero, two clear paths |
| **Docs** | API reference for weather endpoints | **PRESERVE & EXTEND** - Keep structure, add Gaming API docs |
| **Pricing** | Single tier structure (professional only) | **REBUILD** - Dual pricing (Professional + Gaming tiers) |
| **Contact** | Contact form, company info | **PRESERVE** - Keep form, update messaging |

### New Pages (Don't Exist)

| New Page | Purpose | Priority |
|----------|---------|----------|
| **Professional API** | Tour-accurate training value prop | HIGH |
| **Gaming API** | Extreme entertainment value prop | HIGH |
| **Science** | Physics credibility for both markets | HIGH |
| **About** | Mission, dual-market story | MEDIUM |

---

## 🏗️ DETAILED IMPLEMENTATION PLAN

---

## PAGE 1: HOMEPAGE (REBUILD)

### Current Homepage Issues
- Single market focus (no gaming mentioned)
- Technical messaging (not experience-focused)
- No dual path navigation
- Missing golfer experience value prop

### New Homepage Structure

**HERO SECTION:**
```
┌────────────────────────────────────────────────────────────┐
│  Golf Experiences That Players Can't Stop Talking About    │
│                                                             │
│  Real atmospheric physics. Unreal player engagement.        │
│  From tour-accurate training to 500-yard viral moments.     │
│                                                             │
│          [Professional API]    [Gaming API]                 │
│                                                             │
│  VISUAL: Split screen showing:                              │
│  LEFT: Serious golfer analyzing data (professional)         │
│  RIGHT: Friends celebrating 487-yard drive (gaming)         │
└────────────────────────────────────────────────────────────┘
```

**Content from Architecture Doc:** Use homepage section from website_architecture_v2.md

**What to Migrate from Current:**
- None - complete rewrite needed

---

## PAGE 2: PROFESSIONAL API PAGE (NEW)

### Purpose
Dedicated page for inRange, TrackMan, instructors, club fitters

### Content Source
Use "Professional API Page" section from website_architecture_v2.md

### Key Sections
1. Hero: "Tour-Accurate Physics For Real Improvement"
2. Problem/Solution (Why launch monitor data needs context)
3. Use Cases (4 detailed examples)
4. Features (Real-time weather, custom conditions, realistic ranges)
5. Science (Air density formulas, drag calculations)
6. API Example
7. Pricing Preview
8. CTA

### What to Migrate from Current
- **FROM: Current homepage Scientific Approach section**
- **TO: Professional API page - Features section**
- Keep atmospheric modeling, trajectory modeling content
- Preserve physics validation messaging

---

## PAGE 3: GAMING API PAGE (NEW - DOESN'T EXIST)

### Purpose
Dedicated page for Topgolf, Drive Shack, Five Iron, entertainment venues

### Content Source
Use "Gaming API Page" section from website_architecture_v2.md

### Key Sections
1. Hero: "Turn Casual Rounds Into Unforgettable Moments"
2. Entertainment venue challenge
3. **10 Game Modes** (detailed descriptions):
   - Standard: Hurricane Hero, Arctic Assault, Desert Inferno, Monsoon Madness, Mountain Challenge
   - Extreme: Maximum Tailwind, Hurricane Apocalypse, Everest Challenge, Crosswind Chaos, Death Valley Heat
4. Viral opportunity (TikTok/Instagram potential)
5. Features (Handicap-based gameplay, extreme ranges)
6. Science (Why 500-yard drives are real physics)
7. Pricing Preview
8. CTA

### What to Migrate from Current
- None - entirely new content

---

## PAGE 4: PRICING PAGE (REBUILD)

### Current Pricing Issues
- Single tier structure (professional only)
- No gaming tiers
- No ROI calculator
- No market differentiation

### New Pricing Structure

**Tab Toggle:**
```
[ Professional API ] [ Gaming API ]
```

**Professional API Tiers:**
| Tier | Price | Details |
|------|-------|---------|
| Starter | $299/mo | Single facility, 25K calls/day |
| Professional | $599/mo | Multi-facility, 100K calls/day |
| Enterprise | Custom | Unlimited, white-label |

**Gaming API Tiers:**
| Tier | Price | Details |
|------|-------|---------|
| Venue | $1,499/mo | Up to 20 bays, all 10 modes |
| Venue Pro | $2,499/mo | Up to 50 bays, custom presets |
| Enterprise | $3,999+/mo | Unlimited, white-label, co-marketing |

**NEW: ROI Calculator** (Gaming section)
```
Your Venue Stats:
- Number of bays: [20]
- Customers per bay per day: [8]
- Average spend: [$35]
- Session time increase: [15 min]

Result:
Monthly additional revenue: $16,800
API cost: $2,499
ROI: 573%
```

### What to Migrate from Current
- Pricing table structure (the component)
- FAQ patterns
- Form components
- Update all content and pricing

---

## PAGE 5: SCIENCE PAGE (NEW)

### Purpose
Establish physics credibility for both markets

### Content Source
Use "Science Page" section from website_architecture_v2.md

### Key Sections
1. Hero: "Real Physics. Real Math. Real Results."
2. **Physics Deep Dives:**
   - Air density formula (ρ = P/RT)
   - Drag force calculation (Fd = ½ρv²CdA)
   - Wind vector analysis
   - Temperature effects
   - Altitude effects
3. Validation data
4. **Extreme Conditions Section:**
   - "Is 500 yards really possible?"
   - Step-by-step math showing 150mph tailwind = 475 yards
   - Why it's real physics, not fake
5. Professional vs Gaming comparison table

### What to Migrate from Current
- **FROM: Current homepage "Scientific Approach" section**
- **TO: Science page "Physics Deep Dives"**
- Atmospheric modeling content
- Trajectory modeling content
- Validation data

---

## PAGE 6: ABOUT PAGE (NEW)

### Content Source
Use "About Page" section from website_architecture_v2.md

### Structure
1. Hero: "Built By Golfers Who Love Physics"
2. Mission statement
3. Our approach (Real physics, no shortcuts)
4. Values (Accuracy, Transparency, Innovation)
5. Contact info

### What to Migrate from Current
- Company contact information
- Any existing "about us" content
- Team info if present

---

## PAGE 7: DOCUMENTATION (PRESERVE & EXTEND)

### Current Docs Structure
- Good foundation (keep the structure)
- Professional API endpoints documented
- Code examples present

### Changes Needed

**ADD: Gaming API Documentation**

New section in left sidebar:
```
API Documentation
├── Getting Started
├── Authentication
├── Professional API
│   ├── Calculate Trajectory
│   ├── Real-Time Weather
│   └── Custom Conditions
├── Gaming API (NEW)
│   ├── Game Modes
│   ├── Handicap System
│   ├── Preset Library
│   └── Tournament Mode
├── SDKs
└── Guides
```

**NEW: Gaming API Endpoints**
```javascript
// Get all weather presets
GET /api/v1/gaming/presets

// Calculate gaming trajectory
POST /api/v1/gaming/trajectory
{
  "shot": {
    "player_handicap": 15,
    "club": "driver"
  },
  "preset": "maximum_tailwind"
}
```

### What to Migrate from Current
- **PRESERVE:** Entire existing docs structure
- **PRESERVE:** Getting Started guide
- **PRESERVE:** Authentication section
- **PRESERVE:** Professional API endpoints
- **PRESERVE:** Code example patterns
- **ADD:** Gaming API sections (new)

---

## PAGE 8: CONTACT (PRESERVE)

### Current Contact Page
- Contact form works well
- Company information present

### Changes Needed

**Update Messaging:**
- OLD: "Contact us about weather API"
- NEW: "Which API are you interested in?"

**Add Interest Selector:**
```
I'm interested in:
( ) Professional API - Tour-accurate training
( ) Gaming API - Extreme entertainment
( ) Both
( ) Not sure yet
```

### What to Migrate from Current
- **PRESERVE:** Entire contact form component
- **PRESERVE:** Form validation
- **PRESERVE:** Submission handling
- **UPDATE:** Copy/messaging only

---

## 🎨 DESIGN SYSTEM

### Current Design (What Works)

**Colors (Keep):**
- Golf Green: #2E7D32 (or similar)
- Clean, professional palette
- Good contrast

**Typography (Keep):**
- Modern sans-serif (likely Inter or similar)
- Good hierarchy
- Readable sizing

**Components (Keep):**
- Code blocks with syntax highlighting
- Form components
- Card layouts
- Button styles

### New Design Elements (Add)

**Color Differentiation:**
- Professional API accent: Blue (#0066CC)
- Gaming API accent: Orange (#FF6B35)
- Maintain Golf Green as primary

**New Components Needed:**
- Dual-path navigation (Professional | Gaming)
- Tab toggle for pricing
- ROI calculator
- Game mode cards (10 unique designs)
- Comparison tables (Professional vs Gaming)

---

## 🛠️ TECHNICAL IMPLEMENTATION

### Tech Stack (Keep Current)
- React + Vite ✓
- React Router ✓
- Tailwind CSS ✓
- Current component library ✓

### File Structure (Extend)

```
golfphysics-website/
├── src/
│   ├── pages/
│   │   ├── Home.jsx (REBUILD)
│   │   ├── ProfessionalAPI.jsx (NEW)
│   │   ├── GamingAPI.jsx (NEW)
│   │   ├── Pricing.jsx (REBUILD)
│   │   ├── Science.jsx (NEW)
│   │   ├── About.jsx (NEW)
│   │   ├── Docs.jsx (EXTEND - add Gaming docs)
│   │   └── Contact.jsx (PRESERVE, update copy)
│   ├── components/
│   │   ├── Hero.jsx (REBUILD)
│   │   ├── DualPathNav.jsx (NEW)
│   │   ├── PricingToggle.jsx (NEW)
│   │   ├── ROICalculator.jsx (NEW)
│   │   ├── GameModeCard.jsx (NEW)
│   │   ├── ContactForm.jsx (PRESERVE)
│   │   ├── CodeBlock.jsx (PRESERVE)
│   │   └── ... (rest preserved)
│   └── ...
└── ...
```

### Deployment
- Keep current deployment method (Vercel/Railway/GoDaddy)
- No changes to hosting infrastructure

---

## 📝 IMPLEMENTATION PHASES

### Phase 1: Core Rebuild (Priority 1)
**Goal:** Get dual-market homepage and both API pages live

**Tasks:**
1. ✅ Rebuild Homepage with dual-market hero
2. ✅ Create Professional API page
3. ✅ Create Gaming API page  
4. ✅ Update navigation (dual paths)
5. ✅ Deploy to staging for review

**Timeline:** 8-12 hours
**Deliverable:** 3 core pages showing dual positioning

### Phase 2: Pricing & Science (Priority 2)
**Goal:** Complete the value proposition with pricing and credibility

**Tasks:**
1. ✅ Rebuild Pricing page (dual tiers + ROI calculator)
2. ✅ Create Science page (physics credibility)
3. ✅ Update footer with new page links

**Timeline:** 4-6 hours
**Deliverable:** Complete value chain (problem → solution → proof → pricing)

### Phase 3: Documentation & Support (Priority 3)
**Goal:** Extend docs and finalize site

**Tasks:**
1. ✅ Add Gaming API documentation sections
2. ✅ Create About page
3. ✅ Update Contact page messaging
4. ✅ Final polish and testing

**Timeline:** 4-6 hours
**Deliverable:** Complete website ready for production

---

## 🎯 CONTENT CREATION GUIDELINES

### Tone by Section

**Professional API Content:**
- Precise, professional, data-focused
- Scientific but accessible
- Serious golfers want accuracy
- Example: "Tour-accurate atmospheric adjustments validated within 2%"

**Gaming API Content:**
- Energetic, fun, viral-ready
- Experience and outcomes focused
- Casual golfers want excitement
- Example: "500-yard drives with 150mph tailwinds! Real physics, extreme fun 🚀"

**Science Page:**
- Educational, authoritative
- Show the math but explain it
- Builds credibility for both markets
- Example: "Air density (ρ = P/RT) determines drag force. Less dense air = longer drives."

### Writing Principles

1. **Be Honest:** 500-yard drives are extreme but mathematically accurate
2. **Differentiate:** Professional = realistic, Gaming = extreme (both real physics)
3. **Experience-First:** Focus on golfer outcomes, not API features
4. **Science-Backed:** Always tie claims to real physics

---

## ✅ WHAT TO TELL CLAUDE CODE

### Clear Instructions

**"You are REBUILDING the Golf Physics API website, not just updating it."**

**Reasons:**
1. Business strategy changed from single-market to dual-market
2. 50% of content is entirely new (Gaming API)
3. Information architecture fundamentally different
4. Messaging shifted from technology-focus to experience-focus

**What to Keep:**
- React + Vite tech stack
- Contact form components
- Code example patterns from docs
- Some scientific content (migrate to Science page)
- Design aesthetic (clean, professional)

**What to Rebuild:**
- Homepage (dual-market positioning)
- Pricing (dual tiers structure)
- Everything else is new pages

**What's New:**
- Professional API page
- Gaming API page
- Science page
- About page
- Gaming docs sections
- 10 game mode descriptions
- ROI calculator

**Content Source:**
- Primary: website_architecture_v2.md (this has ALL the new content)
- Reference: Current site structure (for components to preserve)

---

## 📋 DELIVERABLES CHECKLIST

When Claude Code completes the rebuild:

### Phase 1 Deliverables
- [ ] New Homepage (dual-market hero, problem/solution, dual CTAs)
- [ ] Professional API page (complete with all sections)
- [ ] Gaming API page (complete with 10 game modes)
- [ ] Updated navigation (dual paths clear)
- [ ] Staging deployment URL

### Phase 2 Deliverables
- [ ] Pricing page (dual tabs, Professional + Gaming tiers)
- [ ] ROI Calculator (Gaming pricing section)
- [ ] Science page (physics formulas, validation, extreme conditions)
- [ ] Updated footer (all new pages linked)

### Phase 3 Deliverables
- [ ] Gaming API documentation (endpoints, examples)
- [ ] About page (mission, values)
- [ ] Updated Contact page (interest selector)
- [ ] All forms tested and working
- [ ] Mobile responsive
- [ ] Lighthouse score >90
- [ ] Production deployment

### Additional Deliverables
- [ ] Build/deployment instructions
- [ ] Content update guide
- [ ] Component documentation
- [ ] Migration notes (what changed from old site)

---

## 🚨 CRITICAL REMINDERS FOR CLAUDE CODE

### DO:
- ✅ Read website_architecture_v2.md FIRST (it has all content)
- ✅ Preserve React + Vite stack
- ✅ Keep contact form working
- ✅ Maintain professional design aesthetic
- ✅ Use all content from architecture doc (don't make up content)
- ✅ Test dual-market navigation thoroughly
- ✅ Ensure both API paths are equally prominent

### DON'T:
- ❌ Try to "update" existing pages - they need rebuilding
- ❌ Reuse old homepage hero - it's single-market
- ❌ Keep old pricing structure - it's professional-only
- ❌ Make up game mode names - use exact ones from doc
- ❌ Simplify the science - show the real formulas
- ❌ Skip the ROI calculator - it's critical for gaming sales

---

## 🎓 SUCCESS CRITERIA

The rebuild is successful when:

1. ✅ **Dual positioning is clear** - Professional and Gaming paths obvious
2. ✅ **Each market has dedicated page** - Not just sections on one page
3. ✅ **Game modes are detailed** - All 10 with descriptions, not just names
4. ✅ **Science is prominent** - Credibility established for both markets
5. ✅ **Pricing is dual** - Separate tiers for each market with clear ROI
6. ✅ **Experience-focused** - Messaging about golfer outcomes, not tech specs
7. ✅ **Mobile works perfectly** - Responsive on all devices
8. ✅ **Fast performance** - <2 second load times

---

## 📞 QUESTIONS & SUPPORT

If Claude Code needs clarification:

**About dual-market strategy:**
- Read the Executive Summary in this doc
- Professional = inRange (training), Gaming = Topgolf (entertainment)

**About content:**
- ALL content is in website_architecture_v2.md
- Use it verbatim - it's been carefully crafted

**About what to preserve:**
- Check "Content Migration Map" section in this doc
- When in doubt, rebuild > update

**About technical implementation:**
- Keep current tech stack
- Extend file structure (don't delete, add new)
- Test thoroughly before each phase delivery

---

**END OF IMPLEMENTATION GUIDE**

This document provides everything Claude Code needs to successfully rebuild the Golf Physics API website to reflect the new dual-market strategy while preserving what works from the current site.
