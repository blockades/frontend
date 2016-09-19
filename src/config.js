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
    title: 'openblockchain.info',
    description: 'the bastard love child of blockchain.info & coinsecrets.org',
    github: 'https://github.com/open-blockchain/openblockchain',
    whitePaper: 'https://www.ascribe.io/app/editions/1BuYHxbHBirCZASALZw1VDzcjerLeutUAo',
    head: {
      titleTemplate: '%s – openblockchain.info',
      meta: [
        {name: 'description', content: 'openblockchain.info'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'openblockchain.info'},
        {property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'openblockchain.info'},
        {property: 'og:description', content: 'openblockchain.info'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@dan-mi-sun'},
        {property: 'og:creator', content: '@dan-mi-sun'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
