# PROMPT FOR CLAUDE CODE - Add Global Market Support

**Give this prompt to Claude Code AFTER the website is complete**

---

```
I need you to add international market support to the Golf Physics API.

**READ THESE SPECIFICATIONS FIRST:**

1. C:\Users\Vtorr\OneDrive\GolfWeatherAPI\golf-admin\MULTI_UNIT_SUPPORT.md
2. C:\Users\Vtorr\OneDrive\GolfWeatherAPI\golf-admin\MULTI_LANGUAGE_SUPPORT.md

These documents contain complete specifications for:
- Multi-unit support (Imperial vs Metric)
- Multi-language support (i18n strategy)

---

## OVERVIEW

We need to serve global golf technology companies (like inRange, TrackMan, etc.) who operate worldwide. This requires:

1. **Unit System Support:** Imperial (US) and Metric (International)
2. **Language Support:** Initially English, with infrastructure for future languages

---

## PHASE 1: MULTI-UNIT SUPPORT (Do This First)

### TASK 1: Backend - Add Unit Conversion System (2-3 hours)

1. **Create conversion utilities**
   - Location: `backend/utils/conversions.py`
   - Implement UnitConverter class per spec
   - All conversions: temp, distance, speed, pressure, etc.

2. **Update API endpoints**
   - Add `units` parameter (default: `imperial`)
   - Accept values: `imperial` | `metric`
   - Return BOTH unit systems in every response (dual-unit approach)
   
3. **Update response format**
   - Change from single values to objects with both units
   - Example:
     ```json
     {
       "temperature": {
         "fahrenheit": 72,
         "celsius": 22
       },
       "wind_speed": {
         "mph": 15,
         "kmh": 24
       }
     }
     ```

4. **Store internally in metric**
   - Database stores everything in SI units (metric)
   - Convert to imperial on output
   - No schema changes needed

5. **Add validation**
   - Validate `units` parameter
   - Return clear error for invalid values

6. **Write tests**
   - Unit tests for all conversions
   - Integration tests for API endpoints
   - Test both unit parameters

**Deliverable:**
- Conversion utility functions
- Updated API endpoints
- Test suite passing
- API returns both units in all responses

---

### TASK 2: Admin Dashboard - Add Unit Toggle (1-2 hours)

1. **Add unit preference toggle**
   - Location: All components (Dashboard, ApiKeys, Usage, Logs)
   - Toggle between Imperial and Metric
   - Store preference in localStorage

2. **Create display helpers**
   ```javascript
   const formatTemp = (tempData, units) => {
     return units === 'imperial' 
       ? `${tempData.fahrenheit}°F`
       : `${tempData.celsius}°C`;
   };
   ```

3. **Update all data displays**
   - Temperature: °F / °C
   - Distance: yards / meters
   - Speed: mph / km/h
   - Show units based on preference

4. **Add unit selector to header**
   - Toggle switch component
   - Show current preference
   - Persist across sessions

**Deliverable:**
- Unit toggle in UI
- All data displays respect preference
- Preference persists in localStorage

---

### TASK 3: Website - Document Multi-Unit Support (1 hour)

1. **Update API documentation**
   - Add `units` parameter to all endpoint docs
   - Show examples with both units
   - Explain dual-unit response format

2. **Update code examples**
   - Show imperial example
   - Show metric example
   - Show how to use both units

3. **Add to features section**
   - "Global Units Support" feature
   - Imperial & Metric explanation

**Deliverable:**
- Updated documentation
- Code examples with units parameter
- Feature highlighted on website

---

## PHASE 2: MULTI-LANGUAGE INFRASTRUCTURE (Do After Units)

### TASK 4: Setup i18n Framework (1-2 hours)

**Admin Dashboard Only (For Now)**

1. **Install dependencies**
   ```bash
   npm install i18next react-i18next i18next-browser-languagedetector
   ```

2. **Create i18n configuration**
   - Location: `src/i18n.js`
   - Configure language detection
   - Set fallback to English

3. **Create translation file structure**
   ```
   src/locales/
   ├── en/
   │   ├── common.json
   │   ├── dashboard.json
   │   ├── api-keys.json
   │   ├── usage.json
   │   └── logs.json
   └── [Future: ja/, ko/, de/, es/]
   ```

4. **Add English translations**
   - Extract all UI text to translation files
   - Use translation keys in components
   - Test that English still works

5. **Add language selector component**
   - Dropdown with language options
   - Currently only shows English
   - Ready for future languages

**Note:** Only implement English for now. Infrastructure is ready for Japanese, Korean, German, Spanish when needed.

**Deliverable:**
- i18n framework installed
- All text in translation files
- Language selector (English only for now)
- System ready for future languages

---

### TASK 5: Prepare Website for i18n (1 hour)

1. **Setup URL structure**
   - Configure for future paths: `/`, `/ja/`, `/ko/`, etc.
   - Currently only serve `/` (English)

2. **Extract strings**
   - Move all text to translation files
   - Keep English as only language

3. **Add language switcher**
   - Show in header
   - Currently only English available
   - Ready to add languages later

**Deliverable:**
- Website structured for i18n
- English working
- Ready for future translations

---

## WHAT NOT TO DO (Important!)

**Don't implement yet:**
- ❌ Actual Japanese, Korean, German, Spanish translations (not until Month 3-6)
- ❌ API response localization (B2B customers handle this)
- ❌ Separate localized documentation (start with English only)

**Do implement:**
- ✅ Multi-unit support (both imperial and metric)
- ✅ i18n infrastructure (framework only, English content)
- ✅ Language selector UI (ready for future languages)

---

## TESTING REQUIREMENTS

### Unit System Testing

1. **API Endpoints**
   ```bash
   # Test default (imperial)
   curl "https://api.golfphysics.io/weather?lat=33.7&lon=-84.4"
   
   # Test explicit metric
   curl "https://api.golfphysics.io/weather?lat=33.7&lon=-84.4&units=metric"
   
   # Test invalid units
   curl "https://api.golfphysics.io/weather?lat=33.7&lon=-84.4&units=invalid"
   ```

2. **Verify dual-unit responses**
   - Check temperature has both °F and °C
   - Check distances have both yards and meters
   - Check wind has both mph and km/h

3. **Admin Dashboard**
   - Toggle between units
   - Verify displays update
   - Verify preference persists

### i18n Testing

1. **Translation loading**
   - All text comes from translation files
   - No hardcoded strings in components

2. **Language detection**
   - Defaults to English
   - Respects user preference

---

## DEPLOYMENT CHECKLIST

**Before deploying:**
- [ ] All conversion tests passing
- [ ] API returns both units correctly
- [ ] Admin dashboard unit toggle works
- [ ] Unit preference persists
- [ ] Documentation updated
- [ ] Website features updated
- [ ] i18n framework installed (English only)
- [ ] No breaking changes to existing clients
- [ ] Backwards compatible (default to imperial)

---

## DELIVERABLES

When complete, provide:

1. **Backend Updates:**
   - Conversion utility functions
   - Updated API endpoints
   - Test suite

2. **Admin Dashboard:**
   - Unit toggle UI
   - Updated data displays
   - i18n framework

3. **Website:**
   - Updated documentation
   - Code examples with units
   - i18n structure (English only)

4. **Documentation:**
   - Update API reference
   - Add unit support guide
   - Migration guide for existing clients

---

## TIMELINE ESTIMATE

- Multi-unit backend: 2-3 hours
- Multi-unit frontend: 1-2 hours
- Documentation updates: 1 hour
- i18n infrastructure: 1-2 hours
- Testing: 1-2 hours

**Total: ~8-12 hours**

---

## IMPORTANT NOTES

### For Multi-Unit Support:
- **Store metric internally** (SI units are standard for science)
- **Return both systems** (better UX, no extra API calls)
- **Default to imperial** (backwards compatible)
- **Validate units parameter** (prevent errors)

### For Multi-Language:
- **Start with infrastructure only** (English content)
- **Don't translate yet** (wait until Month 3+)
- **Build it right** (easier to add languages later)
- **B2B focus** (customers handle end-user localization)

### Backwards Compatibility:
- Existing clients continue working
- Default behavior unchanged (imperial)
- New clients can specify units
- No breaking changes

---

## START NOW

Begin by:
1. Reading both specification documents
2. Planning your implementation approach
3. Starting with TASK 1 (Backend conversions)
4. Working through tasks in order

Let me know if you have any questions before starting!
```

---

**Note:** This prompt assumes Claude Code has already completed the Production Readiness tasks and the website build.
