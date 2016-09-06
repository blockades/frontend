import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as signalActions from 'redux/modules/signal';
import {isLoaded, load as loadTransaction} from 'redux/modules/signal';
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
    data: state.signal.data,
    error: state.signal.error,
    loading: state.signal.loading
  }),
  {...signalActions})
export default class Signal extends Component {
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
    const styles = require('./Signal.scss');
    const title = 'Signal #' + data.txid;

    const listOfTransactionProps = Object.entries(data)
      .map(([key, value]) => <li key={key}><b>{key}:</b> {JSON.stringify(value)}</li>);

    return (
      <div className={styles.signal + ' container'}>
        <h1>{title}</h1>
        <Helmet title={title}/>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error.message || error}
        </div>}
        <div>
          {listOfTransactionProps}
        </div>
      </div>
    );
  }
}
