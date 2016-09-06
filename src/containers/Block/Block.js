import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as blockActions from 'redux/modules/block';
import {isLoaded, load as loadBlock} from 'redux/modules/block';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  deferred: true,
  promise: ({params: {id}, store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
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
    load: PropTypes.func.isRequired,
  };

  render() {
    const {data, error} = this.props;
    // let refreshClassName = 'fa fa-refresh';
    // if (loading) {
    //   refreshClassName += ' fa-spin';
    // }
    const styles = require('./Block.scss');
    const title = 'Block #' + data.height;

    const listOfBlockProps = Object.entries(data)
      .map(([key, value]) => <li key={key}><b>{key}:</b> {JSON.stringify(value)}</li>);

    return (
      <div className={styles.block + ' container'}>
        <h1>{title}</h1>
        <Helmet title={title}/>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error.message || error}
        </div>}
        <div>
          {listOfBlockProps}
        </div>
      </div>
    );
  }
}
