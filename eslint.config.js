import eslintPlugin from '@typescript-eslint/eslint-plugin';
import eslistParser from '@typescript-eslint/parser';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {

    plugins: {
      '@typescript-eslint': eslintPlugin
    },
    languageOptions: {
      parser: eslistParser,
      parserOptions: {
        "ecmaVersion": "latest",
        "sourceType": "module"
      }
    },
    "rules": {
      "implicit-arrow-linebreak": [
        "error",
        "below"
      ],
      "arrow-body-style": [
        "error",
        "as-needed"
      ],
      "global-require": 0,
      "import/no-default-export": 0,
      "import/no-extraneous-dependencies": 0,
      "import/no-named-as-default-member": 0,
      "import/no-named-as-default": 0,
      "import/no-useless-path-segments": 0,
      "import/prefer-default-export": 0,
      "key-spacing": [
        "error",
        {
          "beforeColon": false,
          "afterColon": true
        }
      ],
      "max-len": [
        "error",
        {
          "code": 165
        }
      ],
      "no-shadow": 0,
      "object-curly-newline": 0,
      "object-curly-spacing": [
        "error",
        "always"
      ],
      "no-multiple-empty-lines": 0,
      "no-extra-boolean-cast": 2,
      "no-unsafe-optional-chaining": "off",
      "indent": [
        "error",
        2
      ],
      "semi": [
        "error",
        "always"
      ],
      "brace-style": [
        "error",
        "stroustrup"
      ],
      "no-param-reassign": 0,
      "prefer-regex-literals": 0,
      "default-param-last": 0
    },
    ignores: ['node_modules/*','dist/*']
  }

];
