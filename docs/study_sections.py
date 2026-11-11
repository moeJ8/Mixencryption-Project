# Bilingual study HTML (inserted between hero and quiz). Placeholder: {study_body}
STUDY_BODY = r"""
<section class="topic" id="goals">
<h2>
  <span class="t en">1. Core security goals: confidentiality, integrity, availability, authenticity</span>
  <span class="t ar">1. الأهداف الأمنية: السرية، التكامل، التوفر، الأصالة</span>
</h2>
<div class="card">
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

  <p><span class="t en"><strong>Confidentiality</strong> = only authorized people read the data. <em>Real example:</em> You log into online banking. TLS encrypts the page so someone on the same café Wi‑Fi cannot read your balance. Without confidentiality, an attacker runs Wireshark and sees plaintext HTTP.</span>
  <span class="t ar"><strong>السرية</strong> = المصرح لهم فقط يقرؤون البيانات. <em>مثال:</em> دخول البنك عبر الإنترنت؛ TLS يشفّر الصفحة فلا يرى شخص على نفس شبكة المقهى رصيدك. بدون سرية، يشغّل المهاجم Wireshark ويرى HTTP صريحاً.</span></p>

  <p><span class="t en"><strong>Integrity</strong> = data is not changed without you noticing. <em>Real example:</em> You download exam.pdf (hash SHA-256 on the website). After download you re-hash the file; if it matches, nobody tampered. If an attacker changed one byte, the hash changes completely.</span>
  <span class="t ar"><strong>التكامل</strong> = لا يتغيّر المحتوى دون أن تلاحظ. <em>مثال:</em> تنزيل exam.pdf وهاش SHA-256 من الموقع؛ بعد التنزيل تعيد حساب الهاش؛ إن تطابق فلم يُلاعب. تغيير بايت واحد يغيّر الهاش بالكامل.</span></p>

  <p><span class="t en"><strong>Availability</strong> = the system works when users need it. <em>Real example:</em> A student tries to submit homework at 11:59 PM but the server is down because of a SYN flood (DoS). Confidentiality and integrity might still be fine on disk, but the service fails — that is an availability problem.</span>
  <span class="t ar"><strong>التوفر</strong> = النظام يعمل عند الحاجة. <em>مثال:</em> طالب يرسل واجباً والخادم معطّل بسبب SYN flood. السرية والتكامل قد يكونان سليمين على القرص لكن الخدمة فشلت — هذا توفر.</span></p>

  <p><span class="t en"><strong>Authenticity</strong> = you know <em>who</em> you are talking to. <em>Real example:</em> Email claims to be from the registrar but the From address is forged. A digital signature or TLS certificate on the real university portal proves you reached the true server, not a phishing clone.</span>
  <span class="t ar"><strong>الأصالة</strong> = تعرف <em>من</em> تتحدث معه. <em>مثال:</em> بريد يدّعي أنه من الجامعة لكن المرسل مزوّر. التوقيع الرقمي أو شهادة TLS على البوابة الحقيقية تثبت أنك وصلت للخادم الصحيح لا موقع تصيّد.</span></p>

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

  <p><span class="t en"><strong>Attack</strong> — concrete hostile action. Example: attacker records your login cookies on unencrypted HTTP (threatens confidentiality).</span>
  <span class="t ar"><strong>هجوم</strong> — فعل عدائي ملموس. مثال: تسجيل كوكيز الدخول على HTTP غير مشفر (يهدد السرية).</span></p>
  <p><span class="t en"><strong>Mechanism</strong> — how you defend. Same example: deploy HTTPS (TLS) + HttpOnly cookies — that is the mechanism.</span>
  <span class="t ar"><strong>آلية</strong> — كيف تدافع. نفس المثال: HTTPS (TLS) + كوكيز HttpOnly.</span></p>
  <p><span class="t en"><strong>Service</strong> — the property you wanted. Outcome: <em>confidentiality service</em> for the session.</span>
  <span class="t ar"><strong>خدمة</strong> — الخاصية المطلوبة. النتيجة: <em>خدمة سرية</em> للجلسة.</span></p>

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

  <div class="example-box">
    <div class="example-title"><span class="t en">Examples to remember for the exam</span><span class="t ar">أمثلة للامتحان</span></div>
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

  <p><span class="t en"><strong>Symmetric example:</strong> WhatsApp-style session after setup uses AES with a session key both phones know. Encrypt message M: C = AES<sub>K</sub>(M). Decrypt: M = AES<sub>K</sub><sup>−1</sup>(C). Problem: how did both phones get K safely first time? Often solved with asymmetric handshake (like TLS).</span>
  <span class="t ar"><strong>مثال متماثل:</strong> بعد الإعداد يستخدم AES بمفتاح جلسة يعرفه الطرفان. المشكلة: كيف وصل K بأمان أول مرة؟ غالباً بمصافحة غير متماثلة مثل TLS.</span></p>

  <p><span class="t en"><strong>Asymmetric example:</strong> Bob publishes PK<sub>Bob</sub>. Alice sends confidential grade: C = RSA_Encrypt(PK<sub>Bob</sub>, M). Only SK<sub>Bob</sub> decrypts. For <strong>signature</strong>, Alice signs with SK<sub>Alice</sub>; professor verifies with PK<sub>Alice</sub>.</span>
  <span class="t ar"><strong>مثال غير متماثل:</strong> بوب ينشر مفتاحه العام. أليس تشفّر بـ PK<sub>Bob</sub>؛ SK<sub>Bob</sub> فقط يفك. للتوقيع: SK<sub>Alice</sub> للتوقيع و PK<sub>Alice</sub> للتحقق.</span></p>

  <table class="compare-table">
    <tr><th></th><th><span class="t en">Block cipher (AES)</span><span class="t ar">كتلة (AES)</span></th><th><span class="t en">Stream cipher</span><span class="t ar">تيار</span></th></tr>
    <tr><td><span class="t en">Unit</span><span class="t ar">الوحدة</span></td><td><span class="t en">128-bit blocks</span><span class="t ar">كتل 128 بت</span></td><td><span class="t en">keystream XOR 1 byte at a time</span><span class="t ar">تيار مفتاح XOR بايتاً بايت</span></td></tr>
    <tr><td><span class="t en">Example</span><span class="t ar">مثال</span></td><td><span class="t en">AES-GCM on a file</span><span class="t ar">AES-GCM على ملف</span></td><td><span class="t en">ChaCha20 on a live video</span><span class="t ar">ChaCha20 على بث حي</span></td></tr>
  </table>

  <p><span class="t en"><strong>NONCE example:</strong> Login request includes nonce N=48291. Server stores “last accepted N”. Attacker replays yesterday’s packet with old N → server rejects. Fresh nonce makes every request unique.</span>
  <span class="t ar"><strong>مثال NONCE:</strong> طلب دخول يتضمن N=48291. الخادم يرفض إعادة إرسال نفس N القديم.</span></p>
</div>
</section>

<section class="topic" id="aes">
<h2>
  <span class="t en">4. AES, TRNG, hashes, SHA, concatenation, RSA signatures, tags, MAC</span>
  <span class="t ar">4. AES و TRNG ودوال الهاش و SHA والربط وتوقيع RSA والعلامات و MAC</span>
</h2>
<div class="card">
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

  <p><span class="t en"><strong>AES walkthrough (exam level):</strong> Plaintext block 128 bits → add initial round key → repeat rounds. <strong>SubBytes</strong> substitutes each byte via S-box (non-linearity). <strong>ShiftRows</strong> permutes rows. <strong>MixColumns</strong> mixes columns (last round skips it). <strong>AddRoundKey</strong> XORs with round key from key schedule.</span>
  <span class="t ar"><strong>مستوى امتحان AES:</strong> كتلة 128 بت → AddRoundKey أولي → جولات متكررة. SubBytes استبدال؛ ShiftRows إزاحة؛ MixColumns خلط (تُحذف أخيراً)؛ AddRoundKey XOR مع مفتاح الجولة.</span></p>

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

  <p><span class="t en"><strong>TRNG vs PRNG:</strong> Need a crypto key? Use TRNG from hardware noise (e.g., /dev/random). PRNG like Mersenne Twister is fine for simulations but predictable if attacker learns seed — so seed PRNG from TRNG.</span>
  <span class="t ar"><strong>TRNG مقابل PRNG:</strong> للمفاتيح استخدم TRNG من ضوضاء عتاد؛ PRNG قابل للتنبؤ إن عُرفت البذرة.</span></p>

  <p><span class="t en"><strong>Concatenation example:</strong> Protocol says signature is on H("PAY" ∥ amount ∥ account). If you swap order to H(amount ∥ "PAY" ∥ account) you get a different hash — attackers cannot reuse signatures on reordered fields.</span>
  <span class="t ar"><strong>مثال الربط:</strong> H("PAY" ∥ amount ∥ account) — تغيير الترتيب يغيّر الهاش ويمنع إعادة استخدام توقيع خاطئ.</span></p>

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

  <p><span class="t en"><strong>Tag types:</strong> (1) <strong>HMAC tag</strong> — 32-byte tag on a bank API message using shared secret; (2) <strong>GCM tag</strong> — 16-byte tag on ciphertext proving AEAD integrity; (3) <strong>Digital signature</strong> — RSA/ECDSA signature anyone can verify with public cert.</span>
  <span class="t ar"><strong>أنواع العلامات:</strong> HMAC بسر مشترك؛ علامة GCM على النص المشفر؛ توقيع رقمي يتحقق منه الجميع بالشهادة.</span></p>

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
  <figure class="fig-block">
    <svg viewBox="0 0 440 130" class="fig-svg">
      <rect x="180" y="10" width="80" height="40" rx="6" fill="#14532d" stroke="#6ee7a0"/><text x="220" y="35" text-anchor="middle" fill="#fff" font-size="10">Root CA</text>
      <rect x="60" y="80" width="100" height="40" rx="6" fill="#1e3a5f" stroke="#5eb3ff"/><text x="110" y="105" text-anchor="middle" fill="#fff" font-size="9">Intermediate CA</text>
      <rect x="280" y="80" width="120" height="40" rx="6" fill="#334155" stroke="#94a3b8"/><text x="340" y="105" text-anchor="middle" fill="#fff" font-size="9">server cert</text>
      <path d="M220 50 L110 80 M220 50 L340 80" stroke="#64748b"/>
    </svg>
    <figcaption><span class="t en">Figure 8 — PKI chain: browser trusts root → intermediate → site certificate.</span><span class="t ar">شكل 8 — سلسلة PKI: جذر → وسيط → شهادة الموقع.</span></figcaption>
  </figure>

  <p><span class="t en"><strong>PKI example:</strong> You visit https://google.com. Browser has root CA certs preinstalled. Server sends its cert chain; browser verifies signature up to trusted root and checks hostname matches CN/SAN. If OK → authentic Google server (authenticity) before any data.</span>
  <span class="t ar"><strong>مثال PKI:</strong> المتصفح يتحقق من سلسلة الشهادات حتى جذر موثوق ويطابق اسم المضيف.</span></p>

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

  <p><span class="t en"><strong>TLS handshake (concept):</strong> ClientHello → ServerHello + certificate → key agreement → both derive AES session keys → Application Data encrypted. Achieves confidentiality + integrity + server authentication.</span>
  <span class="t ar"><strong>مصافحة TLS:</strong> تفاوض → شهادة → اتفاق مفاتيح → بيانات مشفّرة.</span></p>

  <p><span class="t en"><strong>SSH example:</strong> <code>ssh student@lab.university.edu</code> on port 22. Replaces cleartext telnet. First connection: verify host key fingerprint (prevent MITM). Then password or private key authenticates you. All keystrokes encrypted inside SSH tunnel.</span>
  <span class="t ar"><strong>مثال SSH:</strong> يستبدل telnet؛ تحقق من بصمة المضيف؛ كل ضغطات المفاتيح داخل نفق مشفّر.</span></p>
</div>
</section>

<section class="topic" id="ipv4">
<h2>
  <span class="t en">6. IPv4 address, network address, subnet mask (with worked example)</span>
  <span class="t ar">6. عنوان IPv4 وعنوان الشبكة وقناع الشبكة (مثال محسوب)</span>
</h2>
<div class="card">
  <figure class="fig-block">
    <svg viewBox="0 0 440 70" class="fig-svg">
      <text x="10" y="18" fill="#94a3b8" font-size="10">192.168.5.102 /24 — bits</text>
      <rect x="10" y="25" width="260" height="22" fill="#1e3a5f"/><text x="140" y="40" text-anchor="middle" fill="#5eb3ff" font-size="10">24 bits NETWORK</text>
      <rect x="270" y="25" width="80" height="22" fill="#3b2f1f"/><text x="310" y="40" text-anchor="middle" fill="#f4a261" font-size="10">8 HOST</text>
      <text x="10" y="65" fill="#6ee7a0" font-size="9">Mask 255.255.255.0 = /24</text>
    </svg>
    <figcaption><span class="t en">Figure 10 — Mask separates network prefix from host suffix.</span><span class="t ar">شكل 10 — القناع يفصل بادئة الشبكة عن المضيف.</span></figcaption>
  </figure>

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
