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
        <p>openblockchain.info is a web application which allows simple statistical analysis of potential ‘social and cultural’ uses of the Bitcoin blockchain by an untrained user. The user can navigate various available charts, selecting more fine-grained parameters for display on the charts. She can also zoom into information of individual Transactions and Blocks and can view statistics relating to the entire blockchain, or over user defined time-spans.</p>

        <p>An advanced user is able to deploy the entire application by harnessing the Docker setup allowing her to run her own cluster locally or in the cloud.</p>
      </div>
    );
  }
}
