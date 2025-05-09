<template>
    <div class="main-container">
        <div class="header-logo">
            <NuxtImg
                src="img/gradient-logo.png"
                alt="INARI-Logo"
                width="150"
                height="150"
            />
        </div>
        <h1
            class="heading-text"
            :class="fontDMSansPrompt"
        >
            {{ $t('login.header') }}
        </h1>
        <div class="login-form">
            <PrimeMessage
                v-if="submitAttempted && errorMessages.length"
                class="error-box"
                severity="error"
            >
                <ul :class="fontDMSansPrompt">
                    <li
                        v-for="(error, index) in errorMessages"
                        :key="index"
                    >
                        {{ error }}
                    </li>
                </ul>
            </PrimeMessage>
            <PrimeFloatLabel
                variant="in"
                :class="fontDMSansPrompt"
            >
                <PrimeInputText
                    id="email"
                    v-model="email"
                    class="login-input-text"
                    variant="filled"
                    :class="fontDMSansPrompt"
                />
                <label
                    for="email"
                    :class="fontDMSansPrompt"
                    >{{ $t('login.form.email') }}</label
                >
            </PrimeFloatLabel>
            <PrimeFloatLabel
                variant="in"
                :class="fontDMSansPrompt"
            >
                <PrimeInputText
                    id="password"
                    v-model="password"
                    class="login-input-text"
                    variant="filled"
                    type="password"
                    :class="fontDMSansPrompt"
                />
                <label
                    for="password"
                    :class="fontDMSansPrompt"
                    >{{ $t('login.form.password') }}</label
                >
            </PrimeFloatLabel>
            <PrimeButton
                id="login-button"
                :label="$t('login.form.button')"
                :class="fontDMSansPrompt"
                @click="submitForm"
            />
            <PrimeMessage
                v-if="callError"
                class="error-box"
                severity="error"
            >
                <p :class="fontDMSansPrompt">{{ $t('login.error.500') }}</p>
            </PrimeMessage>
            <NuxtLinkLocale
                to="/auth/signup"
                class="link-to-login"
                :class="fontDMSansPrompt"
                >{{ $t('login.form.signup') }}</NuxtLinkLocale
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import type { Business } from '~/model/Business';

definePageMeta({
    title: 'INARI Login',
});

const { fontDMSansPrompt } = useFontClass();
const router = useRouter();

const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

const submitAttempted = ref(false);
const callError = ref(false);

const { handleSubmit, errors } = useForm({
    validationSchema: schema,
});

const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');

const errorMessages = computed(() => Object.values(errors.value));

const onSubmit = handleSubmit(
    async () => {
        let loginRes = null;
        let businessRes: Business[] = [];

        callError.value = false;
        submitAttempted.value = false;

        try {
            loginRes = await $fetch('/api/auth/login', {
                method: 'POST',
                body: {
                    email: email.value,
                    password: password.value,
                },
            });
        } catch (error) {
            callError.value = true;
            console.log(error);
        }

        try {
            businessRes = await $fetch<Business[]>(
                `/api/user/${loginRes?.username}/business`,
                {
                    method: 'GET',
                },
            );
        } catch (error) {
            callError.value = true;
            console.log(error);
        }

        if (businessRes.length > 0) {
            router.push(`/business/${businessRes[0].id}`);
        } else {
            router.push('/business/create');
        }
    },
    () => {
        submitAttempted.value = true;
    },
);

const submitForm = () => {
    onSubmit();
};
</script>

<style lang="scss" scoped>
.main-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.header-logo {
    display: flex;
    align-items: center;
}

.heading-text {
    font-size: 24px;
    font-weight: 700;
    color: #727272;
    margin-bottom: 20px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.login-input-text {
    width: 320px !important;
}

::v-deep(.p-password input) {
    width: 100% !important;
}

.link-to-login {
    text-decoration: none;
    color: #727272;
    text-align: center;

    &:hover {
        text-decoration: underline;
    }
}

.error-box {
    width: 320px;
    margin-bottom: 10px;
    text-wrap: wrap;
}
</style>
