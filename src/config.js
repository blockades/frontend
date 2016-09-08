require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'OpenBlockChain',
    description: 'OpenBlockChain',
    github: 'https://github.com/dan-mi-sun/frontend',
    head: {
      titleTemplate: '%s – OpenBlockChain',
      meta: [
        {name: 'description', content: 'OpenBlockChain'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'OpenBlockChain'},
        {property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'OpenBlockChain'},
        {property: 'og:description', content: 'OpenBlockChain'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@dan-mi-sun'},
        {property: 'og:creator', content: '@dan-mi-sun'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
