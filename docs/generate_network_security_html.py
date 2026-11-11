#!/usr/bin/env python3
"""Generate Network_Security_Study.html — one-file study guide + 50 MCQs."""

from study_sections import STUDY_BODY, MCQ_EXAMPLE_EN, MCQ_EXAMPLE_AR

OUTPUT = "/workspace/docs/Network_Security_Study.html"

# 50 MCQs: (question_en, question_ar, options[(en,ar),...], correct_index, expl_en, expl_ar)
MCQS = [
    (
        "Which security goal ensures that only authorized parties can read sensitive data?",
        "أي هدف أمني يضمن أن الأطراف المصرح لها فقط يمكنها قراءة البيانات الحساسة؟",
        [
            ("Confidentiality", "السرية"),
            ("Availability", "التوفر"),
            ("Integrity", "التكامل"),
            ("Scalability", "قابلية التوسع"),
        ],
        0,
        "Confidentiality protects data from unauthorized disclosure (e.g., encryption).",
        "السرية تحمي البيانات من الكشف غير المصرح به (مثل التشفير).",
    ),
    (
        "Availability primarily defends against which type of threat?",
        "التوفر يدافع بشكل أساسي ضد أي نوع من التهديدات؟",
        [
            ("Eavesdropping on traffic", "التنصت على حركة المرور"),
            ("Denial-of-service that blocks legitimate access", "حرمان الخدمة الذي يمنع الوصول الشرعي"),
            ("Tampering with file contents", "التلاعب بمحتوى الملفات"),
            ("Forging digital signatures", "تزوير التوقيعات الرقمية"),
        ],
        1,
        "DoS/DDoS attacks target availability by making resources unreachable.",
        "هجمات DoS/DDoS تستهدف التوفر بجعل الموارد غير قابلة للوصول.",
    ),
    (
        "Integrity means attackers cannot ___ data without detection.",
        "التكامل يعني أن المهاجمين لا يستطيعون ___ البيانات دون اكتشاف ذلك.",
        [
            ("encrypt", "تشفير"),
            ("modify", "تعديل"),
            ("route", "توجيه"),
            ("compress", "ضغط"),
        ],
        1,
        "Integrity ensures data is not altered undetectably (hashes, MACs help).",
        "التكامل يضمن عدم تغيير البيانات دون اكتشاف (الهاش و MAC يساعدان).",
    ),
    (
        "Authenticity confirms that a message or user is ___. ",
        "الأصالة تؤكد أن الرسالة أو المستخدم ___",
        [
            ("anonymous", "مجهول"),
            ("who they claim to be", "من يدعون أنهم"),
            ("always encrypted", "مشفّرون دائماً"),
            ("using IPv6 only", "يستخدمون IPv6 فقط"),
        ],
        1,
        "Authentication binds identity to entities (passwords, certs, signatures).",
        "المصادقة تربط الهوية بالكيانات (كلمات المرور، الشهادات، التوقيعات).",
    ),
    (
        "In IPv4, how many bits are in a host address field when using a /26 prefix?",
        "في IPv4، كم بت في حقل عنوان المضيف عند استخدام بادئة /26؟",
        [("4", "4"), ("6", "6"), ("8", "8"), ("10", "10")],
        1,
        "/26 leaves 32−26 = 6 host bits (62 usable hosts with classic formula).",
        "/26 تترك 32−26 = 6 بتات للمضيف (62 مضيفاً قابلاً للاستخدام بالصيغة الكلاسيكية).",
    ),
    (
        "The AND of an IP address with its subnet mask yields the ___.",
        "نتيجة AND لعنوان IP مع قناع الشبكة هي ___.",
        [
            ("Broadcast address", "عنوان البث"),
            ("Network address", "عنوان الشبكة"),
            ("Default gateway only", "البوابة الافتراضية فقط"),
            ("MAC address", "عنوان MAC"),
        ],
        1,
        "IP ∧ mask identifies the network portion (network ID).",
        "IP ∧ القناع يحدد جزء الشبكة (معرّف الشبكة).",
    ),
    (
        "A nonce is typically used to ___.",
        "يُستخدم NONCE عادةً من أجل ___.",
        [
            ("Replace a subnet mask", "استبدال قناع الشبكة"),
            ("Prevent replay of an old protocol message", "منع إعادة تشغيل رسالة بروتوكول قديمة"),
            ("Increase MTU size", "زيادة حجم MTU"),
            ("Assign TLS cipher suites", "تعيين مجموعات تشفير TLS"),
        ],
        1,
        "Nonces are fresh one-time values tied to a session or request.",
        "NONCE قيم جديدة لمرة واحدة مرتبطة بجلسة أو طلب.",
    ),
    (
        "A passive attack is characterized by ___.",
        "الهجوم السلبي يتميز بـ ___.",
        [
            ("No modification of system resources or data in transit", "عدم تعديل موارد النظام أو البيانات أثناء النقل"),
            ("Flooding a server with SYN packets", "إغراق الخادم بحزم SYN"),
            ("Deleting log files", "حذف ملفات السجل"),
            ("Injecting malware on disk", "حقن برمجيات خبيثة على القرص"),
        ],
        0,
        "Eavesdropping/traffic analysis are passive — observation without alteration.",
        "التنصت/تحليل الحركة سلبي — مراقبة دون تغيير.",
    ),
    (
        "Which is an example of an active attack?",
        "أي مثال يمثل هجوماً نشطاً؟",
        [
            ("Listening to Wi-Fi packets without sending", "الاستماع لحزم Wi-Fi دون إرسال"),
            ("Reading ciphertext on a wire", "قراءة النص المشفر على السلك"),
            ("Man-in-the-middle altering packets", "رجل في الوسط يعدّل الحزم"),
            ("Counting packet sizes only", "عد أحجام الحزم فقط"),
        ],
        2,
        "Active attacks change data or systems (MITM, spoofing, malware).",
        "الهجمات النشطة تغيّر البيانات أو الأنظمة (MITM، انتحال، برمجيات خبيثة).",
    ),
    (
        "Security ___ are abstract goals (e.g., confidentiality); ___ are tools (e.g., encryption).",
        "___ الأمن هي أهداف مجردة (مثل السرية)؛ ___ هي أدوات (مثل التشفير).",
        [
            ("attacks; services", "هجمات؛ خدمات"),
            ("services; mechanisms", "خدمات؛ آليات"),
            ("mechanisms; attacks", "آليات؛ هجمات"),
            ("protocols; attacks", "بروتوكولات؛ هجمات"),
        ],
        1,
        "Services = what you want; mechanisms = how you achieve it; attacks threaten services.",
        "الخدمات = ما تريد؛ الآليات = كيف تحققه؛ الهجمات تهدد الخدمات.",
    ),
    (
        "Symmetric encryption uses ___.",
        "التشفير المتماثل يستخدم ___.",
        [
            ("One shared secret key for both directions", "مفتاح سري مشترك واحد للاتجاهين"),
            ("Only public keys", "مفاتيح عامة فقط"),
            ("No keys at all", "بدون مفاتيح"),
            ("Different keys that cannot be related", "مفاتيح مختلفة لا يمكن ربطها"),
        ],
        0,
        "Alice and Bob share K; fast for bulk data (AES).",
        "أليس وبوب يتشاركان K؛ سريع للبيانات الكبيرة (AES).",
    ),
    (
        "Asymmetric encryption solves key distribution using ___.",
        "التشفير غير المتماثل يحل توزيع المفاتيح باستخدام ___.",
        [
            ("Identical shared secrets only", "أسرار مشتركة متطابقة فقط"),
            ("A public key for encrypt/verify and private key for decrypt/sign", "مفتاح عام للتشفير/التحقق ومفتاح خاص لفك التشفير/التوقيع"),
            ("Subnet masks", "أقنعة الشبكة"),
            ("Nonces only", "NONCE فقط"),
        ],
        1,
        "Public encrypts; only private holder decrypts (RSA, ECC).",
        "العام يشفّر؛ صاحب الخاص فقط يفك التشفير (RSA، ECC).",
    ),
    (
        "You encrypt with ___ and decrypt with ___ in RSA messaging to Bob.",
        "تشفّر بـ ___ وتفك التشفير بـ ___ في رسائل RSA إلى بوب.",
        [
            ("Bob's public; Bob's private", "عام بوب؛ خاص بوب"),
            ("Bob's private; Bob's public", "خاص بوب؛ عام بوب"),
            ("Alice's public; Alice's private", "عام أليس؛ خاص أليس"),
            ("Shared symmetric only", "متماثل مشترك فقط"),
        ],
        0,
        "Anyone uses Bob's public to encrypt; only Bob's private decrypts.",
        "الجميع يستخدم عام بوب للتشفير؛ خاص بوب فقط يفك التشفير.",
    ),
    (
        "AES is a ___ cipher operating on fixed-size blocks.",
        "AES هو تشفير ___ يعمل على كتل بحجم ثابت.",
        [("stream", "تيار"), ("block", "كتلة"), ("hash", "هاش"), ("MAC", "MAC")],
        1,
        "AES block size is 128 bits regardless of key length.",
        "حجم كتلة AES 128 بت بغض النظر عن طول المفتاح.",
    ),
    (
        "RC4-style algorithms are examples of ___ ciphers.",
        "خوارزميات بأسلوب RC4 أمثلة على تشفير ___.",
        [("block", "كتلة"), ("stream", "تيار"), ("public-key", "مفتاح عام"), ("hash", "هاش")],
        1,
        "Stream ciphers encrypt one bit/byte at a time with keystream.",
        "تشفير التيار يشفّر بت/بايت واحد في كل مرة بتيار مفتاح.",
    ),
    (
        "Valid AES key lengths (in bits) include ___.",
        "أطوال مفاتيح AES الصالحة (بالبت) تشمل ___.",
        [("64, 128", "64، 128"), ("128, 192, 256", "128، 192، 256"), ("256, 512", "256، 512"), ("96, 160", "96، 160")],
        1,
        "AES supports 128-, 192-, and 256-bit keys.",
        "AES يدعم مفاتيح 128 و 192 و 256 بت.",
    ),
    (
        "How many AES rounds for a 256-bit key?",
        "كم جولة AES لمفتاح 256 بت؟",
        [("10", "10"), ("12", "12"), ("14", "14"), ("16", "16")],
        2,
        "Rounds: 10 (128-bit key), 12 (192-bit), 14 (256-bit).",
        "الجولات: 10 (مفتاح 128)، 12 (192)، 14 (256).",
    ),
    (
        "Which is NOT a standard AES round transformation (for full rounds)?",
        "أي التالي ليس تحويلاً قياسياً في جولة AES (للجولات الكاملة)?",
        [
            ("SubBytes", "SubBytes"),
            ("ShiftRows", "ShiftRows"),
            ("MixColumns", "MixColumns"),
            ("HammingCode", "HammingCode"),
        ],
        3,
        "AES uses SubBytes, ShiftRows, MixColumns, AddRoundKey each round.",
        "AES يستخدم SubBytes و ShiftRows و MixColumns و AddRoundKey كل جولة.",
    ),
    (
        "A TRNG derives randomness from ___.",
        "TRNG يستمد العشوائية من ___.",
        [
            ("Purely a mathematical formula with fixed seed", "صيغة رياضية بحسب معامل ثابت فقط"),
            ("Physical entropy (noise, timing jitter)", "إنتروبيا فيزيائية (ضوضاء، اضطراب التوقيت)"),
            ("IPv4 subnet calculations", "حسابات أقنعة IPv4"),
            ("TLS handshake messages", "رسائل مصافحة TLS"),
        ],
        1,
        "True Random Number Generators sample unpredictable physical events.",
        "مولدات الأرقام العشوائية الحقيقية تعتمد أحداثاً فيزيائية غير متوقعة.",
    ),
    (
        "A cryptographic hash function maps input of arbitrary length to ___.",
        "دالة الهاش التشفيرية تحوّل مدخلاً بطول غير محدود إلى ___.",
        [
            ("Variable-length output", "مخرج بطول متغير"),
            ("Fixed-length digest", "ملخص بطول ثابت"),
            ("The same as the key", "نفس المفتاح"),
            ("A public key", "مفتاح عام"),
        ],
        1,
        "SHA-256 always outputs 256 bits regardless of input size.",
        "SHA-256 تخرج دائماً 256 بت بغض النظر عن حجم المدخل.",
    ),
    (
        "Concatenation before hashing is written as H(m₁ ∥ m₂) meaning ___.",
        "الربط قبل الهاش يُكتب H(m₁ ∥ m₂) بمعنى ___.",
        [
            ("Hash only the longer message", "هاش الرسالة الأطول فقط"),
            ("Hash the juxtaposition of m₁ followed by m₂", "هاش وصل m₁ ثم m₂"),
            ("Exclusive-or the messages", "XOR للرسالتين"),
            ("Encrypt with two keys", "تشفير بمفتاحين"),
        ],
        1,
        "∥ denotes string concatenation — order matters in protocols.",
        "∥ يعني ربط السلاسل — الترتيب مهم في البروتوكولات.",
    ),
    (
        "SHA-1 produces a ___-bit digest (deprecated for security).",
        "SHA-1 ينتج ملخصاً بطول ___ بت (مهجور أمنياً).",
        [("128", "128"), ("160", "160"), ("256", "256"), ("512", "512")],
        1,
        "SHA-256 outputs 256 bits; SHA-1 outputs 160 bits.",
        "SHA-256 تخرج 256 بت؛ SHA-1 تخرج 160 بت.",
    ),
    (
        "In RSA signatures, the sender signs with ___ and verifiers use ___.",
        "في توقيع RSA، المرسل يوقّع بـ ___ والمتحققون يستخدمون ___.",
        [
            ("Private key; sender's public key", "المفتاح الخاص؛ المفتاح العام للمرسل"),
            ("Public key; private key", "المفتاح العام؛ المفتاح الخاص"),
            ("Symmetric key twice", "مفتاح متماثل مرتين"),
            ("Subnet mask; IP", "قناع الشبكة؛ IP"),
        ],
        0,
        "Sign = encrypt hash with private key; verify with matching public key.",
        "التوقيع = تشفير الهاش بالمفتاح الخاص؛ التحقق بالمفتاح العام المقابل.",
    ),
    (
        "An authentication tag from AES-GCM is an example of a ___ tag.",
        "علامة المصادقة من AES-GCM مثال على علامة ___.",
        [("routing", "توجيه"), ("integrity/authentication", "تكامل/مصادقة"), ("ARP", "ARP"), ("DNS", "DNS")],
        1,
        "AEAD modes output ciphertext plus an authentication tag verifying integrity.",
        "أوضاع AEAD تخرج نصاً مشفراً مع علامة مصادقة تتحقق من التكامل.",
    ),
    (
        "PKI primarily provides ___.",
        "PKI يوفر أساساً ___.",
        [
            ("A framework to bind public keys to identities via certificates & CAs", "إطاراً لربط المفاتيح العامة بالهويات عبر الشهادات والجهات المصدرة"),
            ("Physical cable encryption", "تشفير الكابلات الفيزيائية"),
            ("Only symmetric keys", "مفاتيح متماثلة فقط"),
            ("Wi-Fi channel selection", "اختيار قناة Wi-Fi"),
        ],
        0,
        "Public Key Infrastructure manages trust chains (roots, intermediates).",
        "البنية التحتية للمفتاح العام تدير سلاسل الثقة (جذور، وسيطة).",
    ),
    (
        "TLS sits mainly above ___ and below application protocols like HTTPS.",
        "TLS يقع أساساً فوق ___ وتحت بروتوكولات التطبيق مثل HTTPS.",
        [("TCP", "TCP"), ("Ethernet only", "Ethernet فقط"), ("ARP", "ARP"), ("ICMP only", "ICMP فقط")],
        0,
        "TLS typically runs over reliable transports (TCP); QUIC integrates differently.",
        "TLS يعمل عادةً فوق نقل موثوق (TCP); QUIC تكامل مختلف.",
    ),
    (
        "A MAC provides ___.",
        "MAC يوفر ___.",
        [
            ("Integrity and authenticity using a shared secret", "تكامل وأصالة باستخدام سر مشترك"),
            ("Only confidentiality without keys", "سرية فقط بدون مفاتيح"),
            ("Public bulletin boards", "لوحات إعلان عامة"),
            ("IP address leasing", "تأجير عناوين IP"),
        ],
        0,
        "Message Authentication Code — HMAC-SHA256 is common.",
        "رمز مصادقة الرسالة — HMAC-SHA256 شائع.",
    ),
    (
        "SSH is primarily used to ___.",
        "SSH يُستخدم أساساً من أجل ___.",
        [
            ("Secure remote shell and tunneling over untrusted networks", "وصول طرفي آمن ونفق عبر شبكات غير موثوقة"),
            ("Assign DHCP leases", "تعيين تأجير DHCP"),
            ("Replace DNS entirely", "استبدال DNS بالكامل"),
            ("Encode video streams", "ترميز تدفقات الفيديو"),
        ],
        0,
        "SSH encrypts terminal/file transfer (often port 22).",
        "SSH يشفّر الطرفية/نقل الملفات (غالباً المنفذ 22).",
    ),
    (
        "Which attack threatens confidentiality most directly?",
        "أي هجوم يهدد السرية مباشرة أكثر؟",
        [("Traffic eavesdropping", "التنصت على الحركة"), ("SYN flood", "فيض SYN"), ("Power outage", "انقطاع التيار"), ("Bitmap corruption on disk", "تلف البت ماب على القرص")],
        0,
        "Passive sniffing exposes plaintext or weakly protected data.",
        "الاستنشاق السلبي يكشف النص الصريح أو البيانات ضعيفة الحماية.",
    ),
    (
        "Replay attacks are mitigated by using ___.",
        "هجمات إعادة التشغيل تُخفّف باستخدام ___.",
        [("nonces or timestamps in protocols", "NONCE أو طوابع زمنية في البروتوكولات"), ("larger MTU", "MTU أكبر"), ("shorter cables", "كابلات أقصر"), ("removing TLS", "إزالة TLS")],
        0,
        "Fresh values ensure old captured messages are rejected.",
        "القيم الجديدة تضمن رفض الرسائل الملتقطة القديمة.",
    ),
    (
        "H(password) stored in a database supports which property when login succeeds only if hash matches?",
        "H(password) المخزن في قاعدة بيانات يدعم أي خاصية عند نجاح الدخول فقط إذا تطابق الهاش؟",
        [("Verification without storing plaintext password", "التحقق دون تخزين كلمة المرور صريحة"), ("Perfect forward secrecy alone", "السرية الأمامية الكاملة وحدها"), ("ARP resolution", "حل ARP"), ("IPv6 transition", "انتقال IPv6")],
        0,
        "Hashes verify credentials; salts defend rainbow tables.",
        "الهاش يتحقق من الاعتماديات؛ الملح يدافع عن جداول قوس قزح.",
    ),
    (
        "Collision resistance of a hash means it is hard to find ___ with same hash.",
        "مقاومة التصادم للهاش تعني صعوبة إيجاد ___ لهما نفس الهاش.",
        [("two distinct inputs", "مدخلان مختلفان"), ("two identical inputs", "مدخلان متطابقان"), ("one input twice", "مدخل واحد مرتين"), ("only null input", "مدخل فارغ فقط")],
        0,
        "Collision → break integrity of hash-based commitments.",
        "التصادم يكسر تكامل الالتزامات المعتمدة على الهاش.",
    ),
    (
        "Diffie–Hellman is a security ___ for key agreement, not a hash.",
        "ديفي-هيلمان ___ أمنية لاتفاق المفاتيح وليست هاشاً.",
        [("mechanism", "آلية"), ("passive attack", "هجوم سلبي"), ("availability outage", "انقطاع توفر"), ("routing table", "جدول توجيه")],
        0,
        "Mechanism provides shared secret over public channel.",
        "الآلية توفر سراً مشتركاً عبر قناة عامة.",
    ),
    (
        "Certificate in PKI contains a ___ and is signed by a CA.",
        "الشهادة في PKI تحتوي على ___ وموقعة من جهة مصدرة.",
        [("subject public key + identity", "مفتاح عام للموضوع + هوية"), ("private key of user", "المفتاح الخاص للمستخدم"), ("symmetric session key only", "مفتاح جلسة متماثل فقط"), ("Wi-Fi SSID only", "SSID فقط")],
        0,
        "Never embed private keys in certificates.",
        "لا تضمّن المفاتيح الخاصة في الشهادات أبداً.",
    ),
    (
        "During TLS handshake, parties negotiate ___ and authenticate via certificates.",
        "أثناء مصافحة TLS يتفاوض الطرفان على ___ ويصادقان عبر الشهادات.",
        [("cipher suite & keys", "مجموعة تشفير ومفاتيح"), ("Ethernet MTU only", "MTU Ethernet فقط"), ("ARP entries", "إدخالات ARP"), ("DHCP options only", "خيارات DHCP فقط")],
        0,
        "Handshake establishes keys + algorithms for record layer.",
        "المصافحة تؤسس مفاتيح وخوارزميات لطبقة السجلات.",
    ),
    (
        "Which is symmetric?",
        "أي من التالي متماثل؟",
        [("AES-128", "AES-128"), ("RSA-2048", "RSA-2048"), ("ECDSA verify", "تحقق ECDSA"), ("X.509 cert issuance", "إصدار شهادة X.509")],
        0,
        "AES uses one shared secret; RSA/ECDSA are asymmetric.",
        "AES يستخدم سراً مشتركاً واحداً؛ RSA/ECDSA غير متماثلين.",
    ),
    (
        "Stream ciphers are often faster on ___ when implemented in hardware.",
        "تشفير التيار غالباً أسرع على ___ عند التنفيذ بالعتاد.",
        [("continuous telecom links", "روابط اتصال متواصلة"), ("one-time pad backup tapes only", "أشرطة نسخ احتياطي فقط"), ("paper mail", "بريد ورقي"), ("manual XOR by hand", "XOR يدوي")],
        0,
        "Low latency on bit streams; block ciphers dominate bulk storage standards.",
        "زمن انتقال منخفض على تدفقات البت؛ تشفير الكتل يهيمن على معايير التخزين.",
    ),
    (
        "AddRoundKey in AES XORs the state with ___.",
        "AddRoundKey في AES يعمل XOR للحالة مع ___.",
        [("round key from key schedule", "مفتاح الجولة من جدولة المفتاح"), ("previous ciphertext only", "النص المشفر السابق فقط"), ("subnet mask", "قناع الشبكة"), ("TLS certificate", "شهادة TLS")],
        0,
        "Key schedule expands user key into round keys.",
        "جدولة المفتاح توسّع مفتاح المستخدم إلى مفاتيح جولات.",
    ),
    (
        "If subnet mask is 255.255.255.0, how many host bits?",
        "إذا كان القناع 255.255.255.0، كم بت للمضيف؟",
        [("8", "8"), ("16", "16"), ("24", "24"), ("4", "4")],
        0,
        "/24 → 8 host bits (256 addresses, 254 usable classic).",
        "/24 → 8 بتات مضيف (256 عنواناً، 254 قابلة للاستخدام تقريباً).",
    ),
    (
        "Malware that records keystrokes is a ___ attack affecting confidentiality.",
        "برمجيات تسجل ضغطات المفاتيح هجوم ___ يؤثر على السرية.",
        [("active", "نشط"), ("purely passive on the wire", "سلبي بحت على السلك"), ("availability-only", "للتوفر فقط"), ("routing", "توجيه")],
        0,
        "Installing spyware changes/compromises the endpoint — active.",
        "تثبيت برمجيات التجسس يغيّر/يخترق الطرفية — نشط.",
    ),
    (
        "Digital signature provides non-repudiation because only holder of ___ could sign.",
        "التوقيع الرقمي يوفر عدم إنكار لأن حامل ___ فقط يستطيع التوقيع.",
        [("private key", "المفتاح الخاص"), ("public key", "المفتاح العام"), ("CA root password", "كلمة جذر CA"), ("nonce", "NONCE")],
        0,
        "Private-key operation proves origin to verifiers with public key.",
        "عملية المفتاح الخاص تثبت المصدر للمتحققين بالمفتاح العام.",
    ),
    (
        "HMAC needs ___ besides the hash function.",
        "HMAC يحتاج ___ بالإضافة إلى دالة الهاش.",
        [("a secret key", "مفتاحاً سرياً"), ("a certificate chain", "سلسلة شهادات"), ("an IPv6 address", "عنوان IPv6"), ("a BGP ASN", "ASN لـ BGP")],
        0,
        "Keyed hash — both parties know secret K.",
        "هاش مفتاح — كلا الطرفين يعرفان السر K.",
    ),
    (
        "Which goal does a MITM breaking TLS without detection violate first?",
        "أي هدف يخترقه MITM يكسر TLS دون اكتشاف أولاً؟",
        [("Integrity and authenticity", "التكامل والأصالة"), ("Only humidity control", "التحكم في الرطوبة فقط"), ("Screen brightness", "سطوع الشاشة"), ("CPU fan speed", "سرعة مروحة المعالج")],
        0,
        "Altered or impersonated channel breaks trust in content and peer.",
        "قناة معدّلة أو منتحلة تكسر الثقة في المحتوى والطرف.",
    ),
    (
        "PRNG differs from TRNG because PRNG is ___.",
        "PRNG يختلف عن TRNG لأن PRNG ___.",
        [("deterministic given a seed", "حتمي بمعامل بذرة"), ("always slower than disk", "أبطأ دائماً من القرص"), ("unable to produce bits", "غير قادر على إنتاج بتات"), ("the same as SHA", "مماثل لـ SHA")],
        0,
        "Pseudo-random is algorithmic; seed from TRNG/hardware when possible.",
        "العشوائي الزائف خوارزمي؛ البذرة من TRNG/عتاد عند الإمكان.",
    ),
    (
        "In 192.168.1.0/24, the default directed broadcast is often ___.",
        "في 192.168.1.0/24، بث التوجيه الافتراضي غالباً ___.",
        [("192.168.1.255", "192.168.1.255"), ("192.168.0.0", "192.168.0.0"), ("255.255.255.0", "255.255.255.0"), ("0.0.0.0", "0.0.0.0")],
        0,
        "Host bits all 1s in the network.",
        "بتات المضيف كلها 1 في الشبكة.",
    ),
    (
        "SHA-256 is part of the ___ family.",
        "SHA-256 جزء من عائلة ___.",
        [("SHA-2", "SHA-2"), ("MD5", "MD5"), ("AES", "AES"), ("RSA", "RSA")],
        0,
        "SHA-2 includes SHA-224, SHA-256, SHA-384, SHA-512.",
        "SHA-2 تشمل SHA-224 و SHA-256 و SHA-384 و SHA-512.",
    ),
    (
        "Encrypt-then-MAC is preferred because MAC verifies ___",
        "Encrypt-then-MAC مفضل لأن MAC يتحقق من ___",
        [("ciphertext integrity before decryption", "تكامل النص المشفر قبل فك التشفير"), ("IP routing tables", "جداول توجيه IP"), ("CPU temperature", "حرارة المعالج"), ("printer queue", "طابور الطابعة")],
        0,
        "Prevents padding oracle style issues vs MAC-then-encrypt pitfalls.",
        "يمنع مشاكل oracle الحشو مقارنة بعيوب MAC-then-encrypt.",
    ),
    (
        "Which is a security service enabled by digital certificates in TLS?",
        "أي خدمة أمنية تمكّنها الشهادات الرقمية في TLS؟",
        [("Peer authentication", "مصادقة الطرف"), ("Physical layer cabling", "تمديدات الطبقة الفيزيائية"), ("RAM size", "حجم RAM"), ("Monitor refresh rate", "معدل تحديث الشاشة")],
        0,
        "Server (and optionally client) authentication via PKI.",
        "مصادقة الخادم (واختيارياً العميل) عبر PKI.",
    ),
    (
        "Private key must remain ___; public key can be ___.",
        "المفتاح الخاص يجب أن يبقى ___؛ المفتاح العام يمكن أن يكون ___.",
        [("secret; published", "سرياً؛ منشوراً"), ("published; secret", "منشوراً؛ سرياً"), ("deleted; deleted", "محذوفاً؛ محذوفاً"), ("shared on social media; hidden", "مشاركاً على وسائل التواصل؛ مخفياً")],
        0,
        "Core rule of public-key cryptography.",
        "القاعدة الأساسية لتشفير المفتاح العام.",
    ),
    (
        "Security attack taxonomy in coursework often contrasts ___ vs ___.",
        "تصنيف الهجوم في المقرر يقارن غالباً ___ مقابل ___.",
        [("passive; active", "سلبي؛ نشط"), ("TCP; UDP", "TCP؛ UDP"), ("IPv4; IPv6", "IPv4؛ IPv6"), ("HTTP; FTP", "HTTP؛ FTP")],
        0,
        "Foundational split for mechanisms you deploy.",
        "تقسيم أساسي للآليات التي تنشرها.",
    ),
]

assert len(MCQS) == 50, len(MCQS)
assert len(MCQ_EXAMPLE_EN) == 50 and len(MCQ_EXAMPLE_AR) == 50

HTML_TEMPLATE = r'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Network Security — Study Guide & 50 MCQs</title>
<style>
:root {
  --bg: #121826;
  --card: #1a2234;
  --card-inner: #151d2e;
  --border: #2d3a52;
  --blue: #5eb3ff;
  --blue-btn: #2563eb;
  --green: #6ee7a0;
  --orange: #f4a261;
  --text: #e8edf5;
  --muted: #9aa8bc;
  --pill: #243044;
  --correct-bg: #0d3328;
  --correct-border: #10b981;
  --correct-text: #a7f3d0;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.65;
  padding: 0 16px 48px;
}
body.arabic { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; }
.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(18, 24, 38, 0.92);
  backdrop-filter: blur(8px);
  padding: 12px 0;
  margin: 0 -16px;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--blue-btn);
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  flex-shrink: 0;
}
.nav-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  flex: 1;
  min-width: 0;
  padding-bottom: 2px;
  -webkit-overflow-scrolling: touch;
}
.nav-scroll a {
  flex-shrink: 0;
  text-decoration: none;
  color: var(--blue);
  background: var(--pill);
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.82rem;
  border: 1px solid var(--border);
}
.nav-ar { display: none; }
body.arabic .nav-en { display: none !important; }
body.arabic .nav-ar { display: inline; }
.container { max-width: 920px; margin: 0 auto; }
.hero {
  margin-top: 20px;
  background: var(--card);
  border-radius: 16px;
  padding: 24px 20px;
  border: 1px solid var(--border);
}
.meta {
  color: var(--green);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.hero h1 {
  color: var(--blue);
  font-size: clamp(1.35rem, 4vw, 1.85rem);
  margin: 0 0 12px;
  line-height: 1.25;
}
.hero .lead { color: var(--muted); margin-bottom: 16px; font-size: 1rem; }
.badges { display: flex; flex-wrap: wrap; gap: 8px; }
.badges span {
  background: var(--pill);
  border: 1px solid var(--border);
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  color: var(--muted);
}
section.topic { margin-top: 36px; }
section.topic h2 {
  color: var(--orange);
  font-size: clamp(1.1rem, 3.5vw, 1.35rem);
  margin: 0 0 12px;
  line-height: 1.35;
}
.card {
  background: var(--card-inner);
  border: 1px solid #3d5a80;
  border-radius: 14px;
  padding: 18px 16px;
}
.card p { margin: 0 0 12px; }
.card p:last-child { margin-bottom: 0; }
.card ul { margin: 8px 0 12px 1.1rem; padding: 0; color: var(--muted); }
.card li { margin-bottom: 6px; }
.card strong { color: #fff; }
.card code { background: #0f172a; padding: 2px 6px; border-radius: 4px; font-size: 0.88em; color: #93c5fd; }
.fig-block { margin: 16px 0; text-align: center; }
.fig-svg { max-width: 100%; height: auto; }
.fig-block figcaption { color: var(--muted); font-size: 0.82rem; margin-top: 8px; line-height: 1.4; }
.example-box {
  margin-top: 14px;
  padding: 14px;
  border-radius: 10px;
  border: 1px dashed #6ee7a0;
  background: rgba(16, 185, 129, 0.06);
}
.example-box.mini { margin-top: 10px; padding: 10px 12px; font-size: 0.9rem; }
.example-title { color: var(--green); font-weight: 700; font-size: 0.88rem; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.04em; }
.explanation .expl-detail { margin-top: 10px; line-height: 1.55; }
.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  margin-top: 8px;
}
.compare-table th, .compare-table td {
  border: 1px solid var(--border);
  padding: 8px 10px;
  text-align: left;
}
body.arabic .compare-table th, body.arabic .compare-table td { text-align: right; }
.compare-table th { background: var(--pill); color: var(--blue); }
.t.en, .t.ar { display: block; }
body.arabic .t.en { display: none !important; }
body:not(.arabic) .t.ar { display: none !important; }
body.arabic { direction: rtl; }
body.arabic .nav-scroll { direction: rtl; }
.quiz-header {
  margin-top: 48px;
  text-align: center;
  padding: 20px;
  background: var(--card);
  border-radius: 14px;
  border: 1px solid var(--border);
}
.quiz-header h2 { color: var(--blue); margin: 0 0 8px; }
.question-card {
  background: var(--card);
  border-radius: 12px;
  padding: 20px 16px;
  margin-top: 20px;
  border: 1px solid var(--border);
}
.q-title { font-weight: 600; margin-bottom: 14px; }
.options { list-style: none; padding: 0; margin: 0 0 14px; }
.options li {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  padding: 10px 14px;
  margin-bottom: 8px;
  border-radius: 8px;
  color: var(--muted);
  font-size: 0.95rem;
}
.btn-toggle {
  background: var(--blue);
  color: #0f172a;
  border: none;
  padding: 10px 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}
.explanation {
  display: none;
  margin-top: 14px;
  padding: 14px;
  background: var(--correct-bg);
  border: 1px solid var(--correct-border);
  border-radius: 8px;
  color: var(--correct-text);
  font-size: 0.92rem;
}
.correct-label { font-weight: 700; color: #fff; margin-bottom: 6px; }
@media (max-width: 480px) {
  .hero { padding: 18px 14px; }
  .card { padding: 14px 12px; }
}
</style>
</head>
<body>
<div class="top-bar">
  <button type="button" class="lang-btn" id="langToggle" aria-label="Toggle Arabic">
    <span aria-hidden="true">🌐</span>
    <span id="langLabel">العربية</span>
  </button>
  <nav class="nav-scroll" aria-label="Topics">
    <a href="#goals" class="nav-en">Security Goals</a>
    <a href="#goals" class="nav-ar">الأهداف الأمنية</a>
    <a href="#attacks" class="nav-en">Attacks & Services</a>
    <a href="#attacks" class="nav-ar">الهجمات والخدمات</a>
    <a href="#crypto" class="nav-en">Encryption</a>
    <a href="#crypto" class="nav-ar">التشفير</a>
    <a href="#aes" class="nav-en">AES & Hashes</a>
    <a href="#aes" class="nav-ar">AES والهاش</a>
    <a href="#pki" class="nav-en">PKI & TLS</a>
    <a href="#pki" class="nav-ar">PKI و TLS</a>
    <a href="#ipv4" class="nav-en">IPv4 & Subnets</a>
    <a href="#ipv4" class="nav-ar">IPv4 والشبكات</a>
    <a href="#quiz" class="nav-en">50 MCQs</a>
    <a href="#quiz" class="nav-ar">50 سؤال</a>
  </nav>
</div>

<div class="container">
<header class="hero">
  <div class="meta t en">NETWORK SECURITY · EXAM PREP</div>
  <div class="meta t ar">أمن الشبكات · مراجعة امتحان</div>
  <h1>
    <span class="t en">Network Security — Complete Topic Guide</span>
    <span class="t ar">أمن الشبكات — دليل شامل للموضوعات</span>
  </h1>
  <p class="lead">
    <span class="t en">Deep explanations with <strong>worked examples</strong>, <strong>figures</strong>, and 50 MCQs. Tap <strong>العربية</strong> in the top bar for Arabic.</span>
    <span class="t ar">شرح موسّع مع <strong>أمثلة</strong> و<strong>أشكال</strong> و50 سؤالاً. اضغط <strong>العربية</strong> للعربية.</span>
  </p>
  <div class="badges">
    <span class="t en">Confidentiality · Integrity · Availability</span>
    <span class="t ar">السرية · التكامل · التوفر</span>
    <span class="t en">Symmetric &amp; asymmetric crypto</span>
    <span class="t ar">تشفير متماثل وغير متماثل</span>
    <span class="t en">Figures &amp; worked examples</span>
    <span class="t ar">أشكال وأمثلة محسوبة</span>
    <span class="t en">50 scenario MCQs</span>
    <span class="t ar">50 سؤال اختيار من متعدد</span>
  </div>
</header>

{study_body}

<section id="quiz">
<div class="quiz-header">
  <h2><span class="t en">Practice: 50 Multiple-Choice Questions</span><span class="t ar">تدريب: 50 سؤال اختيار من متعدد</span></h2>
  <p class="t en" style="color:var(--muted);margin:0;">Tap a button to reveal the correct answer and a short explanation.</p>
  <p class="t ar" style="color:var(--muted);margin:0;">اضغط الزر لإظهار الإجابة الصحيحة وتفسير مختصر.</p>
</div>
{mcq_blocks}
</section>
</div>

<script>
function toggleAnswer(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
}
(function () {
  const body = document.body;
  const btn = document.getElementById('langToggle');
  const label = document.getElementById('langLabel');
  const stored = localStorage.getItem('ns-lang');
  if (stored === 'ar') body.classList.add('arabic');
  function updateNav() {
    document.querySelectorAll('.nav-en').forEach(e => e.style.display = body.classList.contains('arabic') ? 'none' : '');
    document.querySelectorAll('.nav-ar').forEach(e => e.style.display = body.classList.contains('arabic') ? '' : 'none');
  }
  function updateLabel() {
    label.textContent = body.classList.contains('arabic') ? 'English' : 'العربية';
    document.documentElement.lang = body.classList.contains('arabic') ? 'ar' : 'en';
  }
  btn.addEventListener('click', function () {
    body.classList.toggle('arabic');
    localStorage.setItem('ns-lang', body.classList.contains('arabic') ? 'ar' : 'en');
    updateLabel();
    updateNav();
  });
  updateLabel();
  updateNav();
})();
</script>
</body>
</html>
'''


def mcq_html():
    blocks = []
    letters = "ABCD"
    for i, (q_en, q_ar, opts, correct, ex_en, ex_ar) in enumerate(MCQS, 1):
        ex_ex_en = MCQ_EXAMPLE_EN[i - 1]
        ex_ex_ar = MCQ_EXAMPLE_AR[i - 1]
        qid = f"q{i}"
        opt_lis = []
        for j, (oen, oar) in enumerate(opts):
            opt_lis.append(
                f'<li><span class="t en">{letters[j]}) {oen}</span>'
                f'<span class="t ar">{letters[j]}) {oar}</span></li>'
            )
        correct_letter = letters[correct]
        correct_text_en = opts[correct][0]
        correct_text_ar = opts[correct][1]
        blocks.append(
            f'''<div class="question-card">
<div class="q-title"><span class="t en">{i}. {q_en}</span><span class="t ar">{i}. {q_ar}</span></div>
<ul class="options">{"".join(opt_lis)}</ul>
<button type="button" class="btn-toggle" onclick="toggleAnswer('{qid}')"><span class="t en">Show Answer &amp; Explanation</span><span class="t ar">إظهار الإجابة والشرح</span></button>
<div id="{qid}" class="explanation">
<div class="correct-label"><span class="t en">Correct: {correct_letter}) {correct_text_en}</span><span class="t ar">الصحيح: {correct_letter}) {correct_text_ar}</span></div>
<p class="expl-detail"><span class="t en">{ex_en}</span><span class="t ar">{ex_ar}</span></p>
<div class="example-box mini"><span class="t en"><strong>Example:</strong> {ex_ex_en}</span><span class="t ar"><strong>مثال:</strong> {ex_ex_ar}</span></div>
</div>
</div>'''
        )
    return "\n".join(blocks)


def main():
    html = HTML_TEMPLATE.replace("{study_body}", STUDY_BODY).replace("{mcq_blocks}", mcq_html())
    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(html)
    print("Wrote", OUTPUT, "bytes", len(html.encode("utf-8")))


if __name__ == "__main__":
    main()
