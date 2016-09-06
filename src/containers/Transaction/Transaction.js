import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as transactionActions from 'redux/modules/transaction';
import {isLoaded, load as loadTransaction} from 'redux/modules/transaction';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  deferred: true,
  promise: ({params: {id}, store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
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
    load: PropTypes.func.isRequired,
  };

  render() {
    const {data, error} = this.props;
    // let refreshClassName = 'fa fa-refresh';
    // if (loading) {
    //   refreshClassName += ' fa-spin';
    // }
    const styles = require('./Transaction.scss');
    const title = 'Transaction #' + data.txid;

    const listOfTransactionProps = Object.entries(data)
      .map(([key, value]) => <li key={key}><b>{key}:</b> {JSON.stringify(value)}</li>);

    return (
      <div className={styles.transaction + ' container'}>
        <h1>{title}</h1>
        <Helmet title={title}/>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}
        <div>
          {listOfTransactionProps}
        </div>
      </div>
    );
  }
}
