// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
    i18n: {
        vueI18n: './i18n.config.ts',
        strategy: 'prefix_and_default',
        defaultLocale: 'en',
        locales: [
            {
                code: 'en',
                name: 'English',
                file: 'en.json',
            },
            {
                code: 'th',
                name: 'Thai',
                file: 'th.json',
            },
        ],
        langDir: 'lang/',
        lazy: true,
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_lang',
            alwaysRedirect: true,
        },
    },
});
