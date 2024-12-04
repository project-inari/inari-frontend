<template>
    <div>
        <!-- Navbar Element -->
        <div
            v-motion-slide-visible-bottom:duration="5000"
            class="navbar-container"
        >
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
                v-if="$viewport.isGreaterOrEquals('desktop')"
                class="navbar-menu"
                :class="fontDMSansPrompt"
            >
                <NuxtLinkLocale
                    to="/"
                    class="navbar-menu-link"
                    >{{ $t('navbar.home') }}</NuxtLinkLocale
                >
                <NuxtLinkLocale
                    to="/feature"
                    class="navbar-menu-link"
                    >{{ $t('navbar.feature') }}</NuxtLinkLocale
                >
                <NuxtLinkLocale
                    to="/package"
                    class="navbar-menu-link"
                    >{{ $t('navbar.package') }}</NuxtLinkLocale
                >
                <NuxtLinkLocale
                    to="/guide"
                    class="navbar-menu-link"
                    >{{ $t('navbar.guide') }}</NuxtLinkLocale
                >
            </div>

            <div
                class="navbar-buttons"
                :class="fontDMSansPrompt"
            >
                <PrimeSelect
                    v-if="$viewport.isGreaterThan('mobile')"
                    id="navbar-language"
                    :class="fontDMSansPrompt"
                    :options="localeOptions"
                    :model-value="currentLocale"
                    @update:model-value="changeLocale"
                />
                <PrimeButton
                    v-if="$viewport.isGreaterThan('mobile')"
                    id="navbar-login"
                    :label="$t('navbar.login')"
                    variant="outlined"
                />
                <PrimeButton
                    v-if="$viewport.isGreaterThan('mobile')"
                    id="navbar-signup"
                    :label="$t('navbar.signup')"
                />
                <Burger
                    v-if="$viewport.isLessThan('desktop')"
                    type="vortex"
                    :active="isburgerMenuOpen"
                    @updated="handleOpenBurgerMenu"
                />
            </div>
        </div>
        <!-- End of Navbar Element -->

        <slot />
    </div>
</template>

<script lang="ts" setup>
const { fontDMSansPrompt } = useFontClass();
const { setLocale, locale } = useI18n();

// locale
const localeOptions = ['EN', 'ไทย'];
let currentLocale = locale.value === 'en' ? 'EN' : 'ไทย';

const changeLocale = (value: string) => {
    if (value === 'EN') {
        setLocale('en');
        currentLocale = 'EN';
    } else {
        setLocale('th');
        currentLocale = 'ไทย';
    }
};

// burger menu
const isburgerMenuOpen = ref(false);
const handleOpenBurgerMenu = () => {
    isburgerMenuOpen.value = !isburgerMenuOpen.value;
};
</script>

<style lang="scss" scoped>
.navbar-container {
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    // background-color: #ececec;
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

.navbar-menu-link {
    background-image: linear-gradient(to right, #10b981, #10b981 50%, #000 50%);
    background-size: 200% 100%;
    background-position: -100%;
    display: inline-block;
    padding: 1px 0;
    position: relative;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.2s ease-in-out;

    &::before {
        content: '';
        background: #10b981;
        display: block;
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 0;
        height: 3px;
        transition: all 0.2s ease-in-out;
    }

    &:hover {
        background-position: 0;

        &::before {
            width: 100%;
        }
    }

    &.router-link-active {
        &::before {
            width: 100%;
        }
    }
}

.navbar-buttons {
    display: flex;
    gap: 1rem;
    flex-basis: content;
    align-items: center;
}

#navbar-language {
    width: 100px;
    height: 48px;
    font-size: 18px;
    text-align: center;
    vertical-align: text-bottom;
}

#navbar-login {
    width: 110px;
    height: 48px;
    font-size: 18px;
}

#navbar-signup {
    width: 110px;
    height: 48px;
    font-size: 18px;
}
</style>
