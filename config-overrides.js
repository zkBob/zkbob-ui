const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = {
  webpack: function(config, env) {
    config.experiments = {
      asyncWebAssembly: true,
      topLevelAwait: true,
    };
    config.module.rules = [
      ...config.module.rules,
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
      new CopyPlugin({
        patterns: [
          { from: 'node_modules/zkbob-client-js/lib/*.worker.js', to: "static/media/[name][ext]" }
        ],
      }),
      new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
      }),
    ];
    if (process.env.SENTRY_ORG) {
      config.plugins.push(
        new SentryWebpackPlugin({
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          include: './build',
          authToken: process.env.SENTRY_AUTH_TOKEN,
        })
      );
    }
    return config;
  },
  devServer: function(configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.headers = {
        ...config.headers,
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      };
      return config;
    };
  },
}
