const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@enums': path.resolve(__dirname, 'src/enums'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@config': path.resolve(__dirname, 'src/config'),
    },
  },
}
