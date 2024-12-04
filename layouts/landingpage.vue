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
                    @click="handleOpenBurgerMenu"
                    >{{ $t('navbar.home') }}
                </NuxtLinkLocale>
                <NuxtLinkLocale
                    to="/feature"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
                    >{{ $t('navbar.feature') }}</NuxtLinkLocale
                >
                <NuxtLinkLocale
                    to="/package"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
                    >{{ $t('navbar.package') }}</NuxtLinkLocale
                >
                <NuxtLinkLocale
                    to="/guide"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
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
                    :active="isBurgerMenuOpen"
                    @updated="handleOpenBurgerMenu"
                />
            </div>
        </div>

        <div
            v-if="$viewport.isLessThan('desktop')"
            :class="[
                'navbar-overlay-container',
                { 'is-open': isBurgerMenuOpen },
            ]"
        >
            <div
                class="navbar-overlay-menu"
                :class="fontDMSansPrompt"
            >
                <NuxtLinkLocale
                    to="/"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
                    >{{ $t('navbar.home') }}
                </NuxtLinkLocale>
                <NuxtLinkLocale
                    to="/feature"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
                    >{{ $t('navbar.feature') }}</NuxtLinkLocale
                >
                <NuxtLinkLocale
                    to="/package"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
                    >{{ $t('navbar.package') }}</NuxtLinkLocale
                >
                <NuxtLinkLocale
                    to="/guide"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
                    >{{ $t('navbar.guide') }}</NuxtLinkLocale
                >
            </div>
        </div>
        <!-- End of Navbar Element -->

        <div class="page-content">
            <slot />
        </div>
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
const isBurgerMenuOpen = ref(false);
const handleOpenBurgerMenu = () => {
    isBurgerMenuOpen.value = !isBurgerMenuOpen.value;
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
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-logo-name {
    display: flex;
    align-items: center;
}

.inari-navbar-text {
    font-size: 32px;
    font-weight: 700;
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

.navbar-overlay-container {
    width: 100%;
    background-color: #d0d0d0;
    overflow: hidden;
    height: 0;
    transition: height 0.5s ease-in-out;
    place-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-overlay-container.is-open {
    height: 300px;
}

.navbar-overlay-menu {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    font-size: 20px;
    align-items: center;

    padding: 1rem;
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

.page-content {
    padding: 1rem;
    z-index: 0;
}
</style>
