module.exports = function(config, _) {
  if (process.env.NODE_ENV === "production") {
    // webpack-runtime inside main.js
    config.optimization.runtimeChunk = false;
    delete config.optimization.splitChunks;

    // pretty html (easier to copy)
    config.plugins[0].options.minify.collapseWhitespace = false;

    // css-styles in main.js (instead of separate .css-file)
    var oneOfRules = config.module.rules.find(rule => rule.oneOf !== undefined)
      .oneOf;
    oneOfRules.unshift({
      test: /\.css$/,
      use: [{ loader: "style-loader" }, { loader: "css-loader" }]
    });
  }
  return config;
};
