module.exports = {
  plugins: [
    require('tailwindcss')(),
    require('./postcss-plugin-replace')({ source: 'px', target: 'var(--tpx)' }),
  ],
};
