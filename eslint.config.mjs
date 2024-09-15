// @ts-check

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettierPluginRecommended,

  {
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021 },
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: true,
      },
    },
  },

  // JS 타입 체크 비활성
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  {
    rules: {
      'prettier/prettier': ['warn', { endOfLine: 'auto' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // 인자들 중에서 _로 시작하는 것은 무시
          varsIgnorePattern: '^_', // 변수들 중에서 _로 시작하는 것은 무시
        },
      ],
    },
  },
);
