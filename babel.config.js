module.exports = function babelConfig(api) {
  api.cache.using(() => process.env.NODE_ENV);

  const config = {
    presets: [
      // presets list
      [
        "@babel/preset-env",
        {
          modules: "auto",
        },
      ],
    ],
    plugins: [
      // plugin list
      "@babel/plugin-transform-runtime",
    ],
  };

  return config;
};
