import { readBody, createError } from 'h3';

const config = useRuntimeConfig();

type SignupReq = {
    username: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    password: string;
    email: string;
};

type SignupRes = {
    username: string;
    uid: string;
    token: string;
};

export default defineEventHandler(async event => {
    const req: SignupReq = await readBody(event);

    const i18nLang = getCookie(event, 'i18n_lang');
    const currentLocale: string = i18nLang
        ? i18nLang.toLocaleUpperCase()
        : 'EN';

    let data: SignupRes;
    try {
        data = await $fetch<SignupRes>(
            `${config.BACKEND_API_BASE_URL}/v1/signup`,
            {
                method: 'POST',
                body: req,
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': config.BACKEND_API_KEY,
                    'Accept-Locale': currentLocale,
                },
            },
        );
    } catch (err) {
        console.error('Signup error:', err);
        throw createError({ statusCode: 500, statusMessage: 'Signup failed' });
    }

    setCookie(event, 'username', data.username, { httpOnly: true });
    setCookie(event, 'token', data.token, { httpOnly: true });
    setCookie(event, 'uid', data.uid, { httpOnly: true });

    return data;
});
