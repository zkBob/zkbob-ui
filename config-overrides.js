const webpack = require('webpack');

module.exports = {
  webpack: function(config, env) {
    config.experiments = {
      asyncWebAssembly: true,
      topLevelAwait: true,
    };
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
      },
      {
        test: /\.wasm$/,
        type: 'asset/resource',
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.bin/,
        type: 'asset/resource'
      },
      {
        resourceQuery: /asset/,
        type: 'asset/resource',
      },
    ];
    const index1 = config.module.rules.findIndex(rule => rule.oneOf);
    const index2 = config.module.rules[index1].oneOf.findIndex(rule => String(rule.test) === String(/\.(js|mjs)$/));
    config.module.rules[index1].oneOf[index2].exclude = /(@babel(?:\/|\\{1,2})runtime|.*worker.*)/;

    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      url: require.resolve('url/'),
    };
    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
      }),
    ];
    return config;
  },
}
