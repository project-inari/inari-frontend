<template>
    <div>
        <!-- Navbar Element -->
        <div class="navbar-container">
            <div class="navbar-logo-name">
                <NuxtLinkLocale to="/">
                    <NuxtImg
                        src="img/default-logo.png"
                        alt="INARI-Logo"
                        width="70"
                        height="70"
                    />
                </NuxtLinkLocale>
                <NuxtLinkLocale to="/">
                    <h1
                        class="inari-navbar-text"
                        :class="fontDMSansPrompt"
                    >
                        {{ $t('inari') }}
                    </h1>
                </NuxtLinkLocale>
            </div>

            <div
                class="navbar-menu"
                :class="fontDMSansPrompt"
            >
                <NuxtLinkLocale to="/">{{ $t('navbar.home') }}</NuxtLinkLocale>
                <NuxtLinkLocale to="/feature">{{
                    $t('navbar.feature')
                }}</NuxtLinkLocale>
                <NuxtLinkLocale to="/about">{{
                    $t('navbar.about')
                }}</NuxtLinkLocale>
                <NuxtLinkLocale to="/contact">{{
                    $t('navbar.contact')
                }}</NuxtLinkLocale>
            </div>

            <div
                class="navbar-buttons"
                :class="fontDMSansPrompt"
            >
                <PrimeButton
                    id="navbar-login"
                    label="Login"
                    variant="outlined"
                />
                <PrimeButton
                    id="navbar-signup"
                    label="Sign Up"
                />
            </div>
        </div>
        <!-- End of Navbar Element -->

        <slot />
    </div>
</template>

<script lang="ts" setup>
const { fontDMSansPrompt } = useFontClass();

// const { setLocale } = useI18n();
// const localePath = useLocalePath();
</script>

<style lang="scss" scoped>
.navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    // background-color: #ececec;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
}

.navbar-logo-name {
    display: flex;
    align-items: center;
}

.inari-navbar-text {
    font-size: 32px;
    font-weight: 600;
    color: #727272;
    margin-right: 0.5rem;
}

.navbar-menu {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    gap: 50px;
    font-size: 18px;
    color: #727272;
    white-space: nowrap;
}

.navbar-buttons {
    display: flex;
    gap: 1rem;
    flex-basis: content;
}

#navbar-login {
    width: 100px;
    height: 48px;
    font-size: 18px;
}

#navbar-signup {
    width: 100px;
    height: 48px;
    font-size: 18px;
}
</style>
