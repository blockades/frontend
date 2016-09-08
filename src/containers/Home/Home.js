import React, { Component } from 'react';
import Helmet from 'react-helmet';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    // // require the logo image both from client and server
    // const logoImage = require('./logo.png');
    return (
      <div className={styles.home + ' container'}>
        <h1>Home</h1>
        <Helmet title="Home"/>
        Hello, world!
      </div>
    );
  }
}
