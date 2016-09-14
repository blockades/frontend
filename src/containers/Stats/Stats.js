import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as statsActions from 'redux/modules/stats';
import {isLoaded, load as loadStats} from 'redux/modules/stats';
import { asyncConnect } from 'redux-async-connect';
import { ErrorAlert, LoadingAlert } from 'components';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadStats());
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
    error: PropTypes.string,
    loading: PropTypes.bool,
    load: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  _renderData(data) {
    return (
      <ul>
        {Object.entries(data)
          .map(([key, value]) => {
            return (
              <li key={key}>
                <b>{key}:</b> {JSON.stringify(value)}
              </li>
            );
          })}
      </ul>
    );
  }

  render() {
    const {data, error, loading} = this.props;

    const styles = require('./Stats.scss');
    const title = 'Stats (All time)';

    return (
      <div className={styles.block + ' container'}>
        <h1>{title}</h1>
        <Helmet title={title}/>

        {loading && <LoadingAlert />}
        {error && <ErrorAlert error={error} />}

        {data && this._renderData(data)}
      </div>
    );
  }
}
