<template>
    <div>
        <!-- Navbar Element -->
        <div
            v-motion-slide-visible-bottom:duration="5000"
            class="navbar-container"
        >
            <div class="navbar-logo-name">
                <NuxtLinkLocale :to="baseUrl">
                    <NuxtImg
                        src="img/default-logo.png"
                        alt="INARI-Logo"
                        width="70"
                        height="70"
                    />
                </NuxtLinkLocale>
                <NuxtLinkLocale :to="baseUrl">
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
                    >{{ $t('landing.navbar.home') }}
                </NuxtLinkLocale>
                <NuxtLinkLocale
                    to="/feature"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
                    >{{ $t('landing.navbar.feature') }}</NuxtLinkLocale
                >
                <NuxtLinkLocale
                    to="/package"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
                    >{{ $t('landing.navbar.package') }}</NuxtLinkLocale
                >
                <NuxtLinkLocale
                    to="/guide"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
                    >{{ $t('landing.navbar.guide') }}</NuxtLinkLocale
                >
            </div>

            <div
                class="navbar-buttons"
                :class="fontDMSansPrompt"
            >
                <PrimeSelect
                    id="navbar-language"
                    :class="fontDMSansPrompt"
                    :options="localeOptions"
                    :model-value="currentLocale"
                    @update:model-value="changeLocale"
                />
                <PrimeButton
                    v-if="$viewport.isGreaterThan('mobile')"
                    id="navbar-login"
                    :label="$t('landing.navbar.login')"
                    variant="outlined"
                />
                <PrimeButton
                    v-if="$viewport.isGreaterThan('mobile')"
                    id="navbar-signup"
                    :label="$t('landing.navbar.signup')"
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
                    >{{ $t('landing.navbar.home') }}
                </NuxtLinkLocale>
                <NuxtLinkLocale
                    to="/feature"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
                    >{{ $t('landing.navbar.feature') }}</NuxtLinkLocale
                >
                <NuxtLinkLocale
                    to="/package"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
                    >{{ $t('landing.navbar.package') }}</NuxtLinkLocale
                >
                <NuxtLinkLocale
                    to="/guide"
                    class="navbar-menu-link"
                    @click="handleOpenBurgerMenu"
                    >{{ $t('landing.navbar.guide') }}</NuxtLinkLocale
                >
                <div
                    v-if="$viewport.isLessThan('tablet')"
                    class="navbar-overlay-menu-buttons"
                >
                    <PrimeButton
                        id="navbar-overlay-login"
                        :label="$t('landing.navbar.login')"
                        severity="secondary"
                    />
                    <PrimeButton
                        id="navbar-overlay-signup"
                        :label="$t('landing.navbar.signup')"
                    />
                </div>
            </div>
        </div>
        <!-- End of Navbar Element -->

        <slot />

        <!-- Footer Element -->
        <div
            v-motion-slide-visible-bottom:duration="5000"
            class="footer-container"
        >
            <div class="footer-logo-name">
                <NuxtLinkLocale :to="baseUrl">
                    <NuxtImg
                        src="img/gradient-logo.png"
                        alt="INARI-Logo"
                        width="150"
                        height="150"
                    />
                </NuxtLinkLocale>
                <NuxtLinkLocale :to="baseUrl">
                    <h1
                        class="inari-footer-text"
                        :class="fontDMSansPrompt"
                    >
                        {{ $t('inari') }}
                    </h1>
                </NuxtLinkLocale>
            </div>

            <div
                class="footer-menu"
                :class="fontDMSansPrompt"
            >
                <NuxtLinkLocale
                    to="/"
                    class="footer-menu-link"
                    >{{ $t('landing.navbar.home') }}
                </NuxtLinkLocale>
                <NuxtLinkLocale
                    to="/feature"
                    class="footer-menu-link"
                    >{{ $t('landing.navbar.feature') }}
                </NuxtLinkLocale>
                <NuxtLinkLocale
                    to="/package"
                    class="footer-menu-link"
                    >{{ $t('landing.navbar.package') }}
                </NuxtLinkLocale>
                <NuxtLinkLocale
                    to="/guide"
                    class="footer-menu-link"
                    >{{ $t('landing.navbar.guide') }}</NuxtLinkLocale
                >
            </div>
        </div>
        <!-- End of Footer Element -->
    </div>
</template>

<script lang="ts" setup>
const { fontDMSansPrompt } = useFontClass();
const { setLocale, locale } = useI18n();
const baseUrl = useBaseUrl();

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
    z-index: 9999;
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
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: rgba(208, 208, 208, 0.95);
    overflow: hidden;
    transition: height 0.5s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 999;
}

.navbar-overlay-container.is-open {
    height: 100vh;
}

.navbar-overlay-menu {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    font-size: 20px;
    align-items: center;

    padding: 1rem;
}

.navbar-overlay-menu-buttons {
    display: flex;
    gap: 20px;
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

#navbar-overlay-login {
    width: 110px;
    height: 48px;
    font-size: 18px;
    color: #10b981;
}

#navbar-overlay-signup {
    width: 110px;
    height: 48px;
    font-size: 18px;
}

.footer-container {
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 1rem;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    background-color: #efefef;
    width: 100%;
    height: 300px;
}

.footer-logo-name {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-basis: 40%;
    flex-grow: 1;
}

.inari-footer-text {
    font-size: 48px;
    font-weight: 700;
    color: #727272;
    text-wrap: nowrap;
}

.footer-menu {
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-size: 20px;
    align-items: center;
    flex-basis: 60%;
    flex-grow: 1;
}

.footer-menu-link {
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
}

@media (max-width: 590px) {
    .footer-container {
        flex-direction: column-reverse;
        height: auto;
    }

    .inari-footer-text {
        font-size: 40px;
        font-weight: 700;
        color: #727272;
        margin-right: 0.5rem;
    }

    .footer-menu {
        flex-basis: 0;
    }

    .footer-logo-name {
        flex-basis: 0;
    }
}
</style>
