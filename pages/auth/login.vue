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
            <PrimeFloatLabel variant="in">
                <PrimeInputText
                    id="email"
                    v-model="email"
                    class="login-input-text"
                    variant="filled"
                />
                <label for="email">{{ $t('login.form.email') }}</label>
            </PrimeFloatLabel>
            <PrimeFloatLabel variant="in">
                <PrimeInputText
                    id="password"
                    v-model="password"
                    class="login-input-text"
                    variant="filled"
                />
                <label for="password">{{ $t('login.form.password') }}</label>
            </PrimeFloatLabel>
            <PrimeButton
                id="login-button"
                :label="$t('login.form.button')"
                @click="handleLogin"
            />
            <NuxtLinkLocale
                to="/auth/signup"
                class="link-to-login"
                >{{ $t('login.form.signup') }}</NuxtLinkLocale
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    title: 'INARI Login',
});

const { fontDMSansPrompt } = useFontClass();

const email = ref('');
const password = ref('');
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
