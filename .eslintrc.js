module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    "@nuxtjs",
    "prettier",
    "prettier/vue",
    "plugin:prettier/recommended",
    "plugin:nuxt/recommended"
  ],
  plugins: ["prettier"],
  // add your custom rules here
  rules: {
    // semi: 0,
    camelcase: ["error", { properties: "never" }]
    // "spaced-comment": 0,
    // useTabs: 0,
    // quotes: [1, "single"],
    // "prettier/prettier": [
    //   "error",
    //   {
    //     endOfLine: "auto"
    //   }
    // ]
  }
}
