import withNuxt from './.nuxt/eslint.config.mjs';
import vue from 'eslint-plugin-vue';
import nuxt from 'eslint-plugin-nuxt';

export default withNuxt(
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            'no-console': 'warn',
        },
    },
    {
        files: ['**/*.vue'],
        plugins: [vue, nuxt],
        rules: {
            'no-console': 'warn',
            '@typescript-eslint/no-explicit-any': [
                'off',
                { ignoreRestArgs: true },
            ],
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            'vue/no-v-html': 'off',
            'vue/multi-word-component-names': 'off',
            'max-len': 'off',
            'vue/first-attribute-linebreak': 'off',
            'vue/html-self-closing': 'off',
        },
    },
);
