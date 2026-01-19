# Multi-Language Support Specification
## Golf Physics API - Internationalization (i18n)

---

## 🌍 OVERVIEW

Strategy for supporting multiple languages across the Golf Physics API ecosystem.

**Components to localize:**
1. API error messages and responses
2. Admin dashboard UI
3. Marketing website
4. Documentation
5. Email notifications

---

## 📊 GOLF MARKET ANALYSIS

### Top Golf Markets by Language

Based on rounds played, golf technology adoption, and market size:

| Priority | Language | Key Markets | Golf Market Size | Tech Adoption |
|----------|----------|-------------|------------------|---------------|
| **1** | English | USA, UK, Australia, Canada, Ireland | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **2** | Japanese | Japan | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **3** | Korean | South Korea | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **4** | Spanish | Spain, Latin America | ⭐⭐⭐ | ⭐⭐⭐ |
| **5** | German | Germany, Austria, Switzerland | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 6 | French | France, Belgium | ⭐⭐ | ⭐⭐⭐ |
| 7 | Chinese | China, Taiwan | ⭐⭐⭐ | ⭐⭐⭐ |
| 8 | Portuguese | Brazil | ⭐⭐ | ⭐⭐ |

### Technology Company Analysis

**Your target customers (launch monitor/golf tech companies):**

| Company | HQ Location | Primary Language | Secondary Markets |
|---------|-------------|------------------|-------------------|
| **inRange** | USA | English | Global (all languages) |
| **TrackMan** | Denmark | English | Europe, Asia |
| **Foresight Sports** | USA | English | Global |
| **Full Swing** | USA | English | Global |
| **Rapsodo** | Singapore | English | Asia, Global |
| **SkyTrak** | USA | English | Global |
| **Arccos** | USA | English | Global |
| **GolfBuddy** | South Korea | Korean | English, Japanese |
| **Garmin** | USA | English | Global (many languages) |

**Key Insight:** Most golf tech companies operate in English but serve global markets. They need your API to support their local market languages.

---

## 🎯 RECOMMENDED PHASED APPROACH

### Phase 1: Launch (English Only)
**Why:** 
- Your primary customers (inRange, etc.) are English-speaking companies
- Get to market faster
- Validate product-market fit first

**Supported:**
- English (US/UK variants handled gracefully)

### Phase 2: Asia Expansion (3 months post-launch)
**Why:**
- Japan and Korea are massive golf + tech markets
- High willingness to pay
- Less competition in localized APIs

**Add:**
- Japanese (日本語)
- Korean (한국어)

### Phase 3: European Expansion (6 months post-launch)
**Why:**
- European golf tech market growing
- German and Spanish markets significant

**Add:**
- German (Deutsch)
- Spanish (Español)

### Phase 4: Global (12 months)
**Add as demand requires:**
- French (Français)
- Simplified Chinese (简体中文)
- Portuguese (Português)

---

## 🔧 IMPLEMENTATION STRATEGY

### 1. API Response Localization

#### Option A: Separate Localized Responses (Not Recommended)

```json
// English
{
  "error": "Invalid API key",
  "message": "The API key you provided is not valid"
}

// Japanese
{
  "error": "無効なAPIキー",
  "message": "提供されたAPIキーは無効です"
}
```

**Problems:**
- Clients need to handle multiple response formats
- Difficult to maintain
- Breaking changes when adding languages

#### Option B: Include Both Code and Message (Recommended)

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The API key you provided is not valid",
    "localized_message": "提供されたAPIキーは無効です"
  },
  "lang": "ja"
}
```

**Pros:**
- Clients can use `code` for logic
- Display `localized_message` to end users
- Backwards compatible

#### Option C: Client-Side Localization Only (Best for B2B)

```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The API key you provided is not valid"
  }
}
```

**Client handles localization:**
```javascript
const ERROR_MESSAGES = {
  en: {
    INVALID_API_KEY: "The API key you provided is not valid"
  },
  ja: {
    INVALID_API_KEY: "提供されたAPIキーは無効です"
  },
  ko: {
    INVALID_API_KEY: "제공된 API 키가 유효하지 않습니다"
  }
};

// Client code
const errorMessage = ERROR_MESSAGES[userLanguage][error.code];
```

**Recommendation for Golf Physics API:**
- **Use Option C** - Your customers are B2B tech companies
- They'll handle end-user localization themselves
- Keep API responses in English with clear error codes
- Provide translation files as a resource

**However, localize these components:**
- Admin dashboard (you control this)
- Marketing website (you control this)
- Documentation (you control this)
- Email notifications (you send these)

---

### 2. Admin Dashboard Localization

**Full i18n implementation using react-i18next**

#### Setup

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

#### Translation Files Structure

```
src/
├── locales/
│   ├── en/
│   │   ├── common.json
│   │   ├── dashboard.json
│   │   ├── api-keys.json
│   │   ├── usage.json
│   │   └── logs.json
│   ├── ja/
│   │   ├── common.json
│   │   ├── dashboard.json
│   │   └── ...
│   ├── ko/
│   │   └── ...
│   ├── de/
│   │   └── ...
│   └── es/
│       └── ...
```

#### Example Translation File

**en/common.json:**
```json
{
  "app_name": "Golf Physics Admin",
  "navigation": {
    "dashboard": "Dashboard",
    "api_keys": "API Keys",
    "usage": "Usage",
    "logs": "Logs",
    "playground": "API Test"
  },
  "actions": {
    "create": "Create",
    "edit": "Edit",
    "delete": "Delete",
    "save": "Save",
    "cancel": "Cancel",
    "search": "Search",
    "filter": "Filter",
    "export": "Export",
    "refresh": "Refresh"
  },
  "units": {
    "toggle": "Toggle Units",
    "imperial": "Imperial (°F, yards, mph)",
    "metric": "Metric (°C, meters, km/h)"
  },
  "time": {
    "just_now": "Just now",
    "minutes_ago": "{{count}} minute ago",
    "minutes_ago_plural": "{{count}} minutes ago",
    "hours_ago": "{{count}} hour ago",
    "hours_ago_plural": "{{count}} hours ago"
  }
}
```

**ja/common.json:**
```json
{
  "app_name": "Golf Physics 管理画面",
  "navigation": {
    "dashboard": "ダッシュボード",
    "api_keys": "APIキー",
    "usage": "使用状況",
    "logs": "ログ",
    "playground": "APIテスト"
  },
  "actions": {
    "create": "作成",
    "edit": "編集",
    "delete": "削除",
    "save": "保存",
    "cancel": "キャンセル",
    "search": "検索",
    "filter": "フィルター",
    "export": "エクスポート",
    "refresh": "更新"
  },
  "units": {
    "toggle": "単位を切り替え",
    "imperial": "ヤード・ポンド法 (°F, ヤード, mph)",
    "metric": "メートル法 (°C, メートル, km/h)"
  },
  "time": {
    "just_now": "たった今",
    "minutes_ago": "{{count}}分前",
    "hours_ago": "{{count}}時間前"
  }
}
```

**ko/common.json:**
```json
{
  "app_name": "Golf Physics 관리자",
  "navigation": {
    "dashboard": "대시보드",
    "api_keys": "API 키",
    "usage": "사용량",
    "logs": "로그",
    "playground": "API 테스트"
  },
  "actions": {
    "create": "생성",
    "edit": "수정",
    "delete": "삭제",
    "save": "저장",
    "cancel": "취소",
    "search": "검색",
    "filter": "필터",
    "export": "내보내기",
    "refresh": "새로고침"
  }
}
```

#### i18n Configuration

```javascript
// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enDashboard from './locales/en/dashboard.json';
import jaCommon from './locales/ja/common.json';
import jaDashboard from './locales/ja/dashboard.json';
import koCommon from './locales/ko/common.json';
import koDashboard from './locales/ko/dashboard.json';

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    resources: {
      en: {
        common: enCommon,
        dashboard: enDashboard,
      },
      ja: {
        common: jaCommon,
        dashboard: jaDashboard,
      },
      ko: {
        common: koCommon,
        dashboard: koDashboard,
      }
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
```

#### Using Translations in Components

```javascript
// Dashboard.jsx

import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t, i18n } = useTranslation(['dashboard', 'common']);
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <div>
      {/* Language selector */}
      <div className="language-selector">
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('ja')}>日本語</button>
        <button onClick={() => changeLanguage('ko')}>한국어</button>
      </div>
      
      {/* Translated content */}
      <h1>{t('common:app_name')}</h1>
      <h2>{t('dashboard:welcome_message')}</h2>
      
      {/* Navigation */}
      <nav>
        <a href="/dashboard">{t('common:navigation.dashboard')}</a>
        <a href="/api-keys">{t('common:navigation.api_keys')}</a>
        <a href="/usage">{t('common:navigation.usage')}</a>
      </nav>
      
      {/* Actions */}
      <button>{t('common:actions.create')}</button>
      <button>{t('common:actions.refresh')}</button>
      
      {/* Plurals */}
      <p>{t('common:time.minutes_ago', { count: 5 })}</p>
    </div>
  );
}
```

#### Language Selector Component

```javascript
// LanguageSelector.jsx

import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLang = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLang.flag} {currentLang.name}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                lang.code === i18n.language ? 'bg-gray-50 font-bold' : ''
              }`}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### 3. Marketing Website Localization

#### Recommended Approach: Separate Pages

**URL Structure:**
```
https://golfphysics.io/          → English (default)
https://golfphysics.io/ja/       → Japanese
https://golfphysics.io/ko/       → Korean
https://golfphysics.io/de/       → German
https://golfphysics.io/es/       → Spanish
```

#### Implementation

```javascript
// Use react-i18next or next-i18next

// pages/index.jsx
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation('home');
  
  return (
    <>
      <h1>{t('hero.headline')}</h1>
      <p>{t('hero.subheadline')}</p>
      <button>{t('hero.cta_primary')}</button>
    </>
  );
}
```

#### Translation Files for Website

**locales/en/home.json:**
```json
{
  "hero": {
    "headline": "Weather Data + Physics Calculations Purpose-Built for Golf",
    "subheadline": "Turn environmental data into actionable insights your golfers can trust",
    "cta_primary": "Get Free API Key",
    "cta_secondary": "View Documentation"
  },
  "features": {
    "realtime": {
      "title": "Real-Time Data",
      "description": "Updates every 5 minutes for tournament-grade reliability"
    },
    "hyperlocal": {
      "title": "Hyperlocal Precision",
      "description": "Course-specific microclimates, hole-by-hole accuracy"
    }
  }
}
```

**locales/ja/home.json:**
```json
{
  "hero": {
    "headline": "ゴルフに特化した気象データと物理計算",
    "subheadline": "環境データをゴルファーが信頼できる実用的な洞察に変換",
    "cta_primary": "無料APIキーを取得",
    "cta_secondary": "ドキュメントを見る"
  },
  "features": {
    "realtime": {
      "title": "リアルタイムデータ",
      "description": "トーナメントレベルの信頼性のため5分ごとに更新"
    },
    "hyperlocal": {
      "title": "超局地的精度",
      "description": "コース固有の微気候、ホール単位の精度"
    }
  }
}
```

#### Language Selector for Website

```javascript
// components/LanguageSwitcher.jsx

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale, locales } = router;
  
  const changeLanguage = (newLocale) => {
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };
  
  return (
    <select 
      value={locale} 
      onChange={(e) => changeLanguage(e.target.value)}
      className="px-3 py-1 border rounded"
    >
      <option value="en">English</option>
      <option value="ja">日本語</option>
      <option value="ko">한국어</option>
      <option value="de">Deutsch</option>
      <option value="es">Español</option>
    </select>
  );
}
```

---

### 4. Documentation Localization

#### Strategy: Start with Auto-Translation, Refine Over Time

**Phase 1:** English only
**Phase 2:** Auto-translate to Japanese, Korean with human review
**Phase 3:** Professional translation for technical accuracy

#### Structure

```
docs/
├── en/
│   ├── getting-started.md
│   ├── authentication.md
│   ├── endpoints/
│   │   ├── weather.md
│   │   └── calculate.md
│   └── sdks/
│       ├── javascript.md
│       └── python.md
├── ja/
│   ├── getting-started.md
│   └── ...
├── ko/
│   └── ...
└── ...
```

#### Documentation Translation Priority

**Tier 1 (Translate First):**
- Getting Started
- Authentication
- API Reference (endpoints)
- Error codes

**Tier 2 (Translate Later):**
- Guides & tutorials
- SDK documentation
- Best practices

**Tier 3 (Low Priority):**
- Blog posts
- Case studies
- FAQ

---

### 5. Email Notifications Localization

Store user's preferred language in database:

```sql
ALTER TABLE api_keys 
ADD COLUMN preferred_language VARCHAR(5) DEFAULT 'en';
```

**Email templates:**

```python
# email_templates.py

EMAIL_TEMPLATES = {
    'welcome': {
        'en': {
            'subject': 'Welcome to Golf Physics API',
            'body': '''
            Hi {name},
            
            Welcome to Golf Physics API! Your API key is ready.
            
            API Key: {api_key}
            
            Get started: https://golfphysics.io/docs
            '''
        },
        'ja': {
            'subject': 'Golf Physics APIへようこそ',
            'body': '''
            {name}様
            
            Golf Physics APIへようこそ！APIキーの準備ができました。
            
            APIキー: {api_key}
            
            開始方法: https://golfphysics.io/ja/docs
            '''
        },
        'ko': {
            'subject': 'Golf Physics API에 오신 것을 환영합니다',
            'body': '''
            {name}님,
            
            Golf Physics API에 오신 것을 환영합니다! API 키가 준비되었습니다.
            
            API 키: {api_key}
            
            시작하기: https://golfphysics.io/ko/docs
            '''
        }
    }
}

def send_welcome_email(user_email, api_key, name, language='en'):
    template = EMAIL_TEMPLATES['welcome'].get(language, EMAIL_TEMPLATES['welcome']['en'])
    
    subject = template['subject']
    body = template['body'].format(name=name, api_key=api_key)
    
    send_email(user_email, subject, body)
```

---

## 🎨 UI/UX CONSIDERATIONS

### Right-to-Left (RTL) Support

Not needed for golf markets (no Arabic, Hebrew, etc. initially)

### Date/Time Formatting

Use locale-aware formatting:

```javascript
// Use Intl.DateTimeFormat
const formatDate = (date, locale) => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// English: "January 17, 2026, 2:30 PM"
// Japanese: "2026年1月17日 14:30"
// Korean: "2026년 1월 17일 오후 2:30"
```

### Number Formatting

```javascript
// Use Intl.NumberFormat
const formatNumber = (number, locale) => {
  return new Intl.NumberFormat(locale).format(number);
};

// English: "1,234.56"
// German: "1.234,56"
// Japanese: "1,234.56"
```

### Currency

```javascript
const formatCurrency = (amount, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// English (US): "$49.00"
// Japanese: "¥5,500"
// Korean: "₩55,000"
// German: "45,00 €"
```

---

## 💰 PRICING BY REGION

Consider regional pricing variations:

```javascript
const PRICING = {
  'en-US': { free: 0, standard: 49, enterprise: 'custom', currency: 'USD' },
  'en-UK': { free: 0, standard: 39, enterprise: 'custom', currency: 'GBP' },
  'ja-JP': { free: 0, standard: 5500, enterprise: 'custom', currency: 'JPY' },
  'ko-KR': { free: 0, standard: 55000, enterprise: 'custom', currency: 'KRW' },
  'de-DE': { free: 0, standard: 45, enterprise: 'custom', currency: 'EUR' },
  'es-ES': { free: 0, standard: 45, enterprise: 'custom', currency: 'EUR' },
};
```

---

## 📊 TRANSLATION MANAGEMENT

### Tools & Services

**For Professional Translation:**
- **Lokalise** - Translation management platform
- **Crowdin** - Community translation
- **POEditor** - Simple translation management

**For Machine Translation (Initial):**
- **DeepL API** - Best quality for technical content
- **Google Translate API** - Good coverage
- Manual review by native speakers

### Translation Workflow

1. **Developer adds new text** → Add to en/common.json
2. **CI/CD detects new keys** → Flag for translation
3. **Auto-translate with DeepL** → Create draft translations
4. **Native speaker reviews** → Refine technical accuracy
5. **Merge to production** → Deploy updated translations

---

## 🧪 TESTING

### Test All Languages

```javascript
describe('Internationalization', () => {
  it('should display dashboard in Japanese', () => {
    i18n.changeLanguage('ja');
    render(<Dashboard />);
    
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
  });
  
  it('should format numbers correctly for each locale', () => {
    expect(formatNumber(1234.56, 'en')).toBe('1,234.56');
    expect(formatNumber(1234.56, 'de')).toBe('1.234,56');
  });
  
  it('should format dates correctly for each locale', () => {
    const date = new Date('2026-01-17T14:30:00Z');
    expect(formatDate(date, 'en')).toContain('January');
    expect(formatDate(date, 'ja')).toContain('1月');
  });
});
```

---

## 🚀 ROLLOUT TIMELINE

### Immediate (Phase 1)
- ✅ English only
- ✅ Prepare i18n infrastructure
- ✅ Plan translation strategy

### Month 3 (Phase 2)
- ✅ Add Japanese
- ✅ Add Korean
- ✅ Translate admin dashboard
- ✅ Translate key marketing pages
- ✅ Translate essential docs

### Month 6 (Phase 3)
- ✅ Add German
- ✅ Add Spanish
- ✅ Complete documentation translation
- ✅ Regional pricing

### Month 12 (Phase 4)
- ✅ Add French, Chinese, Portuguese as needed
- ✅ Community translation contributions
- ✅ Localized case studies

---

## 💡 MY RECOMMENDATIONS

### For Launch (Now):

**1. API Responses:**
- Keep in English
- Use clear error codes
- Your B2B customers will handle end-user localization

**2. Admin Dashboard:**
- English only initially
- Build with i18n from day 1 (easier to add later)
- Add Japanese/Korean in Phase 2

**3. Website:**
- English only for launch
- SEO-friendly URL structure for future languages
- Add auto-detect with language selector

**4. Documentation:**
- English only
- Structure for easy translation later
- Code examples are mostly language-agnostic anyway

### Priority Languages (in order):

1. **English** - Launch, your primary market
2. **Japanese** - Month 3 (huge golf tech market)
3. **Korean** - Month 3 (big golf tech market)
4. **German** - Month 6 (Europe expansion)
5. **Spanish** - Month 6 (Spain + Latin America)

### Don't Worry About:

- **API response localization** - B2B customers handle this
- **French, Chinese, Portuguese** - Add only if customer demand
- **Perfect translations** - Start with machine + review, improve over time

---

## ✅ LAUNCH CHECKLIST

**Before Launch:**
- [x] API in English with clear error codes
- [x] Admin dashboard in English
- [x] Website in English
- [x] Documentation in English
- [x] i18n infrastructure ready (but only English content)

**Month 3 (Asia Expansion):**
- [ ] Admin dashboard in Japanese
- [ ] Admin dashboard in Korean
- [ ] Key website pages in Japanese
- [ ] Key website pages in Korean
- [ ] Essential docs in Japanese
- [ ] Essential docs in Korean

**Month 6 (Europe Expansion):**
- [ ] Add German and Spanish
- [ ] Complete doc translation for all languages
- [ ] Regional pricing

---

## 📝 TECHNICAL NOTES

### Storage

Store user language preference:
```sql
-- In api_keys table
ALTER TABLE api_keys 
ADD COLUMN preferred_language VARCHAR(5) DEFAULT 'en';

-- In admin_users table (for dashboard)
ALTER TABLE admin_users
ADD COLUMN preferred_language VARCHAR(5) DEFAULT 'en';
```

### Environment Variables

```env
# Supported languages (comma-separated)
SUPPORTED_LANGUAGES=en,ja,ko,de,es

# Default language
DEFAULT_LANGUAGE=en

# Translation service API key (DeepL)
DEEPL_API_KEY=your_key_here
```

---

END OF MULTI-LANGUAGE SPECIFICATION
