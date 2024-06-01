module.exports = function override(config, env) {
  const fallback = config.resolve.fallback || {};
  //do stuff with the webpack config...

  Object.assign(fallback, {
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer/"),
  });

  config.resolve.fallback = fallback;
  return config;
};
