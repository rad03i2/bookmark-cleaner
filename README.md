# Bookmark Cleaner

A privacy-first TypeScript CLI for auditing and cleaning browser bookmark exports without uploading browsing data anywhere.

## English

### Why it exists
Bookmark collections accumulate duplicate links, tracking parameters, fragments, and unsupported URL schemes. Bookmark Cleaner reads the standard Netscape HTML export used by major browsers, reports problems, and writes a conservative cleaned copy while leaving the original untouched.

### Features
- Parse Netscape-format bookmark HTML locally.
- Audit total, unique, duplicate, and invalid/unsupported entries.
- Deduplicate equivalent HTTP/HTTPS URLs.
- Remove URL fragments and common tracking parameters (`utm_*`, `fbclid`, `gclid`).
- Normalize host names, default ports, trailing slashes, and query ordering.
- Preserve the first bookmark's title and `ADD_DATE` when duplicates collapse.
- Export importable Netscape bookmark HTML.
- JSON audit output for scripts and automation.
- Refuse in-place writes and refuse replacing output unless `--overwrite` is explicit.
- No telemetry, API keys, accounts, or network requests.

### Requirements & installation
Node.js 20+ and npm are required.

```bash
git clone https://github.com/rad03i2/bookmark-cleaner.git
cd bookmark-cleaner
npm install
npm run build
```

Run directly with `node dist/cli.js`, or use `npm link` after building to expose `bookmark-cleaner` globally.

### Usage
Export bookmarks from your browser as HTML, then audit them:

```bash
node dist/cli.js audit bookmarks.html
node dist/cli.js audit bookmarks.html --json
```

Write a cleaned copy:

```bash
node dist/cli.js clean bookmarks.html --output bookmarks-clean.html
```

If the output already exists, the command fails safely. Add `--overwrite` only when replacement is intentional.

### Preview guidance
This is a CLI project, so screenshots are optional. A useful README preview would show the `audit` summary and a browser import of `bookmarks-clean.html`; never publish a screenshot containing private bookmark URLs.

### Configuration
There are no environment variables or configuration files. Behavior is intentionally explicit through CLI arguments.

### Project structure
```text
src/bookmarks.ts       parser, canonicalization, audit, cleanup, export
src/cli.ts             command-line interface
tests/bookmarks.test.ts core behavior tests
.github/workflows/ci.yml cross-platform CI
```

### Testing
```bash
npm run lint
npm test
```

CI performs type checking, builds, and runs tests on Node 20/22 across Ubuntu, Windows, and macOS.

### Security & privacy
Bookmark files can contain sensitive URLs. Processing is local and this project performs no network requests. Cleaned output accepts only HTTP/HTTPS URLs; unsupported schemes such as `javascript:` and `file:` are omitted. Review `SECURITY.md` before using sensitive exports.

### Limitations
- Folder hierarchy, separators, icons, tags, and browser-specific attributes are not preserved; cleaned output is a flat bookmark list.
- This tool does not test link availability, phishing risk, redirects, or remote content.
- URL canonicalization is intentionally conservative and cannot know site-specific equivalence rules.
- Input must be a Netscape-style HTML export.

### Optional roadmap
Future work may preserve folder hierarchy and add opt-in domain-specific normalization, provided those features remain deterministic and privacy-preserving.

### Contributing & license
See `CONTRIBUTING.md`. Licensed under the MIT License; see `LICENSE`.

### Author
**Radwan Abdulhadi Ahmed**  
**رضوان عبدالهادي أحمد**  
GitHub: **@rad03i2**

---

## العربية

### نبذة وسبب إنشاء المشروع
**Bookmark Cleaner** أداة سطر أوامر مكتوبة بـTypeScript لتدقيق وتنظيف ملفات الإشارات المرجعية المصدّرة من المتصفح محليًا، من دون رفع سجل الروابط إلى أي خدمة خارجية. تتراكم مع الوقت الروابط المكررة ومعلمات التتبع والأجزاء `#fragment`، لذلك توفر الأداة تقريرًا واضحًا وتنتج نسخة منظفة مع إبقاء الملف الأصلي دون تعديل.

### المزايا
- قراءة ملفات الإشارات بصيغة Netscape HTML المستخدمة في تصدير المتصفحات الشائعة.
- إحصاء العدد الكلي والروابط الفريدة والمكررة وغير الصالحة أو غير المدعومة.
- إزالة التكرار بين روابط HTTP/HTTPS المتكافئة.
- حذف أجزاء الرابط ومعلمات التتبع الشائعة مثل `utm_*` و`fbclid` و`gclid`.
- توحيد اسم المضيف والمنفذ الافتراضي والشرطة النهائية وترتيب معاملات الاستعلام.
- الاحتفاظ بعنوان أول إشارة وتاريخ `ADD_DATE` عند دمج المكرر.
- إخراج HTML يمكن استيراده مجددًا في المتصفح.
- إخراج JSON للتدقيق والأتمتة.
- منع الكتابة فوق ملف الإدخال ومنع استبدال الناتج إلا عند طلب `--overwrite` صراحةً.
- لا توجد اتصالات شبكة أو Telemetry أو مفاتيح API.

### المتطلبات والتثبيت
تحتاج إلى Node.js 20 أو أحدث وnpm.

```bash
git clone https://github.com/rad03i2/bookmark-cleaner.git
cd bookmark-cleaner
npm install
npm run build
```

### الاستخدام
بعد تصدير الإشارات من المتصفح بصيغة HTML:

```bash
node dist/cli.js audit bookmarks.html
node dist/cli.js audit bookmarks.html --json
node dist/cli.js clean bookmarks.html --output bookmarks-clean.html
```

إذا كان ملف الناتج موجودًا فسيتوقف الأمر بأمان. استخدم `--overwrite` فقط عندما تريد الاستبدال فعلًا.

### المعاينة
لأن المشروع CLI فلا يحتاج إلى واجهة رسومية. عند إضافة صورة للمستودع يفضّل أن تعرض نتيجة `audit` فقط، مع إخفاء أي روابط شخصية أو حساسة.

### الإعداد
لا توجد متغيرات بيئة أو ملفات إعداد. جميع الخيارات صريحة عبر سطر الأوامر.

### بنية المشروع
`src/bookmarks.ts` يحتوي المحرك، و`src/cli.ts` واجهة الأوامر، و`tests/` للاختبارات، و`.github/workflows/ci.yml` للتكامل المستمر متعدد الأنظمة.

### الاختبارات
```bash
npm run lint
npm test
```

يشغّل CI فحص TypeScript والبناء والاختبارات على Node 20 و22 في Ubuntu وWindows وmacOS.

### الأمان والخصوصية
قد تكشف ملفات الإشارات معلومات حساسة عن التصفح. المعالجة محلية بالكامل ولا تقوم الأداة بطلبات شبكة. النسخة المنظفة تقبل HTTP/HTTPS فقط وتحذف المخططات غير المدعومة مثل `javascript:` و`file:`. راجع `SECURITY.md` عند التعامل مع بيانات حساسة.

### القيود
- لا يتم حاليًا الحفاظ على هيكل المجلدات والفواصل والأيقونات والوسوم وخصائص المتصفح الإضافية؛ الناتج قائمة مسطحة.
- لا تفحص الأداة توفر المواقع أو التصيد أو إعادة التوجيه أو المحتوى البعيد.
- توحيد الروابط محافظ ولا يستطيع معرفة قواعد التكافؤ الخاصة بكل موقع.
- الإدخال يجب أن يكون تصدير HTML بصيغة Netscape.

### تطويرات مستقبلية اختيارية
يمكن لاحقًا إضافة الحفاظ على المجلدات وقواعد توحيد اختيارية خاصة بالنطاقات، بشرط بقاء السلوك حتميًا ومحافظًا على الخصوصية.

### المساهمة والترخيص
راجع `CONTRIBUTING.md`. المشروع مرخص برخصة MIT الموجودة في `LICENSE`.

### المؤلف
**Radwan Abdulhadi Ahmed**  
**رضوان عبدالهادي أحمد**  
GitHub: **@rad03i2**
