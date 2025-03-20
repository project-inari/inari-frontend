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
            <PrimeFloatLabel variant="in">
                <PrimeInputText
                    id="email"
                    v-model="email"
                    class="signup-input-text"
                    variant="filled"
                />
                <label for="email">{{ $t('signup.form.email') }}</label>
            </PrimeFloatLabel>
            <PrimeFloatLabel variant="in">
                <PrimeInputText
                    id="username"
                    v-model="username"
                    class="signup-input-text"
                    variant="filled"
                />
                <label for="username">{{ $t('signup.form.username') }}</label>
            </PrimeFloatLabel>
            <PrimeFloatLabel variant="in">
                <PrimeInputText
                    id="first_name"
                    v-model="firstName"
                    class="signup-input-text"
                    variant="filled"
                />
                <label for="first_name">{{
                    $t('signup.form.firstname')
                }}</label>
            </PrimeFloatLabel>
            <PrimeFloatLabel variant="in">
                <PrimeInputText
                    id="last_name"
                    v-model="lastName"
                    class="signup-input-text"
                    variant="filled"
                />
                <label for="last_name">{{ $t('signup.form.lastname') }}</label>
            </PrimeFloatLabel>
            <PrimeFloatLabel variant="in">
                <PrimeInputText
                    id="phone_no"
                    v-model="phoneNo"
                    class="signup-input-text"
                    variant="filled"
                />
                <label for="phone_no">{{ $t('signup.form.phoneno') }}</label>
            </PrimeFloatLabel>
            <PrimeFloatLabel variant="in">
                <PrimePassword
                    id="password"
                    v-model="password"
                    class="signup-input-text"
                    variant="filled"
                />
                <label for="password">{{ $t('signup.form.password') }}</label>
            </PrimeFloatLabel>
            <PrimeFloatLabel variant="in">
                <PrimePassword
                    id="confirm_password"
                    v-model="confirmPassword"
                    class="signup-input-text"
                    variant="filled"
                />
                <label for="confirm_password">{{
                    $t('signup.form.confirmpassword')
                }}</label>
            </PrimeFloatLabel>
            <PrimeButton
                id="signup-button"
                :label="$t('signup.form.button')"
            />
            <NuxtLinkLocale
                to="/auth/login"
                class="link-to-login"
                >{{ $t('signup.form.login') }}</NuxtLinkLocale
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    title: 'INARI Signup',
});

const { fontDMSansPrompt } = useFontClass();

const email = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstName = ref('');
const lastName = ref('');
const phoneNo = ref('');
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
    width: 300px !important;
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
</style>
