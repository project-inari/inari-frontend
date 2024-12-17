<template>
    <NuxtLayout :name="layout">
        <div class="error-container">
            <div
                v-if="error.statusCode === 404"
                class="error-info-section"
                :class="fontDMSansPrompt"
            >
                <h1>{{ error.statusCode }}</h1>
                <p>{{ $t('error.404.text') }}</p>
                <NuxtLinkLocale to="/">
                    <PrimeButton
                        id="back-home-button"
                        :label="$t('error.backhomebutton')"
                    />
                </NuxtLinkLocale>
            </div>
            <div
                v-if="error.statusCode !== 404"
                class="error-info-section"
                :class="fontDMSansPrompt"
            >
                <h1>{{ error.statusCode }}</h1>
                <p>{{ $t('error.others.text') }}</p>
                <NuxtLinkLocale to="/">
                    <PrimeButton
                        id="back-home-button"
                        :label="$t('error.backhomebutton')"
                    />
                </NuxtLinkLocale>
            </div>
            <NuxtImg
                src="/img/mascot-5.png"
                width="400"
                height="400"
                sizes="(max-width: 590px) 200px, (max-width: 1020px) 250px, 400px"
            />
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
defineProps<{ error: { statusCode: number } }>();

const layout = useRoute().meta.layout || 'landingpage';
const { fontDMSansPrompt } = useFontClass();
</script>

<style lang="scss" scoped>
.error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 700px;
}

.error-info-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-basis: 30%;
    margin-top: -50px;
}

h1 {
    font-size: 150px;
    font-weight: 700;
    margin-bottom: -60px;
}

p {
    font-size: 28px;
    font-weight: 500;
    margin: 20px 0;
}

#back-home-button {
    width: 150px;
    height: 50px;
    font-size: 20px;
}

@media (max-width: 1020px) {
    h1 {
        font-size: 100px;
    }

    p {
        font-size: 20px;
    }

    #back-home-button {
        width: 100px;
        height: 40px;
        font-size: 16px;
    }
}
</style>
