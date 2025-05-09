<template>
    <div
        class="main-container"
        :class="fontDMSansPrompt"
    >
        Welcome to {{ businessName }} Management Dashboard!
    </div>
    <div
        class="charts-header"
        :class="fontDMSansPrompt"
    >
        Monthly Analysis
    </div>
    <div class="charts-grid">
        <PrimeChart
            type="line"
            :data="revenueData"
            :options="revenueOptions"
            class="h-[300px] w-[400px]"
        />
        <PrimeChart
            type="bar"
            :data="orderData"
            :options="orderOptions"
            class="h-[300px] w-[400px]"
        />
        <PrimeChart
            type="pie"
            :data="channelData"
            :options="channelOptions"
            class="h-[300px]"
        />
    </div>

    <div :class="fontDMSansPrompt">
        <PrimeCard class="ai-prediction-card">
            <template #title>
                <div class="card-title">
                    <img
                        src="/img/google-gemini-icon.svg"
                        alt="Gemini"
                        class="gemini-icon"
                    />
                    <span>AI-Prediction Recommendations</span>
                </div>
            </template>
            <template #content>
                <p>
                    Based on the analysis of your monthly revenue and order
                    data, we recommend the following:
                </p>
                <ul>
                    <li>
                        1) Run targeted summer promotions to smooth out mid-year
                        slowdowns.
                    </li>
                    <li>
                        2) Reallocate a larger portion of marketing spend to the
                        high-performing Online channel.
                    </li>
                    <li>
                        3) Introduce a loyalty rewards program to boost repeat
                        purchase rates.
                    </li>
                </ul>
                <p class="ai-subtext">Powered by Google Gemini</p>
            </template>
        </PrimeCard>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: 'dashboard',
});

const { fontDMSansPrompt } = useFontClass();
const currentBusinessStore = useCurrentBusinessStore();
const businessName = currentBusinessStore.businessName;

// Static month labels
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

// 1) Monthly Revenue Data & Options
const revenueData = ref({
    labels: months,
    datasets: [
        {
            label: 'Revenue',
            data: [
                120000, 135000, 150000, 140000, 130000, 125000, 145000, 155000,
                160000, 150000, 140000, 135000,
            ],
            fill: false,
            tension: 0.4,
        },
    ],
});
const revenueOptions = {
    responsive: true,
    plugins: {
        title: { display: true, text: 'Monthly Revenue', align: 'center' },
    },
    scales: {
        y: { title: { display: true, text: 'Revenue (Baht)' } },
    },
};

// 2) Monthly Orders Data & Options
const orderData = ref({
    labels: months,
    datasets: [
        {
            label: 'Orders',
            data: [500, 650, 700, 800, 750, 680, 720, 770, 810, 790, 730, 700],
        },
    ],
});
const orderOptions = {
    responsive: true,
    plugins: {
        title: { display: true, text: 'Monthly Orders', align: 'center' },
    },
    scales: {
        y: { title: { display: true, text: 'Order Count' } },
    },
};

// 3) Revenue by Channel Data & Options
const channelData = ref({
    labels: ['Online', 'Retail', 'Wholesale'],
    datasets: [
        {
            label: 'Revenue by Channel',
            data: [300000, 200000, 150000],
        },
    ],
});
const channelOptions = {
    responsive: true,
    plugins: {
        title: { display: true, text: 'Revenue by Channel', align: 'center' },
        legend: { position: 'bottom' },
    },
};
</script>

<style lang="scss" scoped>
:root {
    background-color: #f5f5f5;
}

.main-container {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
}

.charts-header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
}

.charts-grid {
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
}

.ai-prediction-card {
    width: 100%;
    margin: 0 auto;
    padding: 1.5rem;
    background-color: #fff;
    border-left: 4px solid #10b981;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
}

.gemini-icon {
    width: 24px;
    height: 24px;
}

.ai-subtext {
    font-size: 0.875rem;
    color: #727272;
    margin-top: 1rem;
}
</style>
