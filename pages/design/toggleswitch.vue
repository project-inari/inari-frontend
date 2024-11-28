<template>
    <div>
        <h2 class="component-title">ToggleSwitch</h2>

        <div>
            <h3 class="variant-header--default">Default</h3>
            <ToggleSwitch
                :checked="true"
                @change="change"
            />
            <p>Value: {{ e }}</p>

            <h3 class="variant-header--large">Large</h3>
            <ToggleSwitch
                :checked="e"
                :large="true"
            />
        </div>

        <div class="props-table-container">
            <h3 class="props-table-header">Props</h3>
            <PrimeDataTable
                class="props-table"
                :value="propsList"
                table-style="min-width: 50rem"
                show-gridlines
            >
                <PrimeColumn
                    v-for="col of propColumns"
                    :key="col.field"
                    class="props-table-column"
                    :field="col.field"
                    :header="col.header"
                />
            </PrimeDataTable>
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    title: 'Design Page - ToggleSwitch',
    description: 'Page to showcase design components - ToggleSwitch',
    layout: 'designsystem',
});

const e = ref(true);
const change = () => {
    e.value = !e.value;
};

const propColumns = [
    { field: 'name', header: 'Name' },
    { field: 'type', header: 'Type' },
    { field: 'default', header: 'Default' },
    { field: 'example', header: 'Example' },
    { field: 'description', header: 'Description' },
];

const propsList = [
    {
        name: ':checked',
        type: 'boolean',
        default: 'false',
        example: 'true',
        description: 'Default status of toggleswitch element',
    },
    {
        name: ':large',
        type: 'boolean',
        default: 'false',
        example: 'true',
        description: 'Enable larger size of toggleswitch element',
    },
    {
        name: '@change',
        type: 'function',
        default: '() => {}',
        example: '() => { e.value = !e.value; }',
        description: 'Callback to invoke when toggleswitch element is clicked',
    },
];
</script>

<style lang="scss" scoped>
.component-title {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.variant-header {
    font-weight: 600;
}

.props-table-header {
    font-weight: 800;
}

:deep(.p-datatable-column-header-content) {
    justify-content: center;
}

:deep(.p-datatable-column-title) {
    font-weight: bold;
}
</style>
