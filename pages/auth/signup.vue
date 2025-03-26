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
            {{ $t('signup.header') }}
        </h1>
        <div class="signup-form">
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
                    class="signup-input-text"
                    variant="filled"
                    :class="fontDMSansPrompt"
                />
                <label
                    for="email"
                    :class="fontDMSansPrompt"
                    >{{ $t('signup.form.email') }}</label
                >
            </PrimeFloatLabel>

            <PrimeFloatLabel
                variant="in"
                :class="fontDMSansPrompt"
            >
                <PrimeInputText
                    id="username"
                    v-model="username"
                    class="signup-input-text"
                    variant="filled"
                    :class="fontDMSansPrompt"
                />
                <label
                    for="username"
                    :class="fontDMSansPrompt"
                    >{{ $t('signup.form.username') }}</label
                >
            </PrimeFloatLabel>

            <PrimeFloatLabel
                variant="in"
                :class="fontDMSansPrompt"
            >
                <PrimeInputText
                    id="first_name"
                    v-model="firstName"
                    class="signup-input-text"
                    variant="filled"
                    :class="fontDMSansPrompt"
                />
                <label
                    for="first_name"
                    :class="fontDMSansPrompt"
                    >{{ $t('signup.form.firstname') }}</label
                >
            </PrimeFloatLabel>

            <PrimeFloatLabel
                variant="in"
                :class="fontDMSansPrompt"
            >
                <PrimeInputText
                    id="last_name"
                    v-model="lastName"
                    class="signup-input-text"
                    variant="filled"
                    :class="fontDMSansPrompt"
                />
                <label
                    for="last_name"
                    :class="fontDMSansPrompt"
                    >{{ $t('signup.form.lastname') }}</label
                >
            </PrimeFloatLabel>

            <PrimeFloatLabel
                variant="in"
                :class="fontDMSansPrompt"
            >
                <PrimeInputText
                    id="phone_no"
                    v-model="phoneNo"
                    class="signup-input-text"
                    variant="filled"
                    :class="fontDMSansPrompt"
                />
                <label
                    for="phone_no"
                    :class="fontDMSansPrompt"
                    >{{ $t('signup.form.phoneno') }}</label
                >
            </PrimeFloatLabel>

            <PrimeFloatLabel
                variant="in"
                :class="fontDMSansPrompt"
            >
                <PrimeInputText
                    id="password"
                    v-model="password"
                    class="signup-input-text"
                    variant="filled"
                    :class="fontDMSansPrompt"
                />
                <label
                    for="password"
                    :class="fontDMSansPrompt"
                    >{{ $t('signup.form.password') }}</label
                >
            </PrimeFloatLabel>

            <PrimeFloatLabel
                variant="in"
                :class="fontDMSansPrompt"
            >
                <PrimeInputText
                    id="confirm_password"
                    v-model="confirmPassword"
                    class="signup-input-text"
                    variant="filled"
                    :class="fontDMSansPrompt"
                />
                <label for="confirm_password">{{
                    $t('signup.form.confirmpassword')
                }}</label>
            </PrimeFloatLabel>

            <PrimeButton
                id="signup-button"
                :label="$t('signup.form.button')"
                :class="fontDMSansPrompt"
                @click="submitForm"
            />
            <PrimeMessage
                v-if="callError"
                class="error-box"
                severity="error"
            >
                <p :class="fontDMSansPrompt">{{ $t('signup.error.500') }}</p>
            </PrimeMessage>
            <NuxtLinkLocale
                to="/auth/login"
                class="link-to-login"
                :class="fontDMSansPrompt"
                >{{ $t('signup.form.login') }}</NuxtLinkLocale
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

definePageMeta({
    title: 'INARI Signup',
});

const { fontDMSansPrompt } = useFontClass();

const schema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    username: yup
        .string()
        .min(3, 'Username must be at least 3 characters')
        .required('Username is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    phoneNo: yup.string().required('Phone number is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const submitAttempted = ref(false);
const callError = ref(false);

const { handleSubmit, errors } = useForm({
    validationSchema: schema,
});

const { value: email } = useField<string>('email');
const { value: username } = useField<string>('username');
const { value: firstName } = useField<string>('firstName');
const { value: lastName } = useField<string>('lastName');
const { value: phoneNo } = useField<string>('phoneNo');
const { value: password } = useField<string>('password');
const { value: confirmPassword } = useField<string>('confirmPassword');

const errorMessages = computed(() => Object.values(errors.value));

const onSubmit = handleSubmit(
    async values => {
        callError.value = false;
        submitAttempted.value = false;

        const { error } = await useFetch('/api/auth/signup', {
            method: 'POST',
            body: values,
        });

        if (error.value) {
            callError.value = true;
            throw createError({
                statusCode: 500,
                statusMessage: 'Server is not responding...',
                message: 'Server is not responding...',
            });
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

.signup-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.signup-input-text {
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
