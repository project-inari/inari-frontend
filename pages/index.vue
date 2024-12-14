<template>
    <div>
        <!-- Hero Element -->
        <div
            v-motion-slide-visible-bottom:duration="10000"
            class="hero-container"
            style="background-image: url('/img/landing/hero-bg.png')"
        >
            <div
                class="hero-content"
                :class="fontDMSansPrompt"
            >
                <span class="hero-content--maintext">{{
                    $t('landing.hero.maintext1')
                }}</span
                ><br />
                <span class="hero-content--maintext">{{
                    $t('landing.hero.maintext2')
                }}</span
                ><br />
                <span class="hero-content--maintext">{{
                    $t('landing.hero.maintext3')
                }}</span
                ><br />
                <span class="hero-content--maintext">{{
                    $t('landing.hero.maintext4')
                }}</span
                ><br />
                <span class="hero-content--subtext">{{
                    $t('landing.hero.subtext')
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
                    :label="$t('landing.hero.ctabutton')"
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

        <!-- Key Features Element -->
        <div
            v-motion-slide-visible-bottom:duration="10000"
            class="key-features-container"
        >
            <h2
                class="key-features-header"
                :class="fontDMSansPrompt"
            >
                {{ $t('landing.keyfeatures.header') }}
            </h2>
            <div
                class="key-features-content"
                :class="fontDMSansPrompt"
            >
                <div class="key-feature">
                    <NuxtImg
                        src="/img/landing/key-features-1.png"
                        height="150"
                        width="150"
                    />
                    <div class="key-features-content-text">
                        <h3 class="key-feature-title">
                            {{ $t('landing.keyfeatures.feature1.title') }}
                        </h3>
                        <p class="key-feature-subtitle">
                            {{ $t('landing.keyfeatures.feature1.subtitle') }}
                        </p>
                        <p class="key-feature-description">
                            {{ $t('landing.keyfeatures.feature1.description') }}
                        </p>
                    </div>
                </div>
                <div class="key-feature-rev">
                    <NuxtImg
                        src="/img/landing/key-features-2.png"
                        height="150"
                        width="150"
                    />
                    <div class="key-features-content-text">
                        <h3 class="key-feature-title">
                            {{ $t('landing.keyfeatures.feature2.title') }}
                        </h3>
                        <p class="key-feature-subtitle">
                            {{ $t('landing.keyfeatures.feature2.subtitle') }}
                        </p>
                        <p class="key-feature-description">
                            {{ $t('landing.keyfeatures.feature2.description') }}
                        </p>
                    </div>
                </div>
                <div class="key-feature">
                    <NuxtImg
                        src="/img/landing/key-features-3.png"
                        height="150"
                        width="150"
                    />
                    <div class="key-features-content-text">
                        <h3 class="key-feature-title">
                            {{ $t('landing.keyfeatures.feature3.title') }}
                        </h3>
                        <p class="key-feature-subtitle">
                            {{ $t('landing.keyfeatures.feature3.subtitle') }}
                        </p>
                        <p class="key-feature-description">
                            {{ $t('landing.keyfeatures.feature3.description') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- End of Key Features Element -->

        <!-- Why Choose Us Element -->
        <div
            v-motion-slide-visible-bottom:duration="10000"
            class="why-choose-us-container"
        >
            <div class="why-choose-us-layer-background" />
            <div
                class="why-choose-us-layer-content-box"
                :class="fontDMSansPrompt"
            >
                <h2 class="why-choose-us-header">
                    {{ $t('landing.whychooseus.header') }}
                </h2>
                <div class="why-choose-us-contents">
                    <div class="why-choose-us-content">
                        <div class="why-choose-us-content-left-section">
                            <h2 class="why-choose-us-content-no">01</h2>
                            <h3 class="why-choose-us-content-title">
                                {{ $t('landing.whychooseus.content1.title') }}
                            </h3>
                        </div>
                        <p class="why-choose-us-content-description">
                            {{ $t('landing.whychooseus.content1.description') }}
                        </p>
                    </div>
                    <div class="why-choose-us-content">
                        <div class="why-choose-us-content-left-section">
                            <h2 class="why-choose-us-content-no">02</h2>
                            <h3 class="why-choose-us-content-title">
                                {{ $t('landing.whychooseus.content2.title') }}
                            </h3>
                        </div>
                        <p class="why-choose-us-content-description">
                            {{ $t('landing.whychooseus.content2.description') }}
                        </p>
                    </div>
                    <div class="why-choose-us-content">
                        <div class="why-choose-us-content-left-section">
                            <h2 class="why-choose-us-content-no">03</h2>
                            <h3 class="why-choose-us-content-title">
                                {{ $t('landing.whychooseus.content3.title') }}
                            </h3>
                        </div>
                        <p class="why-choose-us-content-description">
                            {{ $t('landing.whychooseus.content3.description') }}
                        </p>
                    </div>
                    <div class="why-choose-us-content">
                        <div class="why-choose-us-content-left-section">
                            <h2 class="why-choose-us-content-no">04</h2>
                            <h3 class="why-choose-us-content-title">
                                {{ $t('landing.whychooseus.content4.title') }}
                            </h3>
                        </div>
                        <p class="why-choose-us-content-description">
                            {{ $t('landing.whychooseus.content4.description') }}
                        </p>
                    </div>
                    <div class="why-choose-us-content">
                        <div class="why-choose-us-content-left-section">
                            <h2 class="why-choose-us-content-no">05</h2>
                            <h3 class="why-choose-us-content-title">
                                {{ $t('landing.whychooseus.content5.title') }}
                            </h3>
                        </div>
                        <p class="why-choose-us-content-description">
                            {{ $t('landing.whychooseus.content5.description') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- End of Why Choose Us Element -->
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
// hero styles
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

// key features styles
.key-features-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.key-features-header {
    font-size: 36px;
    font-weight: 600;
    padding: 20px;
}

.key-features-content {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    gap: 20px;
    padding: 20px;
}

.key-feature,
.key-feature-rev {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex-basis: 33%;
}

.key-features-content-text,
.key-features-content-text-rev {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.key-feature-description,
.key-feature-description-rev {
    font-size: 16px;
    font-weight: 300;
    color: #727272;
    text-align: center;
}

.key-feature-title {
    font-size: 24px;
    font-weight: 600;
}

.key-feature-subtitle {
    font-size: 20px;
    font-weight: 400;
}

@media (max-width: 1190px) {
    .key-features-content {
        flex-direction: column;
        gap: 50px;
    }

    .key-feature,
    .key-feature-rev {
        gap: 60px;
    }

    .key-feature {
        flex-direction: row;
    }

    .key-feature-rev {
        flex-direction: row-reverse;

        .key-features-content-text {
            align-items: flex-end;
        }

        .key-feature-title {
            text-align: right;
        }

        .key-feature-subtitle {
            text-align: right;
        }

        .key-feature-description {
            text-align: right;
        }
    }

    .key-features-content-text {
        align-items: flex-start;
    }

    .key-feature-description {
        text-align: left;
    }
}

@media (max-width: 590px) {
    .key-features-header {
        font-size: 26px;
    }

    .key-feature-title {
        font-size: 20px;
    }

    .key-feature-subtitle {
        font-size: 16px;
    }

    .key-feature-description {
        font-size: 14px;
    }

    .key-feature,
    .key-feature-rev {
        gap: 30px;
    }
}

// why choose us styles
.why-choose-us-container {
    position: relative;
    height: 800px;
    margin: 20px;
}

.why-choose-us-layer-background {
    position: absolute;
    width: 90%;
    height: 750px;
    background-color: #c5fff2;
    opacity: 0.7;
    border-radius: 25px;
    margin: auto;
    top: 0;
    bottom: 60px;
    left: 0;
    right: 60px;
    z-index: 1;
}

.why-choose-us-layer-content-box {
    position: absolute;
    width: 90%;
    height: 750px;
    background-color: #c5fff2;
    border-radius: 25px;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.why-choose-us-header {
    font-size: 36px;
    font-weight: 600;
    padding: 20px;
    flex-grow: 0;
}

.why-choose-us-contents {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    padding-left: 10px;
    padding-right: 20px;
    padding-bottom: 30px;
}

.why-choose-us-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 30px;
}

.why-choose-us-content-left-section {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-basis: 50%;
}

.why-choose-us-content-no {
    font-size: 50px;
    font-weight: 800;
    border-right: thick solid #000000;
    width: 100px;
    flex-grow: 0;
    flex-shrink: 0;
}

.why-choose-us-content-title {
    font-size: 24px;
    font-weight: 600;
    text-align: left;
    white-space: pre-wrap;
}

.why-choose-us-content-description {
    font-size: 16px;
    font-weight: 300;
    color: #727272;
    text-align: right;
    flex-basis: 55%;
    text-wrap: balance;
}
</style>
