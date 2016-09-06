import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as blocksActions from 'redux/modules/blocks';
import {isLoaded, load as loadBlocks} from 'redux/modules/blocks';
import {initializeWithKey} from 'redux-form';
import { asyncConnect } from 'redux-async-connect';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';

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
    data: state.blocks.data,
    error: state.blocks.error,
    loading: state.blocks.loading
  }),
  {...blocksActions, initializeWithKey })
export default class Blocks extends Component {
  static propTypes = {
    data: PropTypes.object,
    error: PropTypes.object,
    loading: PropTypes.bool,
    initializeWithKey: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired
  };

  render() {
    const {data, error} = this.props;
    // let refreshClassName = 'fa fa-refresh';
    // if (loading) {
    //   refreshClassName += ' fa-spin';
    // }
    const styles = require('./Blocks.scss');
    const dataPoints = data && data.data || [];
    dataPoints.push({x: 1202450000, y: 5});
    dataPoints.push({x: 1202460000, y: 10});
    dataPoints.push({x: 1202490000, y: 100});
    dataPoints.push({x: 1202480000, y: 1});
    return (
      <div className={styles.blocks + ' container'}>
        <h1>Blocks</h1>
        <Helmet title="Blocks"/>
        <p>Stats etc</p>
        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}
        <div>
          <XYPlot width={300} height={300}>
            <HorizontalGridLines />
            <LineSeries data={dataPoints} />
            <XAxis />
            <YAxis />
          </XYPlot>
        </div>
      </div>
    );
  }
}
