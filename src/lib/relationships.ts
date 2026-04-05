export function translateRelationship(rel: string, lang: string): string {
  const map: Record<string, Record<string, string>> = {
    'Spouse / Partner': {
      en: 'Spouse / Partner', es: 'Cónyuge / Pareja',
      fr: 'Conjoint / Partenaire', de: 'Ehepartner / Partner',
      pt: 'Cônjuge / Parceiro', zh: '配偶/伴侣', ja: '配偶者/パートナー',
      it: 'Coniuge / Partner', ru: 'Супруг / Партнёр', sv: 'Make/maka/partner',
    },
    'Parent': {
      en: 'Parent', es: 'Padre/Madre', fr: 'Parent', de: 'Elternteil',
      pt: 'Pai/Mãe', zh: '父母', ja: '親',
      it: 'Genitore', ru: 'Родитель', sv: 'Förälder',
    },
    'Child': {
      en: 'Child', es: 'Hijo/Hija', fr: 'Enfant', de: 'Kind',
      pt: 'Filho/Filha', zh: '子女', ja: '子',
      it: 'Figlio/Figlia', ru: 'Ребёнок', sv: 'Barn',
    },
    'Sibling': {
      en: 'Sibling', es: 'Hermano/Hermana', fr: 'Frère/Sœur', de: 'Geschwister',
      pt: 'Irmão/Irmã', zh: '兄弟姐妹', ja: '兄弟姉妹',
      it: 'Fratello/Sorella', ru: 'Брат/Сестра', sv: 'Syskon',
    },
    'Friend': {
      en: 'Friend', es: 'Amigo/Amiga', fr: 'Ami/Amie', de: 'Freund/Freundin',
      pt: 'Amigo/Amiga', zh: '朋友', ja: '友人',
      it: 'Amico/Amica', ru: 'Друг', sv: 'Vän',
    },
    'Caretaker': {
      en: 'Caretaker', es: 'Cuidador/Cuidadora', fr: 'Soignant/e', de: 'Betreuer/in',
      pt: 'Cuidador/a', zh: '看护者', ja: '介護者',
      it: 'Badante', ru: 'Опекун', sv: 'Vårdgivare',
    },
    'Doctor': {
      en: 'Doctor', es: 'Doctor/Doctora', fr: 'Médecin', de: 'Arzt/Ärztin',
      pt: 'Médico/Médica', zh: '医生', ja: '医師',
      it: 'Medico', ru: 'Врач', sv: 'Läkare',
    },
    'Legal Guardian': {
      en: 'Legal Guardian', es: 'Tutor Legal', fr: 'Tuteur légal', de: 'Vormund',
      pt: 'Tutor Legal', zh: '法定监护人', ja: '法定後見人',
      it: 'Tutore legale', ru: 'Законный опекун', sv: 'Juridisk vårdnadshavare',
    },
    'Other': {
      en: 'Other', es: 'Otro', fr: 'Autre', de: 'Andere',
      pt: 'Outro', zh: '其他', ja: 'その他',
      it: 'Altro', ru: 'Другое', sv: 'Annat',
    },
  }
  return map[rel]?.[lang] ?? map[rel]?.['en'] ?? rel
}
