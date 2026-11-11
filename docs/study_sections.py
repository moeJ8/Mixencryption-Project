# Bilingual study HTML (inserted between hero and quiz). Placeholder: {study_body}
STUDY_BODY = r"""
<section class="topic" id="goals">
<h2>
  <span class="t en">1. Core security goals: confidentiality, integrity, availability, authenticity</span>
  <span class="t ar">1. الأهداف الأمنية: السرية، التكامل، التوفر، الأصالة</span>
</h2>
<div class="card">
  <div class="def-panel">
    <div class="def-heading"><span class="t en">Definitions — read these first</span><span class="t ar">التعريفات — اقرأها أولاً</span></div>
    <dl class="def-list">
      <dt><span class="t en">Confidentiality</span><span class="t ar">السرية</span></dt>
      <dd><span class="t en">Unauthorized parties must not read or access protected data; only authorized users see the content.</span><span class="t ar">غير المصرح لهم لا يقرأون ولا يصلون للبيانات؛ المصرح لهم فقط يرون المحتوى.</span></dd>
      <dt><span class="t en">Integrity</span><span class="t ar">التكامل</span></dt>
      <dd><span class="t en">Data is not changed in an undetectable way; unauthorized modification can be discovered.</span><span class="t ar">لا يتغيّر المحتوى دون إمكانية اكتشاف ذلك؛ التعديل غير المصرح يُكتشف.</span></dd>
      <dt><span class="t en">Availability</span><span class="t ar">التوفر</span></dt>
      <dd><span class="t en">Systems and data are accessible and usable on demand by authorized users.</span><span class="t ar">الأنظمة والبيانات متاحة لمن له صلاحية عند الحاجة.</span></dd>
      <dt><span class="t en">Authenticity</span><span class="t ar">الأصالة</span></dt>
      <dd><span class="t en">You can trust the identity of a user, host, or message (it is not an impostor).</span><span class="t ar">يمكنك الوثوق بهوية المستخدم أو الخادم أو الرسالة (ليست منتحلة).</span></dd>
    </dl>
  </div>

  <div class="subheading"><span class="t en">Figures &amp; intuition</span><span class="t ar">أشكال وفهم بصري</span></div>
  <figure class="fig-block" aria-hidden="true">
    <svg viewBox="0 0 420 200" class="fig-svg" role="img">
      <rect x="10" y="20" width="120" height="70" rx="12" fill="#1e3a5f" stroke="#5eb3ff" stroke-width="2"/>
      <text x="70" y="58" text-anchor="middle" fill="#e8edf5" font-size="13" font-family="sans-serif">Confidentiality</text>
      <rect x="150" y="20" width="120" height="70" rx="12" fill="#1e3a5f" stroke="#f4a261" stroke-width="2"/>
      <text x="210" y="58" text-anchor="middle" fill="#e8edf5" font-size="13" font-family="sans-serif">Integrity</text>
      <rect x="290" y="20" width="120" height="70" rx="12" fill="#1e3a5f" stroke="#6ee7a0" stroke-width="2"/>
      <text x="350" y="58" text-anchor="middle" fill="#e8edf5" font-size="13" font-family="sans-serif">Availability</text>
      <rect x="80" y="120" width="260" height="70" rx="12" fill="#1e3a5f" stroke="#c4b5fd" stroke-width="2"/>
      <text x="210" y="158" text-anchor="middle" fill="#e8edf5" font-size="13" font-family="sans-serif">Authenticity (who is this?)</text>
      <path d="M70 90 L210 120 M210 90 L210 120 M350 90 L210 120" stroke="#334155" fill="none" stroke-width="2"/>
    </svg>
    <figcaption><span class="t en">Figure 1 — Four goals every mechanism maps to at least one goal.</span><span class="t ar">شكل 1 — أربعة أهداف؛ كل آلية أمنية تخدم هدفاً واحداً على الأقل.</span></figcaption>
  </figure>

  <div class="subheading"><span class="t en">Examples</span><span class="t ar">أمثلة</span></div>
  <ul>
    <li><span class="t en"><strong>Confidentiality:</strong> TLS on online banking stops café Wi‑Fi eavesdropping (vs plaintext HTTP on Wireshark).</span><span class="t ar"><strong>السرية:</strong> TLS على البنك يمنع التنصت على شبكة المقهى.</span></li>
    <li><span class="t en"><strong>Integrity:</strong> Compare SHA-256 of downloaded exam.pdf to hash published on site.</span><span class="t ar"><strong>التكامل:</strong> مقارنة هاش الملف المنزّل بهاش الموقع.</span></li>
    <li><span class="t en"><strong>Availability:</strong> Homework server down at deadline due to SYN flood (DoS).</span><span class="t ar"><strong>التوفر:</strong> الخادم معطّل بسبب حرمان الخدمة.</span></li>
    <li><span class="t en"><strong>Authenticity:</strong> TLS certificate proves real university portal vs phishing clone.</span><span class="t ar"><strong>الأصالة:</strong> شهادة TLS تثبت البوابة الحقيقية.</span></li>
  </ul>

  <div class="example-box">
    <div class="example-title"><span class="t en">Worked scenario</span><span class="t ar">سيناريو تطبيقي</span></div>
    <p><span class="t en">Hospital shares MRI scans between two sites over the Internet.<br/>
    • <strong>Confidentiality:</strong> AES/TLS so scans are not public.<br/>
    • <strong>Integrity:</strong> HMAC or signed manifest so a bit flip is detected.<br/>
    • <strong>Availability:</strong> redundant links + DDoS filtering so ER can always fetch scans.<br/>
    • <strong>Authenticity:</strong> mutual TLS so each site proves its hospital identity.</span>
    <span class="t ar">مستشفى يشارك صور MRI بين موقعين عبر الإنترنت.<br/>
    • <strong>السرية:</strong> AES/TLS.<br/>
    • <strong>التكامل:</strong> HMAC أو قائمة موقّعة.<br/>
    • <strong>التوفر:</strong> روابط احتياطية + فلترة DDoS.<br/>
    • <strong>الأصالة:</strong> TLS متبادل لإثبات هوية المستشفى.</span></p>
  </div>
</div>
</section>

<section class="topic" id="attacks">
<h2>
  <span class="t en">2. Attacks vs security mechanisms vs security services</span>
  <span class="t ar">2. الفرق بين الهجمات والآليات الأمنية والخدمات الأمنية</span>
</h2>
<div class="card">
  <div class="def-panel">
    <div class="def-heading"><span class="t en">Definitions — read these first</span><span class="t ar">التعريفات — اقرأها أولاً</span></div>
    <dl class="def-list">
      <dt><span class="t en">Security attack</span><span class="t ar">هجوم أمني</span></dt>
      <dd><span class="t en">Any deliberate action that violates a security goal (read secrets, alter data, block service, impersonate).</span><span class="t ar">فعل متعمّد يخترق هدفاً أمنياً (سرقة، تعديل، حجب، انتحال).</span></dd>
      <dt><span class="t en">Security mechanism</span><span class="t ar">آلية أمنية</span></dt>
      <dd><span class="t en">A procedure, tool, or algorithm used to enforce protection (encryption, hash, firewall, TLS, nonce, MAC, signature).</span><span class="t ar">إجراء أو أداة أو خوارزمية لفرض الحماية (تشفير، هاش، جدار ناري، TLS، NONCE، MAC، توقيع).</span></dd>
      <dt><span class="t en">Security service</span><span class="t ar">خدمة أمنية</span></dt>
      <dd><span class="t en">The abstract security benefit you need (confidentiality service, integrity service, authentication, non-repudiation, access control). Mechanisms <em>provide</em> services.</span><span class="t ar">المنفعة الأمنية المجردة (سرية، تكامل، مصادقة، عدم إنكار، تحكم بالوصول). الآليات <em>تحقّق</em> الخدمات.</span></dd>
      <dt><span class="t en">Passive attack</span><span class="t ar">هجوم سلبي</span></dt>
      <dd><span class="t en">Attacker <strong>observes</strong> data or traffic but does <strong>not modify</strong> systems or messages (eavesdropping, traffic analysis).</span><span class="t ar">المهاجم <strong>يراقب</strong> دون <strong>تعديل</strong> الأنظمة أو الرسائل (تنصت، تحليل حركة).</span></dd>
      <dt><span class="t en">Active attack</span><span class="t ar">هجوم نشط</span></dt>
      <dd><span class="t en">Attacker <strong>changes, inserts, deletes, or replays</strong> data or disrupts systems (MITM, malware, DoS/DDoS).</span><span class="t ar">المهاجم <strong>يغيّر أو يحقن أو يحذف أو يعيد</strong> البيانات أو يعطّل الأنظمة.</span></dd>
    </dl>
  </div>

  <div class="subheading"><span class="t en">Figures &amp; intuition</span><span class="t ar">أشكال وفهم بصري</span></div>
  <figure class="fig-block">
    <svg viewBox="0 0 440 160" class="fig-svg">
      <text x="70" y="25" fill="#f4a261" font-size="12" font-weight="bold">ATTACK</text>
      <text x="200" y="25" fill="#5eb3ff" font-size="12" font-weight="bold">MECHANISM</text>
      <text x="340" y="25" fill="#6ee7a0" font-size="12" font-weight="bold">SERVICE</text>
      <rect x="20" y="40" width="100" height="50" rx="8" fill="#3b1f1f" stroke="#f87171"/>
      <text x="70" y="70" text-anchor="middle" fill="#fecaca" font-size="11">Threat</text>
      <path d="M120 65 L175 65" stroke="#94a3b8" marker-end="url(#arr)"/>
      <rect x="175" y="40" width="110" height="50" rx="8" fill="#1e3a5f" stroke="#5eb3ff"/>
      <text x="230" y="70" text-anchor="middle" fill="#dbeafe" font-size="10">AES, hash,</text>
      <text x="230" y="82" text-anchor="middle" fill="#dbeafe" font-size="10">TLS, MAC…</text>
      <path d="M285 65 L340 65" stroke="#94a3b8"/>
      <rect x="340" y="40" width="80" height="50" rx="8" fill="#14532d" stroke="#6ee7a0"/>
      <text x="380" y="70" text-anchor="middle" fill="#bbf7d0" font-size="10">CIA+</text>
      <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#94a3b8"/></marker></defs>
    </svg>
    <figcaption><span class="t en">Figure 2 — Mechanisms are tools; services are what you gain; attacks threaten services.</span><span class="t ar">شكل 2 — الآليات أدوات؛ الخدمات مكاسب؛ الهجمات تهدد الخدمات.</span></figcaption>
  </figure>

  <table class="compare-table">
    <tr><th><span class="t en">Passive attack</span><span class="t ar">هجوم سلبي</span></th><th><span class="t en">Active attack</span><span class="t ar">هجوم نشط</span></th></tr>
    <tr>
      <td><span class="t en">Eavesdrop, traffic analysis; bits unchanged</span><span class="t ar">تنصت؛ البتات دون تغيير</span></td>
      <td><span class="t en">Modify, inject, delete, replay, DoS</span><span class="t ar">تعديل، حقن، حذف، إعادة، حرمان</span></td>
    </tr>
  </table>

  <figure class="fig-block">
    <svg viewBox="0 0 440 120" class="fig-svg">
      <text x="100" y="20" fill="#94a3b8" font-size="11">PASSIVE</text>
      <circle cx="60" cy="65" r="22" fill="#1e293b" stroke="#94a3b8"/>
      <text x="60" y="70" text-anchor="middle" fill="#e2e8f0" font-size="10">👁</text>
      <line x1="90" y1="65" x2="200" y2="65" stroke="#64748b" stroke-dasharray="4"/>
      <rect x="200" y="50" width="60" height="30" rx="4" fill="#334155"/>
      <text x="230" y="70" text-anchor="middle" fill="#fff" font-size="9">data</text>
      <line x1="260" y1="65" x2="370" y2="65" stroke="#64748b"/>
      <circle cx="400" cy="65" r="22" fill="#1e3a5f" stroke="#5eb3ff"/>
      <text x="400" y="70" text-anchor="middle" fill="#fff" font-size="10">B</text>
      <text x="100" y="105" fill="#94a3b8" font-size="11">ACTIVE: attacker in the middle can change the box</text>
    </svg>
    <figcaption><span class="t en">Figure 3 — Passive = listen on the dashed path; active = sit in the path and alter traffic.</span><span class="t ar">شكل 3 — سلبي = استماع؛ نشط = في المسار وتغيير الحركة.</span></figcaption>
  </figure>

  <div class="subheading"><span class="t en">Examples</span><span class="t ar">أمثلة</span></div>
  <p><span class="t en"><strong>Mapping attack → mechanism → service:</strong> Cookie theft on HTTP (attack) → HTTPS + HttpOnly (mechanism) → confidentiality service.</span>
  <span class="t ar"><strong>ربط هجوم → آلية → خدمة:</strong> سرقة كوكيز على HTTP → HTTPS (آلية) → خدمة سرية.</span></p>

  <div class="example-box">
    <div class="example-title"><span class="t en">Exam-style cases</span><span class="t ar">حالات بأسلوب الامتحان</span></div>
    <ul>
      <li><span class="t en"><strong>Passive:</strong> competitor counts packet sizes to guess when payroll runs (traffic analysis).</span><span class="t ar"><strong>سلبي:</strong> تحليل أحجام الحزم لتخمين موعد الرواتب.</span></li>
      <li><span class="t en"><strong>Active:</strong> attacker changes a bank transfer amount in a message without TLS/MAC.</span><span class="t ar"><strong>نشط:</strong> تغيير مبلغ تحويل دون TLS/MAC.</span></li>
      <li><span class="t en"><strong>Replay (active):</strong> capture “transfer $10” and send it again — stopped by <strong>nonce</strong> or timestamp.</span><span class="t ar"><strong>إعادة تشغيل:</strong> إرسال نفس أمر التحويل مرة أخرى — يُوقف بـ NONCE أو وقت.</span></li>
    </ul>
  </div>
</div>
</section>

<section class="topic" id="crypto">
<h2>
  <span class="t en">3. Symmetric vs asymmetric encryption; public &amp; private keys; block vs stream; NONCE</span>
  <span class="t ar">3. التشفير المتماثل وغير المتماثل؛ المفتاح العام والخاص؛ الكتلة والتيار؛ NONCE</span>
</h2>
<div class="card">
  <div class="def-panel">
    <div class="def-heading"><span class="t en">Definitions — read these first</span><span class="t ar">التعريفات — اقرأها أولاً</span></div>
    <dl class="def-list">
      <dt><span class="t en">Symmetric encryption</span><span class="t ar">تشفير متماثل</span></dt>
      <dd><span class="t en">Same secret key <strong>K</strong> is used to encrypt and decrypt. Both parties must possess K.</span><span class="t ar">نفس المفتاح السري <strong>K</strong> للتشفير وفك التشفير؛ يجب أن يملكه الطرفان.</span></dd>
      <dt><span class="t en">Asymmetric (public-key) encryption</span><span class="t ar">تشفير غير متماثل</span></dt>
      <dd><span class="t en">Uses a <strong>key pair</strong>: public key (shared) and private key (secret). Data encrypted with one key is decrypted with the other, depending on the operation (encrypt vs sign).</span><span class="t ar">يستخدم <strong>زوج مفاتيح</strong>: عام وخاص؛ التشفير بأحدهما وفك التشفير بالآخر حسب العملية.</span></dd>
      <dt><span class="t en">Public key (PK)</span><span class="t ar">المفتاح العام</span></dt>
      <dd><span class="t en">Can be published. Others use it to <strong>encrypt messages to you</strong> or to <strong>verify your digital signature</strong>.</span><span class="t ar">يُنشر؛ يُستخدم ل<strong>تشفير رسائل إليك</strong> أو <strong>التحقق من توقيعك</strong>.</span></dd>
      <dt><span class="t en">Private key (SK)</span><span class="t ar">المفتاح الخاص</span></dt>
      <dd><span class="t en">Must stay secret. Used to <strong>decrypt</strong> messages sent to you and to <strong>create digital signatures</strong>.</span><span class="t ar">يبقى سرياً؛ ل<strong>فك التشفير</strong> ول<strong>إنشاء التوقيعات الرقمية</strong>.</span></dd>
      <dt><span class="t en">Block cipher</span><span class="t ar">تشفير كتلة</span></dt>
      <dd><span class="t en">Encrypts fixed-size blocks of plaintext (AES block = 128 bits). Often used with a mode (CBC, GCM).</span><span class="t ar">يشفّر كتلاً بحجم ثابت (كتلة AES = 128 بت) غالباً مع وضع تشغيل.</span></dd>
      <dt><span class="t en">Stream cipher</span><span class="t ar">تشفير تيار</span></dt>
      <dd><span class="t en">Generates a keystream and XORs it with data one bit or byte at a time (e.g., ChaCha20).</span><span class="t ar">يولّد تيار مفتاح ويعمل XOR مع البيانات بت/بايت تلو الآخر.</span></dd>
      <dt><span class="t en">NONCE</span><span class="t ar">NONCE</span></dt>
      <dd><span class="t en"><strong>Number used once</strong> — a fresh, often random value used only once per message/session to prevent replay attacks and to derive unique keys or IVs.</span><span class="t ar"><strong>رقم يُستخدم مرة واحدة</strong> — قيمة جديدة لكل رسالة/جلسة لمنع إعادة التشغيل واشتقاق مفاتيح أو IV فريدة.</span></dd>
    </dl>
  </div>

  <div class="subheading"><span class="t en">Figures &amp; intuition</span><span class="t ar">أشكال وفهم بصري</span></div>
  <figure class="fig-block">
    <svg viewBox="0 0 420 140" class="fig-svg">
      <text x="30" y="22" fill="#5eb3ff" font-size="11">SYMMETRIC — same key K</text>
      <rect x="20" y="35" width="50" height="35" fill="#334155"/><text x="45" y="57" text-anchor="middle" fill="#fff" font-size="10">Alice</text>
      <rect x="160" y="40" width="80" height="28" rx="6" fill="#1e3a5f" stroke="#fbbf24"/><text x="200" y="58" text-anchor="middle" fill="#fde68a" font-size="11">K</text>
      <rect x="350" y="35" width="50" height="35" fill="#334155"/><text x="375" y="57" text-anchor="middle" fill="#fff" font-size="10">Bob</text>
      <path d="M70 52 L160 54 M280 54 L350 52" stroke="#64748b"/>
      <text x="30" y="95" fill="#c4b5fd" font-size="11">ASYMMETRIC — Bob's public encrypts, Bob's private decrypts</text>
      <text x="60" y="120" fill="#94a3b8" font-size="10">Alice uses PK_Bob → ciphertext → only SK_Bob opens</text>
    </svg>
    <figcaption><span class="t en">Figure 4 — Symmetric shares one secret; asymmetric uses a key pair per person.</span><span class="t ar">شكل 4 — المتماثل سر مشترك؛ غير المتماثل زوج مفاتيح لكل شخص.</span></figcaption>
  </figure>

  <div class="subheading"><span class="t en">Examples</span><span class="t ar">أمثلة</span></div>
  <p><span class="t en">Symmetric: AES session key on both phones after setup. Asymmetric: encrypt grade with <strong>PK<sub>Bob</sub></strong>, Bob decrypts with <strong>SK<sub>Bob</sub></strong>; Alice signs with <strong>SK<sub>Alice</sub></strong>, verify with <strong>PK<sub>Alice</sub></strong>.</span>
  <span class="t ar">متماثل: مفتاح جلسة AES. غير متماثل: تشفير بعام بوب، فك بخاصه؛ توقيع بخاص أليس والتحقق بعامها.</span></p>

  <table class="compare-table">
    <tr><th></th><th><span class="t en">Block cipher (AES)</span><span class="t ar">كتلة (AES)</span></th><th><span class="t en">Stream cipher</span><span class="t ar">تيار</span></th></tr>
    <tr><td><span class="t en">Unit</span><span class="t ar">الوحدة</span></td><td><span class="t en">128-bit blocks</span><span class="t ar">كتل 128 بت</span></td><td><span class="t en">keystream XOR 1 byte at a time</span><span class="t ar">تيار مفتاح XOR بايتاً بايت</span></td></tr>
    <tr><td><span class="t en">Example</span><span class="t ar">مثال</span></td><td><span class="t en">AES-GCM on a file</span><span class="t ar">AES-GCM على ملف</span></td><td><span class="t en">ChaCha20 on a live video</span><span class="t ar">ChaCha20 على بث حي</span></td></tr>
  </table>
  <p><span class="t en"><strong>NONCE:</strong> login packet carries N=48291 once; replay of old N is rejected.</span><span class="t ar"><strong>NONCE:</strong> طلب دخول بقيمة N جديدة؛ إعادة N القديمة مرفوضة.</span></p>
</div>
</section>

<section class="topic" id="aes">
<h2>
  <span class="t en">4. AES, TRNG, hashes, SHA, concatenation, RSA signatures, tags, MAC</span>
  <span class="t ar">4. AES و TRNG ودوال الهاش و SHA والربط وتوقيع RSA والعلامات و MAC</span>
</h2>
<div class="card">
  <div class="def-panel">
    <div class="def-heading"><span class="t en">Definitions — read these first</span><span class="t ar">التعريفات — اقرأها أولاً</span></div>
    <dl class="def-list">
      <dt><span class="t en">AES (Advanced Encryption Standard)</span><span class="t ar">AES</span></dt>
      <dd><span class="t en">Symmetric block cipher; block size <strong>128 bits</strong>; key sizes <strong>128, 192, or 256 bits</strong>; rounds <strong>10, 12, or 14</strong> respectively.</span><span class="t ar">تشفير متماثل؛ كتلة <strong>128 بت</strong>؛ مفاتيح <strong>128 أو 192 أو 256</strong>؛ جولات <strong>10 أو 12 أو 14</strong>.</span></dd>
      <dt><span class="t en">AES round phases</span><span class="t ar">مراحل جولة AES</span></dt>
      <dd><span class="t en"><strong>SubBytes</strong> (byte substitution), <strong>ShiftRows</strong> (row shift), <strong>MixColumns</strong> (column mix; omitted in final round), <strong>AddRoundKey</strong> (XOR round key).</span><span class="t ar">SubBytes، ShiftRows، MixColumns (تُحذف آخر جولة)، AddRoundKey.</span></dd>
      <dt><span class="t en">TRNG</span><span class="t ar">TRNG</span></dt>
      <dd><span class="t en"><strong>True Random Number Generator</strong> — randomness from unpredictable physical events (hardware noise). Used when keys must be unguessable.</span><span class="t ar">مولد أرقام عشوائية حقيقية من أحداث فيزيائية غير متوقعة للمفاتيح.</span></dd>
      <dt><span class="t en">Cryptographic hash function</span><span class="t ar">دالة الهاش التشفيرية</span></dt>
      <dd><span class="t en">Maps input of any length to a <strong>fixed-length digest</strong>; one-way; collision and preimage resistance (ideal).</span><span class="t ar">تحوّل أي مدخل إلى <strong>ملخص بطول ثابت</strong>؛ اتجاه واحد؛ مقاومة تصادم وأصل.</span></dd>
      <dt><span class="t en">Concatenation (∥)</span><span class="t ar">الربط (∥)</span></dt>
      <dd><span class="t en">Placing one string immediately after another; <strong>order matters</strong> when hashing or signing combined fields.</span><span class="t ar">وصل سلسلتين؛ <strong>الترتيب مهم</strong> عند الهاش أو التوقيع.</span></dd>
      <dt><span class="t en">SHA</span><span class="t ar">SHA</span></dt>
      <dd><span class="t en">Secure Hash Algorithm family (SHA-1, SHA-2 such as SHA-256, SHA-3). Produces hash digests of standard sizes.</span><span class="t ar">عائلة خوارزميات هاش آمنة (SHA-1، SHA-2 مثل SHA-256، SHA-3).</span></dd>
      <dt><span class="t en">RSA digital signature</span><span class="t ar">توقيع RSA الرقمي</span></dt>
      <dd><span class="t en">Hash the message, sign digest with sender’s <strong>private key</strong>, verify with sender’s <strong>public key</strong>.</span><span class="t ar">هاش الرسالة، وقّع بال<strong>خاص</strong>، تحقق بال<strong>عام</strong>.</span></dd>
      <dt><span class="t en">Authentication tag (types)</span><span class="t ar">علامة مصادقة (أنواع)</span></dt>
      <dd><span class="t en">(1) <strong>MAC/HMAC tag</strong> — symmetric; (2) <strong>AEAD tag</strong> (e.g. GCM); (3) <strong>digital signature</strong> — asymmetric.</span><span class="t ar">(1) MAC/HMAC متماثل؛ (2) علامة AEAD؛ (3) توقيع رقمي غير متماثل.</span></dd>
      <dt><span class="t en">MAC (Message Authentication Code)</span><span class="t ar">MAC</span></dt>
      <dd><span class="t en">Keyed algorithm providing <strong>integrity and authenticity</strong> of a message between parties sharing a secret (e.g. HMAC). Not the same as a network MAC address.</span><span class="t ar">خوارزمية بمفتاح سري تضمن <strong>التكامل والأصالة</strong> (مثل HMAC). ليس عنوان MAC للشبكة.</span></dd>
    </dl>
  </div>

  <div class="subheading"><span class="t en">Figures &amp; intuition</span><span class="t ar">أشكال وفهم بصري</span></div>
  <figure class="fig-block">
    <svg viewBox="0 0 460 100" class="fig-svg">
      <text x="20" y="18" fill="#94a3b8" font-size="10">One AES round (simplified)</text>
      <rect x="10" y="28" width="70" height="36" rx="6" fill="#1e3a5f" stroke="#5eb3ff"/><text x="45" y="50" text-anchor="middle" fill="#fff" font-size="9">SubBytes</text>
      <text x="88" y="50" fill="#64748b">→</text>
      <rect x="95" y="28" width="70" height="36" rx="6" fill="#1e3a5f" stroke="#5eb3ff"/><text x="130" y="50" text-anchor="middle" fill="#fff" font-size="9">ShiftRows</text>
      <text x="173" y="50" fill="#64748b">→</text>
      <rect x="180" y="28" width="78" height="36" rx="6" fill="#1e3a5f" stroke="#5eb3ff"/><text x="219" y="50" text-anchor="middle" fill="#fff" font-size="9">MixColumns</text>
      <text x="266" y="50" fill="#64748b">→</text>
      <rect x="273" y="28" width="82" height="36" rx="6" fill="#1e3a5f" stroke="#fbbf24"/><text x="314" y="50" text-anchor="middle" fill="#fff" font-size="9">AddRoundKey</text>
      <text x="20" y="85" fill="#6ee7a0" font-size="10">128-bit key → 10 rounds | 192-bit → 12 | 256-bit → 14</text>
    </svg>
    <figcaption><span class="t en">Figure 5 — AES round transformations (MixColumns omitted in the final round).</span><span class="t ar">شكل 5 — تحويلات جولة AES (بدون MixColumns في الجولة الأخيرة).</span></figcaption>
  </figure>

  <figure class="fig-block">
    <svg viewBox="0 0 400 90" class="fig-svg">
      <text x="20" y="20" fill="#94a3b8" font-size="10">HASH — any length in, fixed digest out</text>
      <rect x="10" y="30" width="120" height="40" rx="6" fill="#334155"/><text x="70" y="55" text-anchor="middle" fill="#fff" font-size="10">"Hello" (5 B)</text>
      <text x="140" y="55" fill="#64748b">→ SHA-256 →</text>
      <rect x="230" y="30" width="160" height="40" rx="6" fill="#14532d" stroke="#6ee7a0"/><text x="310" y="48" text-anchor="middle" fill="#bbf7d0" font-size="8">2cf24dba5f...</text>
      <text x="310" y="62" text-anchor="middle" fill="#86efac" font-size="8">always 256 bits</text>
    </svg>
    <figcaption><span class="t en">Figure 6 — Output length fixed; tiny input change → avalanche in digest.</span><span class="t ar">شكل 6 — طول المخرج ثابت؛ تغيير بسيط يسبب تغييراً كبيراً في الهاش.</span></figcaption>
  </figure>

  <figure class="fig-block">
    <svg viewBox="0 0 420 110" class="fig-svg">
      <text x="20" y="18" fill="#f4a261" font-size="10">RSA SIGNATURE</text>
      <rect x="10" y="28" width="55" height="30" fill="#334155"/><text x="37" y="47" text-anchor="middle" fill="#fff" font-size="9">Msg</text>
      <text x="72" y="47" fill="#94a3b8">hash→</text>
      <rect x="95" y="28" width="50" height="30" fill="#334155"/><text x="120" y="47" text-anchor="middle" fill="#fff" font-size="9">digest</text>
      <text x="150" y="47" fill="#94a3b8">sign SK→</text>
      <rect x="195" y="28" width="60" height="30" fill="#1e3a5f" stroke="#fbbf24"/><text x="225" y="47" text-anchor="middle" fill="#fff" font-size="9">sig</text>
      <text x="20" y="85" fill="#94a3b8" font-size="10">Verify: apply PK → compare to hash(msg)</text>
    </svg>
    <figcaption><span class="t en">Figure 7 — Sign hash with private key; verify with public key (never reverse).</span><span class="t ar">شكل 7 — وقّع الهاش بالخاص؛ تحقق بالعام.</span></figcaption>
  </figure>

  <div class="subheading"><span class="t en">Examples</span><span class="t ar">أمثلة</span></div>
  <ul>
    <li><span class="t en">TRNG: /dev/random for crypto keys; PRNG must not be used alone for keys unless seeded from TRNG.</span><span class="t ar">TRNG للمفاتيح؛ لا PRNG وحده للمفاتيح دون بذرة من TRNG.</span></li>
    <li><span class="t en">Concatenation: H("PAY" ∥ amount ∥ acct) ≠ H(amount ∥ "PAY" ∥ acct).</span><span class="t ar">الربط: تغيير الترتيب يغيّر الهاش.</span></li>
    <li><span class="t en">SHA-256 always outputs 256 bits whether input is 1 byte or 1 GB.</span><span class="t ar">SHA-256 تخرج 256 بت دائماً بغض النظر عن حجم المدخل.</span></li>
  </ul>

  <div class="example-box">
    <div class="example-title"><span class="t en">MAC vs digital signature</span><span class="t ar">MAC مقابل التوقيع الرقمي</span></div>
    <p><span class="t en">Two roommates share Wi‑Fi password K. They HMAC-SHA256(login requests) so only someone with K can forge valid tags — but either roommate could deny later (no non-repudiation). A university registrar signs PDFs with SK<sub>uni</sub>; anyone with PK<sub>uni</sub> can prove the registrar signed — <strong>non-repudiation</strong>.</span>
    <span class="t ar">شريكان يتشاركان K ويستخدمان HMAC — لا إنكار قوي. الجامعة توقّع PDF بمفتاحها الخاص — <strong>عدم إنكار</strong>.</span></p>
  </div>
</div>
</section>

<section class="topic" id="pki">
<h2>
  <span class="t en">5. PKI, TLS, and SSH — how they fit together</span>
  <span class="t ar">5. PKI و TLS و SSH — كيف تترابط</span>
</h2>
<div class="card">
  <div class="def-panel">
    <div class="def-heading"><span class="t en">Definitions — read these first</span><span class="t ar">التعريفات — اقرأها أولاً</span></div>
    <dl class="def-list">
      <dt><span class="t en">PKI (Public Key Infrastructure)</span><span class="t ar">PKI</span></dt>
      <dd><span class="t en">Framework of trusted <strong>Certificate Authorities (CAs)</strong>, digital certificates, and policies that bind <strong>identities to public keys</strong> and manage trust.</span><span class="t ar">إطار <strong>جهات إصدار شهادات</strong> وسياسات تربط <strong>الهويات بالمفاتيح العامة</strong> وتدير الثقة.</span></dd>
      <dt><span class="t en">TLS (Transport Layer Security)</span><span class="t ar">TLS</span></dt>
      <dd><span class="t en">Protocol that provides <strong>confidentiality and integrity</strong> between applications over a transport (usually TCP). Used by HTTPS. Negotiates ciphers and authenticates servers via certificates.</span><span class="t ar">بروتوكول <strong>سرية وتكامل</strong> فوق النقل (غالباً TCP)؛ يُستخدم في HTTPS؛ يتفاوض على التشفير ويصادق الخوادم بالشهادات.</span></dd>
      <dt><span class="t en">SSH (Secure Shell)</span><span class="t ar">SSH</span></dt>
      <dd><span class="t en">Protocol for <strong>secure remote login, command execution, and file transfer</strong> over insecure networks (replaces telnet). Encrypts the session; typically port <strong>22</strong>.</span><span class="t ar">بروتوكول <strong>دخول وتنفيذ أوامر ونقل ملفات آمن</strong> (بديل telnet)؛ يشفّر الجلسة؛ المنفذ <strong>22</strong> عادةً.</span></dd>
    </dl>
  </div>

  <div class="subheading"><span class="t en">Figures &amp; intuition</span><span class="t ar">أشكال وفهم بصري</span></div>
  <figure class="fig-block">
    <svg viewBox="0 0 440 130" class="fig-svg">
      <rect x="180" y="10" width="80" height="40" rx="6" fill="#14532d" stroke="#6ee7a0"/><text x="220" y="35" text-anchor="middle" fill="#fff" font-size="10">Root CA</text>
      <rect x="60" y="80" width="100" height="40" rx="6" fill="#1e3a5f" stroke="#5eb3ff"/><text x="110" y="105" text-anchor="middle" fill="#fff" font-size="9">Intermediate CA</text>
      <rect x="280" y="80" width="120" height="40" rx="6" fill="#334155" stroke="#94a3b8"/><text x="340" y="105" text-anchor="middle" fill="#fff" font-size="9">server cert</text>
      <path d="M220 50 L110 80 M220 50 L340 80" stroke="#64748b"/>
    </svg>
    <figcaption><span class="t en">Figure 8 — PKI chain: browser trusts root → intermediate → site certificate.</span><span class="t ar">شكل 8 — سلسلة PKI: جذر → وسيط → شهادة الموقع.</span></figcaption>
  </figure>

  <figure class="fig-block">
    <svg viewBox="0 0 420 85" class="fig-svg">
      <text x="15" y="20" fill="#5eb3ff" font-size="10">TLS over TCP (HTTPS)</text>
      <rect x="10" y="28" width="70" height="45" fill="#334155"/><text x="45" y="55" text-anchor="middle" fill="#fff" font-size="9">App</text>
      <rect x="90" y="28" width="70" height="45" fill="#1e3a5f" stroke="#5eb3ff"/><text x="125" y="55" text-anchor="middle" fill="#fff" font-size="9">TLS</text>
      <rect x="170" y="28" width="70" height="45" fill="#334155"/><text x="205" y="55" text-anchor="middle" fill="#fff" font-size="9">TCP</text>
      <text x="260" y="55" fill="#94a3b8">→ encrypted tunnel →</text>
    </svg>
    <figcaption><span class="t en">Figure 9 — TLS sits between application and TCP; provides cipher + integrity.</span><span class="t ar">شكل 9 — TLS بين التطبيق و TCP.</span></figcaption>
  </figure>

  <div class="subheading"><span class="t en">Examples</span><span class="t ar">أمثلة</span></div>
  <ul>
    <li><span class="t en"><strong>PKI:</strong> browser validates https://google.com cert chain to trusted root + hostname.</span><span class="t ar"><strong>PKI:</strong> المتصفح يتحقق من سلسلة الشهادة واسم المضيف.</span></li>
    <li><span class="t en"><strong>TLS:</strong> ClientHello → cert → session keys → encrypted HTTP (HTTPS).</span><span class="t ar"><strong>TLS:</strong> مصافحة → مفاتيح جلسة → HTTP مشفّر.</span></li>
    <li><span class="t en"><strong>SSH:</strong> <code>ssh user@host</code> — verify host fingerprint; encrypted terminal (not telnet).</span><span class="t ar"><strong>SSH:</strong> طرفية مشفّرة وتحقق من المضيف.</span></li>
  </ul>
</div>
</section>

<section class="topic" id="ipv4">
<h2>
  <span class="t en">6. IPv4 address, network address, subnet mask (with worked example)</span>
  <span class="t ar">6. عنوان IPv4 وعنوان الشبكة وقناع الشبكة (مثال محسوب)</span>
</h2>
<div class="card">
  <div class="def-panel">
    <div class="def-heading"><span class="t en">Definitions — read these first</span><span class="t ar">التعريفات — اقرأها أولاً</span></div>
    <dl class="def-list">
      <dt><span class="t en">IPv4 address</span><span class="t ar">عنوان IPv4</span></dt>
      <dd><span class="t en">A <strong>32-bit</strong> logical address for a host or interface, usually written in dotted decimal (four octets, e.g. 192.168.5.102).</span><span class="t ar">عنوان منطقي <strong>32 بت</strong> للمضيف، يُكتب عادةً بأربعة أوكتتات عشرية.</span></dd>
      <dt><span class="t en">Subnet mask</span><span class="t ar">قناع الشبكة</span></dt>
      <dd><span class="t en">32-bit value (or prefix length <strong>/n</strong>) that separates the address into <strong>network bits</strong> (prefix) and <strong>host bits</strong>. Example: 255.255.255.0 = /24.</span><span class="t ar">قيمة 32 بت (أو بادئة <strong>/n</strong>) تفصل <strong>بتات الشبكة</strong> عن <strong>بتات المضيف</strong>.</span></dd>
      <dt><span class="t en">Network address</span><span class="t ar">عنوان الشبكة</span></dt>
      <dd><span class="t en">The address of the subnet itself: <strong>IP AND mask</strong> with all host bits set to 0 (identifies the network).</span><span class="t ar">عنوان الشبكة: <strong>IP AND القناع</strong> مع جعل بتات المضيف أصفاراً.</span></dd>
      <dt><span class="t en">Broadcast address</span><span class="t ar">عنوان البث</span></dt>
      <dd><span class="t en">Address with all host bits set to 1 — sends to every host on the subnet.</span><span class="t ar">عنوان بكل بتات المضيف = 1 للبث لجميع المضيفات في الشبكة.</span></dd>
    </dl>
  </div>

  <div class="subheading"><span class="t en">Figures &amp; intuition</span><span class="t ar">أشكال وفهم بصري</span></div>
  <figure class="fig-block">
    <svg viewBox="0 0 440 70" class="fig-svg">
      <text x="10" y="18" fill="#94a3b8" font-size="10">192.168.5.102 /24 — bits</text>
      <rect x="10" y="25" width="260" height="22" fill="#1e3a5f"/><text x="140" y="40" text-anchor="middle" fill="#5eb3ff" font-size="10">24 bits NETWORK</text>
      <rect x="270" y="25" width="80" height="22" fill="#3b2f1f"/><text x="310" y="40" text-anchor="middle" fill="#f4a261" font-size="10">8 HOST</text>
      <text x="10" y="65" fill="#6ee7a0" font-size="9">Mask 255.255.255.0 = /24</text>
    </svg>
    <figcaption><span class="t en">Figure 10 — Mask separates network prefix from host suffix.</span><span class="t ar">شكل 10 — القناع يفصل بادئة الشبكة عن المضيف.</span></figcaption>
  </figure>

  <div class="subheading"><span class="t en">Worked example</span><span class="t ar">مثال محسوب</span></div>
  <p><span class="t en"><strong>Given:</strong> IP = 192.168.5.102, mask = 255.255.255.0 (/24).<br/>
  • Network = 192.168.5.102 AND 255.255.255.0 = <strong>192.168.5.0</strong><br/>
  • Broadcast = host bits all 1 → <strong>192.168.5.255</strong><br/>
  • Usable hosts: 192.168.5.1 – 192.168.5.254 (2<sup>8</sup> − 2 = 254)</span>
  <span class="t ar"><strong>معطى:</strong> IP = 192.168.5.102، القناع /24.<br/>
  • الشبكة = <strong>192.168.5.0</strong><br/>
  • البث = <strong>192.168.5.255</strong><br/>
  • المضيفات: .1 – .254 (254 مضيفاً)</span></p>

  <div class="example-box">
    <div class="example-title"><span class="t en">Security use of subnetting</span><span class="t ar">الأمن وتجزئة الشبكة</span></div>
    <p><span class="t en">Put student lab PCs on 10.10.20.0/24 and payment servers on 10.10.30.0/24. Firewall rule: deny all from 10.10.20.0/24 → 10.10.30.0/24. Even if a lab PC is compromised, it cannot reach the payment VLAN — defense in depth using addresses + ACLs.</span>
    <span class="t ar">معاملات الطلاب في شبكة ومخدمات الدفع في أخرى؛ الجدار الناري يمنع الوصول بينهما حتى لو اُخترق جهاز معمل.</span></p>
  </div>
</div>
</section>
"""


MCQ_EXAMPLE_EN = ['Someone on public Wi-Fi captures your HTTP login — that violates confidentiality; HTTPS fixes it.', 'A registrar site times out during registration week while pings work — classic availability hit from overload/DoS.', "You change 'grade=90' to 'grade=99' in a file; SHA-256 before/after mismatch proves integrity failure.", "A fake 'university.edu' site asks for your password — certificates on the real site prove authenticity.", 'Network 172.16.4.0/26: 32−26=6 host bits → 2⁶−2=62 usable addresses.', '192.168.2.17 AND 255.255.255.240 → network 192.168.2.16 (not broadcast 31).', "ATM dispense: server sends nonce=8832; replay of yesterday's withdraw message rejected.", 'Wireshark on promiscuous mode reads frames but does not modify them — passive.', 'Attacker changes DNS answer to point bank.com to evil IP — active MITM.', 'You want integrity → use SHA/HMAC (mechanism); integrity is the service delivered.', 'Two apps share AES key in a config file — symmetric setup for bulk lecture videos.', 'Bob posts PK on website; Alice encrypts transcript without meeting — asymmetric distribution.', 'Email to Bob: encrypt with PK_Bob; Bob decrypts with SK_Bob only he owns.', 'AES-128-GCM on a 10 MB zip — block cipher with 128-bit blocks.', 'RC4/ChaCha20 XOR on live chat stream — stream cipher pattern.', 'Exam fact: only 128, 192, 256 are valid AES key lengths (not 64).', 'Exam fact: longer key → more AES rounds (256-bit → 14 rounds).', "If 'HammingCode' appears, it is error correction — not an AES round step.", 'Crypto keys from /dev/random (hardware) vs rand() with fixed seed — TRNG vs weak PRNG.', "Password 'cat' and 'catastrophe' both map to 256-bit SHA-256 digests (fixed output size).", "Signing H('pay'||'50') differs from H('50'||'pay') — concatenation order changes digest.", 'Legacy Git used SHA-1 commits; collision attacks motivated SHA-256 migration.', 'Contract PDF: hash file, sign digest with SK_lawyer, verify with PK_lawyer.', 'TLS 1.3 record ends with 16-byte GCM authentication tag — AEAD tag type.', 'Browser padlock checks cert chain to DigiCert root — PKI trust.', 'HTTPS: HTTP inside TLS inside TCP — TLS layer on top of TCP.', 'API partners share secret K; HMAC on JSON body detects tampering — MAC.', 'Instead of telnet to router, network admin uses ssh admin@gw — encrypted shell.', 'Reading SMS over the air with SDR without sending — threatens confidentiality.', "Online banking adds request counter so 'pay bill' packet cannot be replayed tomorrow.", 'DB stores SHA256(salt||password) so leak does not reveal plaintext passwords.', 'Two different PDFs with same MD5 (historic attack) broke collision resistance demos.', 'TLS uses Ephemeral DH — Diffie-Hellman mechanism for session keys.', "Cert shows CN=www.university.edu and embeds server's public key — not private key.", 'ClientHello lists ciphers; server picks TLS_AES_256_GCM_SHA384 — handshake negotiation.', 'Encrypting disk with AES-128 uses symmetric cipher; RSA-2048 on cert is asymmetric.', 'Cellular voice links historically liked stream ciphers for low latency.', 'Round key XOR mixes key material into state — ties SubBytes output to secret key.', 'Mask 255.255.255.0 leaves last octet for hosts — 8 host bits.', 'Keylogger installs software — active attack even though wiretap alone is passive.', 'CEO cannot deny sending signed email if only her SK could produce signature.', 'HMAC-SHA256(message, K) needs secret K in addition to hash function.', 'Fake access point presents wrong cert — breaks authenticity and integrity of channel.', 'Video game uses Mersenne Twister with known seed — predictable (PRNG), bad for keys.', 'Last host in 192.168.1.0/24 is .255 broadcast — ping sweep often skips .0 and .255.', 'When a site says SHA-256 fingerprint, expect SHA-2 family member.', 'Encrypt-then-MAC: verify tag on ciphertext before decrypting — safer ordering.', 'padlock icon means server cert authenticated domain — peer authentication service.', 'Publishing SK on GitHub breaks all signatures; PK belongs on key server.', 'Listening only vs cutting cable vs spoofing — passive vs active taxonomy.']

MCQ_EXAMPLE_AR = ['التقاط دخول HTTP على شبكة عامة يخالف السرية؛ HTTPS يعالج ذلك.', 'موقع التسجيل لا يستجيب أثناء الذروة — مشكلة توفر.', 'تغيير علامة في ملف يغيّر SHA-256 — كسر تكامل.', 'موقع مزيف للجامعة — الشهادة الحقيقية تثبت الأصالة.', '/26 تعني 6 بتات مضيف.', 'AND مع القناع يعطي عنوان الشبكة.', 'رفض إعادة رسالة سحب قديمة بفضل NONCE.', 'Wireshark للقراءة فقط — سلبي.', 'تغيير إجابة DNS — نشط.', 'الهاش آلية؛ التكامل خدمة.', 'مفتاح AES مشترك في ملف إعداد — متماثل.', 'نشر المفتاح العام لتوزيع آمن — غير متماثل.', 'تشفير بعام بوب وفك بخاصه.', 'AES على ملف كبير — كتلة.', 'ChaCha20 على بث — تيار.', 'أطوال AES: 128 و192 و256 فقط.', 'مفتاح 256 بت → 14 جولة.', 'Hamming ليس من AES.', '/dev/random عتاد مقابل بذرة ثابتة.', 'مخرج هاش بطول ثابت دائماً.', 'ترتيب الربط يغيّر الهاش.', 'SHA-1 ضعيف؛ SHA-256 أفضل.', 'توقيع محامٍ على هاش العقد.', 'علامة GCM في TLS.', 'سلسلة شهادات المتصفح.', 'HTTPS = TLS فوق TCP.', 'HMAC على JSON بسر مشترك.', 'ssh بدل telnet.', 'التنصت على الرسائل — سرية.', 'عداد طلبات يمنع إعادة التشغيل.', 'تخزين هاش كلمة المرور مع ملح.', 'تصادم MD5 التاريخي.', 'DH آلية لاتفاق مفتاح الجلسة.', 'الشهادة تحوي المفتاح العام لا الخاص.', 'مصافحة TLS تختار مجموعة تشفير.', 'AES متماثل؛ RSA غير متماثل.', 'تيار منخفض التأخير للاتصالات.', 'AddRoundKey يدمج مفتاح الجولة.', 'قناع /24 = 8 بت مضيف.', 'برمجيات تسجيل — نشط.', 'التوقيع بالخاص — عدم إنكار.', 'HMAC يحتاج سراً.', 'نقطة وصول مزيفة تكسر الأصالة.', 'PRNG متوقع ببذرة معروفة.', 'البث .255 في /24.', 'SHA-256 من عائلة SHA-2.', 'تحقق MAC قبل فك التشفير.', 'القفل = مصادقة الخادم.', 'الخاص سري؛ العام منشور.', 'سلبي مراقبة؛ نشط تغيير.']
