export function useFontClass() {
    const { locale } = useI18n();

    const fontDMSansPrompt = computed(() => {
        if (locale.value === 'en') {
            return 'font-dmsans';
        } else if (locale.value === 'th') {
            return 'font-prompt';
        }
        return '';
    });

    const fontDMSansSarabun = computed(() => {
        if (locale.value === 'en') {
            return 'font-dmsans';
        } else if (locale.value === 'th') {
            return 'font-sarabun';
        }
        return '';
    });

    return { fontDMSansPrompt, fontDMSansSarabun };
}
