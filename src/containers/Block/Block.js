import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as blockActions from 'redux/modules/block';
import {isLoaded, load as loadBlock} from 'redux/modules/block';
import { asyncConnect } from 'redux-async-connect';
import { ErrorAlert, LoadingAlert } from 'components';

@asyncConnect([{
  deferred: true,
  promise: ({params: {id}, store: {dispatch, getState}}) => {
    if (!isLoaded(getState(), id)) {
      return dispatch(loadBlock(id));
    }
  }
}])
@connect(
  state => ({
    data: state.block.data,
    error: state.block.error,
    loading: state.block.loading
  }),
  {...blockActions})
export default class Block extends Component {
  static propTypes = {
    data: PropTypes.object,
    error: PropTypes.object,
    loading: PropTypes.bool,
  };

  _renderData(data) {
    return (
      <div>
        {Object.entries(data).map(([key, value]) => {
          return <li key={key}><b>{key}:</b> {JSON.stringify(value)}</li>;
        })}
      </div>
    );
  }

  render() {
    const {data, error, loading} = this.props;

    const styles = require('./Block.scss');
    const title = data && ('Block #' + data.height) || 'Block';

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
