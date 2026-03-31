export type Lang =
  'en' | 'es' | 'fr' | 'de' | 'pt' |
  'zh' | 'ja' | 'it' | 'ru' | 'sv'

export const SUPPORTED_LANGS: Lang[] = [
  'en', 'es', 'fr', 'de', 'pt',
  'zh', 'ja', 'it', 'ru', 'sv'
]

export const LANG_NAMES: Record<Lang, string> = {
  en: 'English', es: 'Español', fr: 'Français',
  de: 'Deutsch', pt: 'Português', zh: '中文',
  ja: '日本語', it: 'Italiano', ru: 'Русский', sv: 'Svenska',
}

type TranslationMap = Record<string, Record<Lang, string>>

const translations: TranslationMap = {

  // ─── Auth ───────────────────────────────────
  'auth.signIn': {
    en: 'Sign in', es: 'Iniciar sesión',
    fr: 'Se connecter', de: 'Anmelden',
    pt: 'Entrar', zh: '登录', ja: 'ログイン',
    it: 'Accedi', ru: 'Войти', sv: 'Logga in',
  },
  'auth.createAccount': {
    en: 'Create account', es: 'Crear cuenta',
    fr: 'Créer un compte', de: 'Konto erstellen',
    pt: 'Criar conta', zh: '创建账户', ja: 'アカウント作成',
    it: 'Crea account', ru: 'Создать аккаунт', sv: 'Skapa konto',
  },
  'auth.email': {
    en: 'Email', es: 'Correo electrónico',
    fr: 'E-mail', de: 'E-Mail',
    pt: 'E-mail', zh: '邮箱', ja: 'メール',
    it: 'E-mail', ru: 'Электронная почта', sv: 'E-post',
  },
  'auth.password': {
    en: 'Password', es: 'Contraseña',
    fr: 'Mot de passe', de: 'Passwort',
    pt: 'Senha', zh: '密码', ja: 'パスワード',
    it: 'Password', ru: 'Пароль', sv: 'Lösenord',
  },
  'auth.fullName': {
    en: 'Full name', es: 'Nombre completo',
    fr: 'Nom complet', de: 'Vollständiger Name',
    pt: 'Nome completo', zh: '全名', ja: 'フルネーム',
    it: 'Nome completo', ru: 'Полное имя', sv: 'Fullständigt namn',
  },
  'auth.forgotPassword': {
    en: 'Forgot password?', es: '¿Olvidó su contraseña?',
    fr: 'Mot de passe oublié ?', de: 'Passwort vergessen?',
    pt: 'Esqueceu a senha?', zh: '忘记密码？', ja: 'パスワードを忘れた方',
    it: 'Password dimenticata?', ru: 'Забыли пароль?', sv: 'Glömt lösenord?',
  },
  'auth.resetPassword': {
    en: 'Reset password', es: 'Restablecer contraseña',
    fr: 'Réinitialiser le mot de passe', de: 'Passwort zurücksetzen',
    pt: 'Redefinir senha', zh: '重置密码', ja: 'パスワードをリセット',
    it: 'Reimposta password', ru: 'Сбросить пароль', sv: 'Återställ lösenord',
  },
  'auth.sendResetLink': {
    en: 'Send reset link', es: 'Enviar enlace',
    fr: 'Envoyer le lien', de: 'Link senden',
    pt: 'Enviar link', zh: '发送重置链接', ja: 'リセットリンクを送る',
    it: 'Invia link', ru: 'Отправить ссылку', sv: 'Skicka länk',
  },
  'auth.continueWithGoogle': {
    en: 'Continue with Google', es: 'Continuar con Google',
    fr: 'Continuer avec Google', de: 'Mit Google fortfahren',
    pt: 'Continuar com Google', zh: '使用 Google 继续', ja: 'Googleで続ける',
    it: 'Continua con Google', ru: 'Продолжить с Google', sv: 'Fortsätt med Google',
  },
  'auth.alreadyHaveAccount': {
    en: 'Already have an account?', es: '¿Ya tiene una cuenta?',
    fr: 'Vous avez déjà un compte ?', de: 'Haben Sie schon ein Konto?',
    pt: 'Já tem uma conta?', zh: '已有账户？', ja: 'すでにアカウントをお持ちですか？',
    it: 'Hai già un account?', ru: 'Уже есть аккаунт?', sv: 'Har du redan ett konto?',
  },
  'auth.noAccount': {
    en: "Don't have an account?", es: '¿No tiene una cuenta?',
    fr: "Vous n'avez pas de compte ?", de: 'Noch kein Konto?',
    pt: 'Não tem uma conta?', zh: '没有账户？', ja: 'アカウントをお持ちでない方',
    it: 'Non hai un account?', ru: 'Нет аккаунта?', sv: 'Har du inget konto?',
  },
  'auth.verifyEmail': {
    en: 'Verify your email', es: 'Verifique su correo',
    fr: 'Vérifiez votre e-mail', de: 'E-Mail bestätigen',
    pt: 'Verifique seu e-mail', zh: '验证您的邮箱', ja: 'メールを確認してください',
    it: 'Verifica la tua email', ru: 'Подтвердите email', sv: 'Verifiera din e-post',
  },
  'auth.resendVerification': {
    en: 'Resend verification email', es: 'Reenviar correo de verificación',
    fr: "Renvoyer l'e-mail de vérification", de: 'Bestätigungs-E-Mail erneut senden',
    pt: 'Reenviar e-mail de verificação', zh: '重新发送验证邮件', ja: '確認メールを再送',
    it: "Invia di nuovo l'email di verifica", ru: 'Отправить письмо повторно', sv: 'Skicka om verifieringsmail',
  },

  // ─── Navigation ─────────────────────────────
  'nav.profile': {
    en: 'Profile', es: 'Perfil',
    fr: 'Profil', de: 'Profil',
    pt: 'Perfil', zh: '个人资料', ja: 'プロフィール',
    it: 'Profilo', ru: 'Профиль', sv: 'Profil',
  },
  'nav.emergencyData': {
    en: 'Emergency Data', es: 'Datos de Emergencia',
    fr: "Données d'urgence", de: 'Notfalldaten',
    pt: 'Dados de Emergência', zh: '紧急数据', ja: '緊急データ',
    it: 'Dati di Emergenza', ru: 'Экстренные данные', sv: 'Nöddata',
  },
  'nav.myQr': {
    en: 'My QR Code', es: 'Mi Código QR',
    fr: 'Mon code QR', de: 'Mein QR-Code',
    pt: 'Meu Código QR', zh: '我的二维码', ja: '私のQRコード',
    it: 'Il mio QR', ru: 'Мой QR-код', sv: 'Min QR-kod',
  },
  'nav.journal': {
    en: 'Journal', es: 'Diario',
    fr: 'Journal', de: 'Tagebuch',
    pt: 'Diário', zh: '日志', ja: 'ジャーナル',
    it: 'Diario', ru: 'Журнал', sv: 'Dagbok',
  },
  'nav.activity': {
    en: 'Activity Log', es: 'Registro de Actividad',
    fr: "Journal d'activité", de: 'Aktivitätsprotokoll',
    pt: 'Registro de Atividade', zh: '活动记录', ja: 'アクティビティログ',
    it: 'Registro attività', ru: 'Журнал активности', sv: 'Aktivitetslogg',
  },
  'nav.settings': {
    en: 'Settings', es: 'Configuración',
    fr: 'Paramètres', de: 'Einstellungen',
    pt: 'Configurações', zh: '设置', ja: '設定',
    it: 'Impostazioni', ru: 'Настройки', sv: 'Inställningar',
  },
  'nav.signOut': {
    en: 'Sign out', es: 'Cerrar sesión',
    fr: 'Se déconnecter', de: 'Abmelden',
    pt: 'Sair', zh: '退出登录', ja: 'ログアウト',
    it: 'Esci', ru: 'Выйти', sv: 'Logga ut',
  },

  // ─── Dashboard / Profile ─────────────────────
  'profile.title': {
    en: 'My Profile', es: 'Mi Perfil',
    fr: 'Mon profil', de: 'Mein Profil',
    pt: 'Meu Perfil', zh: '我的资料', ja: '私のプロフィール',
    it: 'Il mio profilo', ru: 'Мой профиль', sv: 'Min profil',
  },
  'profile.complete': {
    en: 'Profile complete ✓', es: 'Perfil completo ✓',
    fr: 'Profil complet ✓', de: 'Profil vollständig ✓',
    pt: 'Perfil completo ✓', zh: '资料完整 ✓', ja: 'プロフィール完成 ✓',
    it: 'Profilo completo ✓', ru: 'Профиль заполнен ✓', sv: 'Profil komplett ✓',
  },
  'profile.addContact': {
    en: 'Add an emergency contact to activate your profile',
    es: 'Agregue un contacto de emergencia para activar su perfil',
    fr: "Ajoutez un contact d'urgence pour activer votre profil",
    de: 'Fügen Sie einen Notfallkontakt hinzu, um Ihr Profil zu aktivieren',
    pt: 'Adicione um contato de emergência para ativar seu perfil',
    zh: '添加紧急联系人以激活您的个人资料',
    ja: '緊急連絡先を追加してプロフィールを有効化してください',
    it: 'Aggiungi un contatto di emergenza per attivare il tuo profilo',
    ru: 'Добавьте экстренный контакт для активации профиля',
    sv: 'Lägg till en nödkontakt för att aktivera din profil',
  },
  'profile.addMoreInfo': {
    en: 'Add more info to improve your profile',
    es: 'Agregue más información para mejorar su perfil',
    fr: "Ajoutez plus d'informations pour améliorer votre profil",
    de: 'Fügen Sie weitere Informationen hinzu, um Ihr Profil zu verbessern',
    pt: 'Adicione mais informações para melhorar seu perfil',
    zh: '添加更多信息以完善您的资料',
    ja: 'プロフィールを改善するために情報を追加してください',
    it: 'Aggiungi più informazioni per migliorare il tuo profilo',
    ru: 'Добавьте больше информации для улучшения профиля',
    sv: 'Lägg till mer information för att förbättra din profil',
  },
  'profile.firstName': {
    en: 'First name', es: 'Nombre',
    fr: 'Prénom', de: 'Vorname',
    pt: 'Nome', zh: '名字', ja: '名',
    it: 'Nome', ru: 'Имя', sv: 'Förnamn',
  },
  'profile.lastName': {
    en: 'Last name', es: 'Apellido',
    fr: 'Nom de famille', de: 'Nachname',
    pt: 'Sobrenome', zh: '姓氏', ja: '姓',
    it: 'Cognome', ru: 'Фамилия', sv: 'Efternamn',
  },
  'profile.preferredName': {
    en: 'Preferred name', es: 'Nombre preferido',
    fr: 'Nom préféré', de: 'Bevorzugter Name',
    pt: 'Nome preferido', zh: '常用名', ja: '呼び名',
    it: 'Nome preferito', ru: 'Предпочтительное имя', sv: 'Föredraget namn',
  },
  'profile.dateOfBirth': {
    en: 'Date of birth', es: 'Fecha de nacimiento',
    fr: 'Date de naissance', de: 'Geburtsdatum',
    pt: 'Data de nascimento', zh: '出生日期', ja: '生年月日',
    it: 'Data di nascita', ru: 'Дата рождения', sv: 'Födelsedatum',
  },
  'profile.biologicalSex': {
    en: 'Biological sex', es: 'Sexo biológico',
    fr: 'Sexe biologique', de: 'Biologisches Geschlecht',
    pt: 'Sexo biológico', zh: '生理性别', ja: '生物学的性別',
    it: 'Sesso biologico', ru: 'Биологический пол', sv: 'Biologiskt kön',
  },
  'profile.bloodType': {
    en: 'Blood type', es: 'Tipo de sangre',
    fr: 'Groupe sanguin', de: 'Blutgruppe',
    pt: 'Tipo sanguíneo', zh: '血型', ja: '血液型',
    it: 'Gruppo sanguigno', ru: 'Группа крови', sv: 'Blodgrupp',
  },
  'profile.primaryLanguage': {
    en: 'Primary language', es: 'Idioma principal',
    fr: 'Langue principale', de: 'Hauptsprache',
    pt: 'Idioma principal', zh: '主要语言', ja: '主要言語',
    it: 'Lingua principale', ru: 'Основной язык', sv: 'Huvudspråk',
  },
  'profile.organDonor': {
    en: 'Organ donor', es: 'Donante de órganos',
    fr: "Donneur d'organes", de: 'Organspender',
    pt: 'Doador de órgãos', zh: '器官捐献者', ja: '臓器提供者',
    it: 'Donatore di organi', ru: 'Донор органов', sv: 'Organdonator',
  },
  'profile.saveChanges': {
    en: 'Save changes', es: 'Guardar cambios',
    fr: 'Enregistrer', de: 'Speichern',
    pt: 'Salvar alterações', zh: '保存更改', ja: '変更を保存',
    it: 'Salva modifiche', ru: 'Сохранить изменения', sv: 'Spara ändringar',
  },
  'profile.saved': {
    en: 'Profile updated ✓', es: 'Perfil actualizado ✓',
    fr: 'Profil mis à jour ✓', de: 'Profil aktualisiert ✓',
    pt: 'Perfil atualizado ✓', zh: '资料已更新 ✓', ja: 'プロフィール更新済み ✓',
    it: 'Profilo aggiornato ✓', ru: 'Профиль обновлён ✓', sv: 'Profil uppdaterad ✓',
  },
  'profile.quickGlance': {
    en: 'Quick-Glance Health Icons',
    es: 'Íconos de Salud de Un Vistazo',
    fr: 'Icônes de santé rapides',
    de: 'Gesundheits-Schnellübersicht',
    pt: 'Ícones de saúde rápidos',
    zh: '快速健康图标',
    ja: 'クイック健康アイコン',
    it: 'Icone salute rapide',
    ru: 'Иконки здоровья',
    sv: 'Snabbhälsoikoner',
  },
  'profile.quickGlanceSubtitle': {
    en: 'Select up to 5 icons that appear on your emergency profile',
    es: 'Seleccione hasta 5 íconos que aparecerán en su perfil de emergencia',
    fr: "Sélectionnez jusqu'à 5 icônes qui apparaîtront sur votre profil d'urgence",
    de: 'Wählen Sie bis zu 5 Symbole für Ihr Notfallprofil',
    pt: 'Selecione até 5 ícones que aparecerão no seu perfil de emergência',
    zh: '选择最多5个图标显示在您的紧急资料上',
    ja: '緊急プロフィールに表示するアイコンを5つまで選択',
    it: 'Seleziona fino a 5 icone per il tuo profilo di emergenza',
    ru: 'Выберите до 5 иконок для вашего профиля экстренной помощи',
    sv: 'Välj upp till 5 ikoner för din nödprofil',
  },

  // ─── Emergency Data ──────────────────────────
  'emergency.title': {
    en: 'Emergency Data', es: 'Datos de Emergencia',
    fr: "Données d'urgence", de: 'Notfalldaten',
    pt: 'Dados de Emergência', zh: '紧急数据', ja: '緊急データ',
    it: 'Dati di Emergenza', ru: 'Экстренные данные', sv: 'Nöddata',
  },
  'emergency.subtitle': {
    en: 'Shown on your emergency profile when someone scans your QR code',
    es: 'Se muestra en su perfil de emergencia cuando alguien escanea su código QR',
    fr: "Affiché sur votre profil d'urgence quand quelqu'un scanne votre QR",
    de: 'Wird auf Ihrem Notfallprofil angezeigt, wenn jemand Ihren QR-Code scannt',
    pt: 'Exibido no seu perfil de emergência quando alguém escaneia seu código QR',
    zh: '当有人扫描您的二维码时显示在您的紧急资料上',
    ja: '誰かがQRコードをスキャンしたときに緊急プロフィールに表示されます',
    it: 'Mostrato nel tuo profilo di emergenza quando qualcuno scansiona il tuo QR',
    ru: 'Отображается в вашем профиле экстренной помощи при сканировании QR',
    sv: 'Visas på din nödprofil när någon skannar din QR-kod',
  },
  'emergency.conditions': {
    en: 'Conditions', es: 'Condiciones',
    fr: 'Conditions', de: 'Erkrankungen',
    pt: 'Condições', zh: '病症', ja: '疾患',
    it: 'Condizioni', ru: 'Состояния', sv: 'Tillstånd',
  },
  'emergency.allergies': {
    en: 'Allergies', es: 'Alergias',
    fr: 'Allergies', de: 'Allergien',
    pt: 'Alergias', zh: '过敏', ja: 'アレルギー',
    it: 'Allergie', ru: 'Аллергии', sv: 'Allergier',
  },
  'emergency.medications': {
    en: 'Medications', es: 'Medicamentos',
    fr: 'Médicaments', de: 'Medikamente',
    pt: 'Medicamentos', zh: '药物', ja: '薬',
    it: 'Farmaci', ru: 'Лекарства', sv: 'Mediciner',
  },
  'emergency.contacts': {
    en: 'Emergency Contacts', es: 'Contactos de Emergencia',
    fr: "Contacts d'urgence", de: 'Notfallkontakte',
    pt: 'Contatos de Emergência', zh: '紧急联系人', ja: '緊急連絡先',
    it: 'Contatti di emergenza', ru: 'Экстренные контакты', sv: 'Nödkontakter',
  },
  'emergency.physician': {
    en: 'Primary Physician', es: 'Médico Principal',
    fr: 'Médecin traitant', de: 'Hausarzt',
    pt: 'Médico Principal', zh: '主治医生', ja: 'かかりつけ医',
    it: 'Medico di base', ru: 'Лечащий врач', sv: 'Primärvårdsläkare',
  },
  'emergency.addCondition': {
    en: 'Add condition', es: 'Agregar condición',
    fr: 'Ajouter une condition', de: 'Erkrankung hinzufügen',
    pt: 'Adicionar condição', zh: '添加病症', ja: '疾患を追加',
    it: 'Aggiungi condizione', ru: 'Добавить состояние', sv: 'Lägg till tillstånd',
  },
  'emergency.addAllergy': {
    en: 'Add allergy', es: 'Agregar alergia',
    fr: 'Ajouter une allergie', de: 'Allergie hinzufügen',
    pt: 'Adicionar alergia', zh: '添加过敏', ja: 'アレルギーを追加',
    it: 'Aggiungi allergia', ru: 'Добавить аллергию', sv: 'Lägg till allergi',
  },
  'emergency.addMedication': {
    en: 'Add medication', es: 'Agregar medicamento',
    fr: 'Ajouter un médicament', de: 'Medikament hinzufügen',
    pt: 'Adicionar medicamento', zh: '添加药物', ja: '薬を追加',
    it: 'Aggiungi farmaco', ru: 'Добавить лекарство', sv: 'Lägg till medicin',
  },
  'emergency.addContact': {
    en: 'Add contact', es: 'Agregar contacto',
    fr: 'Ajouter un contact', de: 'Kontakt hinzufügen',
    pt: 'Adicionar contato', zh: '添加联系人', ja: '連絡先を追加',
    it: 'Aggiungi contatto', ru: 'Добавить контакт', sv: 'Lägg till kontakt',
  },
  'emergency.noConditions': {
    en: 'No conditions on record', es: 'Sin condiciones registradas',
    fr: 'Aucune condition enregistrée', de: 'Keine Erkrankungen eingetragen',
    pt: 'Nenhuma condição registrada', zh: '暂无病症记录', ja: '疾患の記録なし',
    it: 'Nessuna condizione registrata', ru: 'Состояния не записаны', sv: 'Inga tillstånd registrerade',
  },
  'emergency.noAllergies': {
    en: 'No allergies on record', es: 'Sin alergias registradas',
    fr: 'Aucune allergie enregistrée', de: 'Keine Allergien eingetragen',
    pt: 'Nenhuma alergia registrada', zh: '暂无过敏记录', ja: 'アレルギーの記録なし',
    it: 'Nessuna allergia registrata', ru: 'Аллергии не записаны', sv: 'Inga allergier registrerade',
  },
  'emergency.noMedications': {
    en: 'No medications on record', es: 'Sin medicamentos registrados',
    fr: 'Aucun médicament enregistré', de: 'Keine Medikamente eingetragen',
    pt: 'Nenhum medicamento registrado', zh: '暂无药物记录', ja: '薬の記録なし',
    it: 'Nessun farmaco registrato', ru: 'Лекарства не записаны', sv: 'Inga mediciner registrerade',
  },
  'emergency.noContacts': {
    en: 'No emergency contacts listed', es: 'Sin contactos de emergencia',
    fr: "Aucun contact d'urgence", de: 'Keine Notfallkontakte',
    pt: 'Nenhum contato de emergência', zh: '暂无紧急联系人', ja: '緊急連絡先なし',
    it: 'Nessun contatto di emergenza', ru: 'Экстренные контакты не добавлены', sv: 'Inga nödkontakter',
  },
  'emergency.critical': {
    en: 'Critical', es: 'Crítico',
    fr: 'Critique', de: 'Kritisch',
    pt: 'Crítico', zh: '危急', ja: '重篤',
    it: 'Critico', ru: 'Критическое', sv: 'Kritisk',
  },
  'emergency.notes': {
    en: 'Notes', es: 'Notas',
    fr: 'Notes', de: 'Notizen',
    pt: 'Notas', zh: '备注', ja: 'メモ',
    it: 'Note', ru: 'Заметки', sv: 'Anteckningar',
  },

  // ─── QR Page ─────────────────────────────────
  'qr.title': {
    en: 'My QR Code', es: 'Mi Código QR',
    fr: 'Mon code QR', de: 'Mein QR-Code',
    pt: 'Meu Código QR', zh: '我的二维码', ja: '私のQRコード',
    it: 'Il mio QR', ru: 'Мой QR-код', sv: 'Min QR-kod',
  },
  'qr.subtitle': {
    en: 'Share this code to give helpers instant access to your emergency profile',
    es: 'Comparta este código para dar a los asistentes acceso inmediato a su perfil',
    fr: 'Partagez ce code pour donner aux helpers un accès immédiat à votre profil',
    de: 'Teilen Sie diesen Code, um Helfern sofortigen Zugang zu Ihrem Profil zu geben',
    pt: 'Compartilhe este código para dar acesso imediato ao seu perfil de emergência',
    zh: '分享此码让救助者即时访问您的紧急资料',
    ja: 'このコードを共有して、助ける人があなたの緊急プロフィールにアクセスできます',
    it: 'Condividi questo codice per dare agli helper accesso immediato al tuo profilo',
    ru: 'Поделитесь кодом, чтобы помощники могли получить доступ к вашему профилю',
    sv: 'Dela den här koden för att ge hjälpare omedelbar tillgång till din profil',
  },
  'qr.copyUrl': {
    en: 'Copy URL', es: 'Copiar URL',
    fr: "Copier l'URL", de: 'URL kopieren',
    pt: 'Copiar URL', zh: '复制链接', ja: 'URLをコピー',
    it: 'Copia URL', ru: 'Копировать ссылку', sv: 'Kopiera URL',
  },
  'qr.copied': {
    en: 'Copied ✓', es: 'Copiado ✓',
    fr: 'Copié ✓', de: 'Kopiert ✓',
    pt: 'Copiado ✓', zh: '已复制 ✓', ja: 'コピー済み ✓',
    it: 'Copiato ✓', ru: 'Скопировано ✓', sv: 'Kopierat ✓',
  },
  'qr.download': {
    en: 'Download QR', es: 'Descargar QR',
    fr: 'Télécharger QR', de: 'QR herunterladen',
    pt: 'Baixar QR', zh: '下载二维码', ja: 'QRをダウンロード',
    it: 'Scarica QR', ru: 'Скачать QR', sv: 'Ladda ner QR',
  },
  'qr.share': {
    en: 'Share', es: 'Compartir',
    fr: 'Partager', de: 'Teilen',
    pt: 'Compartilhar', zh: '分享', ja: '共有',
    it: 'Condividi', ru: 'Поделиться', sv: 'Dela',
  },
  'qr.regenerate': {
    en: 'Regenerate', es: 'Regenerar',
    fr: 'Régénérer', de: 'Neu generieren',
    pt: 'Regenerar', zh: '重新生成', ja: '再生成',
    it: 'Rigenera', ru: 'Пересоздать', sv: 'Regenerera',
  },
  'qr.regenerateTitle': {
    en: 'Regenerate your QR code?',
    es: '¿Regenerar su código QR?',
    fr: 'Régénérer votre code QR ?',
    de: 'Ihren QR-Code neu generieren?',
    pt: 'Regenerar seu código QR?',
    zh: '重新生成您的二维码？',
    ja: 'QRコードを再生成しますか？',
    it: 'Rigenerare il tuo QR?',
    ru: 'Пересоздать QR-код?',
    sv: 'Regenerera din QR-kod?',
  },
  'qr.regenerateWarning': {
    en: 'Your current QR code will stop working permanently. This cannot be undone.',
    es: 'Su código QR actual dejará de funcionar permanentemente. Esto no se puede deshacer.',
    fr: 'Votre code QR actuel cessera de fonctionner définitivement. Ceci est irréversible.',
    de: 'Ihr aktueller QR-Code funktioniert dauerhaft nicht mehr. Dies kann nicht rückgängig gemacht werden.',
    pt: 'Seu código QR atual deixará de funcionar permanentemente. Isso não pode ser desfeito.',
    zh: '您当前的二维码将永久停止工作。此操作无法撤销。',
    ja: '現在のQRコードは永久に無効になります。この操作は元に戻せません。',
    it: 'Il tuo QR attuale smetterà di funzionare permanentemente. Non può essere annullato.',
    ru: 'Ваш текущий QR-код перестанет работать навсегда. Это нельзя отменить.',
    sv: 'Din nuvarande QR-kod slutar fungera permanent. Detta kan inte ångras.',
  },

  // ─── Onboarding ──────────────────────────────
  'onboarding.welcome': {
    en: 'Welcome to Arkoura 🌿', es: 'Bienvenido a Arkoura 🌿',
    fr: 'Bienvenue sur Arkoura 🌿', de: 'Willkommen bei Arkoura 🌿',
    pt: 'Bem-vindo ao Arkoura 🌿', zh: '欢迎使用 Arkoura 🌿', ja: 'Arkоuraへようこそ 🌿',
    it: 'Benvenuto su Arkoura 🌿', ru: 'Добро пожаловать в Arkoura 🌿', sv: 'Välkommen till Arkoura 🌿',
  },
  'onboarding.welcomeBody': {
    en: "Your health profile is ready to build. Let's take 2 minutes to set up the essentials.",
    es: 'Su perfil de salud está listo para construir. Tomemos 2 minutos para configurar lo esencial.',
    fr: "Votre profil de santé est prêt. Prenons 2 minutes pour configurer l'essentiel.",
    de: 'Ihr Gesundheitsprofil ist bereit. Nehmen Sie sich 2 Minuten für die Einrichtung.',
    pt: 'Seu perfil de saúde está pronto. Vamos dedicar 2 minutos para configurar o essencial.',
    zh: '您的健康档案已准备就绪。让我们花2分钟设置基本信息。',
    ja: 'あなたの健康プロフィールの準備ができました。2分で必須項目を設定しましょう。',
    it: "Il tuo profilo salute è pronto. Prendiamo 2 minuti per configurare l'essenziale.",
    ru: 'Ваш профиль здоровья готов. Потратим 2 минуты на базовую настройку.',
    sv: 'Din hälsoprofil är redo. Låt oss ta 2 minuter för att ställa in det viktigaste.',
  },
  'onboarding.getStarted': {
    en: 'Get started →', es: 'Comenzar →',
    fr: 'Commencer →', de: 'Loslegen →',
    pt: 'Começar →', zh: '开始 →', ja: '始める →',
    it: 'Inizia →', ru: 'Начать →', sv: 'Kom igång →',
  },
  'onboarding.next': {
    en: 'Next →', es: 'Siguiente →',
    fr: 'Suivant →', de: 'Weiter →',
    pt: 'Próximo →', zh: '下一步 →', ja: '次へ →',
    it: 'Avanti →', ru: 'Далее →', sv: 'Nästa →',
  },
  'onboarding.skip': {
    en: "I'll add this later", es: 'Lo agregaré después',
    fr: "Je l'ajouterai plus tard", de: 'Ich füge das später hinzu',
    pt: 'Vou adicionar depois', zh: '稍后添加', ja: '後で追加します',
    it: 'Lo aggiungo dopo', ru: 'Добавлю позже', sv: 'Jag lägger till detta senare',
  },
  'onboarding.complete': {
    en: 'Complete setup →', es: 'Completar configuración →',
    fr: 'Terminer la configuration →', de: 'Einrichtung abschließen →',
    pt: 'Concluir configuração →', zh: '完成设置 →', ja: 'セットアップを完了 →',
    it: 'Completa configurazione →', ru: 'Завершить настройку →', sv: 'Slutför konfiguration →',
  },
  'onboarding.addSomeone': {
    en: 'Add someone who can help', es: 'Agregue a alguien que pueda ayudar',
    fr: 'Ajoutez quelqu\'un qui peut aider', de: 'Fügen Sie jemanden hinzu, der helfen kann',
    pt: 'Adicione alguém que possa ajudar', zh: '添加一位可以帮助您的人', ja: '助けてくれる人を追加',
    it: 'Aggiungi qualcuno che può aiutare', ru: 'Добавьте того, кто может помочь', sv: 'Lägg till någon som kan hjälpa',
  },

  // ─── Common ──────────────────────────────────
  'common.save': {
    en: 'Save', es: 'Guardar',
    fr: 'Enregistrer', de: 'Speichern',
    pt: 'Salvar', zh: '保存', ja: '保存',
    it: 'Salva', ru: 'Сохранить', sv: 'Spara',
  },
  'common.cancel': {
    en: 'Cancel', es: 'Cancelar',
    fr: 'Annuler', de: 'Abbrechen',
    pt: 'Cancelar', zh: '取消', ja: 'キャンセル',
    it: 'Annulla', ru: 'Отмена', sv: 'Avbryt',
  },
  'common.edit': {
    en: 'Edit', es: 'Editar',
    fr: 'Modifier', de: 'Bearbeiten',
    pt: 'Editar', zh: '编辑', ja: '編集',
    it: 'Modifica', ru: 'Редактировать', sv: 'Redigera',
  },
  'common.delete': {
    en: 'Delete', es: 'Eliminar',
    fr: 'Supprimer', de: 'Löschen',
    pt: 'Excluir', zh: '删除', ja: '削除',
    it: 'Elimina', ru: 'Удалить', sv: 'Ta bort',
  },
  'common.add': {
    en: 'Add', es: 'Agregar',
    fr: 'Ajouter', de: 'Hinzufügen',
    pt: 'Adicionar', zh: '添加', ja: '追加',
    it: 'Aggiungi', ru: 'Добавить', sv: 'Lägg till',
  },
  'common.loading': {
    en: 'Loading...', es: 'Cargando...',
    fr: 'Chargement...', de: 'Laden...',
    pt: 'Carregando...', zh: '加载中...', ja: '読み込み中...',
    it: 'Caricamento...', ru: 'Загрузка...', sv: 'Laddar...',
  },
  'common.error': {
    en: 'Something went wrong. Please try again.',
    es: 'Algo salió mal. Por favor inténtelo de nuevo.',
    fr: 'Une erreur s\'est produite. Veuillez réessayer.',
    de: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    pt: 'Algo deu errado. Por favor tente novamente.',
    zh: '出了点问题，请重试。',
    ja: 'エラーが発生しました。もう一度お試しください。',
    it: 'Qualcosa è andato storto. Riprova.',
    ru: 'Что-то пошло не так. Попробуйте ещё раз.',
    sv: 'Något gick fel. Försök igen.',
  },
  'common.required': {
    en: 'This field is required', es: 'Este campo es requerido',
    fr: 'Ce champ est obligatoire', de: 'Dieses Feld ist erforderlich',
    pt: 'Este campo é obrigatório', zh: '此字段为必填项', ja: 'この項目は必須です',
    it: 'Questo campo è obbligatorio', ru: 'Это поле обязательно', sv: 'Det här fältet är obligatoriskt',
  },
  'common.primary': {
    en: 'Primary', es: 'Principal',
    fr: 'Principal', de: 'Primär',
    pt: 'Principal', zh: '主要', ja: 'プライマリー',
    it: 'Principale', ru: 'Основной', sv: 'Primär',
  },
  'common.critical': {
    en: 'Critical', es: 'Crítico',
    fr: 'Critique', de: 'Kritisch',
    pt: 'Crítico', zh: '危急', ja: '重篤',
    it: 'Critico', ru: 'Критическое', sv: 'Kritisk',
  },
  'common.showOnEmergency': {
    en: 'Show on emergency profile',
    es: 'Mostrar en perfil de emergencia',
    fr: "Afficher sur le profil d'urgence",
    de: 'Im Notfallprofil anzeigen',
    pt: 'Mostrar no perfil de emergência',
    zh: '在紧急资料上显示',
    ja: '緊急プロフィールに表示',
    it: 'Mostra nel profilo di emergenza',
    ru: 'Показать в экстренном профиле',
    sv: 'Visa på nödprofil',
  },
}

export function t(key: string, lang: Lang = 'en'): string {
  const map = translations[key]
  if (!map) return key
  return map[lang] ?? map['en'] ?? key
}

export default translations
