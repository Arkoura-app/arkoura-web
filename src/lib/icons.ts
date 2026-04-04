export interface ArkouraIcon {
  src: string
  alt: string
  emoji: string   // fallback if PNG missing
}

export const ICONS = {
  // Navigation
  dashboard:      { src: "/icons/icon-dashboard.png",      alt: "Dashboard",          emoji: "🏠" },
  emergencyData:  { src: "/icons/icon-emergency-data.png", alt: "Emergency Data",     emoji: "🚨" },
  journal:        { src: "/icons/icon-journal.png",        alt: "Journal",            emoji: "📔" },
  qrCode:         { src: "/icons/icon-qr-code.png",        alt: "QR Code",           emoji: "📱" },
  settings:       { src: "/icons/icon-settings.png",       alt: "Settings",           emoji: "⚙️" },
  activity:       { src: "/icons/icon-activity.png",       alt: "Activity",           emoji: "📊" },
  // Actions
  edit:           { src: "/icons/icon-edit.png",           alt: "Edit",               emoji: "✏️" },
  delete:         { src: "/icons/icon-delete.png",         alt: "Delete",             emoji: "🗑️" },
  add:            { src: "/icons/icon-add.png",            alt: "Add",                emoji: "➕" },
  search:         { src: "/icons/icon-search.png",         alt: "Search",             emoji: "🔍" },
  copy:           { src: "/icons/icon-copy.png",           alt: "Copy",               emoji: "📋" },
  download:       { src: "/icons/icon-download.png",       alt: "Download",           emoji: "⬇️" },
  share:          { src: "/icons/icon-share.png",          alt: "Share",              emoji: "🔗" },
  back:           { src: "/icons/icon-back.png",           alt: "Back",               emoji: "↩️" },
  refresh:        { src: "/icons/icon-refresh.png",        alt: "Refresh",            emoji: "🔄" },
  checkmark:      { src: "/icons/icon-checkmark.png",      alt: "Done",               emoji: "✅" },
  close:          { src: "/icons/icon-close.png",          alt: "Close",              emoji: "✕" },
  next:           { src: "/icons/icon-next.png",           alt: "Next",               emoji: "➡️" },
  // Profile
  profilePhoto:   { src: "/icons/icon-profile-photo.png",  alt: "Profile Photo",      emoji: "👤" },
  phone:          { src: "/icons/icon-phone.png",          alt: "Phone",              emoji: "📞" },
  verified:       { src: "/icons/icon-verified.png",       alt: "Verified",           emoji: "✅" },
  warning:        { src: "/icons/icon-warning.png",        alt: "Warning",            emoji: "⚠️" },
  whatsapp:       { src: "/icons/icon-whatsapp.png",       alt: "WhatsApp",           emoji: "💬" },
  sms:            { src: "/icons/icon-sms.png",            alt: "SMS",                emoji: "📱" },
  // Emergency Data tabs
  conditions:     { src: "/icons/icon-conditions.png",     alt: "Conditions",         emoji: "🩺" },
  allergies:      { src: "/icons/icon-allergies.png",      alt: "Allergies",          emoji: "🌿" },
  medications:    { src: "/icons/icon-medications.png",    alt: "Medications",        emoji: "💊" },
  contacts:       { src: "/icons/icon-contacts.png",       alt: "Contacts",           emoji: "📞" },
  physician:      { src: "/icons/icon-physician.png",      alt: "Physician",          emoji: "👨‍⚕️" },
  customCondition:{ src: "/icons/icon-custom-condition.png",alt: "Custom Condition",  emoji: "📝" },
  // Emergency profile actions
  emergency:      { src: "/icons/icon-emergency-button.png",   alt: "Emergency",      emoji: "🚨" },
  appointment:    { src: "/icons/icon-appointment-button.png", alt: "Appointment",    emoji: "📅" },
  location:       { src: "/icons/icon-location-share.png",     alt: "Share Location", emoji: "📍" },
  call:           { src: "/icons/icon-call.png",               alt: "Call",           emoji: "📞" },
  whatsappContact:{ src: "/icons/icon-whatsapp-contact.png",   alt: "WhatsApp",       emoji: "💬" },
  emailContact:   { src: "/icons/icon-email-contact.png",      alt: "Email",          emoji: "✉️" },
  private:        { src: "/icons/icon-private.png",            alt: "Private",        emoji: "🔒" },
  emergencyBadge: { src: "/icons/icon-emergency-profile-badge.png", alt: "Emergency Profile", emoji: "🏥" },
  appointmentUnavailable: { src: "/icons/icon-appointment-unavailable.png", alt: "Unavailable", emoji: "📵" },
  // OTP
  otpPublic:      { src: "/icons/icon-otp-public.png",     alt: "Your Code",          emoji: "🔑" },
  otpPrivate:     { src: "/icons/icon-otp-private.png",    alt: "Private Code",       emoji: "🔐" },
  // QR tips
  phoneCase:      { src: "/icons/icon-phone-case.png",     alt: "Phone Case",         emoji: "📲" },
  bracelet:       { src: "/icons/icon-bracelet.png",       alt: "Bracelet",           emoji: "🏷️" },
  familyShare:    { src: "/icons/icon-family-share.png",   alt: "Share with Family",  emoji: "👨‍👩‍👧" },
  helmet:         { src: "/icons/icon-helmet.png",         alt: "Helmet",             emoji: "🚲" },
  regenerate:     { src: "/icons/icon-regenerate.png",     alt: "Regenerate",         emoji: "🔄" },
  // Onboarding
  welcome:        { src: "/icons/icon-welcome.png",        alt: "Welcome",            emoji: "👋" },
  protect:        { src: "/icons/icon-protect.png",        alt: "Protect",            emoji: "🛡️" },
  family:         { src: "/icons/icon-family.png",         alt: "Family",             emoji: "👥" },
  // Landing page features
  scanQr:         { src: "/icons/icon-scan-qr.png",        alt: "Scan QR",            emoji: "📱" },
  multilingual:   { src: "/icons/icon-multilingual.png",   alt: "Multilingual",       emoji: "🌍" },
  aiJournal:      { src: "/icons/icon-ai-journal.png",     alt: "AI Journal",         emoji: "🤖" },
  familyAccounts: { src: "/icons/icon-family-accounts.png",alt: "Family Accounts",    emoji: "👨‍👩‍👧‍👦" },
  documentUpload: { src: "/icons/icon-document-upload.png",alt: "Document Upload",    emoji: "📄" },
  notification:   { src: "/icons/icon-notification.png",   alt: "Notification",       emoji: "🔔" },
  // Severity
  critical:       { src: "/icons/icon-critical.png",       alt: "Critical",           emoji: "⚠️" },
  sevLifeThreat:  { src: "/icons/icon-severity-lifethreatening.png", alt: "Life-threatening", emoji: "🔴" },
  sevSevere:      { src: "/icons/icon-severity-severe.png",    alt: "Severe",          emoji: "🟠" },
  sevModerate:    { src: "/icons/icon-severity-moderate.png",  alt: "Moderate",        emoji: "🟡" },
  sevMild:        { src: "/icons/icon-severity-mild.png",      alt: "Mild",            emoji: "⚪" },
  // Health quick-glance
  healthCardiac:          { src: "/icons/icon-health-cardiac.png",           alt: "Cardiac",            emoji: "❤️" },
  healthNeurological:     { src: "/icons/icon-health-neurological.png",      alt: "Neurological",       emoji: "🧠" },
  healthDiabetes:         { src: "/icons/icon-health-diabetes.png",          alt: "Diabetes",           emoji: "🩸" },
  healthAllergy:          { src: "/icons/icon-health-allergy.png",           alt: "Allergy",            emoji: "🌿" },
  healthRespiratory:      { src: "/icons/icon-health-respiratory.png",       alt: "Respiratory",        emoji: "🫁" },
  healthBlood:            { src: "/icons/icon-health-blood.png",             alt: "Blood Disorder",     emoji: "💉" },
  healthNeurodevelopmental:{ src: "/icons/icon-health-neurodevelopmental.png",alt: "Neurodevelopmental",emoji: "🧩" },
  healthPregnancy:        { src: "/icons/icon-health-pregnancy.png",         alt: "Pregnancy",          emoji: "🤰" },
  healthDevice:           { src: "/icons/icon-health-device.png",            alt: "Medical Device",     emoji: "🔧" },
  healthDirective:        { src: "/icons/icon-health-directive.png",         alt: "Legal Directive",    emoji: "📋" },
  healthMedication:       { src: "/icons/icon-health-medication.png",        alt: "Critical Medication",emoji: "💊" },
  healthMobility:         { src: "/icons/icon-health-mobility.png",          alt: "Mobility",           emoji: "♿" },
  // Compliance
  gdpr:           { src: "/icons/icon-gdpr.png",           alt: "GDPR",               emoji: "🏛️" },
  pii:            { src: "/icons/icon-pii.png",            alt: "PII Protection",     emoji: "🔒" },
  hipaa:          { src: "/icons/icon-hipaa.png",          alt: "HIPAA",              emoji: "🏥" },
  ccpa:           { src: "/icons/icon-ccpa.png",           alt: "CCPA",               emoji: "🌴" },
  security:       { src: "/icons/icon-security.png",       alt: "Security",           emoji: "🛡️" },
  terms:          { src: "/icons/icon-terms.png",          alt: "Terms",              emoji: "📄" },
} satisfies Record<string, ArkouraIcon>

export type IconName = keyof typeof ICONS
