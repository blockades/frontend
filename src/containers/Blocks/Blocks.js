import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import moment from 'moment';
import {connect} from 'react-redux';
import * as blocksActions from 'redux/modules/blocks';
import {isLoaded, load as loadBlocks} from 'redux/modules/blocks';
import {initializeWithKey} from 'redux-form';
import { asyncConnect } from 'redux-async-connect';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries} from 'react-vis';

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
    const {error} = this.props;
    // let refreshClassName = 'fa fa-refresh';
    // if (loading) {
    //   refreshClassName += ' fa-spin';
    // }
    const styles = require('./Blocks.scss');
    // const dataPoints = data && data.data || [];
    const dataPoints = [
      {x: 1173600000000, y: 10},
      {x: 1173686400000, y: 20},
      {x: 1173772800000, y: 30},
      {x: 1173859200000, y: 25},
      {x: 1173945600000, y: 45},
    ];
    const labelFormatter = (xVal) => moment(xVal).format('YYYY-MM-DD');
    const labelTickValues = dataPoints.map((point) => point.x);
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
          <XYPlot width={600} height={300} xType="time-utc">
            <HorizontalGridLines />
            <VerticalGridLines />
            <LineSeries data={dataPoints} />
            <XAxis title="Day" labelFormat={labelFormatter} labelValues={labelTickValues} tickValues={labelTickValues} />
            <YAxis title="# of blocks" />
          </XYPlot>
        </div>
      </div>
    );
  }
}
