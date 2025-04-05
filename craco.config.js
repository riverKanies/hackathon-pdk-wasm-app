module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Enable Webpack 5 async WASM support
      webpackConfig.experiments = {
        ...webpackConfig.experiments,
        asyncWebAssembly: true,
      };

      // Add .wasm to resolvable extensions
      const wasmExtensionRegExp = /\.wasm$/;
      webpackConfig.resolve.extensions.push('.wasm');

      // Exclude .wasm from file-loader/asset modules
      webpackConfig.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.type === 'asset/resource') {
            oneOf.exclude.push(wasmExtensionRegExp);
          }
        });
      });

      // Ensure WASM files are treated as webassembly/async
      webpackConfig.module.rules.push({
        test: wasmExtensionRegExp,
        type: 'webassembly/async',
      });

      return webpackConfig;
    },
  },
};