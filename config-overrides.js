module.exports = {
  webpack: function(config, env) {
    config.experiments = {
      asyncWebAssembly: true,
      topLevelAwait: true,
    };
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.wasm$/,
        type: 'webassembly/async',
      },
    ]
    return config;
  },
}
