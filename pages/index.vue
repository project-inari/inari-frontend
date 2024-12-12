<template>
    <div>
        <!-- Hero Element -->
        <div
            v-motion-slide-visible-bottom:duration="10000"
            class="hero-container"
            style="background-image: url('/img/hero-bg.png')"
        >
            <div
                class="hero-content"
                :class="fontDMSansPrompt"
            >
                <span class="hero-content--maintext">{{
                    $t('hero.maintext1')
                }}</span
                ><br />
                <span class="hero-content--maintext">{{
                    $t('hero.maintext2')
                }}</span
                ><br />
                <span class="hero-content--maintext">{{
                    $t('hero.maintext3')
                }}</span
                ><br />
                <span class="hero-content--maintext">{{
                    $t('hero.maintext4')
                }}</span
                ><br />
                <span class="hero-content--subtext">{{
                    $t('hero.subtext')
                }}</span>
                <br
                    v-if="$viewport.isGreaterThan('mobile')"
                    class="hero-content--text-button-break"
                />
                <NuxtImg
                    v-if="$viewport.isLessThan('tablet')"
                    src="/img/mascot-3.png"
                    height="200"
                />
                <PrimeButton
                    id="hero-cta-button"
                    :label="$t('hero.cta.button')"
                    icon="pi pi-angle-double-right"
                    icon-pos="right"
                />
            </div>
            <div
                v-if="$viewport.isGreaterThan('mobile')"
                class="hero-image"
            >
                <NuxtImg
                    src="/img/mascot-3.png"
                    height="400"
                />
            </div>
        </div>
        <!-- End of Hero Element -->
    </div>
</template>

<script lang="ts" setup>
const { fontDMSansPrompt } = useFontClass();

definePageMeta({
    title: 'INARI Inventory Management System',
    description: 'Landing page for INARI Inventory Management System',
    layout: 'landingpage',
});
</script>

<style lang="scss" scoped>
.hero-container {
    height: 450px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background-size: cover;
    background-position: center;
    padding: 0 20px;

    @media (max-width: 590px) {
        height: 550px;
    }
}

.hero-content {
    &--maintext {
        font-size: 40px;
        font-weight: 700;
    }

    &--subtext {
        font-size: 36px;
        font-weight: 300;
    }

    &--text-button-break {
        display: block;
        content: '';
        margin-top: 10px;
    }
}

@media (max-width: 590px) {
    .hero-content {
        &--maintext {
            font-size: 32px;
        }

        &--subtext {
            font-size: 26px;
        }
    }
}

#hero-cta-button {
    width: 350px;
    height: 48px;
    font-size: 20px;
}
</style>
