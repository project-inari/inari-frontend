import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const InariTheme = definePreset(Aura, {
    primary: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
        950: '#022c22',
    },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    modules: [
        '@nuxt/eslint',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        '@primevue/nuxt-module',
        '@nuxt/image',
        '@vueuse/motion/nuxt',
    ],
    primevue: {
        components: {
            include: '*',
            prefix: 'Prime',
        },
        options: {
            theme: {
                preset: InariTheme,
                options: {
                    darkModeSelector: '.dark-mode',
                    // cssLayer: true
                },
            },
        },
    },
    css: ['primeicons/primeicons.css'],
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
