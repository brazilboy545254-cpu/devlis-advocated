export type Locale = "en" | "hi";

export const translations = {
  en: {
    appName: "Devli's Advocated",
    tagline: "Your Original QR Photo",
    googleLogin: "Continue with Google",
    googleOnly: "Google / Gmail only",
    create: "Create",
    downloadPng: "Download PNG",
    uploadQr: "Upload original QR photo",
    uploadReference: "Upload reference photo",
    originalHint: "Your source QR image.",
    referenceHint: "Style or color reference.",
    history: "History",
    settings: "Settings",
    dashboard: "Dashboard",
    logout: "Logout",
    deleteAccount: "Delete account",
    language: "Language",
    loginMethod: "Login method",
    signInWith: "Signed in with",
    processing: "Processing",
    done: "Ready",
    error: "Something went wrong",
    noHistory: "No creations yet.",
    preview: "Preview",
    originalUpload: "Original QR",
    referenceUpload: "Reference photo",
    createdAt: "Created",
    downloadAction: "Download",
    profile: "Profile",
    privacyNote: "Private by design. Metadata only where possible.",
    hindiToggle: "Hindi",
    englishToggle: "English",
    welcome: "Welcome back"
  },
  hi: {
    appName: "देवलीज़ एडवोकेटेड",
    tagline: "आपका मूल QR फोटो",
    googleLogin: "Google से जारी रखें",
    googleOnly: "केवल Google / Gmail",
    create: "बनाएँ",
    downloadPng: "PNG डाउनलोड करें",
    uploadQr: "मूल QR फोटो अपलोड करें",
    uploadReference: "रेफरेंस फोटो अपलोड करें",
    originalHint: "आपकी स्रोत QR छवि।",
    referenceHint: "स्टाइल या रंग का रेफरेंस।",
    history: "इतिहास",
    settings: "सेटिंग्स",
    dashboard: "डैशबोर्ड",
    logout: "लॉग आउट",
    deleteAccount: "खाता हटाएँ",
    language: "भाषा",
    loginMethod: "लॉगिन तरीका",
    signInWith: "साइन इन किया गया",
    processing: "प्रोसेस हो रहा है",
    done: "तैयार",
    error: "कुछ गलत हुआ",
    noHistory: "अभी तक कोई क्रिएशन नहीं।",
    preview: "पूर्वावलोकन",
    originalUpload: "मूल QR",
    referenceUpload: "रेफरेंस फोटो",
    createdAt: "बनाया गया",
    downloadAction: "डाउनलोड",
    profile: "प्रोफ़ाइल",
    privacyNote: "डिज़ाइन से निजी। जहाँ संभव हो केवल मेटाडेटा।",
    hindiToggle: "हिंदी",
    englishToggle: "अंग्रेज़ी",
    welcome: "फिर से स्वागत है"
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(locale: Locale, key: TranslationKey) {
  return translations[locale][key];
}
