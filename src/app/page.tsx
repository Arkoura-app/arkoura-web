'use client'

export const runtime = 'edge'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

// ─── Design tokens ─────────────────────────────────────────────────────────────
// #FAFAF8 page bg · #F5F5F0 hero/cta bg · #F0F2EE section wash
// #7A9E7E sage · #4A7A50 sage-text · #E8F2E6 sage-tint · #A8C5A0 sage-med
// #1C2B1E forest · #374151 body · #6B7280 muted

// ─── Framer Motion variants ─────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: 'easeOut' } },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
}

function stagger(delay = 0.15): Variants {
  return { hidden: {}, show: { transition: { staggerChildren: delay } } }
}

const vp = { once: true, amount: 0.2 }

// ─── Language system ─────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'EN', name: 'English',    native: 'English' },
  { code: 'ES', name: 'Spanish',    native: 'Español' },
  { code: 'FR', name: 'French',     native: 'Français' },
  { code: 'DE', name: 'German',     native: 'Deutsch' },
  { code: 'PT', name: 'Portuguese', native: 'Português' },
  { code: 'ZH', name: 'Chinese',    native: '中文' },
  { code: 'AR', name: 'Arabic',     native: 'العربية' },
  { code: 'JA', name: 'Japanese',   native: '日本語' },
  { code: 'KO', name: 'Korean',     native: '한국어' },
  { code: 'IT', name: 'Italian',    native: 'Italiano' },
  { code: 'NL', name: 'Dutch',      native: 'Nederlands' },
  { code: 'RU', name: 'Russian',    native: 'Русский' },
  { code: 'PL', name: 'Polish',     native: 'Polski' },
  { code: 'SV', name: 'Swedish',    native: 'Svenska' },
  { code: 'TR', name: 'Turkish',    native: 'Türkçe' },
  { code: 'HI', name: 'Hindi',      native: 'हिन्दी' },
  { code: 'UK', name: 'Ukrainian',  native: 'Українська' },
  { code: 'VI', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'TH', name: 'Thai',       native: 'ภาษาไทย' },
  { code: 'ID', name: 'Indonesian', native: 'Bahasa Indonesia' },
]

const TRANSLATIONS: Record<string, Record<string, string>> = {
  EN: {
    signIn: 'Sign in',
    getStarted: 'Get Started',
    heroBadge: 'Personal Health · Emergency Ready',
    heroH1: 'Your health story,',
    heroH2: 'everywhere you go.',
    heroSub: "Arkoura is a personal health journal that becomes an emergency lifeline. One QR scan gives any helper anywhere in the world instant access to what they need — in their language.",
    heroCta1: 'Join the waitlist →',
    heroCta2: 'See how it works',
    heroChip1: 'Free emergency access',
    heroChip2: 'GDPR & HIPAA ready',
    heroChip3: 'No app needed',
    problemLabel: 'WHY ARKOURA EXISTS',
    problemH1: 'In an emergency, silence',
    problemH2: 'is the most dangerous thing.',
    s1title: 'The cyclist who could not speak',
    s1body: 'He collapsed mid-route. No ID. Responders had no way to know about his penicillin allergy. The treatment they gave him nearly ended his life.',
    s1tag: 'Happens every day',
    s2title: 'The tourist and the language barrier',
    s2body: "Anaphylactic reaction in Tokyo. Her allergy history was in English. The doctors were brilliant — but twenty minutes was lost to translation.",
    s2tag: 'In every country',
    s3title: 'The parent who forgot',
    s3body: 'Dementia. He wandered from home. No medications list, no doctor name remembered. The ER started from zero.',
    s3tag: 'Closer than you think',
    howLabel: 'HOW IT WORKS',
    howH1: 'Three steps. One scan.',
    howH2: 'A life protected.',
    step1label: 'STEP ONE',
    step1title: 'Build your health profile',
    step1body: 'Add conditions, allergies, medications, and emergency contacts. Upload a photo. Select quick-glance icons for your most critical needs. Takes about 10 minutes.',
    step2label: 'STEP TWO',
    step2title: 'Your QR code goes everywhere',
    step2body: "Print it. Phone case. Bike helmet. Luggage tag. Medical bracelet. It never expires, never requires an app to scan, and never changes unless you ask it to.",
    step3label: 'STEP THREE',
    step3title: 'Anyone scans → instant help',
    step3body: "No account, no download, no friction. Any smartphone camera opens your profile immediately — in the helper's language. An AI assistant guides them step by step.",
    zfH1: 'Zero tracking.',
    zfH2: 'Zero installs.',
    zfH3: '100% yours.',
    zfSub: 'We built the app we wished existed. Private by design, free where it matters, and honest about everything.',
    fb1label: 'NO APP STORE REQUIRED',
    fb1body: "Helpers scan with any smartphone camera. Nothing to download. When every second counts, zero friction is everything.",
    fb2label: 'AES-256 ENCRYPTION',
    fb2body: 'Your data is encrypted at rest. We cannot read it. Not us, not anyone.',
    fb3label: 'FREE EMERGENCY MODE. FOREVER.',
    fb3body: 'The feature that saves lives will never be paywalled. Emergency access is a human right. No exceptions, ever.',
    diffLabel: 'THE ARKOURA ADVANTAGE',
    diffH1: 'Engineered for the',
    diffH2: 'moments that matter most.',
    d1title: 'Free for emergencies. Forever.',
    d1body: 'Emergency access will never sit behind a paywall. The feature that saves lives is free. No exceptions. No asterisks. No future pricing changes.',
    d2title: 'Speaks 20 languages instantly',
    d2body: "Your profile auto-renders in the helper's language. The AI chat adapts its terminology for doctors, first responders, and everyday bystanders alike.",
    d3title: 'Your data. Your control.',
    d3body: 'Export everything in one click. Delete everything permanently. No data sold, no advertising, no profiling. Your health story belongs entirely to you.',
    d4title: 'No app needed to help you',
    d4body: "Any smartphone. Any camera app. No download, no account, no friction. In someone's worst moment, nothing should slow them down.",
    trustLabel: 'TRUSTED INFRASTRUCTURE',
    trustQuote: "We store your health data with the same infrastructure that powers Google's own products — encrypted, redundant, and protected at every layer.",
    ctaH1: 'Be ready before',
    ctaH2: 'you need it.',
    ctaSub: 'Join the waitlist. Be among the first people to protect themselves and their loved ones with Arkoura.',
    ctaDisclaimer: 'Free forever for emergency access. No credit card required.',
    ctaIcon1: '🌿 Free emergency access',
    ctaIcon2: '🔒 Encrypted & private',
    ctaIcon3: '🌍 20 languages',
    formName: 'Your name',
    formEmail: 'your@email.com',
    formSubmit: 'Join the waitlist →',
    formLoading: 'Sending…',
    formSuccessTitle: "You're on the list.",
    formSuccessSub: "We'll reach out when Arkoura launches.",
    formErr: 'Something went wrong — please try again.',
    footerDisclaimer: 'Arkoura is not a medical device and does not provide medical advice. It is an information-sharing tool designed to assist in emergency situations. Always contact emergency services in a life-threatening situation.',
    footerCopyright: '© 2026 Arkoura. Built with care in Costa Rica. 🇨🇷',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
  },
  ES: {
    signIn: 'Iniciar sesión',
    getStarted: 'Comenzar',
    heroBadge: 'Salud Personal · Listo para Emergencias',
    heroH1: 'Tu historia de salud,',
    heroH2: 'dondequiera que vayas.',
    heroSub: 'Arkoura es un diario de salud personal que se convierte en un salvavidas. Un escaneo QR da acceso instantáneo a cualquier asistente en el mundo — en su idioma.',
    heroCta1: 'Unirse a la lista →',
    heroCta2: 'Cómo funciona',
    heroChip1: 'Acceso de emergencia gratuito',
    heroChip2: 'GDPR y HIPAA listo',
    heroChip3: 'Sin aplicación',
    problemLabel: 'POR QUÉ EXISTE ARKOURA',
    problemH1: 'En una emergencia, el silencio',
    problemH2: 'es lo más peligroso.',
    s1title: 'El ciclista que no pudo hablar',
    s1body: 'Colapsó a mitad del recorrido. Sin identificación. Los paramédicos no sabían de su alergia a la penicilina. El tratamiento que le dieron casi le costó la vida.',
    s1tag: 'Sucede cada día',
    s2title: 'El turista y la barrera del idioma',
    s2body: 'Reacción anafiláctica en Tokio. Su historial de alergias estaba en inglés. Los médicos eran brillantes — pero se perdieron veinte minutos en traducción.',
    s2tag: 'En todos los países',
    s3title: 'El padre que olvidó',
    s3body: 'Demencia. Salió de casa y se perdió. Sin lista de medicamentos, sin nombre del médico. La sala de emergencias empezó desde cero.',
    s3tag: 'Más cerca de lo que crees',
    howLabel: 'CÓMO FUNCIONA',
    howH1: 'Tres pasos. Un escaneo.',
    howH2: 'Una vida protegida.',
    step1label: 'PASO UNO',
    step1title: 'Construye tu perfil de salud',
    step1body: 'Agrega condiciones, alergias, medicamentos y contactos de emergencia. Sube una foto. Selecciona íconos para tus necesidades más críticas. Tarda unos 10 minutos.',
    step2label: 'PASO DOS',
    step2title: 'Tu código QR va a todas partes',
    step2body: 'Imprímelo. Funda del teléfono. Casco de bicicleta. Etiqueta del equipaje. Brazalete médico. Nunca vence y nunca requiere una app para escanearlo.',
    step3label: 'PASO TRES',
    step3title: 'Cualquiera escanea → ayuda inmediata',
    step3body: 'Sin cuenta, sin descarga, sin fricción. Cualquier cámara de smartphone abre tu perfil al instante — en el idioma del asistente. Una IA los guía paso a paso.',
    zfH1: 'Cero rastreo.',
    zfH2: 'Cero instalaciones.',
    zfH3: '100% tuyo.',
    zfSub: 'Creamos la app que quisiéramos que existiera. Privada por diseño, gratuita donde importa, y honesta con todo.',
    fb1label: 'SIN APP STORE',
    fb1body: 'Los asistentes escanean con cualquier cámara. Nada que descargar. Cuando cada segundo cuenta, cero fricción lo es todo.',
    fb2label: 'CIFRADO AES-256',
    fb2body: 'Tus datos están cifrados en reposo. No podemos leerlos. Ni nosotros, ni nadie.',
    fb3label: 'MODO DE EMERGENCIA GRATUITO. SIEMPRE.',
    fb3body: 'La función que salva vidas nunca estará detrás de un muro de pago. El acceso de emergencia es un derecho humano. Sin excepciones.',
    diffLabel: 'LA VENTAJA ARKOURA',
    diffH1: 'Diseñado para los',
    diffH2: 'momentos que más importan.',
    d1title: 'Gratuito para emergencias. Siempre.',
    d1body: 'El acceso de emergencia nunca estará detrás de un muro de pago. La función que salva vidas es gratuita. Sin excepciones. Sin asteriscos.',
    d2title: 'Habla 20 idiomas al instante',
    d2body: 'Tu perfil se muestra automáticamente en el idioma del asistente. La IA adapta su terminología para médicos, socorristas y transeúntes.',
    d3title: 'Tus datos. Tu control.',
    d3body: 'Exporta todo con un clic. Elimina todo permanentemente. Sin datos vendidos, sin publicidad. Tu historia de salud te pertenece totalmente.',
    d4title: 'Sin app para ayudarte',
    d4body: 'Cualquier smartphone. Cualquier app de cámara. Sin descarga, sin cuenta, sin fricción. En el peor momento de alguien, nada debe frenarlos.',
    trustLabel: 'INFRAESTRUCTURA DE CONFIANZA',
    trustQuote: "Almacenamos tus datos de salud con la misma infraestructura que impulsa los productos de Google — cifrados, redundantes y protegidos en cada capa.",
    ctaH1: 'Prepárate antes de',
    ctaH2: 'que lo necesites.',
    ctaSub: 'Únete a la lista de espera. Sé de los primeros en protegerte a ti y a tus seres queridos con Arkoura.',
    ctaDisclaimer: 'Gratuito para siempre para acceso de emergencia. Sin tarjeta de crédito.',
    ctaIcon1: '🌿 Acceso de emergencia gratuito',
    ctaIcon2: '🔒 Cifrado y privado',
    ctaIcon3: '🌍 20 idiomas',
    formName: 'Tu nombre',
    formEmail: 'tu@email.com',
    formSubmit: 'Unirse a la lista →',
    formLoading: 'Enviando…',
    formSuccessTitle: 'Estás en la lista.',
    formSuccessSub: 'Te contactaremos cuando Arkoura lance.',
    formErr: 'Algo salió mal — intenta de nuevo.',
    footerDisclaimer: 'Arkoura no es un dispositivo médico y no brinda consejo médico. Es una herramienta de compartición de información diseñada para asistir en situaciones de emergencia. Siempre contacta los servicios de emergencia ante una situación de riesgo de vida.',
    footerCopyright: '© 2026 Arkoura. Construido con cariño en Costa Rica. 🇨🇷',
    privacy: 'Privacidad',
    terms: 'Términos',
    cookies: 'Cookies',
  },
  FR: {
    signIn: 'Se connecter',
    getStarted: 'Commencer',
    heroBadge: 'Santé Personnelle · Prêt pour les Urgences',
    heroH1: 'Votre histoire de santé,',
    heroH2: 'partout où vous allez.',
    heroSub: "Arkoura est un journal de santé personnel qui devient un filet de sécurité d'urgence. Un scan QR donne un accès instantané à tout assistant dans le monde — dans sa langue.",
    heroCta1: "Rejoindre la liste →",
    heroCta2: 'Comment ça marche',
    heroChip1: "Accès d'urgence gratuit",
    heroChip2: 'Conforme RGPD et HIPAA',
    heroChip3: 'Aucune appli requise',
    problemLabel: "POURQUOI ARKOURA EXISTE",
    problemH1: "En cas d'urgence, le silence",
    problemH2: 'est la chose la plus dangereuse.',
    s1title: 'Le cycliste qui ne pouvait pas parler',
    s1body: "Il s'est effondré en pleine route. Pas d'identité. Les secouristes ignoraient son allergie à la pénicilline. Le traitement reçu a failli lui coûter la vie.",
    s1tag: 'Arrive tous les jours',
    s2title: 'Le touriste et la barrière de la langue',
    s2body: "Réaction anaphylactique à Tokyo. Ses antécédents allergiques étaient en anglais. Les médecins étaient brillants — mais vingt minutes ont été perdues en traduction.",
    s2tag: 'Dans tous les pays',
    s3title: "Le parent qui a oublié",
    s3body: "Démence. Il a erré hors de chez lui. Pas de liste de médicaments, pas de nom de médecin. Les urgences sont reparties de zéro.",
    s3tag: 'Plus proche que vous ne le pensez',
    howLabel: 'COMMENT ÇA MARCHE',
    howH1: 'Trois étapes. Un scan.',
    howH2: 'Une vie protégée.',
    step1label: 'ÉTAPE UNE',
    step1title: 'Créez votre profil de santé',
    step1body: "Ajoutez vos pathologies, allergies, médicaments et contacts d'urgence. Téléchargez une photo. Sélectionnez des icônes pour vos besoins les plus critiques. Environ 10 minutes.",
    step2label: 'ÉTAPE DEUX',
    step2title: 'Votre QR code vous suit partout',
    step2body: "Imprimez-le. Coque de téléphone. Casque de vélo. Étiquette de bagage. Bracelet médical. Il n'expire jamais et ne nécessite aucune appli pour être scanné.",
    step3label: 'ÉTAPE TROIS',
    step3title: "N'importe qui scanne → aide immédiate",
    step3body: "Pas de compte, pas de téléchargement, pas de friction. N'importe quelle caméra ouvre votre profil instantanément — dans la langue de l'assistant. Une IA les guide pas à pas.",
    zfH1: 'Zéro traçage.',
    zfH2: 'Zéro installation.',
    zfH3: '100% le vôtre.',
    zfSub: "Nous avons construit l'application que nous aurions voulu avoir. Privée par conception, gratuite là où ça compte, et honnête en tout.",
    fb1label: 'SANS APP STORE',
    fb1body: "Les assistants scannent avec n'importe quelle caméra. Rien à télécharger. Quand chaque seconde compte, zéro friction est tout.",
    fb2label: 'CHIFFREMENT AES-256',
    fb2body: "Vos données sont chiffrées au repos. Nous ne pouvons pas les lire. Ni nous, ni personne.",
    fb3label: "MODE URGENCE GRATUIT. POUR TOUJOURS.",
    fb3body: "La fonctionnalité qui sauve des vies ne sera jamais derrière un mur payant. L'accès d'urgence est un droit humain. Sans exception.",
    diffLabel: "L'AVANTAGE ARKOURA",
    diffH1: 'Conçu pour les',
    diffH2: 'moments qui comptent le plus.',
    d1title: "Gratuit pour les urgences. Pour toujours.",
    d1body: "L'accès d'urgence ne sera jamais derrière un mur payant. La fonctionnalité qui sauve des vies est gratuite. Sans exception.",
    d2title: 'Parle 20 langues instantanément',
    d2body: "Votre profil s'affiche automatiquement dans la langue de l'assistant. L'IA adapte sa terminologie pour les médecins, les secouristes et les passants.",
    d3title: 'Vos données. Votre contrôle.',
    d3body: "Exportez tout en un clic. Supprimez tout définitivement. Aucune donnée vendue, aucune publicité. Votre histoire de santé vous appartient entièrement.",
    d4title: "Aucune appli pour vous aider",
    d4body: "N'importe quel smartphone. N'importe quelle appli photo. Sans téléchargement, sans compte, sans friction.",
    trustLabel: 'INFRASTRUCTURE DE CONFIANCE',
    trustQuote: "Nous stockons vos données de santé avec la même infrastructure que les produits Google — chiffrée, redondante et protégée à chaque couche.",
    ctaH1: 'Soyez prêt avant',
    ctaH2: "d'en avoir besoin.",
    ctaSub: "Rejoignez la liste d'attente. Soyez parmi les premiers à vous protéger, vous et vos proches, avec Arkoura.",
    ctaDisclaimer: "Gratuit pour toujours pour l'accès d'urgence. Aucune carte de crédit requise.",
    ctaIcon1: "🌿 Accès urgence gratuit",
    ctaIcon2: '🔒 Chiffré et privé',
    ctaIcon3: '🌍 20 langues',
    formName: 'Votre nom',
    formEmail: 'votre@email.com',
    formSubmit: "Rejoindre la liste →",
    formLoading: 'Envoi…',
    formSuccessTitle: 'Vous êtes sur la liste.',
    formSuccessSub: "Nous vous contacterons au lancement d'Arkoura.",
    formErr: 'Une erreur est survenue — veuillez réessayer.',
    footerDisclaimer: "Arkoura n'est pas un dispositif médical et ne fournit pas de conseils médicaux. C'est un outil de partage d'informations conçu pour aider dans les situations d'urgence. Contactez toujours les services d'urgence en cas de danger de vie.",
    footerCopyright: '© 2026 Arkoura. Fait avec soin au Costa Rica. 🇨🇷',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    cookies: 'Cookies',
  },
  DE: {
    signIn: 'Anmelden',
    getStarted: 'Loslegen',
    heroBadge: 'Persönliche Gesundheit · Notfallbereit',
    heroH1: 'Deine Gesundheitsgeschichte,',
    heroH2: 'wohin du auch gehst.',
    heroSub: 'Arkoura ist ein persönliches Gesundheitstagebuch, das zur Notfallhilfe wird. Ein QR-Scan gibt jedem Helfer weltweit sofortigen Zugriff auf das Wichtigste — in seiner Sprache.',
    heroCta1: 'Warteliste beitreten →',
    heroCta2: 'Wie es funktioniert',
    heroChip1: 'Kostenloser Notfallzugriff',
    heroChip2: 'DSGVO & HIPAA bereit',
    heroChip3: 'Keine App nötig',
    problemLabel: 'WARUM ARKOURA EXISTIERT',
    problemH1: 'Im Notfall ist Stille',
    problemH2: 'das Gefährlichste.',
    s1title: 'Der Radfahrer, der nicht sprechen konnte',
    s1body: 'Er brach mitten auf der Strecke zusammen. Kein Ausweis. Die Sanitäter wussten nichts von seiner Penicillinallergie. Die Behandlung hätte sein Leben fast beendet.',
    s1tag: 'Passiert jeden Tag',
    s2title: 'Der Tourist und die Sprachbarriere',
    s2body: 'Anaphylaktische Reaktion in Tokio. Ihre Allergiegeschichte war auf Englisch. Die Ärzte waren brilliant — aber zwanzig Minuten gingen durch Übersetzung verloren.',
    s2tag: 'In jedem Land',
    s3title: 'Der Elternteil, der vergaß',
    s3body: 'Demenz. Er lief von zu Hause weg. Keine Medikamentenliste, kein Arztname. Die Notaufnahme begann von Null.',
    s3tag: 'Näher als du denkst',
    howLabel: 'WIE ES FUNKTIONIERT',
    howH1: 'Drei Schritte. Ein Scan.',
    howH2: 'Ein Leben geschützt.',
    step1label: 'SCHRITT EINS',
    step1title: 'Erstelle dein Gesundheitsprofil',
    step1body: 'Füge Erkrankungen, Allergien, Medikamente und Notfallkontakte hinzu. Lade ein Foto hoch. Wähle Symbole für deine wichtigsten Bedürfnisse. Dauert etwa 10 Minuten.',
    step2label: 'SCHRITT ZWEI',
    step2title: 'Dein QR-Code geht überall hin',
    step2body: 'Drucke ihn aus. Handyhülle. Fahrradhelm. Gepäckanhänger. Medizinarmband. Er läuft nie ab und erfordert keine App zum Scannen.',
    step3label: 'SCHRITT DREI',
    step3title: 'Jeder scannt → sofortige Hilfe',
    step3body: 'Kein Konto, kein Download, keine Hürden. Jede Smartphone-Kamera öffnet dein Profil sofort — in der Sprache des Helfers. Eine KI begleitet sie Schritt für Schritt.',
    zfH1: 'Null Tracking.',
    zfH2: 'Null Installationen.',
    zfH3: '100% deins.',
    zfSub: 'Wir haben die App gebaut, die wir uns gewünscht haben. Privat von Natur aus, kostenlos wo es darauf ankommt, und überall ehrlich.',
    fb1label: 'KEIN APP STORE NÖTIG',
    fb1body: 'Helfer scannen mit jeder Smartphone-Kamera. Nichts herunterladen. Wenn jede Sekunde zählt, ist null Reibung alles.',
    fb2label: 'AES-256 VERSCHLÜSSELUNG',
    fb2body: 'Deine Daten sind im Ruhezustand verschlüsselt. Wir können sie nicht lesen. Nicht wir, nicht irgendjemand.',
    fb3label: 'NOTFALLMODUS KOSTENLOS. FÜR IMMER.',
    fb3body: 'Die lebensrettende Funktion wird niemals kostenpflichtig sein. Notfallzugriff ist ein Menschenrecht. Keine Ausnahmen.',
    diffLabel: 'DER ARKOURA-VORTEIL',
    diffH1: 'Entwickelt für die',
    diffH2: 'Momente, die am meisten zählen.',
    d1title: 'Kostenlos für Notfälle. Für immer.',
    d1body: 'Der Notfallzugriff wird niemals hinter einer Paywall sitzen. Die lebensrettende Funktion ist kostenlos. Keine Ausnahmen. Kein Kleingedrucktes.',
    d2title: 'Spricht sofort 20 Sprachen',
    d2body: 'Dein Profil wird automatisch in der Sprache des Helfers angezeigt. Die KI passt ihre Terminologie für Ärzte, Ersthelfer und Passanten an.',
    d3title: 'Deine Daten. Deine Kontrolle.',
    d3body: 'Alles mit einem Klick exportieren. Alles dauerhaft löschen. Keine verkauften Daten, keine Werbung. Deine Gesundheitsgeschichte gehört dir.',
    d4title: 'Keine App nötig, um dir zu helfen',
    d4body: 'Jedes Smartphone. Jede Kamera-App. Kein Download, kein Konto, keine Hürden. Im schlimmsten Moment darf nichts bremsen.',
    trustLabel: 'VERTRAUENSWÜRDIGE INFRASTRUKTUR',
    trustQuote: "Wir speichern deine Gesundheitsdaten mit der gleichen Infrastruktur, die Googles eigene Produkte antreibt — verschlüsselt, redundant und auf jeder Ebene geschützt.",
    ctaH1: 'Sei bereit, bevor',
    ctaH2: 'du es brauchst.',
    ctaSub: 'Trag dich in die Warteliste ein. Sei unter den Ersten, die sich und ihre Liebsten mit Arkoura schützen.',
    ctaDisclaimer: 'Für immer kostenlos für Notfallzugriff. Keine Kreditkarte erforderlich.',
    ctaIcon1: '🌿 Kostenloser Notfallzugriff',
    ctaIcon2: '🔒 Verschlüsselt & privat',
    ctaIcon3: '🌍 20 Sprachen',
    formName: 'Dein Name',
    formEmail: 'deine@email.com',
    formSubmit: 'Warteliste beitreten →',
    formLoading: 'Wird gesendet…',
    formSuccessTitle: 'Du bist auf der Liste.',
    formSuccessSub: 'Wir melden uns, wenn Arkoura startet.',
    formErr: 'Etwas ist schiefgelaufen — bitte versuche es erneut.',
    footerDisclaimer: 'Arkoura ist kein Medizinprodukt und bietet keine medizinische Beratung. Es ist ein Informationsaustauschwerkzeug, das in Notsituationen helfen soll. Kontaktiere immer die Notfalldienste bei lebensbedrohlichen Situationen.',
    footerCopyright: '© 2026 Arkoura. Mit Sorgfalt in Costa Rica gebaut. 🇨🇷',
    privacy: 'Datenschutz',
    terms: 'AGB',
    cookies: 'Cookies',
  },
  PT: {
    signIn: 'Entrar',
    getStarted: 'Começar',
    heroBadge: 'Saúde Pessoal · Pronto para Emergências',
    heroH1: 'Sua história de saúde,',
    heroH2: 'onde quer que você vá.',
    heroSub: 'Arkoura é um diário de saúde pessoal que se torna um salva-vidas de emergência. Um scan QR dá acesso instantâneo a qualquer pessoa no mundo — no idioma dela.',
    heroCta1: 'Entrar na lista de espera →',
    heroCta2: 'Ver como funciona',
    heroChip1: 'Acesso de emergência gratuito',
    heroChip2: 'GDPR e HIPAA pronto',
    heroChip3: 'Sem app necessário',
    problemLabel: 'POR QUE ARKOURA EXISTE',
    problemH1: 'Em uma emergência, o silêncio',
    problemH2: 'é a coisa mais perigosa.',
    s1title: 'O ciclista que não conseguia falar',
    s1body: 'Ele desmaiou no meio do percurso. Sem identificação. Os socorristas não sabiam de sua alergia à penicilina. O tratamento dado quase terminou com sua vida.',
    s1tag: 'Acontece todo dia',
    s2title: 'O turista e a barreira do idioma',
    s2body: 'Reação anafilática em Tóquio. Seu histórico de alergias estava em inglês. Os médicos eram brilhantes — mas vinte minutos foram perdidos na tradução.',
    s2tag: 'Em todos os países',
    s3title: 'O pai que esqueceu',
    s3body: 'Demência. Ele saiu de casa sem rumo. Sem lista de medicamentos, sem nome do médico. A emergência começou do zero.',
    s3tag: 'Mais perto do que você pensa',
    howLabel: 'COMO FUNCIONA',
    howH1: 'Três passos. Um scan.',
    howH2: 'Uma vida protegida.',
    step1label: 'PASSO UM',
    step1title: 'Crie seu perfil de saúde',
    step1body: 'Adicione condições, alergias, medicamentos e contatos de emergência. Envie uma foto. Selecione ícones para suas necessidades mais críticas. Leva cerca de 10 minutos.',
    step2label: 'PASSO DOIS',
    step2title: 'Seu QR code vai a qualquer lugar',
    step2body: 'Imprima. Capa de celular. Capacete de bicicleta. Etiqueta de bagagem. Pulseira médica. Nunca expira e nunca requer um app para escanear.',
    step3label: 'PASSO TRÊS',
    step3title: 'Qualquer pessoa escaneia → ajuda imediata',
    step3body: 'Sem conta, sem download, sem atrito. Qualquer câmera de smartphone abre seu perfil imediatamente — no idioma do assistente. Uma IA os guia passo a passo.',
    zfH1: 'Zero rastreamento.',
    zfH2: 'Zero instalações.',
    zfH3: '100% seu.',
    zfSub: 'Criamos o app que gostaríamos que existisse. Privado por design, gratuito onde importa, e honesto em tudo.',
    fb1label: 'SEM APP STORE',
    fb1body: 'Assistentes escaneiam com qualquer câmera de smartphone. Nada para baixar. Quando cada segundo conta, zero atrito é tudo.',
    fb2label: 'CRIPTOGRAFIA AES-256',
    fb2body: 'Seus dados são criptografados em repouso. Não podemos lê-los. Nem nós, nem ninguém.',
    fb3label: 'MODO DE EMERGÊNCIA GRATUITO. PARA SEMPRE.',
    fb3body: 'O recurso que salva vidas nunca ficará atrás de um paywall. Acesso de emergência é um direito humano. Sem exceções.',
    diffLabel: 'A VANTAGEM ARKOURA',
    diffH1: 'Desenvolvido para os',
    diffH2: 'momentos que mais importam.',
    d1title: 'Gratuito para emergências. Para sempre.',
    d1body: 'O acesso de emergência nunca ficará atrás de um paywall. O recurso que salva vidas é gratuito. Sem exceções. Sem asteriscos.',
    d2title: 'Fala 20 idiomas instantaneamente',
    d2body: 'Seu perfil é renderizado automaticamente no idioma do assistente. O chat de IA adapta sua terminologia para médicos, socorristas e transeuntes.',
    d3title: 'Seus dados. Seu controle.',
    d3body: 'Exporte tudo com um clique. Delete tudo permanentemente. Sem dados vendidos, sem publicidade. Sua história de saúde pertence totalmente a você.',
    d4title: 'Sem app para te ajudar',
    d4body: 'Qualquer smartphone. Qualquer app de câmera. Sem download, sem conta, sem atrito. No pior momento de alguém, nada deve atrasá-los.',
    trustLabel: 'INFRAESTRUTURA CONFIÁVEL',
    trustQuote: "Armazenamos seus dados de saúde com a mesma infraestrutura que impulsiona os produtos do Google — criptografada, redundante e protegida em cada camada.",
    ctaH1: 'Esteja pronto antes',
    ctaH2: 'de precisar.',
    ctaSub: 'Entre na lista de espera. Seja um dos primeiros a se proteger e proteger seus entes queridos com Arkoura.',
    ctaDisclaimer: 'Gratuito para sempre para acesso de emergência. Sem cartão de crédito necessário.',
    ctaIcon1: '🌿 Acesso de emergência gratuito',
    ctaIcon2: '🔒 Criptografado e privado',
    ctaIcon3: '🌍 20 idiomas',
    formName: 'Seu nome',
    formEmail: 'seu@email.com',
    formSubmit: 'Entrar na lista →',
    formLoading: 'Enviando…',
    formSuccessTitle: 'Você está na lista.',
    formSuccessSub: 'Entraremos em contato quando Arkoura lançar.',
    formErr: 'Algo deu errado — por favor tente novamente.',
    footerDisclaimer: 'Arkoura não é um dispositivo médico e não fornece aconselhamento médico. É uma ferramenta de compartilhamento de informações projetada para auxiliar em situações de emergência. Sempre contate os serviços de emergência em uma situação de risco de vida.',
    footerCopyright: '© 2026 Arkoura. Feito com carinho na Costa Rica. 🇨🇷',
    privacy: 'Privacidade',
    terms: 'Termos',
    cookies: 'Cookies',
  },
}

function getText(lang: string, key: string): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.EN[key] ?? key
}

// ─── Shared section label ──────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#7A9E7E]">
      {children}
    </p>
  )
}

// ─── Decorative leaf ──────────────────────────────────────────────────────────

function LeafDecor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 400"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M150 390 C55 310 10 225 10 140 C10 48 82 8 150 8 C218 8 290 48 290 140 C290 225 245 310 150 390Z" />
      <path
        d="M150 8 Q138 110 144 210 Q148 295 150 390"
        stroke="white"
        strokeWidth="2"
        fill="none"
        opacity="0.25"
      />
      <path d="M150 100 Q110 130 90 170" stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" />
      <path d="M150 100 Q190 130 210 170" stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" />
      <path d="M148 200 Q118 220 105 255" stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" />
      <path d="M150 200 Q180 220 195 255" stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" />
    </svg>
  )
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function IconBicycle() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="10" cy="29" r="7" stroke="#7A9E7E" strokeWidth="1.5" />
      <circle cx="30" cy="29" r="7" stroke="#7A9E7E" strokeWidth="1.5" />
      <path d="M10 29L17 14L23 19H31L30 29" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 14H21" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M23 19L25 17H30" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconAirplane() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M35 20L5 10l6 8-3 3 11 4 3-3 8 6-5-8zM11 18l9 3" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 21L14 29l4-2 2 5 3-8" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconElderly() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="9" r="4" stroke="#7A9E7E" strokeWidth="1.5" />
      <path d="M14 20v10" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 20C14 16 17 14 20 14C23 14 26 16 26 20L24 28" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 22l4 10" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M26 28h5" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconNotebook() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="10" y="6" width="20" height="28" rx="2" stroke="#7A9E7E" strokeWidth="1.5" />
      <path d="M15 6v28" stroke="#7A9E7E" strokeWidth="1.5" />
      <path d="M19 14h7M19 20h7M19 26h4" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconQR() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="1.5" stroke="#7A9E7E" strokeWidth="1.5" />
      <rect x="22" y="6" width="12" height="12" rx="1.5" stroke="#7A9E7E" strokeWidth="1.5" />
      <rect x="6" y="22" width="12" height="12" rx="1.5" stroke="#7A9E7E" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" fill="#7A9E7E" />
      <rect x="25" y="9" width="6" height="6" fill="#7A9E7E" />
      <rect x="9" y="25" width="6" height="6" fill="#7A9E7E" />
      <path d="M22 22h4v4h-4zM30 22v4M26 26h8M30 30v4" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="14" stroke="#7A9E7E" strokeWidth="1.5" />
      <path d="M20 6C16 12 16 28 20 34M20 6C24 12 24 28 20 34" stroke="#7A9E7E" strokeWidth="1.5" />
      <path d="M6 20h28M7 14h26M7 26h26" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconSmallCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <circle cx="5" cy="5" r="5" fill="#7A9E7E" />
      <path d="M3 5l1.5 1.5L7 3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCheckLarge() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#E8F2E6" />
      <path d="M14 24l7 7 13-14" stroke="#4A7A50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── WaitlistForm ─────────────────────────────────────────────────────────────

function WaitlistForm({ lang }: { lang: string }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
      const json = await res.json()
      setStatus(json.ok ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  if (status === 'ok') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <IconCheckLarge />
        <p className="mt-1 font-[var(--font-manrope)] text-xl font-semibold text-[#1C2B1E]">
          {getText(lang, 'formSuccessTitle')}
        </p>
        <p className="text-sm text-[#6B7280]">
          {getText(lang, 'formSuccessSub')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 w-full">
      <input
        required
        type="text"
        placeholder={getText(lang, 'formName')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border-0 bg-white px-5 py-3.5 text-sm text-[#374151] placeholder-[#6B7280] shadow-[0_1px_3px_rgba(0,0,0,0.06)] outline-none transition focus:ring-2 focus:ring-[#A8C5A0]"
      />
      <input
        required
        type="email"
        placeholder={getText(lang, 'formEmail')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl border-0 bg-white px-5 py-3.5 text-sm text-[#374151] placeholder-[#6B7280] shadow-[0_1px_3px_rgba(0,0,0,0.06)] outline-none transition focus:ring-2 focus:ring-[#A8C5A0]"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-1 w-full rounded-xl bg-[#7A9E7E] py-4 font-[var(--font-manrope)] text-base font-semibold text-white transition-colors hover:bg-[#4A7A50] disabled:opacity-60"
      >
        {status === 'loading' ? getText(lang, 'formLoading') : getText(lang, 'formSubmit')}
      </button>
      {status === 'err' && (
        <p className="text-center text-sm text-red-500">
          {getText(lang, 'formErr')}
        </p>
      )}
    </form>
  )
}

// ─── Language Selector ────────────────────────────────────────────────────────

function LanguageSelector({ lang, setLang }: { lang: string; setLang: (l: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-label="Select language"
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-[#6B7280] transition hover:bg-[#F0F2EE] hover:text-[#374151]"
      >
        {/* Globe — always visible */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25" />
          <path d="M8 2C6.7 4.3 6.7 11.7 8 14M8 2C9.3 4.3 9.3 11.7 8 14" stroke="currentColor" strokeWidth="1.25" />
          <path d="M2 8h12M2.5 5.5h11M2.5 10.5h11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
        {/* Code + chevron — desktop only */}
        <span className="hidden sm:inline text-xs font-medium">{lang}</span>
        <svg
          className="hidden sm:inline transition-transform"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
        >
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-y-auto rounded-xl bg-white py-1"
            style={{
              maxHeight: '320px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setIsOpen(false) }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-[#F0F2EE] ${
                  lang === l.code ? 'font-semibold text-[#4A7A50]' : 'text-[#374151]'
                }`}
              >
                <span>{l.native}</span>
                <span className="text-xs text-[#9CA3AF]">{l.code}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ lang, setLang }: { lang: string; setLang: (l: string) => void }) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-[rgba(122,158,126,0.1)]"
      style={{ background: 'rgba(250,250,248,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="Arkoura" width={32} height={32} />
          <span className="font-[var(--font-manrope)] font-semibold text-[#1C2B1E]">
            Arkoura
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <LanguageSelector lang={lang} setLang={setLang} />
          <a href="#" className="text-sm text-[#6B7280] transition hover:text-[#374151]">
            {getText(lang, 'signIn')}
          </a>
          <a
            href="#waitlist"
            className="rounded-full bg-[#7A9E7E] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4A7A50]"
          >
            {getText(lang, 'getStarted')}
          </a>
        </nav>
      </div>
    </header>
  )
}

// ─── Emergency Card (hero right column) ───────────────────────────────────────

function EmergencyCard() {
  return (
    <div className="hero-card w-full max-w-[320px]">
      <div
        className="hero-card-float rounded-[2rem] bg-white p-6"
        style={{
          boxShadow:
            '0 2px 8px rgba(28,43,30,0.06), 0 16px 48px rgba(28,43,30,0.10)',
        }}
      >
        {/* Profile row */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative h-[72px] w-[72px] shrink-0">
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              position: 'relative',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/profile.png"
                alt="Jamie Donovan"
                width={52}
                height={52}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />
            </div>
            {/* Verified badge */}
            <span
              className="absolute bottom-0 right-0 z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#2D7DD2]"
              style={{ border: '2px solid white' }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path
                  d="M2 5l2 2 4-4"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {/* Name + location */}
          <div>
            <p className="font-[var(--font-manrope)] text-2xl font-bold leading-tight tracking-tight text-[#1C2B1E]">
              <span className="block">Jamie</span>
              <span className="block">Donovan</span>
            </p>
            <div className="mt-1 flex items-center gap-1">
              <svg
                width="10"
                height="10"
                viewBox="-6 -7 12 15"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M0,-5 C-3,-5 -5,-2 -5,0 C-5,3 0,7 0,7 C0,7 5,3 5,0 C5,-2 3,-5 0,-5 Z"
                  stroke="#7A9E7E"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="0" cy="0" r="1.5" fill="#7A9E7E" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#7A9E7E]">
                San Francisco, CA
              </span>
            </div>
          </div>
        </div>

        {/* Condition chips */}
        <div className="mt-5 flex flex-col gap-2">
          {[
            { label: 'CARDIAC HISTORY',       bg: '#F0F2EE', color: '#374151' },
            { label: 'TYPE 1 DIABETES',        bg: '#F0F2EE', color: '#374151' },
            { label: 'ANAPHYLACTIC (PEANUTS)', bg: '#FEE2E2', color: '#991B1B' },
            { label: 'INSULIN DEPENDENT',      bg: '#DBEAFE', color: '#1E40AF' },
          ].map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center self-start rounded-full px-4 py-2 text-xs font-semibold tracking-wide"
              style={{ background: chip.bg, color: chip.color }}
            >
              {chip.label}
            </span>
          ))}
        </div>

        {/* Emergency button */}
        <button
          className="mt-6 w-full cursor-pointer rounded-2xl bg-[#DC2626] px-6 py-4 transition-colors duration-200 hover:bg-red-700"
        >
          <span className="flex items-center justify-center gap-3">
            <svg width="22" height="22" viewBox="-10 -10 20 20" fill="none" aria-hidden="true">
              <line x1="0" y1="-9" x2="0" y2="9"   stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="-7.8" y1="-4.5" x2="7.8" y2="4.5"  stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="7.8" y1="-4.5" x2="-7.8" y2="4.5"  stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-bold uppercase tracking-widest text-white">
              This is an emergency
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

// ─── Section 1 — Hero ─────────────────────────────────────────────────────────

function HeroSection({ lang }: { lang: string }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F5F5F0]">
      <LeafDecor className="pointer-events-none absolute -right-16 -top-10 w-[300px] text-[#7A9E7E] opacity-[0.05]" />

      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* LEFT */}
          <div className="flex flex-col items-start">
            <span className="hero-badge inline-flex items-center gap-1.5 rounded-full bg-[#E8F2E6] px-4 py-1.5 text-xs font-medium text-[#4A7A50]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="#7A9E7E" aria-hidden="true">
                <path d="M6 11C3 9 1 7 1 4.5A2.5 2.5 0 0 1 6 3.5A2.5 2.5 0 0 1 11 4.5C11 7 9 9 6 11Z" />
              </svg>
              {getText(lang, 'heroBadge')}
            </span>

            <h1 className="hero-headline mt-4 font-[var(--font-manrope)] text-5xl font-extrabold leading-none tracking-tight text-[#1C2B1E] xl:text-6xl">
              {getText(lang, 'heroH1')}
              <br />
              {getText(lang, 'heroH2')}
            </h1>

            <p className="hero-sub mt-6 max-w-lg text-xl leading-relaxed text-[#6B7280]">
              {getText(lang, 'heroSub')}
            </p>

            <div className="hero-ctas mt-10 flex flex-wrap gap-3">
              <a
                href="#waitlist"
                className="rounded-xl bg-[#7A9E7E] px-8 py-4 font-[var(--font-manrope)] text-base font-semibold text-white transition-colors hover:bg-[#4A7A50]"
              >
                {getText(lang, 'heroCta1')}
              </a>
              <a
                href="#how-it-works"
                className="rounded-xl border border-[#A8C5A0] px-8 py-4 text-base font-medium text-[#4A7A50] transition-colors hover:bg-[#E8F2E6]"
              >
                {getText(lang, 'heroCta2')}
              </a>
            </div>

            <div className="hero-chips mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {(['heroChip1', 'heroChip2', 'heroChip3'] as const).map((key) => (
                <span key={key} className="inline-flex items-center gap-1.5 text-xs text-[#6B7280]">
                  <IconSmallCheck />
                  {getText(lang, key)}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex justify-center lg:justify-end">
            <EmergencyCard />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Section 2 — Problem ──────────────────────────────────────────────────────

function ProblemSection({ lang }: { lang: string }) {
  const scenarios = [
    { icon: <IconBicycle />, titleKey: 's1title', bodyKey: 's1body', tagKey: 's1tag' },
    { icon: <IconAirplane />, titleKey: 's2title', bodyKey: 's2body', tagKey: 's2tag' },
    { icon: <IconElderly />, titleKey: 's3title', bodyKey: 's3body', tagKey: 's3tag' },
  ]

  return (
    <section className="relative overflow-hidden bg-white py-28">
      <LeafDecor className="pointer-events-none absolute -bottom-20 -left-10 w-[250px] -rotate-12 text-[#7A9E7E] opacity-[0.04]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="mb-14 max-w-2xl"
        >
          <motion.div variants={fadeIn}>
            <SectionLabel>{getText(lang, 'problemLabel')}</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-[var(--font-manrope)] text-4xl font-bold leading-tight tracking-tight text-[#1C2B1E]"
          >
            {getText(lang, 'problemH1')}
            <br />
            {getText(lang, 'problemH2')}
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid gap-6 md:grid-cols-3"
        >
          {scenarios.map((s) => (
            <motion.div
              key={s.titleKey}
              variants={fadeUp}
              className="flex flex-col rounded-2xl bg-[#F0F2EE] p-8"
              style={{ boxShadow: 'none' }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                {s.icon}
              </div>
              <h3 className="mt-5 font-[var(--font-manrope)] text-lg font-semibold text-[#1C2B1E]">
                {getText(lang, s.titleKey)}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#6B7280]">
                {getText(lang, s.bodyKey)}
              </p>
              <span className="mt-4 text-xs font-medium text-[#4A7A50]">
                {getText(lang, s.tagKey)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section 3 — How It Works ─────────────────────────────────────────────────

function HowItWorksSection({ lang }: { lang: string }) {
  const steps = [
    { n: '01', icon: <IconNotebook />, labelKey: 'step1label', titleKey: 'step1title', bodyKey: 'step1body' },
    { n: '02', icon: <IconQR />,       labelKey: 'step2label', titleKey: 'step2title', bodyKey: 'step2body' },
    { n: '03', icon: <IconGlobe />,    labelKey: 'step3label', titleKey: 'step3title', bodyKey: 'step3body' },
  ]

  return (
    <section id="how-it-works" className="bg-[#F0F2EE] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeIn}>
            <SectionLabel>{getText(lang, 'howLabel')}</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-[var(--font-manrope)] text-4xl font-bold leading-tight tracking-tight text-[#1C2B1E]"
          >
            {getText(lang, 'howH1')}
            <br />
            {getText(lang, 'howH2')}
          </motion.h2>
        </motion.div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-[68px] hidden border-t-2 border-dashed border-[#D4E8D0] md:block"
          />

          <motion.div
            variants={stagger(0.15)}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="grid gap-6 md:grid-cols-3"
          >
            {steps.map((step) => (
              <motion.div
                key={step.n}
                variants={fadeUp}
                className="relative overflow-hidden rounded-2xl bg-white p-8"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)' }}
              >
                <span
                  aria-hidden="true"
                  className="absolute right-6 top-4 font-[var(--font-manrope)] text-6xl font-black text-[#E8F2E6]"
                >
                  {step.n}
                </span>
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F2E6]">
                  {step.icon}
                </div>
                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-[#7A9E7E]">
                  {getText(lang, step.labelKey)}
                </p>
                <h3 className="mt-2 font-[var(--font-manrope)] text-xl font-semibold text-[#1C2B1E]">
                  {getText(lang, step.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
                  {getText(lang, step.bodyKey)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Section 4 — Zero Friction (dark) ────────────────────────────────────────

function ZeroFrictionSection({ lang }: { lang: string }) {
  const factBlocks = [
    { labelKey: 'fb1label', bodyKey: 'fb1body' },
    { labelKey: 'fb2label', bodyKey: 'fb2body' },
    { labelKey: 'fb3label', bodyKey: 'fb3body' },
  ]

  return (
    <section className="relative overflow-hidden bg-[#1C2B1E] py-28">
      <LeafDecor className="pointer-events-none absolute -right-20 -top-10 w-[400px] text-white opacity-[0.03]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div variants={stagger()} initial="hidden" whileInView="show" viewport={vp}>
            <motion.h2
              variants={fadeUp}
              className="font-[var(--font-manrope)] text-5xl font-black leading-none tracking-tight text-white xl:text-6xl"
            >
              {getText(lang, 'zfH1')}
              <br />
              {getText(lang, 'zfH2')}
              <br />
              {getText(lang, 'zfH3')}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 max-w-sm text-lg text-[#A8C5A0]">
              {getText(lang, 'zfSub')}
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger(0.15)}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="flex flex-col gap-8"
          >
            {factBlocks.map((fb) => (
              <motion.div key={fb.labelKey} variants={fadeUp} className="flex gap-4">
                <div className="mt-1 h-8 w-1 shrink-0 rounded-full bg-[#7A9E7E]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7A9E7E]">
                    {getText(lang, fb.labelKey)}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">
                    {getText(lang, fb.bodyKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Section 5 — Differentiators ─────────────────────────────────────────────

function DifferentiatorsSection({ lang }: { lang: string }) {
  const diffCards = [
    { titleKey: 'd1title', bodyKey: 'd1body' },
    { titleKey: 'd2title', bodyKey: 'd2body' },
    { titleKey: 'd3title', bodyKey: 'd3body' },
    { titleKey: 'd4title', bodyKey: 'd4body' },
  ]

  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="mb-14 text-center"
        >
          <motion.div variants={fadeIn}>
            <SectionLabel>{getText(lang, 'diffLabel')}</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-[var(--font-manrope)] text-4xl font-bold leading-tight tracking-tight text-[#1C2B1E]"
          >
            {getText(lang, 'diffH1')}
            <br />
            {getText(lang, 'diffH2')}
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="grid gap-6 sm:grid-cols-2"
        >
          {diffCards.map((card) => (
            <motion.div
              key={card.titleKey}
              variants={scaleUp}
              className="rounded-2xl bg-[#FAFAF8] p-8"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)' }}
            >
              <h3 className="font-[var(--font-manrope)] text-lg font-semibold text-[#1C2B1E]">
                {getText(lang, card.titleKey)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
                {getText(lang, card.bodyKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section 6 — Trust Signals ────────────────────────────────────────────────

const TRUST_BADGES = ['Firebase + GCP', 'AES-256 Encryption', 'GDPR Compliant', 'SOC 2 Infrastructure']

function TrustSection({ lang }: { lang: string }) {
  return (
    <section className="bg-[#F0F2EE] py-28">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <motion.div variants={stagger()} initial="hidden" whileInView="show" viewport={vp}>
          <motion.div variants={fadeIn}>
            <SectionLabel>{getText(lang, 'trustLabel')}</SectionLabel>
          </motion.div>

          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            {TRUST_BADGES.map((label) => (
              <motion.div
                key={label}
                variants={scaleUp}
                className="rounded-xl bg-white px-6 py-4"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)' }}
              >
                <span className="text-sm font-medium text-[#374151]">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-12 max-w-xl text-base italic text-[#6B7280]"
          >
            &ldquo;{getText(lang, 'trustQuote')}&rdquo;
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Section 7 — CTA + Waitlist ───────────────────────────────────────────────

function CTASection({ lang }: { lang: string }) {
  return (
    <section id="waitlist" className="relative overflow-hidden bg-[#F5F5F0] py-28">
      <LeafDecor className="pointer-events-none absolute left-1/2 top-1/2 w-[350px] -translate-x-1/2 -translate-y-1/2 text-[#7A9E7E] opacity-[0.05]" />

      <div className="relative mx-auto max-w-lg px-6 text-center">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="Arkoura" width={40} height={40} />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-[var(--font-manrope)] text-5xl font-extrabold leading-tight tracking-tight text-[#1C2B1E]"
          >
            {getText(lang, 'ctaH1')}
            <br />
            {getText(lang, 'ctaH2')}
          </motion.h2>

          <motion.p variants={fadeUp} className="mt-4 text-lg text-[#6B7280]">
            {getText(lang, 'ctaSub')}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 w-full max-w-sm">
            <WaitlistForm lang={lang} />
            <p className="mt-3 text-xs text-[#6B7280]">
              {getText(lang, 'ctaDisclaimer')}
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-[#6B7280]"
          >
            <span>{getText(lang, 'ctaIcon1')}</span>
            <span>{getText(lang, 'ctaIcon2')}</span>
            <span>{getText(lang, 'ctaIcon3')}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ lang }: { lang: string }) {
  return (
    <footer className="bg-[#1C2B1E]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-6 py-12">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="Arkoura" width={32} height={32} />
            <span className="font-[var(--font-manrope)] font-semibold text-white">Arkoura</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-[#6B7280]">
            {(['privacy', 'terms', 'cookies'] as const).map((key) => (
              <a key={key} href="#" className="transition hover:text-white">
                {getText(lang, key)}
              </a>
            ))}
            <a href="mailto:hello@arkoura.com" className="transition hover:text-white">
              hello@arkoura.com
            </a>
          </nav>
        </div>

        <div className="border-t border-white/[0.08]" />

        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="max-w-2xl text-xs leading-relaxed text-[#6B7280]">
            {getText(lang, 'footerDisclaimer')}
          </p>
          <p className="text-xs text-[#4B5563]">
            {getText(lang, 'footerCopyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [currentLang, setCurrentLang] = useState('EN')

  return (
    <div className="bg-[#FAFAF8]" dir={currentLang === 'AR' ? 'rtl' : undefined}>
      <Nav lang={currentLang} setLang={setCurrentLang} />
      <HeroSection lang={currentLang} />
      <ProblemSection lang={currentLang} />
      <HowItWorksSection lang={currentLang} />
      <ZeroFrictionSection lang={currentLang} />
      <DifferentiatorsSection lang={currentLang} />
      <TrustSection lang={currentLang} />
      <CTASection lang={currentLang} />
      <Footer lang={currentLang} />
    </div>
  )
}
