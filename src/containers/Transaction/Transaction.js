import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as transactionActions from 'redux/modules/transaction';
import {isLoaded, load as loadTransaction} from 'redux/modules/transaction';
import { asyncConnect } from 'redux-async-connect';
import { ErrorAlert, LoadingAlert } from 'components';

@asyncConnect([{
  deferred: true,
  promise: ({params: {id}, store: {dispatch, getState}}) => {
    if (!isLoaded(getState(), id)) {
      return dispatch(loadTransaction(id));
    }
  }
}])
@connect(
  state => ({
    data: state.transaction.data,
    error: state.transaction.error,
    loading: state.transaction.loading
  }),
  {...transactionActions})
export default class Transaction extends Component {
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

    const styles = require('./Transaction.scss');
    const title = data && ('Transaction #' + data.height) || 'Transaction';

    return (
      <div className={styles.transaction + ' container'}>
        <h1>{title}</h1>
        <Helmet title={title}/>

        {loading && <LoadingAlert />}
        {error && <ErrorAlert error={error} />}

        {data && this._renderData(data)}
      </div>
    );
  }
}
