import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';
import * as searchActions from 'redux/modules/search';
import {isLoaded, load as loadSearch} from 'redux/modules/search';
import { asyncConnect } from 'redux-async-connect';
import { ErrorAlert, LoadingAlert } from 'components';

@asyncConnect([{
  deferred: true,
  promise: ({location, store: {dispatch, getState}}) => {
    const searchQuery = location.query.q || '';
    if (!isLoaded(getState(), searchQuery)) {
      return dispatch(loadSearch(searchQuery));
    }
  }
}])
@connect(
  state => ({
    result: state.search.result,
    error: state.search.error,
    loading: state.search.loading
  }),
  {...searchActions, pushState: push})
export default class Search extends Component {
  static propTypes = {
    result: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
    location: PropTypes.object,
    pushState: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.result) {
      if (nextProps.result.type === 'block') {
        nextProps.pushState('/blocks/' + nextProps.result.resp.height);
      }

      if (nextProps.result.type === 'transaction') {
        nextProps.pushState('/transactions/' + nextProps.result.resp.txid);
      }
    }
  }

  render() {
    const {location, result, error, loading} = this.props;
    const query = location && location.query && location.query.q || null;

    const styles = require('./Search.scss');
    const title = 'Search "' + query + '"';

    return (
      <div className={styles.search + ' container'}>
        <h1>{title}</h1>
        <Helmet title={title}/>

        {loading && <LoadingAlert />}
        {error && <ErrorAlert error={error} />}

        {result && result.type === 'no_result' && 'Nothing found'}
      </div>
    );
  }
}
