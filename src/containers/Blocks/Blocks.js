import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import moment from 'moment';
import {connect} from 'react-redux';
import * as blocksActions from 'redux/modules/blocks';
import {isLoaded, load as loadBlocks} from 'redux/modules/blocks';
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
  {...blocksActions})
export default class Blocks extends Component {
  static propTypes = {
    data: PropTypes.object,
    error: PropTypes.object,
    loading: PropTypes.bool,
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
    const labelFormatter = (xVal) => moment(xVal).format('MMM YYYY');
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
