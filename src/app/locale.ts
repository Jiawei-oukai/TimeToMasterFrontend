export const i18n = {
    default: 'zh_CN',
    locales: ['en_US', 'zh_CN']
} as const;

export type Locale = (typeof i18n)['locales'][number];

const fetchTranslations = (uri: string) => () => fetch(uri).then(response => response.json())

const translations = {
    en_US: fetchTranslations('./translations/en_US.json'),
    zh_CN: fetchTranslations('./translations/zh_CN.json')
}

export const getTranslation = async (locale: Locale) => translations[locale]?.() ?? translations[i18n.default]()