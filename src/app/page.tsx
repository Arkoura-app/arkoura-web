'use client'

export const runtime = 'edge'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import dynamic from 'next/dynamic'

const AuthModal = dynamic(
  () => import('@/components/auth/AuthModal').then(mod => mod.AuthModal),
  { ssr: false }
)

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
  { code: 'en', name: 'English',   flag: '🇺🇸' },
  { code: 'es', name: 'Español',   flag: '🇪🇸' },
  { code: 'fr', name: 'Français',  flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch',   flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: '中文',       flag: '🇨🇳' },
  { code: 'ja', name: '日本語',     flag: '🇯🇵' },
  { code: 'it', name: 'Italiano',  flag: '🇮🇹' },
  { code: 'ru', name: 'Русский',   flag: '🇷🇺' },
  { code: 'sv', name: 'Svenska',   flag: '🇸🇪' },
]

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    signIn: 'Sign in',
    getStarted: 'Get Started',
    nav_cta: 'Get Started',
    heroBadge: 'Personal Health · Emergency Ready',
    heroH1: 'Your health story,',
    heroH2: 'everywhere you go.',
    heroSub: "Arkoura is a personal health journal that becomes an emergency lifeline. One QR scan gives any helper anywhere in the world instant access to what they need — in their language.",
    heroCta1: 'Get started free →',
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
    s4title: 'Abroad and unable to communicate',
    s4body: 'Severe chest pain in a foreign market. No shared language with locals. Twelve minutes passed before anyone understood what he needed.',
    s4tag: '1 in 4 emergencies involve a language barrier',
    s5title: "The child who couldn't say his name",
    s5body: "Non-verbal and lost at a crowded festival. No name, no parents' contacts, no sensory needs communicated. Responders had nothing to go on.",
    s5tag: '1 in 36 children is autistic globally',
    s6title: 'He fainted. He recovered. He opened a session.',
    s6body: 'Regained consciousness surrounded by paramedics. He opened a timed session, handed them a code — and they accessed his full journal and history in seconds.',
    s6tag: 'When words come back — more becomes possible',
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
    d2title: 'Speaks 10 languages instantly',
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
    ctaIcon3: '🌍 10 languages',
    trust1: 'Free emergency access',
    trust2: 'Encrypted & private',
    trust3: '10 languages',
    formName: 'Your name',
    formEmail: 'your@email.com',
    formSubmit: 'Join the waitlist →',
    formLoading: 'Sending…',
    formSuccessTitle: "You're on the list.",
    formSuccessSub: "We'll reach out when Arkoura launches.",
    formErr: 'Something went wrong — please try again.',
    footerDisclaimer: 'Arkoura is not a medical device and is not a medical record system. It does not provide medical diagnosis, clinical assessments, or medical advice of any kind. Arkoura is a personal health journal, document management tool, and information-sharing platform designed solely to assist in emergency situations by making user-provided information accessible to helpers. Always contact emergency services immediately in any life-threatening situation.',
    footer_copy: '© 2026 Arkoura. Engineered for humanity.',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    privacy_label: 'YOUR DATA IS SACRED',
    privacy_headline: 'Built on a foundation of uncompromising privacy.',
    privacy_sub: 'Health data is the most personal data that exists. We designed every layer of Arkoura with that in mind — not as an afterthought, but as the foundation.',
    privacy1_title: 'AES-256 Encryption at Rest',
    privacy1_body: 'Every piece of health data you store is encrypted using AES-256 — the same standard used by banks and governments. Your data is unreadable without your keys.',
    privacy2_title: 'TLS 1.3 in Transit',
    privacy2_body: 'All data moving between your device and our servers is encrypted with TLS 1.3. No third party can intercept your information — ever.',
    privacy3_title: 'Contributing to Medical Research',
    privacy3_body: 'With your explicit opt-in, anonymized health patterns may help advance medical research. You stay in control — it defaults to off and can be revoked at any time.',
    privacy4_title: 'You Own Your Data',
    privacy4_body: 'Export everything in one click. Delete everything permanently — including backups — within 30 days of your request. Your data belongs to you, not to us.',
    privacy5_title: 'GDPR & HIPAA Ready',
    privacy5_body: 'Arkoura is designed to meet the requirements of both GDPR for European users and HIPAA-aligned infrastructure for health data. Your rights are built in, not bolted on.',
    privacy6_title: 'Emergency Access is Minimal',
    privacy6_body: 'The QR profile shows only what you choose — name, conditions, allergies, medications, contacts. Full journal data requires your active consent and a timed session you control.',
    privacy_hosting_title: 'Hosted on Google Cloud Platform',
    privacy_hosting_body: 'Firebase + GCP infrastructure with 99.9% uptime SLA, SOC 2 Type II certified data centers, and automatic redundancy across multiple regions.',
    stats_label: 'THE SCALE OF THE PROBLEM',
    stats_headline: 'Every day, millions cannot speak for themselves.',
    stats_sub: 'When seconds matter most, silence is lethal. These are the numbers behind why Arkoura exists.',
    stats1_label: 'people live with epilepsy — and may lose consciousness without warning',
    stats1_source: 'WHO Global Epilepsy Report, 2024',
    stats2_label: 'people live with dementia, often unable to communicate their identity or medical needs',
    stats2_source: 'WHO Dementia Fact Sheet, 2023',
    stats3_label: 'children are diagnosed with autism spectrum disorder, many of whom are non-verbal',
    stats3_source: 'CDC ADDM Network, 2023',
    stats4_label: 'international tourist arrivals per year — each a potential patient in a foreign-language medical system',
    stats4_source: 'UN Tourism World Barometer, 2024',
    stats5_label: 'of adverse medical events involving tourists involve communication failures with local healthcare providers',
    stats5_source: 'Journal of Travel Medicine, 2022',
    stats6_label: 'emergency department visits per year in the US — many by patients who cannot communicate their medical history',
    stats6_source: 'CDC NHCS, 2022',
    stats_closing_headline: 'One QR scan changes everything.',
    stats_closing_body: 'Arkoura puts critical health information where it needs to be — accessible to anyone, anywhere, instantly. No app. No language barrier. No barrier at all.',
    stats_citation: 'Data referenced from WHO, CDC, UN Tourism, and peer-reviewed medical literature. Full citations available at arkoura.com/research.',
    appt_label: 'ADVANCED SUPPORT — APPOINTMENT MODE',
    appt_headline: "When the emergency is over — the conversation doesn't have to be.",
    appt_body: "Sometimes the person who needs help can speak — but needs to share more than a QR profile allows. Appointment Mode lets you open a timed, secure session and hand a helper a one-time code. They get full access to your health journal, conditions, and history — guided by AI, in their language.",
    appt_f1_title: 'Timed and controlled',
    appt_f1_body: 'Sessions expire automatically. You decide how long access lasts.',
    appt_f2_title: 'One-time code',
    appt_f2_body: 'Share a single OTP. No account needed for the helper.',
    appt_f3_title: 'AI-guided conversation',
    appt_f3_body: 'The helper interacts with an AI that reads your journal and answers their questions — in their language, with your context.',
    appt_badge: 'Available for premium members',
    appt_session_active: 'Session Active',
    appt_session_title: 'Appointment Session',
    appt_code_label: 'YOUR ACCESS CODE',
    appt_code_hint: 'Share this code with your helper',
    appt_chat_ai: 'Based on the journal, the last cardiac episode was 3 weeks ago. Current medications include...',
    appt_chat_helper: 'Does he have any known drug interactions?',
    appt_end_session: 'End session',
  },
  es: {
    signIn: 'Iniciar sesión',
    getStarted: 'Comenzar',
    nav_cta: 'Comenzar',
    heroBadge: 'Salud Personal · Listo para Emergencias',
    heroH1: 'Tu historia de salud,',
    heroH2: 'dondequiera que vayas.',
    heroSub: 'Arkoura es un diario de salud personal que se convierte en un salvavidas. Un escaneo QR da acceso instantáneo a cualquier asistente en el mundo — en su idioma.',
    heroCta1: 'Comenzar gratis →',
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
    s4title: 'En el extranjero sin poder comunicarse',
    s4body: 'Dolor intenso en el pecho en un mercado extranjero. Sin idioma en común con los locales. Pasaron doce minutos antes de que alguien entendiera lo que necesitaba.',
    s4tag: '1 de cada 4 emergencias implica una barrera idiomática',
    s5title: 'El niño que no podía decir su nombre',
    s5body: 'No verbal y perdido en un festival concurrido. Sin nombre, sin contactos de los padres, sin necesidades sensoriales comunicadas. Los servicios de emergencia no tenían nada con qué trabajar.',
    s5tag: '1 de cada 36 niños es autista en todo el mundo',
    s6title: 'Se desmayó. Se recuperó. Abrió una sesión.',
    s6body: 'Recuperó la consciencia rodeado de paramédicos. Abrió una sesión temporal, les dio un código — y en segundos accedieron a su historial y diario completos.',
    s6tag: 'Cuando vuelven las palabras — más se vuelve posible',
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
    d2title: 'Habla 10 idiomas al instante',
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
    ctaIcon3: '🌍 10 idiomas',
    trust1: 'Acceso de emergencia gratuito',
    trust2: 'Cifrado y privado',
    trust3: '10 idiomas',
    formName: 'Tu nombre',
    formEmail: 'tu@email.com',
    formSubmit: 'Unirse a la lista →',
    formLoading: 'Enviando…',
    formSuccessTitle: 'Estás en la lista.',
    formSuccessSub: 'Te contactaremos cuando Arkoura lance.',
    formErr: 'Algo salió mal — intenta de nuevo.',
    footerDisclaimer: 'Arkoura no es un dispositivo médico ni un sistema de historial clínico. No proporciona diagnósticos médicos, evaluaciones clínicas ni asesoramiento médico de ningún tipo. Arkoura es un diario de salud personal, una herramienta de gestión de documentos y una plataforma de intercambio de información diseñada únicamente para asistir en situaciones de emergencia. Contacte siempre los servicios de emergencia ante cualquier situación que ponga en riesgo la vida.',
    footer_copy: '© 2026 Arkoura. Diseñado para la humanidad.',
    privacy: 'Privacidad',
    terms: 'Términos',
    cookies: 'Cookies',
    privacy_label: 'TUS DATOS SON SAGRADOS',
    privacy_headline: 'Construido sobre una base de privacidad inquebrantable.',
    privacy_sub: 'Los datos de salud son los más personales que existen. Diseñamos cada capa de Arkoura con eso en mente — no como algo adicional, sino como la base.',
    privacy1_title: 'Cifrado AES-256 en reposo',
    privacy1_body: 'Cada dato de salud que almacenas está cifrado con AES-256 — el mismo estándar que usan bancos y gobiernos. Tus datos son ilegibles sin tus claves.',
    privacy2_title: 'TLS 1.3 en tránsito',
    privacy2_body: 'Todos los datos entre tu dispositivo y nuestros servidores están cifrados con TLS 1.3. Ningún tercero puede interceptar tu información — nunca.',
    privacy3_title: 'Contribuyendo a la investigación médica',
    privacy3_body: 'Con tu consentimiento explícito, patrones de salud anonimizados pueden ayudar a avanzar en la investigación médica. Tú controlas esto — está desactivado por defecto y se puede revocar en cualquier momento.',
    privacy4_title: 'Tus datos te pertenecen',
    privacy4_body: 'Exporta todo con un clic. Elimina todo permanentemente — incluyendo copias de seguridad — en 30 días de tu solicitud. Tus datos son tuyos, no nuestros.',
    privacy5_title: 'Listo para GDPR y HIPAA',
    privacy5_body: 'Arkoura está diseñado para cumplir con los requisitos del GDPR para usuarios europeos y la infraestructura alineada con HIPAA. Tus derechos están integrados, no añadidos después.',
    privacy6_title: 'El acceso de emergencia es mínimo',
    privacy6_body: 'El perfil QR muestra solo lo que eliges — nombre, condiciones, alergias, medicamentos, contactos. Los datos completos requieren tu consentimiento activo en una sesión que controlas.',
    privacy_hosting_title: 'Alojado en Google Cloud Platform',
    privacy_hosting_body: 'Infraestructura Firebase + GCP con SLA de 99.9% de disponibilidad, centros de datos certificados SOC 2 Tipo II y redundancia automática en múltiples regiones.',
    stats_label: 'LA MAGNITUD DEL PROBLEMA',
    stats_headline: 'Cada día, millones no pueden hablar por sí mismos.',
    stats_sub: 'Cuando los segundos son más importantes, el silencio es letal. Estos son los números detrás de por qué existe Arkoura.',
    stats1_label: 'personas viven con epilepsia — y pueden perder el conocimiento sin previo aviso',
    stats1_source: 'WHO Global Epilepsy Report, 2024',
    stats2_label: 'personas viven con demencia, a menudo sin poder comunicar su identidad o necesidades médicas',
    stats2_source: 'WHO Dementia Fact Sheet, 2023',
    stats3_label: 'niños son diagnosticados con trastorno del espectro autista, muchos de los cuales son no verbales',
    stats3_source: 'CDC ADDM Network, 2023',
    stats4_label: 'llegadas de turistas internacionales por año — cada uno un potencial paciente en un sistema médico de idioma extranjero',
    stats4_source: 'UN Tourism World Barometer, 2024',
    stats5_label: 'de los eventos médicos adversos con turistas involucran fallos de comunicación con los proveedores de salud locales',
    stats5_source: 'Journal of Travel Medicine, 2022',
    stats6_label: 'visitas a urgencias por año en EE.UU. — muchas de pacientes que no pueden comunicar su historial médico',
    stats6_source: 'CDC NHCS, 2022',
    stats_closing_headline: 'Un escaneo QR lo cambia todo.',
    stats_closing_body: 'Arkoura pone la información de salud crítica donde necesita estar — accesible para cualquiera, en cualquier lugar, al instante. Sin app. Sin barrera de idioma. Sin ninguna barrera.',
    stats_citation: 'Datos referenciados de OMS, CDC, ONU Turismo y literatura médica revisada por pares. Citas completas disponibles en arkoura.com/research.',
    appt_label: 'SOPORTE AVANZADO — MODO CITA',
    appt_headline: 'Cuando la emergencia termina — la conversación no tiene por qué.',
    appt_body: 'A veces quien necesita ayuda puede hablar — pero necesita compartir más de lo que permite un perfil QR. El Modo Cita te permite abrir una sesión segura y temporal y dar a un ayudante un código único. Obtienen acceso completo a tu diario de salud, condiciones e historial — guiados por IA, en su idioma.',
    appt_f1_title: 'Temporizado y controlado',
    appt_f1_body: 'Las sesiones expiran automáticamente. Tú decides cuánto tiempo dura el acceso.',
    appt_f2_title: 'Código de un solo uso',
    appt_f2_body: 'Comparte un único OTP. El ayudante no necesita cuenta.',
    appt_f3_title: 'Conversación guiada por IA',
    appt_f3_body: 'El ayudante interactúa con una IA que lee tu diario y responde sus preguntas — en su idioma, con tu contexto.',
    appt_badge: 'Disponible para miembros premium',
    appt_session_active: 'Sesión Activa',
    appt_session_title: 'Sesión de Cita',
    appt_code_label: 'TU CÓDIGO DE ACCESO',
    appt_code_hint: 'Comparte este código con tu ayudante',
    appt_chat_ai: 'Según el diario, el último episodio cardíaco fue hace 3 semanas. Los medicamentos actuales incluyen...',
    appt_chat_helper: '¿Tiene alguna interacción medicamentosa conocida?',
    appt_end_session: 'Finalizar sesión',
  },
  fr: {
    signIn: 'Se connecter',
    getStarted: 'Commencer',
    nav_cta: 'Commencer',
    heroBadge: 'Santé Personnelle · Prêt pour les Urgences',
    heroH1: 'Votre histoire de santé,',
    heroH2: 'partout où vous allez.',
    heroSub: "Arkoura est un journal de santé personnel qui devient un filet de sécurité d'urgence. Un scan QR donne un accès instantané à tout assistant dans le monde — dans sa langue.",
    heroCta1: "Commencer gratuitement →",
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
    s4title: 'À l\'étranger sans pouvoir communiquer',
    s4body: 'Douleur thoracique sévère dans un marché étranger. Aucune langue commune avec les habitants. Douze minutes s\'écoulèrent avant que quelqu\'un comprenne ce dont il avait besoin.',
    s4tag: '1 urgence sur 4 implique une barrière linguistique',
    s5title: 'L\'enfant qui ne pouvait pas dire son nom',
    s5body: 'Non verbal et perdu dans un festival bondé. Pas de nom, pas de contacts des parents, pas de besoins sensoriels communiqués. Les secours n\'avaient rien sur quoi s\'appuyer.',
    s5tag: '1 enfant sur 36 est autiste dans le monde',
    s6title: 'Il s\'est évanoui. Il a récupéré. Il a ouvert une session.',
    s6body: 'Reprit conscience entouré de paramédicaux. Il ouvrit une session temporisée, leur donna un code — et en quelques secondes ils accédèrent à son journal et son historique complets.',
    s6tag: 'Quand les mots reviennent — plus devient possible',
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
    d2title: 'Parle 10 langues instantanément',
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
    ctaIcon3: '🌍 10 langues',
    trust1: "Accès d'urgence gratuit",
    trust2: 'Chiffré et privé',
    trust3: '10 langues',
    formName: 'Votre nom',
    formEmail: 'votre@email.com',
    formSubmit: "Rejoindre la liste →",
    formLoading: 'Envoi…',
    formSuccessTitle: 'Vous êtes sur la liste.',
    formSuccessSub: "Nous vous contacterons au lancement d'Arkoura.",
    formErr: 'Une erreur est survenue — veuillez réessayer.',
    footerDisclaimer: "Arkoura n'est pas un dispositif médical et n'est pas un système de dossier médical. Il ne fournit aucun diagnostic médical, aucune évaluation clinique ni aucun conseil médical. Arkoura est un journal de santé personnel, un outil de gestion de documents et une plateforme de partage d'informations conçue uniquement pour aider dans les situations d'urgence. Contactez toujours les services d'urgence immédiatement dans toute situation mettant la vie en danger.",
    footer_copy: "© 2026 Arkoura. Conçu pour l'humanité.",
    privacy: 'Confidentialité',
    terms: 'Conditions',
    cookies: 'Cookies',
    privacy_label: 'VOS DONNÉES SONT SACRÉES',
    privacy_headline: 'Construit sur une base de confidentialité absolue.',
    privacy_sub: "Les données de santé sont les données les plus personnelles qui existent. Nous avons conçu chaque couche d'Arkoura avec cela à l'esprit — pas comme une réflexion après coup, mais comme la fondation.",
    privacy1_title: 'Chiffrement AES-256 au repos',
    privacy1_body: "Chaque donnée de santé que vous stockez est chiffrée avec AES-256 — le même standard utilisé par les banques et les gouvernements. Vos données sont illisibles sans vos clés.",
    privacy2_title: 'TLS 1.3 en transit',
    privacy2_body: "Toutes les données entre votre appareil et nos serveurs sont chiffrées avec TLS 1.3. Aucun tiers ne peut intercepter vos informations — jamais.",
    privacy3_title: 'Contribution à la recherche médicale',
    privacy3_body: "Avec votre opt-in explicite, des patterns de santé anonymisés peuvent aider à faire avancer la recherche médicale. Vous restez en contrôle — désactivé par défaut et révocable à tout moment.",
    privacy4_title: 'Vous possédez vos données',
    privacy4_body: "Exportez tout en un clic. Supprimez tout définitivement — sauvegardes incluses — dans les 30 jours suivant votre demande. Vos données vous appartiennent, pas à nous.",
    privacy5_title: 'Conforme RGPD et HIPAA',
    privacy5_body: "Arkoura est conçu pour répondre aux exigences du RGPD pour les utilisateurs européens et d'une infrastructure alignée sur HIPAA. Vos droits sont intégrés, pas ajoutés après.",
    privacy6_title: "L'accès d'urgence est minimal",
    privacy6_body: "Le profil QR affiche uniquement ce que vous choisissez — nom, conditions, allergies, médicaments, contacts. Les données complètes nécessitent votre consentement actif lors d'une session que vous contrôlez.",
    privacy_hosting_title: 'Hébergé sur Google Cloud Platform',
    privacy_hosting_body: "Infrastructure Firebase + GCP avec SLA de disponibilité à 99.9%, centres de données certifiés SOC 2 Type II et redondance automatique dans plusieurs régions.",
    stats_label: "L'AMPLEUR DU PROBLÈME",
    stats_headline: 'Chaque jour, des millions ne peuvent pas parler pour eux-mêmes.',
    stats_sub: "Quand chaque seconde compte, le silence est mortel. Ce sont les chiffres qui expliquent pourquoi Arkoura existe.",
    stats1_label: "personnes vivent avec l'épilepsie — et peuvent perdre conscience sans avertissement",
    stats1_source: 'WHO Global Epilepsy Report, 2024',
    stats2_label: 'personnes vivent avec la démence, souvent incapables de communiquer leur identité ou leurs besoins médicaux',
    stats2_source: 'WHO Dementia Fact Sheet, 2023',
    stats3_label: 'enfants sont diagnostiqués avec un trouble du spectre autistique, dont beaucoup sont non verbaux',
    stats3_source: 'CDC ADDM Network, 2023',
    stats4_label: "arrivées de touristes internationaux par an — chacun un patient potentiel dans un système médical en langue étrangère",
    stats4_source: 'UN Tourism World Barometer, 2024',
    stats5_label: "des événements médicaux indésirables impliquant des touristes impliquent des défaillances de communication avec les prestataires de soins locaux",
    stats5_source: 'Journal of Travel Medicine, 2022',
    stats6_label: "visites aux urgences par an aux États-Unis — beaucoup de patients qui ne peuvent pas communiquer leurs antécédents médicaux",
    stats6_source: 'CDC NHCS, 2022',
    stats_closing_headline: 'Un scan QR change tout.',
    stats_closing_body: "Arkoura place les informations de santé critiques là où elles doivent être — accessibles à tous, partout, instantanément. Aucune app. Aucune barrière linguistique. Aucune barrière du tout.",
    stats_citation: "Données référencées de l'OMS, CDC, ONU Tourisme et littérature médicale à comité de lecture. Citations complètes disponibles sur arkoura.com/research.",
    appt_label: 'SUPPORT AVANCÉ — MODE RENDEZ-VOUS',
    appt_headline: "Quand l'urgence est passée — la conversation peut continuer.",
    appt_body: "Parfois, la personne qui a besoin d'aide peut parler — mais doit partager plus que ce qu'un profil QR permet. Le Mode Rendez-vous vous permet d'ouvrir une session sécurisée et temporisée et de donner à un aidant un code unique. Ils obtiennent un accès complet à votre journal de santé — guidé par IA, dans leur langue.",
    appt_f1_title: 'Temporisé et contrôlé',
    appt_f1_body: "Les sessions expirent automatiquement. Vous décidez de la durée d'accès.",
    appt_f2_title: 'Code à usage unique',
    appt_f2_body: "Partagez un seul OTP. Aucun compte requis pour l'aidant.",
    appt_f3_title: 'Conversation guidée par IA',
    appt_f3_body: "L'aidant interagit avec une IA qui lit votre journal et répond à ses questions — dans sa langue, avec votre contexte.",
    appt_badge: 'Disponible pour les membres premium',
    appt_session_active: 'Session Active',
    appt_session_title: 'Session de Rendez-vous',
    appt_code_label: "VOTRE CODE D'ACCÈS",
    appt_code_hint: 'Partagez ce code avec votre aidant',
    appt_chat_ai: "D'après le journal, le dernier épisode cardiaque remonte à 3 semaines. Les médicaments actuels comprennent...",
    appt_chat_helper: 'A-t-il des interactions médicamenteuses connues?',
    appt_end_session: 'Terminer la session',
  },
  de: {
    signIn: 'Anmelden',
    getStarted: 'Loslegen',
    nav_cta: 'Loslegen',
    heroBadge: 'Persönliche Gesundheit · Notfallbereit',
    heroH1: 'Deine Gesundheitsgeschichte,',
    heroH2: 'wohin du auch gehst.',
    heroSub: 'Arkoura ist ein persönliches Gesundheitstagebuch, das zur Notfallhilfe wird. Ein QR-Scan gibt jedem Helfer weltweit sofortigen Zugriff auf das Wichtigste — in seiner Sprache.',
    heroCta1: 'Kostenlos starten →',
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
    s4title: 'Im Ausland und nicht in der Lage zu kommunizieren',
    s4body: 'Starke Brustschmerzen auf einem ausländischen Markt. Keine gemeinsame Sprache mit Einheimischen. Zwölf Minuten vergingen, bevor jemand verstand, was er brauchte.',
    s4tag: '1 von 4 Notfällen beinhaltet eine Sprachbarriere',
    s5title: 'Das Kind, das seinen Namen nicht sagen konnte',
    s5body: 'Nicht-verbal und verloren auf einem überfüllten Festival. Kein Name, keine Elternkontakte, keine sensorischen Bedürfnisse kommuniziert. Die Einsatzkräfte hatten nichts, womit sie arbeiten konnten.',
    s5tag: '1 von 36 Kindern ist weltweit autistisch',
    s6title: 'Er wurde ohnmächtig. Er erholte sich. Er öffnete eine Sitzung.',
    s6body: 'Erlangte das Bewusstsein wieder, umgeben von Sanitätern. Er öffnete eine zeitgesteuerte Sitzung, gab ihnen einen Code — und sie hatten in Sekunden Zugang zu seinem vollständigen Tagebuch und seiner Geschichte.',
    s6tag: 'Wenn die Worte zurückkommen — mehr wird möglich',
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
    d2title: 'Spricht sofort 10 Sprachen',
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
    ctaIcon3: '🌍 10 Sprachen',
    trust1: 'Kostenloser Notfallzugang',
    trust2: 'Verschlüsselt & privat',
    trust3: '10 Sprachen',
    formName: 'Dein Name',
    formEmail: 'deine@email.com',
    formSubmit: 'Warteliste beitreten →',
    formLoading: 'Wird gesendet…',
    formSuccessTitle: 'Du bist auf der Liste.',
    formSuccessSub: 'Wir melden uns, wenn Arkoura startet.',
    formErr: 'Etwas ist schiefgelaufen — bitte versuche es erneut.',
    footerDisclaimer: 'Arkoura ist kein Medizinprodukt und kein medizinisches Aktensystem. Es stellt keine medizinischen Diagnosen, klinischen Bewertungen oder medizinischen Ratschläge jeglicher Art bereit. Arkoura ist ein persönliches Gesundheitstagebuch, ein Dokumentenverwaltungstool und eine Informationsplattform, die ausschließlich dazu dient, in Notfallsituationen zu helfen. Rufen Sie bei lebensbedrohlichen Situationen immer sofort den Notfalldienst.',
    footer_copy: '© 2026 Arkoura. Entwickelt für die Menschheit.',
    privacy: 'Datenschutz',
    terms: 'AGB',
    cookies: 'Cookies',
    privacy_label: 'DEINE DATEN SIND HEILIG',
    privacy_headline: 'Auf einer Grundlage kompromissloser Privatsphäre gebaut.',
    privacy_sub: 'Gesundheitsdaten sind die persönlichsten Daten, die es gibt. Wir haben jede Schicht von Arkoura mit diesem Gedanken entworfen — nicht als Nachgedanke, sondern als Fundament.',
    privacy1_title: 'AES-256-Verschlüsselung im Ruhezustand',
    privacy1_body: 'Jedes Stück Gesundheitsdaten, das du speicherst, wird mit AES-256 verschlüsselt — demselben Standard, den Banken und Regierungen nutzen. Ohne deine Schlüssel sind deine Daten unlesbar.',
    privacy2_title: 'TLS 1.3 bei der Übertragung',
    privacy2_body: 'Alle Daten zwischen deinem Gerät und unseren Servern sind mit TLS 1.3 verschlüsselt. Kein Dritter kann deine Informationen abfangen — niemals.',
    privacy3_title: 'Beitrag zur medizinischen Forschung',
    privacy3_body: 'Mit deiner ausdrücklichen Zustimmung können anonymisierte Gesundheitsmuster zur medizinischen Forschung beitragen. Du behältst die Kontrolle — standardmäßig deaktiviert und jederzeit widerrufbar.',
    privacy4_title: 'Du besitzt deine Daten',
    privacy4_body: 'Alles mit einem Klick exportieren. Alles dauerhaft löschen — einschließlich Backups — innerhalb von 30 Tagen nach deiner Anfrage. Deine Daten gehören dir, nicht uns.',
    privacy5_title: 'DSGVO & HIPAA bereit',
    privacy5_body: 'Arkoura ist so gestaltet, dass es die Anforderungen der DSGVO für europäische Nutzer und HIPAA-konforme Infrastruktur für Gesundheitsdaten erfüllt. Deine Rechte sind eingebaut, nicht nachgerüstet.',
    privacy6_title: 'Notfallzugriff ist minimal',
    privacy6_body: 'Das QR-Profil zeigt nur, was du wählst — Name, Erkrankungen, Allergien, Medikamente, Kontakte. Vollständige Tagebuchdaten erfordern deine aktive Zustimmung in einer von dir kontrollierten Sitzung.',
    privacy_hosting_title: 'Gehostet auf Google Cloud Platform',
    privacy_hosting_body: 'Firebase + GCP-Infrastruktur mit 99,9% Uptime-SLA, SOC 2 Typ II zertifizierten Rechenzentren und automatischer Redundanz über mehrere Regionen.',
    stats_label: 'DAS AUSMASS DES PROBLEMS',
    stats_headline: 'Jeden Tag können Millionen nicht für sich selbst sprechen.',
    stats_sub: 'Wenn Sekunden am wichtigsten sind, ist Stille tödlich. Das sind die Zahlen hinter der Existenz von Arkoura.',
    stats1_label: 'Menschen leben mit Epilepsie — und können ohne Vorwarnung das Bewusstsein verlieren',
    stats1_source: 'WHO Global Epilepsy Report, 2024',
    stats2_label: 'Menschen leben mit Demenz, oft unfähig, ihre Identität oder medizinischen Bedürfnisse mitzuteilen',
    stats2_source: 'WHO Dementia Fact Sheet, 2023',
    stats3_label: 'Kinder werden mit Autismus-Spektrum-Störung diagnostiziert, von denen viele nicht-verbal sind',
    stats3_source: 'CDC ADDM Network, 2023',
    stats4_label: 'internationale Touristenankünfte pro Jahr — jeder ein potenzieller Patient in einem fremdsprachigen Medizinsystem',
    stats4_source: 'UN Tourism World Barometer, 2024',
    stats5_label: 'der unerwünschten medizinischen Ereignisse bei Touristen beinhalten Kommunikationsfehler mit lokalen Gesundheitsdienstleistern',
    stats5_source: 'Journal of Travel Medicine, 2022',
    stats6_label: 'Notaufnahmebesuche pro Jahr in den USA — viele von Patienten, die ihre Krankengeschichte nicht mitteilen können',
    stats6_source: 'CDC NHCS, 2022',
    stats_closing_headline: 'Ein QR-Scan ändert alles.',
    stats_closing_body: 'Arkoura bringt kritische Gesundheitsinformationen dorthin, wo sie hingehören — für jeden, überall, sofort zugänglich. Keine App. Keine Sprachbarriere. Überhaupt keine Barriere.',
    stats_citation: 'Daten referenziert von WHO, CDC, UN-Tourismus und begutachteter medizinischer Literatur. Vollständige Zitate verfügbar unter arkoura.com/research.',
    appt_label: 'ERWEITERTER SUPPORT — TERMIN-MODUS',
    appt_headline: 'Wenn der Notfall vorbei ist — das Gespräch muss es nicht sein.',
    appt_body: 'Manchmal kann die hilfsbedürftige Person sprechen — muss aber mehr teilen als ein QR-Profil erlaubt. Der Termin-Modus ermöglicht es Ihnen, eine zeitgesteuerte, sichere Sitzung zu öffnen und einem Helfer einen Einmalcode zu geben. Er erhält vollen Zugang zu Ihrem Gesundheitstagebuch — durch KI geführt, in seiner Sprache.',
    appt_f1_title: 'Zeitgesteuert und kontrolliert',
    appt_f1_body: 'Sitzungen laufen automatisch ab. Sie bestimmen, wie lange der Zugang besteht.',
    appt_f2_title: 'Einmalcode',
    appt_f2_body: 'Teilen Sie einen einzigen OTP. Der Helfer benötigt kein Konto.',
    appt_f3_title: 'KI-geführtes Gespräch',
    appt_f3_body: 'Der Helfer interagiert mit einer KI, die Ihr Tagebuch liest und seine Fragen beantwortet — in seiner Sprache, mit Ihrem Kontext.',
    appt_badge: 'Verfügbar für Premium-Mitglieder',
    appt_session_active: 'Sitzung Aktiv',
    appt_session_title: 'TerminSitzung',
    appt_code_label: 'IHR ZUGANGSCODE',
    appt_code_hint: 'Teilen Sie diesen Code mit Ihrem Helfer',
    appt_chat_ai: 'Laut Tagebuch war die letzte Herzepisode vor 3 Wochen. Aktuelle Medikamente umfassen...',
    appt_chat_helper: 'Hat er bekannte Wechselwirkungen mit Medikamenten?',
    appt_end_session: 'Sitzung beenden',
  },
  pt: {
    signIn: 'Entrar',
    getStarted: 'Começar',
    nav_cta: 'Começar',
    heroBadge: 'Saúde Pessoal · Pronto para Emergências',
    heroH1: 'Sua história de saúde,',
    heroH2: 'onde quer que você vá.',
    heroSub: 'Arkoura é um diário de saúde pessoal que se torna um salva-vidas de emergência. Um scan QR dá acesso instantâneo a qualquer pessoa no mundo — no idioma dela.',
    heroCta1: 'Começar grátis →',
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
    s4title: 'No exterior sem conseguir comunicar',
    s4body: 'Dor intensa no peito num mercado estrangeiro. Sem idioma comum com os locais. Passaram doze minutos antes que alguém entendesse o que ele precisava.',
    s4tag: '1 em cada 4 emergências envolve uma barreira linguística',
    s5title: 'A criança que não conseguia dizer o seu nome',
    s5body: 'Não verbal e perdido num festival lotado. Sem nome, sem contatos dos pais, sem necessidades sensoriais comunicadas. Os socorristas não tinham nada com que trabalhar.',
    s5tag: '1 em cada 36 crianças é autista globalmente',
    s6title: 'Ele desmaiou. Ele se recuperou. Ele abriu uma sessão.',
    s6body: 'Recuperou a consciência rodeado de paramédicos. Abriu uma sessão temporizada, deu-lhes um código — e em segundos acederam ao seu diário e historial completos.',
    s6tag: 'Quando as palavras voltam — mais se torna possível',
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
    d2title: 'Fala 10 idiomas instantaneamente',
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
    ctaIcon3: '🌍 10 idiomas',
    trust1: 'Acesso de emergência gratuito',
    trust2: 'Criptografado e privado',
    trust3: '10 idiomas',
    formName: 'Seu nome',
    formEmail: 'seu@email.com',
    formSubmit: 'Entrar na lista →',
    formLoading: 'Enviando…',
    formSuccessTitle: 'Você está na lista.',
    formSuccessSub: 'Entraremos em contato quando Arkoura lançar.',
    formErr: 'Algo deu errado — por favor tente novamente.',
    footerDisclaimer: 'Arkoura não é um dispositivo médico nem um sistema de prontuário eletrônico. Não fornece diagnósticos médicos, avaliações clínicas nem aconselhamento médico de qualquer tipo. Arkoura é um diário de saúde pessoal, uma ferramenta de gestão de documentos e uma plataforma de compartilhamento de informações projetada exclusivamente para auxiliar em situações de emergência. Em qualquer situação de risco de vida, contacte sempre os serviços de emergência imediatamente.',
    footer_copy: '© 2026 Arkoura. Desenvolvido para a humanidade.',
    privacy: 'Privacidade',
    terms: 'Termos',
    cookies: 'Cookies',
    privacy_label: 'SEUS DADOS SÃO SAGRADOS',
    privacy_headline: 'Construído sobre uma base de privacidade inabalável.',
    privacy_sub: 'Dados de saúde são os dados mais pessoais que existem. Projetamos cada camada do Arkoura com isso em mente — não como um pensamento posterior, mas como a fundação.',
    privacy1_title: 'Criptografia AES-256 em repouso',
    privacy1_body: 'Cada dado de saúde que você armazena é criptografado com AES-256 — o mesmo padrão usado por bancos e governos. Seus dados são ilegíveis sem suas chaves.',
    privacy2_title: 'TLS 1.3 em trânsito',
    privacy2_body: 'Todos os dados entre seu dispositivo e nossos servidores são criptografados com TLS 1.3. Nenhum terceiro pode interceptar suas informações — jamais.',
    privacy3_title: 'Contribuindo para a pesquisa médica',
    privacy3_body: 'Com seu opt-in explícito, padrões de saúde anonimizados podem ajudar a avançar na pesquisa médica. Você permanece no controle — desativado por padrão e pode ser revogado a qualquer momento.',
    privacy4_title: 'Você possui seus dados',
    privacy4_body: 'Exporte tudo com um clique. Delete tudo permanentemente — incluindo backups — em 30 dias da sua solicitação. Seus dados pertencem a você, não a nós.',
    privacy5_title: 'Pronto para GDPR e HIPAA',
    privacy5_body: 'Arkoura é projetado para atender aos requisitos do GDPR para usuários europeus e infraestrutura alinhada com HIPAA. Seus direitos são integrados, não adicionados depois.',
    privacy6_title: 'Acesso de emergência é mínimo',
    privacy6_body: 'O perfil QR mostra apenas o que você escolhe — nome, condições, alergias, medicamentos, contatos. Dados completos requerem seu consentimento ativo em uma sessão que você controla.',
    privacy_hosting_title: 'Hospedado no Google Cloud Platform',
    privacy_hosting_body: 'Infraestrutura Firebase + GCP com SLA de 99.9% de disponibilidade, data centers certificados SOC 2 Tipo II e redundância automática em múltiplas regiões.',
    stats_label: 'A DIMENSÃO DO PROBLEMA',
    stats_headline: 'Todos os dias, milhões não conseguem falar por si mesmos.',
    stats_sub: 'Quando os segundos são mais importantes, o silêncio é letal. Estes são os números por trás da existência do Arkoura.',
    stats1_label: 'pessoas vivem com epilepsia — e podem perder a consciência sem aviso',
    stats1_source: 'WHO Global Epilepsy Report, 2024',
    stats2_label: 'pessoas vivem com demência, muitas vezes incapazes de comunicar sua identidade ou necessidades médicas',
    stats2_source: 'WHO Dementia Fact Sheet, 2023',
    stats3_label: 'crianças são diagnosticadas com transtorno do espectro autista, muitas das quais são não verbais',
    stats3_source: 'CDC ADDM Network, 2023',
    stats4_label: 'chegadas de turistas internacionais por ano — cada um um potencial paciente em um sistema médico de língua estrangeira',
    stats4_source: 'UN Tourism World Barometer, 2024',
    stats5_label: 'dos eventos médicos adversos envolvendo turistas envolvem falhas de comunicação com prestadores de saúde locais',
    stats5_source: 'Journal of Travel Medicine, 2022',
    stats6_label: 'visitas a pronto-socorro por ano nos EUA — muitas de pacientes que não conseguem comunicar seu histórico médico',
    stats6_source: 'CDC NHCS, 2022',
    stats_closing_headline: 'Um scan QR muda tudo.',
    stats_closing_body: 'Arkoura coloca informações de saúde críticas onde precisam estar — acessíveis a qualquer pessoa, em qualquer lugar, instantaneamente. Sem app. Sem barreira de idioma. Sem barreira alguma.',
    stats_citation: 'Dados referenciados da OMS, CDC, ONU Turismo e literatura médica revisada por pares. Citações completas disponíveis em arkoura.com/research.',
    appt_label: 'SUPORTE AVANÇADO — MODO CONSULTA',
    appt_headline: 'Quando a emergência acaba — a conversa não precisa acabar.',
    appt_body: 'Às vezes quem precisa de ajuda pode falar — mas precisa compartilhar mais do que um perfil QR permite. O Modo Consulta permite abrir uma sessão segura temporizada e dar a um ajudante um código único. Ele obtém acesso completo ao seu diário de saúde — guiado por IA, no seu idioma.',
    appt_f1_title: 'Temporizado e controlado',
    appt_f1_body: 'As sessões expiram automaticamente. Você decide quanto tempo dura o acesso.',
    appt_f2_title: 'Código de uso único',
    appt_f2_body: 'Compartilhe um único OTP. O ajudante não precisa de conta.',
    appt_f3_title: 'Conversa guiada por IA',
    appt_f3_body: 'O ajudante interage com uma IA que lê seu diário e responde às perguntas — no idioma dele, com seu contexto.',
    appt_badge: 'Disponível para membros premium',
    appt_session_active: 'Sessão Ativa',
    appt_session_title: 'Sessão de Consulta',
    appt_code_label: 'SEU CÓDIGO DE ACESSO',
    appt_code_hint: 'Compartilhe este código com seu ajudante',
    appt_chat_ai: 'De acordo com o diário, o último episódio cardíaco foi há 3 semanas. Os medicamentos atuais incluem...',
    appt_chat_helper: 'Ele tem alguma interação medicamentosa conhecida?',
    appt_end_session: 'Encerrar sessão',
  },
  zh: {
    badge: '个人健康日记 · 随时应对紧急情况',
    headline1: '您的健康故事，',
    headline2: '随时随地伴您左右。',
    subheadline: 'Arkoura 是一款个人健康日记，在紧急情况下成为您的生命线。一次 QR 扫描即可让任何帮助者即时获取所需信息——以他们的语言。',
    cta_primary: '加入等候名单 →',
    cta_secondary: '了解工作原理',
    trust1: '免费紧急访问',
    trust2: '加密且私密',
    trust3: '10种语言',
    problem_label: 'Arkoura 存在的原因',
    problem_headline1: '在紧急情况下，沉默',
    problem_headline2: '是最危险的事。',
    how_label: '工作原理',
    how_headline1: '三个步骤。一次扫描。',
    how_headline2: '守护一条生命。',
    zero_headline1: '零追踪。',
    zero_headline2: '零安装。',
    zero_headline3: '百分之百属于您。',
    diff_label: 'Arkoura 的优势',
    diff_headline1: '为最关键的',
    diff_headline2: '时刻而设计。',
    cta_headline1: '在需要之前',
    cta_headline2: '做好准备。',
    form_name: '您的姓名',
    form_email: '您的邮箱',
    form_submit: '加入等候名单 →',
    form_fine: '紧急访问永久免费。无需信用卡。',
    success_headline: '您已加入名单。',
    success_sub: 'Arkoura 发布时我们将与您联系。',
    footer_copy: '© 2026 Arkoura. 为人类而生。',
    nav_signin: '登录',
    nav_cta: '访问 Vault',
    footerDisclaimer: 'Arkoura 不是医疗设备，也不是医疗记录系统。它不提供任何形式的医疗诊断、临床评估或医疗建议。Arkoura 是个人健康日记、文件管理工具和信息共享平台，专为在紧急情况下协助提供用户信息而设计。在任何危及生命的情况下，请立即联系紧急服务。',
    privacy_label: '您的数据神圣不可侵犯',
    privacy_headline: '建立在坚定隐私保护基础上。',
    privacy_sub: '健康数据是世界上最私密的数据。我们在设计 Arkoura 的每一层时都将这一点放在心中——不是事后的想法，而是作为基础。',
    s4title: '身处异乡，无法沟通',
    s4body: '在异国市场突发剧烈胸痛。与当地人没有共同语言。十二分钟过去了，才有人明白他需要什么。',
    s4tag: '每4次紧急情况中有1次涉及语言障碍',
    s5title: '说不出自己名字的孩子',
    s5body: '在拥挤的节日中迷路。没有名字，没有父母联系方式，没有感官需求得到传达。救援人员无从入手。',
    s5tag: '全球每36名儿童中有1名是自闭症',
    s6title: '他晕倒了。他苏醒了。他开启了一个会话。',
    s6body: '在急救人员围绕下恢复意识。他开启了一个定时会话，把代码交给他们——几秒钟内他们就访问了他的完整日记和病史。',
    s6tag: '当语言回归——更多成为可能',
    privacy1_title: '静态 AES-256 加密',
    privacy1_body: '您存储的每一条健康数据都使用 AES-256 加密——与银行和政府使用的相同标准。没有您的密钥，数据无法被读取。',
    privacy2_title: '传输中的 TLS 1.3',
    privacy2_body: '您的设备与我们服务器之间的所有数据均使用 TLS 1.3 加密。第三方永远无法拦截您的信息。',
    privacy3_title: '为医学研究做贡献',
    privacy3_body: '在您明确选择加入的情况下，匿名化的健康模式可能有助于推进医学研究。您始终保持控制——默认关闭，可随时撤销。',
    privacy4_title: '数据归您所有',
    privacy4_body: '一键导出所有内容。在您提出请求后 30 天内永久删除所有内容（包括备份）。您的数据属于您，而非我们。',
    privacy5_title: '符合 GDPR 和 HIPAA',
    privacy5_body: 'Arkoura 旨在满足面向欧洲用户的 GDPR 要求以及与 HIPAA 对齐的健康数据基础设施要求。您的权利是内置的，而非事后添加的。',
    privacy6_title: '紧急访问权限最小化',
    privacy6_body: 'QR 档案仅显示您选择的内容——姓名、病情、过敏、药物、联系人。完整日记数据需要您主动同意并通过您控制的定时会话访问。',
    privacy_hosting_title: '托管于 Google Cloud Platform',
    privacy_hosting_body: 'Firebase + GCP 基础设施，99.9% 正常运行时间 SLA，SOC 2 II 型认证数据中心，以及跨多个区域的自动冗余。',
    stats_label: '问题的规模',
    stats_headline: '每天，数百万人无法为自己发声。',
    stats_sub: '当每一秒都至关重要时，沉默是致命的。这些数字解释了Arkoura存在的原因。',
    stats1_label: '人患有癫痫——可能在没有预警的情况下失去意识',
    stats1_source: 'WHO Global Epilepsy Report, 2024',
    stats2_label: '人患有痴呆症，通常无法表达自己的身份或医疗需求',
    stats2_source: 'WHO Dementia Fact Sheet, 2023',
    stats3_label: '儿童被诊断为自闭症谱系障碍，其中许多是非语言性的',
    stats3_source: 'CDC ADDM Network, 2023',
    stats4_label: '国际游客每年抵达次数——每一位都可能成为外语医疗系统中的患者',
    stats4_source: 'UN Tourism World Barometer, 2024',
    stats5_label: '涉及游客的医疗不良事件与当地医疗提供者的沟通障碍有关',
    stats5_source: 'Journal of Travel Medicine, 2022',
    stats6_label: '美国每年急诊就诊次数——其中许多患者无法表达自己的病史',
    stats6_source: 'CDC NHCS, 2022',
    stats_closing_headline: '一次QR扫描改变一切。',
    stats_closing_body: 'Arkoura将关键健康信息放在需要的地方——任何人、任何地方都能即时访问。无需应用程序。没有语言障碍。没有任何障碍。',
    stats_citation: '数据来源于WHO、CDC、联合国旅游组织及同行评审医学文献。完整引用请访问arkoura.com/research。',
    appt_label: '高级支持 — 预约模式',
    appt_headline: '紧急情况过去了——对话可以继续。',
    appt_body: '有时需要帮助的人可以说话——但需要分享比QR档案更多的信息。预约模式让您开启一个定时安全会话，并向帮助者提供一次性代码。他们可以完整访问您的健康日记和病史——由AI引导，使用他们的语言。',
    appt_f1_title: '定时且受控',
    appt_f1_body: '会话自动过期。您决定访问时长。',
    appt_f2_title: '一次性代码',
    appt_f2_body: '分享单个OTP。帮助者无需账号。',
    appt_f3_title: 'AI引导的对话',
    appt_f3_body: '帮助者与AI互动，AI读取您的日记并回答问题——使用他们的语言，基于您的背景信息。',
    appt_badge: '适用于高级会员',
    appt_session_active: '会话进行中',
    appt_session_title: '预约会话',
    appt_code_label: '您的访问码',
    appt_code_hint: '将此代码分享给您的帮助者',
    appt_chat_ai: '根据日记，最近一次心脏发作是3周前。目前用药包括……',
    appt_chat_helper: '他有已知的药物相互作用吗？',
    appt_end_session: '结束会话',
  },
  ja: {
    badge: '個人健康日記 · 緊急事態に備えて',
    headline1: 'あなたの健康の物語を、',
    headline2: 'どこへでも。',
    subheadline: 'Arkouraは個人の健康日記であり、緊急時の命綱となります。QRコードを一回スキャンするだけで、助けてくれる人があなたの情報に即座にアクセスできます—その人の言語で。',
    cta_primary: '順番待ちリストに参加 →',
    cta_secondary: '仕組みを見る',
    trust1: '緊急アクセス無料',
    trust2: '暗号化されたプライベート',
    trust3: '10言語対応',
    problem_label: 'ARKOURAが存在する理由',
    problem_headline1: '緊急時、沈黙は',
    problem_headline2: '最も危険なことです。',
    how_label: '仕組み',
    how_headline1: '3つのステップ。1回のスキャン。',
    how_headline2: '守られる命。',
    zero_headline1: 'トラッキングゼロ。',
    zero_headline2: 'インストールゼロ。',
    zero_headline3: '100%あなたのもの。',
    diff_label: 'ARKOURAの優位性',
    diff_headline1: '最も重要な',
    diff_headline2: '瞬間のために設計。',
    cta_headline1: '必要になる前に',
    cta_headline2: '備えておきましょう。',
    form_name: 'お名前',
    form_email: 'メールアドレス',
    form_submit: '順番待ちリストに参加 →',
    form_fine: '緊急アクセスは永久無料。クレジットカード不要。',
    success_headline: 'リストに登録されました。',
    success_sub: 'Arkouraのローンチ時にご連絡いたします。',
    footer_copy: '© 2026 Arkoura. 人類のために作られました。',
    nav_signin: 'サインイン',
    nav_cta: 'Vaultを開く',
    footerDisclaimer: 'Arkouraは医療機器でも医療記録システムでもありません。医療診断、臨床評価、または医療アドバイスを提供するものではありません。Arkouraは、緊急時に利用者が提供した情報をヘルパーがアクセスできるよう設計された、個人健康日記・文書管理・情報共有プラットフォームです。生命の危険がある状況では、必ず直ちに緊急サービスに連絡してください。',
    privacy_label: 'あなたのデータは神聖です',
    privacy_headline: '妥協のないプライバシーの基盤の上に構築。',
    privacy_sub: '健康データは世界で最もプライベートなデータです。Arkouraのすべての層をその考えを念頭に設計しました——後付けではなく、基盤として。',
    s4title: '海外で言葉が通じない',
    s4body: '外国の市場で激しい胸の痛み。地元の人々と共通の言語がない。誰かが何が必要かを理解するまで12分かかった。',
    s4tag: '4回の救急のうち1回は言語の壁が関係している',
    s5title: '自分の名前を言えなかった子ども',
    s5body: '非言語で混んだフェスティバルで迷子に。名前も、親の連絡先も、感覚ニーズも伝えられなかった。対応者には何も手がかりがなかった。',
    s5tag: '世界では36人に1人の子どもが自閉症',
    s6title: '彼は気を失った。回復した。セッションを開いた。',
    s6body: '救急隊員に囲まれて意識を取り戻した。時間制限付きセッションを開き、コードを渡すと——数秒で彼の完全な日記と病歴にアクセスできた。',
    s6tag: '言葉が戻るとき——もっと多くが可能になる',
    privacy1_title: '保存時のAES-256暗号化',
    privacy1_body: '保存するすべての健康データはAES-256で暗号化されています——銀行や政府が使用するのと同じ標準です。あなたのキーなしにデータを読むことはできません。',
    privacy2_title: '転送時のTLS 1.3',
    privacy2_body: 'デバイスとサーバー間のすべてのデータはTLS 1.3で暗号化されています。第三者があなたの情報を傍受することは決してできません。',
    privacy3_title: '医学研究への貢献',
    privacy3_body: '明示的な同意のもと、匿名化された健康パターンが医学研究の進展に役立つ場合があります。デフォルトはオフで、いつでも取り消せます。',
    privacy4_title: 'データはあなたのもの',
    privacy4_body: 'ワンクリックですべてをエクスポート。リクエストから30日以内に、バックアップを含むすべてを完全に削除。あなたのデータは私たちではなくあなたのものです。',
    privacy5_title: 'GDPRおよびHIPAA対応',
    privacy5_body: 'ArkouraはEUユーザー向けGDPRおよびHIPAA対応インフラの要件を満たすよう設計されています。あなたの権利は後付けではなく、最初から組み込まれています。',
    privacy6_title: '緊急アクセスは最小限',
    privacy6_body: 'QRプロフィールにはあなたが選んだ情報のみ表示されます——氏名、病状、アレルギー、薬、連絡先。完全な日記データにはあなたが管理するセッションでの同意が必要です。',
    privacy_hosting_title: 'Google Cloud Platformでホスト',
    privacy_hosting_body: 'Firebase + GCPインフラ、99.9%稼働時間SLA、SOC 2 Type II認定データセンター、複数リージョンにわたる自動冗長性。',
    stats_label: '問題の規模',
    stats_headline: '毎日、何百万人もの人が自分のために語れません。',
    stats_sub: '一秒一秒が最も重要なとき、沈黙は致命的です。これらがArkouraが存在する理由となる数字です。',
    stats1_label: '人がてんかんを持ち——警告なしに意識を失う可能性があります',
    stats1_source: 'WHO Global Epilepsy Report, 2024',
    stats2_label: '人が認知症を持ち、自分の身元や医療ニーズを伝えられないことが多い',
    stats2_source: 'WHO Dementia Fact Sheet, 2023',
    stats3_label: '子どもが自閉スペクトラム症と診断されており、その多くは非言語です',
    stats3_source: 'CDC ADDM Network, 2023',
    stats4_label: '年間国際観光客到着数——それぞれが外国語の医療システムでの潜在的な患者',
    stats4_source: 'UN Tourism World Barometer, 2024',
    stats5_label: '旅行者が関与する医療有害事象に地元医療提供者とのコミュニケーション障害が含まれる',
    stats5_source: 'Journal of Travel Medicine, 2022',
    stats6_label: '米国での年間救急受診数——多くは自分の病歴を伝えられない患者',
    stats6_source: 'CDC NHCS, 2022',
    stats_closing_headline: '一回のQRスキャンが全てを変えます。',
    stats_closing_body: 'Arkouraは重要な健康情報を必要な場所に届けます——誰でも、どこでも、即座にアクセス可能。アプリ不要。言語の壁なし。一切の障壁なし。',
    stats_citation: 'データはWHO、CDC、国連観光局、査読済み医学文献を参照。完全な引用はarkoura.com/researchでご覧いただけます。',
    appt_label: '高度なサポート — アポイントメントモード',
    appt_headline: '緊急事態が終わっても——会話は続けられます。',
    appt_body: '助けが必要な人が話せる場合でも、QRプロフィール以上の情報を共有する必要があることがあります。アポイントメントモードでは、時間制限付きの安全なセッションを開き、ヘルパーにワンタイムコードを渡すことができます。彼らはAIに案内されながら、あなたの健康日記や病歴への完全なアクセスを得ます。',
    appt_f1_title: '時間制限付きで制御可能',
    appt_f1_body: 'セッションは自動的に期限切れになります。アクセス時間はあなたが決めます。',
    appt_f2_title: 'ワンタイムコード',
    appt_f2_body: '1つのOTPを共有するだけ。ヘルパーはアカウント不要。',
    appt_f3_title: 'AIガイドの会話',
    appt_f3_body: 'ヘルパーはあなたの日記を読むAIと対話し、質問に答えてもらいます——ヘルパーの言語で、あなたのコンテキストに基づいて。',
    appt_badge: 'プレミアム会員向け',
    appt_session_active: 'セッション進行中',
    appt_session_title: 'アポイントメントセッション',
    appt_code_label: 'アクセスコード',
    appt_code_hint: 'このコードをヘルパーに共有してください',
    appt_chat_ai: '日記によると、最後の心臓発作は3週間前でした。現在の薬には……',
    appt_chat_helper: '既知の薬物相互作用はありますか？',
    appt_end_session: 'セッション終了',
  },
  it: {
    badge: 'Diario di Salute · Pronto per le Emergenze',
    headline1: 'La tua storia di salute,',
    headline2: 'sempre con te.',
    subheadline: "Arkoura è un diario di salute personale che diventa un salvagente nelle emergenze. Una scansione QR dà accesso immediato a chiunque ti aiuti — nella sua lingua.",
    cta_primary: 'Unisciti alla lista →',
    cta_secondary: 'Scopri come funziona',
    trust1: 'Accesso emergenze gratuito',
    trust2: 'Crittografato e privato',
    trust3: '10 lingue',
    problem_label: 'PERCHÉ ESISTE ARKOURA',
    problem_headline1: "In un'emergenza, il silenzio",
    problem_headline2: 'è la cosa più pericolosa.',
    how_label: 'COME FUNZIONA',
    how_headline1: 'Tre passaggi. Una scansione.',
    how_headline2: 'Una vita protetta.',
    zero_headline1: 'Zero tracciamento.',
    zero_headline2: 'Zero installazioni.',
    zero_headline3: '100% tuo.',
    diff_label: 'IL VANTAGGIO ARKOURA',
    diff_headline1: 'Progettato per i',
    diff_headline2: 'momenti che contano di più.',
    cta_headline1: 'Sii pronto prima',
    cta_headline2: 'di averne bisogno.',
    form_name: 'Il tuo nome',
    form_email: 'tua@email.com',
    form_submit: 'Unisciti alla lista →',
    form_fine: 'Gratuito per sempre per accesso emergenze. Nessuna carta di credito.',
    success_headline: 'Sei nella lista.',
    success_sub: 'Ti contatteremo al lancio di Arkoura.',
    footer_copy: "© 2026 Arkoura. Progettato per l'umanità.",
    nav_signin: 'Accedi',
    nav_cta: 'Accedi al Vault',
    footerDisclaimer: 'Arkoura non è un dispositivo medico né un sistema di cartella clinica. Non fornisce diagnosi mediche, valutazioni cliniche o consigli medici di alcun tipo. Arkoura è un diario sanitario personale, uno strumento di gestione documentale e una piattaforma di condivisione delle informazioni progettata esclusivamente per assistere nelle situazioni di emergenza. Contattare sempre immediatamente i servizi di emergenza in qualsiasi situazione pericolosa per la vita.',
    privacy_label: 'I TUOI DATI SONO SACRI',
    privacy_headline: 'Costruito su una base di privacy assoluta.',
    privacy_sub: 'I dati sanitari sono i dati più personali che esistono. Abbiamo progettato ogni strato di Arkoura con questo in mente — non come un ripensamento, ma come fondamento.',
    s4title: 'All\'estero senza poter comunicare',
    s4body: 'Forte dolore al petto in un mercato straniero. Nessuna lingua comune con i locali. Passarono dodici minuti prima che qualcuno capisse di cosa aveva bisogno.',
    s4tag: '1 emergenza su 4 coinvolge una barriera linguistica',
    s5title: 'Il bambino che non riusciva a dire il suo nome',
    s5body: 'Non verbale e perso in un festival affollato. Nessun nome, nessun contatto dei genitori, nessun bisogno sensoriale comunicato. I soccorritori non avevano nulla su cui lavorare.',
    s5tag: '1 bambino su 36 è autistico a livello globale',
    s6title: 'È svenuto. Si è ripreso. Ha aperto una sessione.',
    s6body: 'Riprese conoscenza circondato dai paramedici. Aprì una sessione temporizzata, diede loro un codice — e in pochi secondi accedettero al suo diario e alla sua storia completi.',
    s6tag: 'Quando le parole tornano — più diventa possibile',
    privacy1_title: 'Crittografia AES-256 a riposo',
    privacy1_body: 'Ogni dato sanitario che conservi è crittografato con AES-256 — lo stesso standard usato da banche e governi. I tuoi dati sono illeggibili senza le tue chiavi.',
    privacy2_title: 'TLS 1.3 in transito',
    privacy2_body: 'Tutti i dati tra il tuo dispositivo e i nostri server sono crittografati con TLS 1.3. Nessuna terza parte può intercettare le tue informazioni — mai.',
    privacy3_title: 'Contribuire alla ricerca medica',
    privacy3_body: "Con il tuo opt-in esplicito, pattern di salute anonimizzati possono contribuire all'avanzamento della ricerca medica. Rimani in controllo — disattivato per impostazione predefinita e revocabile in qualsiasi momento.",
    privacy4_title: 'Possiedi i tuoi dati',
    privacy4_body: "Esporta tutto con un clic. Elimina tutto permanentemente — inclusi i backup — entro 30 giorni dalla tua richiesta. I tuoi dati appartengono a te, non a noi.",
    privacy5_title: 'Conforme GDPR e HIPAA',
    privacy5_body: "Arkoura è progettato per soddisfare i requisiti del GDPR per gli utenti europei e un'infrastruttura allineata HIPAA per i dati sanitari. I tuoi diritti sono integrati, non aggiunti dopo.",
    privacy6_title: "L'accesso di emergenza è minimo",
    privacy6_body: 'Il profilo QR mostra solo ciò che scegli — nome, condizioni, allergie, farmaci, contatti. I dati completi del diario richiedono il tuo consenso attivo in una sessione che controlli.',
    privacy_hosting_title: 'Ospitato su Google Cloud Platform',
    privacy_hosting_body: 'Infrastruttura Firebase + GCP con SLA di uptime al 99.9%, data center certificati SOC 2 Type II e ridondanza automatica su più regioni.',
    stats_label: 'LA PORTATA DEL PROBLEMA',
    stats_headline: 'Ogni giorno, milioni di persone non possono parlare per se stesse.',
    stats_sub: "Quando i secondi contano di più, il silenzio è letale. Questi sono i numeri dietro l'esistenza di Arkoura.",
    stats1_label: "persone vivono con l'epilessia — e possono perdere conoscenza senza preavviso",
    stats1_source: 'WHO Global Epilepsy Report, 2024',
    stats2_label: 'persone vivono con la demenza, spesso incapaci di comunicare la propria identità o le proprie esigenze mediche',
    stats2_source: 'WHO Dementia Fact Sheet, 2023',
    stats3_label: 'bambini vengono diagnosticati con disturbo dello spettro autistico, molti dei quali sono non verbali',
    stats3_source: 'CDC ADDM Network, 2023',
    stats4_label: "arrivi di turisti internazionali all'anno — ognuno un potenziale paziente in un sistema medico in lingua straniera",
    stats4_source: 'UN Tourism World Barometer, 2024',
    stats5_label: 'degli eventi medici avversi che coinvolgono turisti comportano fallimenti di comunicazione con i fornitori sanitari locali',
    stats5_source: 'Journal of Travel Medicine, 2022',
    stats6_label: "visite al pronto soccorso all'anno negli USA — molte da pazienti che non riescono a comunicare la loro storia medica",
    stats6_source: 'CDC NHCS, 2022',
    stats_closing_headline: 'Una scansione QR cambia tutto.',
    stats_closing_body: "Arkoura mette le informazioni sanitarie critiche dove devono essere — accessibili a chiunque, ovunque, istantaneamente. Nessuna app. Nessuna barriera linguistica. Nessuna barriera.",
    stats_citation: 'Dati riferiti da OMS, CDC, ONU Turismo e letteratura medica peer-reviewed. Citazioni complete disponibili su arkoura.com/research.',
    appt_label: 'SUPPORTO AVANZATO — MODALITÀ APPUNTAMENTO',
    appt_headline: "Quando l'emergenza è finita — la conversazione non deve esserlo.",
    appt_body: "A volte chi ha bisogno di aiuto può parlare — ma deve condividere più di quanto permetta un profilo QR. La Modalità Appuntamento ti permette di aprire una sessione sicura e temporizzata e dare a un aiutante un codice unico. Ottiene accesso completo al tuo diario di salute — guidato dall'IA, nella sua lingua.",
    appt_f1_title: 'Temporizzato e controllato',
    appt_f1_body: "Le sessioni scadono automaticamente. Decidi tu quanto dura l'accesso.",
    appt_f2_title: 'Codice monouso',
    appt_f2_body: "Condividi un unico OTP. L'aiutante non ha bisogno di un account.",
    appt_f3_title: "Conversazione guidata dall'IA",
    appt_f3_body: "L'aiutante interagisce con un'IA che legge il tuo diario e risponde alle sue domande — nella sua lingua, con il tuo contesto.",
    appt_badge: 'Disponibile per i membri premium',
    appt_session_active: 'Sessione Attiva',
    appt_session_title: 'Sessione Appuntamento',
    appt_code_label: 'IL TUO CODICE DI ACCESSO',
    appt_code_hint: 'Condividi questo codice con il tuo aiutante',
    appt_chat_ai: "Dal diario, l'ultimo episodio cardiaco è stato 3 settimane fa. I farmaci attuali includono...",
    appt_chat_helper: 'Ha interazioni farmacologiche note?',
    appt_end_session: 'Termina sessione',
  },
  ru: {
    badge: 'Личный дневник здоровья · Готов к экстренным случаям',
    headline1: 'Ваша история здоровья,',
    headline2: 'всегда рядом.',
    subheadline: 'Arkoura — это личный дневник здоровья, который становится спасательным кругом в экстренных ситуациях. Один QR-скан даёт мгновенный доступ любому помощнику — на его языке.',
    cta_primary: 'Вступить в список →',
    cta_secondary: 'Узнать как работает',
    trust1: 'Бесплатный экстренный доступ',
    trust2: 'Зашифровано и приватно',
    trust3: '10 языков',
    problem_label: 'ПОЧЕМУ СУЩЕСТВУЕТ ARKOURA',
    problem_headline1: 'В экстренной ситуации молчание',
    problem_headline2: 'самое опасное.',
    how_label: 'КАК ЭТО РАБОТАЕТ',
    how_headline1: 'Три шага. Один скан.',
    how_headline2: 'Жизнь под защитой.',
    zero_headline1: 'Ноль отслеживания.',
    zero_headline2: 'Ноль установок.',
    zero_headline3: '100% ваше.',
    diff_label: 'ПРЕИМУЩЕСТВО ARKOURA',
    diff_headline1: 'Создан для',
    diff_headline2: 'моментов, которые важнее всего.',
    cta_headline1: 'Будьте готовы до того,',
    cta_headline2: 'как понадобится.',
    form_name: 'Ваше имя',
    form_email: 'ваш@email.com',
    form_submit: 'Вступить в список →',
    form_fine: 'Бесплатно навсегда для экстренного доступа. Без кредитной карты.',
    success_headline: 'Вы в списке.',
    success_sub: 'Мы свяжемся с вами при запуске Arkoura.',
    footer_copy: '© 2026 Arkoura. Создан для человечества.',
    nav_signin: 'Войти',
    nav_cta: 'Открыть Vault',
    footerDisclaimer: 'Arkoura не является медицинским устройством и не является системой медицинских записей. Он не предоставляет медицинских диагнозов, клинических оценок или медицинских консультаций. Arkoura — это личный дневник здоровья, инструмент управления документами и платформа обмена информацией, предназначенная исключительно для помощи в экстренных ситуациях. В любой ситуации, угрожающей жизни, всегда немедленно обращайтесь в службу экстренной помощи.',
    privacy_label: 'ВАШИ ДАННЫЕ СВЯЩЕННЫ',
    privacy_headline: 'Построен на основе бескомпромиссной конфиденциальности.',
    privacy_sub: 'Данные о здоровье — самые личные данные в мире. Мы проектировали каждый уровень Arkoura с этой мыслью — не как запоздалую мысль, а как фундамент.',
    s4title: 'За рубежом без возможности общаться',
    s4body: 'Сильная боль в груди на иностранном рынке. Нет общего языка с местными. Прошло двенадцать минут, прежде чем кто-то понял, что ему нужно.',
    s4tag: '1 из 4 экстренных случаев связан с языковым барьером',
    s5title: 'Ребёнок, который не мог назвать своё имя',
    s5body: 'Невербальный и потерявшийся на переполненном фестивале. Нет имени, нет контактов родителей, нет информации о сенсорных потребностях. У спасателей не было ничего, с чего начать.',
    s5tag: '1 из 36 детей в мире имеет аутизм',
    s6title: 'Он потерял сознание. Пришёл в себя. Открыл сеанс.',
    s6body: 'Пришёл в сознание, окружённый парамедиками. Открыл временный сеанс, передал им код — и за секунды они получили доступ к его полному дневнику и истории.',
    s6tag: 'Когда слова возвращаются — становится возможным больше',
    privacy1_title: 'Шифрование AES-256 в покое',
    privacy1_body: 'Каждый фрагмент данных о здоровье шифруется с помощью AES-256 — того же стандарта, что используют банки и правительства. Без ваших ключей данные нечитаемы.',
    privacy2_title: 'TLS 1.3 при передаче',
    privacy2_body: 'Все данные между вашим устройством и нашими серверами зашифрованы TLS 1.3. Третьи лица никогда не смогут перехватить вашу информацию.',
    privacy3_title: 'Вклад в медицинские исследования',
    privacy3_body: 'При вашем явном согласии анонимизированные паттерны здоровья могут помочь в развитии медицинских исследований. Вы сохраняете контроль — по умолчанию отключено, можно отозвать в любой момент.',
    privacy4_title: 'Данные принадлежат вам',
    privacy4_body: 'Экспортируйте всё в один клик. Навсегда удалите всё — включая резервные копии — в течение 30 дней с момента запроса. Ваши данные принадлежат вам, а не нам.',
    privacy5_title: 'Готовность к GDPR и HIPAA',
    privacy5_body: 'Arkoura спроектирован для соответствия требованиям GDPR для европейских пользователей и инфраструктуре, согласованной с HIPAA. Ваши права встроены изначально, а не добавлены потом.',
    privacy6_title: 'Экстренный доступ минимален',
    privacy6_body: 'QR-профиль показывает только то, что вы выбрали — имя, состояния, аллергии, лекарства, контакты. Полные данные дневника требуют вашего активного согласия в сессии, которую вы контролируете.',
    privacy_hosting_title: 'Размещено на Google Cloud Platform',
    privacy_hosting_body: 'Инфраструктура Firebase + GCP с SLA 99.9% доступности, дата-центрами с сертификацией SOC 2 Type II и автоматическим резервированием в нескольких регионах.',
    stats_label: 'МАСШТАБ ПРОБЛЕМЫ',
    stats_headline: 'Каждый день миллионы не могут говорить за себя.',
    stats_sub: 'Когда каждая секунда на счету, молчание смертельно. Это цифры, объясняющие, почему существует Arkoura.',
    stats1_label: 'человек живут с эпилепсией — и могут потерять сознание без предупреждения',
    stats1_source: 'WHO Global Epilepsy Report, 2024',
    stats2_label: 'человек живут с деменцией, часто не способных сообщить о своей личности или медицинских потребностях',
    stats2_source: 'WHO Dementia Fact Sheet, 2023',
    stats3_label: 'детей диагностируют расстройство аутистического спектра, многие из которых не вербальны',
    stats3_source: 'CDC ADDM Network, 2023',
    stats4_label: 'международных туристических прибытий в год — каждое потенциальный пациент в иноязычной медицинской системе',
    stats4_source: 'UN Tourism World Barometer, 2024',
    stats5_label: 'неблагоприятных медицинских событий с участием туристов связаны с коммуникационными сбоями с местными медицинскими работниками',
    stats5_source: 'Journal of Travel Medicine, 2022',
    stats6_label: 'обращений в отделения скорой помощи в год в США — многие от пациентов, которые не могут сообщить свою историю болезни',
    stats6_source: 'CDC NHCS, 2022',
    stats_closing_headline: 'Один QR-скан меняет всё.',
    stats_closing_body: 'Arkoura помещает критически важную медицинскую информацию туда, где она нужна — доступную для всех, везде, мгновенно. Без приложения. Без языкового барьера. Без каких-либо барьеров.',
    stats_citation: 'Данные ссылаются на ВОЗ, CDC, ООН по туризму и рецензируемую медицинскую литературу. Полные ссылки доступны на arkoura.com/research.',
    appt_label: 'РАСШИРЕННАЯ ПОДДЕРЖКА — РЕЖИМ ВСТРЕЧИ',
    appt_headline: 'Когда экстренная ситуация позади — разговор может продолжиться.',
    appt_body: 'Иногда человеку, которому нужна помощь, удаётся говорить — но нужно поделиться большим, чем позволяет QR-профиль. Режим встречи позволяет открыть временный защищённый сеанс и передать помощнику одноразовый код. Он получает полный доступ к вашему дневнику здоровья — при поддержке ИИ, на своём языке.',
    appt_f1_title: 'Временный и управляемый',
    appt_f1_body: 'Сеансы истекают автоматически. Вы решаете, как долго длится доступ.',
    appt_f2_title: 'Одноразовый код',
    appt_f2_body: 'Поделитесь одним OTP. Помощнику не нужна учётная запись.',
    appt_f3_title: 'Разговор под руководством ИИ',
    appt_f3_body: 'Помощник взаимодействует с ИИ, который читает ваш дневник и отвечает на вопросы — на языке помощника, с учётом вашего контекста.',
    appt_badge: 'Доступно для премиум-участников',
    appt_session_active: 'Сеанс активен',
    appt_session_title: 'Сеанс встречи',
    appt_code_label: 'ВАШ КОД ДОСТУПА',
    appt_code_hint: 'Поделитесь этим кодом с помощником',
    appt_chat_ai: 'По данным дневника, последний сердечный эпизод был 3 недели назад. Текущие препараты включают...',
    appt_chat_helper: 'Есть ли у него известные лекарственные взаимодействия?',
    appt_end_session: 'Завершить сеанс',
  },
  sv: {
    badge: 'Personlig hälsodagbok · Redo för nödsituationer',
    headline1: 'Din hälsohistoria,',
    headline2: 'alltid med dig.',
    subheadline: 'Arkoura är en personlig hälsodagbok som blir en livlina i nödsituationer. En QR-skanning ger omedelbar tillgång till vem som helst som hjälper dig — på deras språk.',
    cta_primary: 'Gå med i listan →',
    cta_secondary: 'Se hur det fungerar',
    trust1: 'Gratis nödtillgång',
    trust2: 'Krypterat och privat',
    trust3: '10 språk',
    problem_label: 'VARFÖR ARKOURA FINNS',
    problem_headline1: 'I en nödsituation är tystnad',
    problem_headline2: 'det farligaste som finns.',
    how_label: 'HUR DET FUNGERAR',
    how_headline1: 'Tre steg. En skanning.',
    how_headline2: 'Ett liv skyddat.',
    zero_headline1: 'Noll spårning.',
    zero_headline2: 'Noll installationer.',
    zero_headline3: '100% ditt.',
    diff_label: 'ARKOURA-FÖRDELEN',
    diff_headline1: 'Utvecklad för de',
    diff_headline2: 'stunder som betyder mest.',
    cta_headline1: 'Var redo innan',
    cta_headline2: 'du behöver det.',
    form_name: 'Ditt namn',
    form_email: 'din@email.com',
    form_submit: 'Gå med i listan →',
    form_fine: 'Alltid gratis för nödtillgång. Inget kreditkort krävs.',
    success_headline: 'Du är med på listan.',
    success_sub: 'Vi hör av oss när Arkoura lanseras.',
    footer_copy: '© 2026 Arkoura. Konstruerad för mänskligheten.',
    nav_signin: 'Logga in',
    nav_cta: 'Öppna Vault',
    footerDisclaimer: 'Arkoura är inte en medicinsk enhet och inte ett journalsystem. Det tillhandahåller inga medicinska diagnoser, kliniska bedömningar eller medicinska råd av något slag. Arkoura är en personlig hälsodagbok, ett dokumenthanteringsverktyg och en informationsdelningsplattform utformad enbart för att hjälpa i nödsituationer. Kontakta alltid räddningstjänsten omedelbart i alla livshotande situationer.',
    privacy_label: 'DIN DATA ÄR HELIG',
    privacy_headline: 'Byggt på en grund av kompromisslös integritet.',
    privacy_sub: 'Hälsodata är de mest personliga data som finns. Vi designade varje lager av Arkoura med det i åtanke — inte som en eftertanke, utan som grunden.',
    s4title: 'Utomlands och oförmögen att kommunicera',
    s4body: 'Svår bröstsmärta på en utländsk marknad. Inget gemensamt språk med lokalbefolkningen. Tolv minuter gick innan någon förstod vad han behövde.',
    s4tag: '1 av 4 nödsituationer involverar en språkbarriär',
    s5title: 'Barnet som inte kunde säga sitt namn',
    s5body: 'Icke-verbal och borttappad på ett trångt festival. Inget namn, inga föräldrars kontakter, inga sensoriska behov kommunicerade. Räddningspersonalen hade ingenting att gå på.',
    s5tag: '1 av 36 barn är autistiska globalt',
    s6title: 'Han svimmade. Han återhämtade sig. Han öppnade en session.',
    s6body: 'Återfick medvetandet omgiven av ambulanspersonal. Han öppnade en tidsbegränsad session, gav dem en kod — och på sekunder fick de tillgång till hans fullständiga dagbok och historik.',
    s6tag: 'När orden kommer tillbaka — mer blir möjligt',
    privacy1_title: 'AES-256-kryptering i vila',
    privacy1_body: 'Varje hälsodata du lagrar krypteras med AES-256 — samma standard som banker och regeringar använder. Dina data är oläsliga utan dina nycklar.',
    privacy2_title: 'TLS 1.3 under överföring',
    privacy2_body: 'All data mellan din enhet och våra servrar krypteras med TLS 1.3. Ingen tredje part kan avlyssna din information — aldrig.',
    privacy3_title: 'Bidrar till medicinsk forskning',
    privacy3_body: 'Med ditt explicita samtycke kan anonymiserade hälsomönster bidra till att främja medicinsk forskning. Du behåller kontrollen — avstängt som standard och kan återkallas när som helst.',
    privacy4_title: 'Du äger din data',
    privacy4_body: 'Exportera allt med ett klick. Radera allt permanent — inklusive säkerhetskopior — inom 30 dagar från din begäran. Din data tillhör dig, inte oss.',
    privacy5_title: 'GDPR- och HIPAA-kompatibel',
    privacy5_body: 'Arkoura är designat för att uppfylla kraven i GDPR för europeiska användare och HIPAA-anpassad infrastruktur för hälsodata. Dina rättigheter är inbyggda, inte tillagda efteråt.',
    privacy6_title: 'Nödtillgång är minimal',
    privacy6_body: 'QR-profilen visar bara vad du väljer — namn, tillstånd, allergier, mediciner, kontakter. Fullständig dagboksdata kräver ditt aktiva samtycke i en session du kontrollerar.',
    privacy_hosting_title: 'Hostad på Google Cloud Platform',
    privacy_hosting_body: 'Firebase + GCP-infrastruktur med 99.9% drifttid SLA, SOC 2 Type II-certifierade datacenter och automatisk redundans över flera regioner.',
    stats_label: 'PROBLEMETS OMFATTNING',
    stats_headline: 'Varje dag kan miljoner inte tala för sig själva.',
    stats_sub: 'När sekunder räknas som mest är tystnad dödlig. Dessa är siffrorna bakom varför Arkoura finns.',
    stats1_label: 'personer lever med epilepsi — och kan förlora medvetandet utan förvarning',
    stats1_source: 'WHO Global Epilepsy Report, 2024',
    stats2_label: 'personer lever med demens, ofta oförmögna att kommunicera sin identitet eller medicinska behov',
    stats2_source: 'WHO Dementia Fact Sheet, 2023',
    stats3_label: 'barn diagnostiseras med autismspektrumstörning, varav många är icke-verbala',
    stats3_source: 'CDC ADDM Network, 2023',
    stats4_label: 'internationella turistankomster per år — var och en en potentiell patient i ett utländskt medicinskt system',
    stats4_source: 'UN Tourism World Barometer, 2024',
    stats5_label: 'av negativa medicinska händelser som involverar turister involverar kommunikationsmisslyckanden med lokala vårdgivare',
    stats5_source: 'Journal of Travel Medicine, 2022',
    stats6_label: 'akutmottagningsbesök per år i USA — många av patienter som inte kan kommunicera sin medicinska historia',
    stats6_source: 'CDC NHCS, 2022',
    stats_closing_headline: 'En QR-skanning förändrar allt.',
    stats_closing_body: 'Arkoura placerar kritisk hälsoinformation där den behöver vara — tillgänglig för alla, var som helst, omedelbart. Ingen app. Ingen språkbarriär. Ingen barriär alls.',
    stats_citation: 'Data refererade från WHO, CDC, UN Tourism och granskad medicinsk litteratur. Fullständiga citat tillgängliga på arkoura.com/research.',
    appt_label: 'AVANCERAT STÖD — MÖTESLÄGE',
    appt_headline: 'När nödsituationen är över — behöver inte samtalet vara det.',
    appt_body: 'Ibland kan den som behöver hjälp tala — men behöver dela mer än vad en QR-profil tillåter. Mötesläget låter dig öppna en tidsbegränsad, säker session och ge en hjälpare en engångskod. De får full tillgång till din hälsodagbok — guidad av AI, på deras språk.',
    appt_f1_title: 'Tidsbegränsad och kontrollerad',
    appt_f1_body: 'Sessioner löper ut automatiskt. Du bestämmer hur länge åtkomsten varar.',
    appt_f2_title: 'Engångskod',
    appt_f2_body: 'Dela en enda OTP. Hjälparen behöver inget konto.',
    appt_f3_title: 'AI-guidad konversation',
    appt_f3_body: 'Hjälparen interagerar med en AI som läser din dagbok och svarar på deras frågor — på deras språk, med ditt sammanhang.',
    appt_badge: 'Tillgänglig för premiummedlemmar',
    appt_session_active: 'Session aktiv',
    appt_session_title: 'Mötessession',
    appt_code_label: 'DIN ÅTKOMSTKOD',
    appt_code_hint: 'Dela den här koden med din hjälpare',
    appt_chat_ai: 'Enligt dagboken var det senaste hjärtepisoden för 3 veckor sedan. Nuvarande mediciner inkluderar...',
    appt_chat_helper: 'Har han några kända läkemedelsinteraktioner?',
    appt_end_session: 'Avsluta session',
  },
}

function getText(lang: string, key: string): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key
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
                <span>{l.flag} {l.name}</span>
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

function Nav({ lang, setLang, onGetStarted }: { lang: string; setLang: (l: string) => void; onGetStarted: () => void }) {
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
        <nav className="flex items-center gap-2">
          <LanguageSelector lang={lang} setLang={setLang} />
          <button
            onClick={onGetStarted}
            className="rounded-full bg-[#7A9E7E] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4A7A50]"
          >
            {getText(lang, 'nav_cta')}
          </button>
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

function HeroSection({ lang, onGetStarted }: { lang: string; onGetStarted: () => void }) {
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
              <button
                onClick={onGetStarted}
                className="rounded-xl bg-[#7A9E7E] px-8 py-4 font-[var(--font-manrope)] text-base font-semibold text-white transition-colors hover:bg-[#4A7A50]"
              >
                {getText(lang, 'heroCta1')}
              </button>
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

// ─── Section 2 — Problem (Carousel) ──────────────────────────────────────────

// ─── Scenario icons ───────────────────────────────────────────────────────────

function IconBicycle() {
  return (
    <svg width="24" height="24" viewBox="0 0 48 48"
         fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round"
         className="text-[#4A7A50]">
      <circle cx="12" cy="34" r="8"/>
      <circle cx="36" cy="34" r="8"/>
      <path d="M12,34 L22,16 L36,16"/>
      <path d="M22,16 L30,34"/>
      <path d="M18,16 L26,16"/>
      <path d="M34,10 L34,6 M32,8 L36,8"/>
    </svg>
  )
}

function IconAirplane() {
  return (
    <svg width="24" height="24" viewBox="0 0 48 48"
         fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round"
         className="text-[#4A7A50]">
      <circle cx="24" cy="24" r="16"/>
      <path d="M24,8 C18,14 18,34 24,40"/>
      <path d="M24,8 C30,14 30,34 24,40"/>
      <path d="M8,24 C12,20 36,20 40,24"/>
      <path d="M8,24 C12,28 36,28 40,24"/>
      <path d="M30,12 L38,12 L38,20 L34,20 L30,24 L30,20 L30,12 Z"/>
      <path d="M33,15 L35,17 M35,15 L33,17"/>
    </svg>
  )
}

function IconElderly() {
  return (
    <svg width="24" height="24" viewBox="0 0 48 48"
         fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round"
         className="text-[#4A7A50]">
      <circle cx="24" cy="12" r="6"/>
      <path d="M24,18 L24,32"/>
      <path d="M14,24 L24,20 L34,24"/>
      <path d="M18,32 L24,32 L30,42"/>
      <path d="M24,32 L20,42"/>
      <path d="M30,42 L36,42 C36,42 38,42 38,40 L38,30"/>
      <path d="M40,14 C40,11 43,10 43,13 C43,15 41,15 41,17"/>
      <circle cx="41" cy="19" r="0.8" fill="currentColor"/>
    </svg>
  )
}

function IconChild() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round"
         className="text-[#4A7A50]">
      <circle cx="12" cy="5" r="3"/>
      <path d="M12,8 L12,16"/>
      <path d="M7,11 L12,9 L17,11"/>
      <path d="M9,16 L12,16 L15,21"/>
      <path d="M12,16 L10,21"/>
      <path d="M17,7 C18,6 20,6 20,8 C20,9 19,10 18,9"/>
      <circle cx="18" cy="10" r="0.8" fill="currentColor"/>
    </svg>
  )
}

function IconSession() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round"
         className="text-[#4A7A50]">
      <rect x="7" y="2" width="10" height="16" rx="2"/>
      <line x1="10" y1="7" x2="14" y2="7"/>
      <line x1="10" y1="10" x2="14" y2="10"/>
      <line x1="10" y1="13" x2="12" y2="13"/>
      <circle cx="10" cy="16" r="1" fill="currentColor"/>
      <circle cx="12" cy="16" r="1" fill="currentColor"/>
      <circle cx="14" cy="16" r="1" fill="currentColor"/>
      <path d="M17,14 L20,17 L17,20"/>
      <path d="M11,22 L20,17"/>
    </svg>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SCENARIOS = [
  {
    id: 1,
    tag: 'Happens every day',
    tagColor: '#E8F2E6',
    tagText: '#4A7A50',
    accentBg: '#F0F7F0',
    title: "The cyclist who couldn't speak",
    body: 'Collapsed mid-route. No ID. Responders had no way to know about his penicillin allergy. The treatment nearly ended his life.',
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none"
           stroke="#4A7A50" strokeWidth="2.2" strokeLinecap="round"
           strokeLinejoin="round">
        <circle cx="12" cy="34" r="8"/>
        <circle cx="36" cy="34" r="8"/>
        <path d="M12,34 L22,16 L36,16"/>
        <path d="M22,16 L30,34"/>
        <path d="M18,16 L26,16"/>
        <path d="M34,10 L34,6 M32,8 L36,8"/>
      </svg>
    ),
  },
  {
    id: 2,
    tag: 'In every country',
    tagColor: '#DBEAFE',
    tagText: '#1E40AF',
    accentBg: '#EFF6FF',
    title: 'The tourist and the language barrier',
    body: "Anaphylactic reaction in Tokyo. Her allergy history was in English. The doctors were brilliant — but twenty minutes was lost to translation.",
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none"
           stroke="#4A7A50" strokeWidth="2.2" strokeLinecap="round"
           strokeLinejoin="round">
        <circle cx="24" cy="24" r="16"/>
        <path d="M24,8 C18,14 18,34 24,40"/>
        <path d="M24,8 C30,14 30,34 24,40"/>
        <path d="M8,24 C12,20 36,20 40,24"/>
        <path d="M8,24 C12,28 36,28 40,24"/>
        <path d="M30,12 L38,12 L38,20 L34,20 L30,24 L30,20 L30,12 Z"/>
        <path d="M33,15 L35,17 M35,15 L33,17"/>
      </svg>
    ),
  },
  {
    id: 3,
    tag: 'Closer than you think',
    tagColor: '#FEF3C7',
    tagText: '#92400E',
    accentBg: '#FFFBEB',
    title: 'The parent who forgot',
    body: "Dementia. He wandered from home. No medications list, no doctor's name remembered. The ER started from zero.",
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none"
           stroke="#4A7A50" strokeWidth="2.2" strokeLinecap="round"
           strokeLinejoin="round">
        <circle cx="24" cy="12" r="6"/>
        <path d="M24,18 L24,32"/>
        <path d="M14,24 L24,20 L34,24"/>
        <path d="M18,32 L24,32 L30,42"/>
        <path d="M24,32 L20,42"/>
        <path d="M30,42 L36,42 C36,42 38,42 38,40 L38,30"/>
        <path d="M40,14 C40,11 43,10 43,13 C43,15 41,15 41,17"/>
        <circle cx="41" cy="19" r="0.8" fill="#4A7A50"/>
      </svg>
    ),
  },
  {
    id: 4,
    tag: '1 in 4 emergencies involve a language barrier',
    tagColor: '#FCE7F3',
    tagText: '#9D174D',
    accentBg: '#FDF2F8',
    title: 'Abroad and unable to communicate',
    body: 'Severe chest pain in a foreign market. No shared language with locals. Twelve minutes passed before anyone understood what he needed.',
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none"
           stroke="#4A7A50" strokeWidth="2.2" strokeLinecap="round"
           strokeLinejoin="round">
        <path d="M24,38 C24,38 8,28 8,18 C8,12 13,8 18,8 C21,8 23,10 24,12 C25,10 27,8 30,8 C35,8 40,12 40,18 C40,28 24,38 24,38 Z"/>
        <path d="M13,20 L17,20 L19,14 L22,26 L25,18 L27,20 L35,20"/>
      </svg>
    ),
  },
  {
    id: 5,
    tag: '1 in 36 children is autistic globally',
    tagColor: '#EDE9FE',
    tagText: '#5B21B6',
    accentBg: '#F5F3FF',
    title: "The child who couldn't say his name",
    body: "Non-verbal and lost at a crowded festival. No name, no parents' contacts, no sensory needs communicated. Responders had nothing to go on.",
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none"
           stroke="#4A7A50" strokeWidth="2.2" strokeLinecap="round"
           strokeLinejoin="round">
        <circle cx="24" cy="11" r="5"/>
        <path d="M24,16 L24,28"/>
        <path d="M16,22 L24,19 L32,22"/>
        <path d="M19,28 L24,28 L29,38"/>
        <path d="M24,28 L21,38"/>
        <path d="M33,8 C33,6 35,5 37,5 C39,5 40,6 40,8 C40,10 39,11 37,11 C35,11 33,10 33,8 Z"/>
        <path d="M37,8 C37,6 39,5 41,5 C43,5 44,6 44,8 C44,10 43,11 41,11 C39,11 37,10 37,8 Z"/>
      </svg>
    ),
  },
  {
    id: 6,
    tag: 'When words come back — more is possible',
    tagColor: '#ECFDF5',
    tagText: '#065F46',
    accentBg: '#F0FDF4',
    title: 'He fainted. He recovered. He opened a session.',
    body: 'Regained consciousness surrounded by paramedics. He opened a timed session, handed them a code — and they accessed his full journal and history in seconds.',
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none"
           stroke="#4A7A50" strokeWidth="2.2" strokeLinecap="round"
           strokeLinejoin="round">
        <rect x="14" y="6" width="20" height="32" rx="4"/>
        <line x1="19" y1="14" x2="29" y2="14"/>
        <line x1="19" y1="19" x2="29" y2="19"/>
        <line x1="19" y1="24" x2="25" y2="24"/>
        <circle cx="19" cy="30" r="1.5" fill="#4A7A50"/>
        <circle cx="24" cy="30" r="1.5" fill="#4A7A50"/>
        <circle cx="29" cy="30" r="1.5" fill="#4A7A50"/>
        <path d="M36,16 L40,20 L46,12"/>
      </svg>
    ),
  },
]

function ProblemSection({ lang }: { lang: string }) {
  const scenarios = [
    { icon: <IconBicycle />,  titleKey: 's1title', bodyKey: 's1body', tagKey: 's1tag' },
    { icon: <IconAirplane />, titleKey: 's2title', bodyKey: 's2body', tagKey: 's2tag' },
    { icon: <IconElderly />,  titleKey: 's3title', bodyKey: 's3body', tagKey: 's3tag' },
    { icon: <IconGlobe />,    titleKey: 's4title', bodyKey: 's4body', tagKey: 's4tag' },
    { icon: <IconChild />,    titleKey: 's5title', bodyKey: 's5body', tagKey: 's5tag' },
    { icon: <IconSession />,  titleKey: 's6title', bodyKey: 's6body', tagKey: 's6tag' },
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

// ─── Section 4 — Data Privacy ────────────────────────────────────────────────

function DataPrivacySection({ lang }: { lang: string }) {
  const pillars = [
    {
      titleKey: 'privacy1_title',
      bodyKey: 'privacy1_body',
      icon: (
        <svg viewBox="0 0 40 40" width="24" height="24" fill="none" stroke="#4A7A50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12,10 L12,8 C12,5 16,3 20,3 C24,3 28,5 28,8 L28,10"/>
          <rect x="8" y="10" width="24" height="18" rx="4"/>
          <circle cx="20" cy="19" r="3"/>
          <path d="M20,22 L20,25"/>
        </svg>
      ),
    },
    {
      titleKey: 'privacy2_title',
      bodyKey: 'privacy2_body',
      icon: (
        <svg viewBox="0 0 40 40" width="24" height="24" fill="none" stroke="#4A7A50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12,12 L20,8 L28,12 L28,20 C28,26 20,30 20,30 C20,30 12,26 12,20 Z"/>
          <path d="M17,18 L19,20 L23,16"/>
        </svg>
      ),
    },
    {
      titleKey: 'privacy3_title',
      bodyKey: 'privacy3_body',
      icon: (
        <svg viewBox="0 0 40 40" width="24" height="24" fill="none" stroke="#4A7A50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20,6 L20,18"/>
          <path d="M15,9 L25,9"/>
          <path d="M20,18 L20,24"/>
          <path d="M16,24 L24,24"/>
          <circle cx="20" cy="28" r="4"/>
          <path d="M14,36 L26,36"/>
          <path d="M20,32 L20,36"/>
        </svg>
      ),
    },
    {
      titleKey: 'privacy4_title',
      bodyKey: 'privacy4_body',
      icon: (
        <svg viewBox="0 0 40 40" width="24" height="24" fill="none" stroke="#4A7A50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="20" cy="10" r="5"/>
          <path d="M12,30 C12,22 28,22 28,30"/>
          <circle cx="28" cy="20" r="4"/>
          <path d="M32,20 L38,20 M36,18 L38,20 L36,22"/>
        </svg>
      ),
    },
    {
      titleKey: 'privacy5_title',
      bodyKey: 'privacy5_body',
      icon: (
        <svg viewBox="0 0 40 40" width="24" height="24" fill="none" stroke="#4A7A50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10,6 L10,34 L30,34 L30,14 L22,6 Z"/>
          <path d="M22,6 L22,14 L30,14"/>
          <path d="M14,20 L18,24 L26,16"/>
        </svg>
      ),
    },
    {
      titleKey: 'privacy6_title',
      bodyKey: 'privacy6_body',
      icon: (
        <svg viewBox="0 0 40 40" width="24" height="24" fill="none" stroke="#4A7A50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8,20 C8,20 12,12 20,12 C28,12 32,20 32,20 C32,20 28,28 20,28 C12,28 8,20 8,20 Z"/>
          <circle cx="20" cy="20" r="4"/>
          <path d="M17,17 L17,15 C17,13 23,13 23,15 L23,17"/>
          <rect x="15" y="17" width="10" height="8" rx="2"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeIn}>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#7A9E7E]">
              {getText(lang, 'privacy_label')}
            </p>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mx-auto max-w-2xl font-[var(--font-manrope)] text-4xl font-bold leading-tight text-[#1C2B1E]"
          >
            {getText(lang, 'privacy_headline')}
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-600">
            {getText(lang, 'privacy_sub')}
          </motion.p>
        </motion.div>

        {/* Pillars grid */}
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.titleKey}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={vp}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-8"
              style={{
                background: '#FAFAF8',
                border: '1px solid rgba(74,122,80,0.08)',
              }}
            >
              <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#E8F2E6]">
                {pillar.icon}
              </div>
              <h3 className="mb-2 font-[var(--font-manrope)] text-base font-semibold text-[#1C2B1E]">
                {getText(lang, pillar.titleKey)}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {getText(lang, pillar.bodyKey)}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── Statistics section ───────────────────────────────────────────────────────

const STAT_ITEMS = [
  { number: '117M',   labelKey: 'stats1_label', sourceKey: 'stats1_source' },
  { number: '55M',    labelKey: 'stats2_label', sourceKey: 'stats2_source' },
  { number: '1 in 36', labelKey: 'stats3_label', sourceKey: 'stats3_source' },
  { number: '1.35B',  labelKey: 'stats4_label', sourceKey: 'stats4_source' },
  { number: '67%',    labelKey: 'stats5_label', sourceKey: 'stats5_source' },
  { number: '136M',   labelKey: 'stats6_label', sourceKey: 'stats6_source' },
]

function StatisticsSection({ lang }: { lang: string }) {
  return (
    <section className="bg-[#F0F2EE] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeIn}>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#7A9E7E]">
              {getText(lang, 'stats_label')}
            </p>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mx-auto max-w-2xl font-[var(--font-manrope)] text-4xl font-bold leading-tight text-[#1C2B1E]"
          >
            {getText(lang, 'stats_headline')}
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-600">
            {getText(lang, 'stats_sub')}
          </motion.p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STAT_ITEMS.map((stat, i) => (
            <motion.div
              key={stat.number + i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={vp}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white p-8"
              style={{ boxShadow: '0 2px 16px 0 rgba(28,43,30,0.06)' }}
            >
              <p className="mb-2 font-[var(--font-manrope)] text-5xl font-black leading-none text-[#4A7A50]">
                {stat.number}
              </p>
              <p className="mb-3 text-base font-semibold leading-snug text-[#1C2B1E]">
                {getText(lang, stat.labelKey)}
              </p>
              <p className="text-xs italic text-gray-400">{getText(lang, stat.sourceKey)}</p>
            </motion.div>
          ))}
        </div>

        {/* Closing card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          className="mx-auto mt-12 max-w-3xl rounded-2xl p-10"
          style={{ background: '#1C2B1E' }}
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <p className="max-w-xs font-[var(--font-manrope)] text-2xl font-bold leading-tight text-white">
              {getText(lang, 'stats_closing_headline')}
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-gray-400">
              {getText(lang, 'stats_closing_body')}
            </p>
          </div>
          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-center text-xs italic text-gray-600">
              {getText(lang, 'stats_citation')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Appointment Mode section ─────────────────────────────────────────────────

function AppointmentModeSection({ lang }: { lang: string }) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-center">
          {/* Left column — text */}
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="max-w-lg"
          >
            <motion.div variants={fadeIn}>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#7A9E7E]">
                {getText(lang, 'appt_label')}
              </p>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-[var(--font-manrope)] text-4xl font-bold leading-tight text-[#1C2B1E]"
            >
              {getText(lang, 'appt_headline')}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-gray-600">
              {getText(lang, 'appt_body')}
            </motion.p>

            {/* Feature rows */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-5">
              {[
                {
                  titleKey: 'appt_f1_title',
                  bodyKey: 'appt_f1_body',
                  icon: (
                    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#4A7A50" strokeWidth="2" strokeLinecap="round">
                      <circle cx="10" cy="10" r="8"/>
                      <path d="M10,5 L10,10 L14,13"/>
                    </svg>
                  ),
                },
                {
                  titleKey: 'appt_f2_title',
                  bodyKey: 'appt_f2_body',
                  icon: (
                    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#4A7A50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="7" cy="10" r="4"/>
                      <path d="M11,10 L18,10 M16,8 L18,10 L16,12"/>
                    </svg>
                  ),
                },
                {
                  titleKey: 'appt_f3_title',
                  bodyKey: 'appt_f3_body',
                  icon: (
                    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#4A7A50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3,4 C3,3 4,2 5,2 L15,2 C16,2 17,3 17,4 L17,12 C17,13 16,14 15,14 L8,14 L4,18 L4,14 L5,14 C4,14 3,13 3,12 Z"/>
                      <line x1="6" y1="6" x2="14" y2="6"/>
                      <line x1="6" y1="9" x2="11" y2="9"/>
                    </svg>
                  ),
                },
              ].map((feat) => (
                <div key={feat.titleKey} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F2E6]">
                    {feat.icon}
                  </div>
                  <div>
                    <p className="font-[var(--font-manrope)] text-sm font-semibold text-[#1C2B1E]">
                      {getText(lang, feat.titleKey)}
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
                      {getText(lang, feat.bodyKey)}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Premium badge */}
            <motion.div variants={fadeUp} className="mt-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F2E6] px-4 py-2 text-sm font-medium text-[#4A7A50]">
                <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="#4A7A50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="10" height="8" rx="2"/>
                  <path d="M4,6 L4,4 C4,2 10,2 10,4 L10,6"/>
                </svg>
                {getText(lang, 'appt_badge')}
              </span>
            </motion.div>
          </motion.div>

          {/* Right column — phone mockup */}
          <motion.div
            variants={scaleUp}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            className="flex justify-center"
          >
            <div
              className="w-full max-w-xs rounded-3xl p-5 shadow-xl"
              style={{
                background: '#F4F6F2',
                animation: 'arkoura-float 4s ease-in-out infinite',
              }}
            >
              {/* Status row */}
              <div className="mb-4 flex items-center justify-between">
                <span className="font-[var(--font-manrope)] text-sm font-semibold text-[#1C2B1E]">Arkoura</span>
                <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-xs font-semibold text-[#065F46]">
                  {getText(lang, 'appt_session_active')}
                </span>
              </div>

              {/* Session card */}
              <div className="mb-3 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1C2B1E]">
                    {getText(lang, 'appt_session_title')}
                  </span>
                  <span className="font-[var(--font-manrope)] text-sm font-bold text-[#4A7A50]">14:32</span>
                </div>
                <div className="mt-3">
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    {getText(lang, 'appt_code_label')}
                  </p>
                  <p className="mt-1 font-[var(--font-manrope)] text-3xl font-black tracking-widest text-[#1C2B1E]">
                    7 4 2 9
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {getText(lang, 'appt_code_hint')}
                  </p>
                </div>
              </div>

              {/* Chat bubbles */}
              <div
                className="rounded-2xl rounded-tl-sm p-3 mb-2"
                style={{ background: '#F4F6F2' }}
              >
                <p className="text-xs text-[#374151]">
                  {getText(lang, 'appt_chat_ai')}
                </p>
              </div>
              <div className="ml-6 rounded-2xl rounded-tr-sm bg-[#4A7A50] p-3">
                <p className="text-xs text-white">
                  {getText(lang, 'appt_chat_helper')}
                </p>
              </div>

              {/* End session button */}
              <button className="mt-4 w-full cursor-pointer rounded-xl border border-red-200 py-2 text-center text-xs font-medium text-red-400">
                {getText(lang, 'appt_end_session')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Section 5 — Zero Friction (dark) ────────────────────────────────────────

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
            {getText(lang, 'footer_copy')}
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [currentLang, setCurrentLang] = useState('en')
  const [authOpen, setAuthOpen] = useState(false)
  const [authView, setAuthView] = useState<'login' | 'register'>('register')

  function openRegister() {
    setAuthView('register')
    setAuthOpen(true)
  }

  return (
    <div className="bg-[#FAFAF8]" dir={currentLang === 'AR' ? 'rtl' : undefined}>
      <Nav lang={currentLang} setLang={setCurrentLang} onGetStarted={openRegister} />
      <HeroSection lang={currentLang} onGetStarted={openRegister} />
      <ProblemSection lang={currentLang} />
      <HowItWorksSection lang={currentLang} />
      <DataPrivacySection lang={currentLang} />
      <StatisticsSection lang={currentLang} />
      <AppointmentModeSection lang={currentLang} />
      <ZeroFrictionSection lang={currentLang} />
      <DifferentiatorsSection lang={currentLang} />
      <TrustSection lang={currentLang} />
      <Footer lang={currentLang} />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultView={authView} />
    </div>
  )
}

/*
TRANSLATION INVENTORY — UNTRANSLATED STRINGS
=============================================

Section: SCENARIOS array (ProblemSection alternating layout)
NOTE: All 6 scenario entries use hardcoded English. The TRANSLATIONS object has
s1tag/s1title/s1body through s3tag/s3title/s3body (scenarios 1–3 only). Scenarios
4–6 have no translation keys at all. The SCENARIOS array is not currently wired to
getText() — titles, bodies, and tags are rendered directly.

Line 1619: "Happens every day"
  Suggested key: s1tag  (key exists in TRANSLATIONS but not used by SCENARIOS)

Line 1623: "The cyclist who couldn't speak"
  Suggested key: s1title  (key exists in TRANSLATIONS but not used by SCENARIOS)

Line 1624: "Collapsed mid-route. No ID. Responders had no way to know about his penicillin allergy. The treatment nearly ended his life."
  Suggested key: s1body  (key exists in TRANSLATIONS but not used by SCENARIOS)

Line 1640: "In every country"
  Suggested key: s2tag  (key exists in TRANSLATIONS but not used by SCENARIOS)

Line 1644: "The tourist and the language barrier"
  Suggested key: s2title  (key exists in TRANSLATIONS but not used by SCENARIOS)

Line 1645: "Anaphylactic reaction in Tokyo. Her allergy history was in English. The doctors were brilliant — but twenty minutes was lost to translation."
  Suggested key: s2body  (key exists in TRANSLATIONS but not used by SCENARIOS)

Line 1662: "Closer than you think"
  Suggested key: s3tag  (key exists in TRANSLATIONS but not used by SCENARIOS)

Line 1666: "The parent who forgot"
  Suggested key: s3title  (key exists in TRANSLATIONS but not used by SCENARIOS)

Line 1667: "Dementia. He wandered from home. No medications list, no doctor's name remembered. The ER started from zero."
  Suggested key: s3body  (key exists in TRANSLATIONS but not used by SCENARIOS)

Line 1685: "1 in 4 emergencies involve a language barrier"
  Suggested key: s4tag  (no translation key exists — needs new key + all 10 languages)

Line 1689: "Abroad and unable to communicate"
  Suggested key: s4title  (no translation key exists)

Line 1690: "Severe chest pain in a foreign market. No shared language with locals. Twelve minutes passed before anyone understood what he needed."
  Suggested key: s4body  (no translation key exists)

Line 1702: "1 in 36 children is autistic globally"
  Suggested key: s5tag  (no translation key exists)

Line 1706: "The child who couldn't say his name"
  Suggested key: s5title  (no translation key exists)

Line 1707: "Non-verbal and lost at a crowded festival. No name, no parents' contacts, no sensory needs communicated. Responders had nothing to go on."
  Suggested key: s5body  (no translation key exists)

Line 1724: "When words come back — more is possible"
  Suggested key: s6tag  (no translation key exists)

Line 1728: "He fainted. He recovered. He opened a session."
  Suggested key: s6title  (no translation key exists)

Line 1729: "Regained consciousness surrounded by paramedics. He opened a timed session, handed them a code — and they accessed his full journal and history in seconds."
  Suggested key: s6body  (no translation key exists)

Section: ProblemSection

Line ~1878: "These are not edge cases. They happen every single day."
  Suggested key: problem_closing
  Section: ProblemSection closing line

Section: EmergencyCard (hero right column — UI demo mockup with persona data)

Line ~1507: "San Francisco, CA"
  Suggested key: hero_card_location  (mock location label — may be intentionally static)
  Section: EmergencyCard

Line ~1517: "TYPE 1 DIABETES"
  Suggested key: hero_card_chip2  (mock condition chip — may be intentionally static)
  Section: EmergencyCard

Line ~1542: "This is an emergency"
  Suggested key: hero_card_emergency_btn
  Section: EmergencyCard

Section: TrustSection

Line 2479: "Firebase + GCP"
  Suggested key: trust_badge1  (technical brand name — may be intentionally untranslated)
  Section: TRUST_BADGES array

Line 2479: "SOC 2 Infrastructure"
  Suggested key: trust_badge4  (technical certification — may be intentionally untranslated)
  Section: TRUST_BADGES array

TOTAL UNTRANSLATED: 23

ACTION REQUIRED: The SCENARIOS array tag/title/body fields need to be refactored to
use getText() calls (passing lang down from ProblemSection). Keys s1–s3 already exist
in TRANSLATIONS and just need to be wired. Keys s4–s6 need new entries in all 10
language objects. The EmergencyCard and TRUST_BADGES items are UI demo/brand content
and can be deferred or kept as static English.
*/
