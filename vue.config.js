const ManifestPlugin = require("webpack-manifest-plugin");
const nodeExternals = require("webpack-node-externals");
const path = require('path');

exports.chainWebpack = (webpackConfig) => {

  if (process.env.SSR) {

    webpackConfig
      .entry("app")
      .clear()
      .add("./src/main.server.ts");

    webpackConfig.target("node");
    webpackConfig.output.libraryTarget("commonjs2");

    webpackConfig
      .plugin("manifest")
      .use(new ManifestPlugin({ fileName: "ssr-manifest.json" }));

    webpackConfig.externals(nodeExternals({ allowlist: [
      /\.(css|vue)$/,
      /@babel/,
    ] }));

    webpackConfig.optimization.splitChunks(false).minimize(false);

    webpackConfig.plugins.delete("hmr");
    webpackConfig.plugins.delete("preload");
    webpackConfig.plugins.delete("prefetch");
    webpackConfig.plugins.delete("progress");
    webpackConfig.plugins.delete("friendly-errors");

  } else {

    webpackConfig.externals({
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'element-plus': 'ElementPlus',
    });

  }

};

exports.filenameHashing = false;

if (process.env.SSR) {
  exports.outputDir = path.resolve(__dirname, 'build', 'ssr');
}
