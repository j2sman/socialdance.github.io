// 번역된 텍스트를 가져오는 함수
export const getTranslatedText = (
  club: any,
  field: string,
  localeValue: string
) => {
  const currentTranslation = club.translations[localeValue]?.[field];
  if (currentTranslation) return currentTranslation;

  const defaultTranslation = club.translations[club.default_language]?.[field];
  if (defaultTranslation) return defaultTranslation;

  const firstAvailableTranslation = Object.values(club.translations)[0]?.[
    field
  ];
  if (firstAvailableTranslation) return firstAvailableTranslation;

  return "";
};
