const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,

  // Configuración para archivos normales (Node)
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "commonjs",
      globals: {
        process: "readonly",
        console: "readonly"
      }
    }
  },

  // Configuración específica para tests (Jest)
  {
    files: ["test/**/*.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly"
      }
    }
  }
];
