import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as statsActions from 'redux/modules/stats';
import {isLoaded, load as loadBlocks} from 'redux/modules/stats';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadBlocks());
    }
  }
}])
@connect(
  state => ({
    data: state.stats.data,
    error: state.stats.error,
    loading: state.stats.loading
  }),
  {...statsActions})
export default class Stats extends Component {
  static propTypes = {
    data: PropTypes.object,
    error: PropTypes.object,
    loading: PropTypes.bool,
    load: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {data, error} = this.props;
    const styles = require('./Stats.scss');
    // // require the logo image both from client and server
    // const logoImage = require('./logo.png');

    let listOfProps = [];
    if (data) {
      listOfProps = Object.entries(data)
        .map(([key, value]) => <li key={key}><b>{key}:</b> {JSON.stringify(value)}</li>);
    }

    return (
      <div className={styles.stats + ' container'}>
        <h1>Stats (All time)</h1>
        <Helmet title="Stats"/>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error.message || error}
        </div>}
        <div>
          {listOfProps}
        </div>
      </div>
    );
  }
}
