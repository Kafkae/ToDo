module.exports = {
  plugins: {
    autoprefixer: {
      grid: true,
    },
    cssnano: {},
    'postcss-input-range': {},
    'css-mqpacker': {},
    'postcss-preset-env': {
      browsers: 'last 10 versions',
    },
  },
};
