<template>
    <div>
        <div>
            <h2>Button</h2>
            <Button
                text-label="Check"
                button-icon="pi pi-check"
                :rounded="false"
                severity="primary"
            />
        </div>
        <div>
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
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    title: 'Design Page - Button',
    description: 'Page to showcase design components - Button',
    layout: 'designsystem',
});

const propColumns = [
    { field: 'name', header: 'Name' },
    { field: 'type', header: 'Type' },
    { field: 'default', header: 'Default' },
    { field: 'example', header: 'Example' },
    { field: 'description', header: 'Description' },
];

const propsList = [
    {
        name: ':text-label',
        type: 'string',
        default: '',
        example: 'Check',
        description: 'Text label for button element',
    },
    {
        name: ':button-icon',
        type: 'string',
        default: '',
        example: 'pi pi-check',
        description: 'Icon for button element',
    },
    {
        name: ':rounded',
        type: 'boolean',
        default: 'false',
        example: 'true',
        description: 'Rounded button element',
    },
    {
        name: ':severity',
        type: 'string',
        default: 'primary',
        example: 'primary',
        description: 'Severity of button element',
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
