import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import moment from 'moment';
import {connect} from 'react-redux';
import * as blocksActions from 'redux/modules/blocks';
import {isLoaded, load as loadBlocks} from 'redux/modules/blocks';
import { asyncConnect } from 'redux-async-connect';
import {
  RadialChart,
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  Crosshair
} from 'react-vis';

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

  constructor(props) {
    super(props);
    this.state = {
      crosshairValues: {
        blocks: [],
        transactions: [],
      }
    };
  }

  /**
   * Event handler for onNearestX.
   * @param {number} seriesIndex Index of the series.
   * @param {Object} value Selected value.
   * @private
   */
  _onNearestX(chartName, value) {
    this.setState({
      crosshairValues: {
        blocks: [
          this.props.data.blocks.data.find(pt => pt.x === value.x)
        ],
        transactions: [
          this.props.data.transactions.data.find(pt => pt.x === value.x)
        ],
      }
    });
  }

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _onMouseLeave() {
    this.setState({
      crosshairValues: {
        blocks: [],
        transactions: []
      }
    });
  }

  _renderPie1(data) {
    return (
      <div>
        <h4>{data.opReturnBlocksVsBlocks.name}</h4>
        <RadialChart
          data={data.opReturnBlocksVsBlocks.data.map(pt => ({angle: pt.x}))}
          width={300}
          height={300} />
      </div>
    );
  }

  _renderPlotBlocks(dataAll, dataOpReturn, dataNonOpReturn, ticks) {
    return (
      <div>
        <h4>Blocks per Month</h4>
        <XYPlot
          onMouseLeave={::this._onMouseLeave}
          width={600}
          height={300}
          xType="time-utc">
          <HorizontalGridLines />
          <VerticalGridLines />
          <LineSeries
            onNearestX={this._onNearestX.bind(this, 'blocks')}
            data={dataAll} />
          <LineSeries
            data={dataOpReturn} />
          <LineSeries
            data={dataNonOpReturn} />
          <XAxis
            title="Month"
            labelFormat={(xVal) => moment(xVal).format('MMM YYYY')}
            labelValues={ticks}
            tickValues={ticks} />
          <YAxis title="# of blocks" />
          <Crosshair
            titleFormat={(values) => ({title: 'date', value: moment(values[0].x).format('MMM YYYY')})}
            itemsFormat={(values) => [
              {title: 'all', value: values[0].all},
              {title: 'OP_RETURN', value: values[0].opReturn},
              {title: 'non OP_RETURN', value: values[0].nonOpReturn},
            ]}
            values={this.state.crosshairValues.blocks}/>
        </XYPlot>
      </div>
    );
  }

  _renderPlotTx(dataAll, dataOpReturn, dataNonOpReturn, ticks) {
    return (
      <div>
        <h4>Transactions per Month</h4>
        <XYPlot
          onMouseLeave={::this._onMouseLeave}
          width={600}
          height={300}
          xType="time-utc">
          <HorizontalGridLines />
          <VerticalGridLines />
          <LineSeries
            onNearestX={this._onNearestX.bind(this, 'blocks')}
            data={dataAll} />
          <LineSeries
            data={dataOpReturn} />
          <LineSeries
            data={dataNonOpReturn} />
          <XAxis
            title="Month"
            labelFormat={(xVal) => moment(xVal).format('MMM YYYY')}
            labelValues={ticks}
            tickValues={ticks} />
          <YAxis title="# of transactions" />
          <Crosshair
            titleFormat={(values) => ({title: 'count', value: values[0].y})}
            itemsFormat={(values) => [
              {title: 'date', value: moment(values[0].x).format('MMM YYYY')}
            ]}
            values={this.state.crosshairValues.transactions}/>
        </XYPlot>
      </div>
    );
  }

  _renderAllData(data) {
    return (
      <div>
        {this._renderPlotBlocks(
          data.blocks.data.map(pt => ({x: pt.x, y: pt.all})),
          data.blocks.data.map(pt => ({x: pt.x, y: pt.opReturn})),
          data.blocks.data.map(pt => ({x: pt.x, y: pt.nonOpReturn})),
          data.blocks.data.map(pt => pt.x)
        )}
        {this._renderPlotTx(
          data.transactions.data.map(pt => ({x: pt.x, y: pt.all})),
          data.transactions.data.map(pt => ({x: pt.x, y: pt.opReturn})),
          data.transactions.data.map(pt => ({x: pt.x, y: pt.nonOpReturn})),
          data.transactions.data.map(pt => pt.x)
        )}
        {this._renderPie1(data)}
      </div>
    );
  }

  _renderError(error) {
    return (
      <div className="alert alert-danger" role="alert">
        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        {' '}
        {error.message || error}
      </div>
    );
  }

  render() {
    const {data, error} = this.props;
    // let refreshClassName = 'fa fa-refresh';
    // if (loading) {
    //   refreshClassName += ' fa-spin';
    // }
    const styles = require('./Blocks.scss');
    return (
      <div className={styles.blocks + ' container'}>
        <h1>Blocks</h1>
        <Helmet title="Blocks"/>
        {error && this._renderError(error)}
        {data && this._renderAllData(data)}
      </div>
    );
  }

}
//
// <h4>{data.opReturnBlocksPerDay.name}</h4>
// <XYPlot width={600} height={300} xType="time-utc">
//   <HorizontalGridLines />
//   <VerticalGridLines />
//   <LineSeries data={data.opReturnBlocksPerDay.data} />
//   <XAxis
//     title="Month"
//     labelFormat={(xVal) => moment(xVal).format('MMM YYYY')}
//     labelValues={data.opReturnBlocksPerDay.data.map((point) => point.x)}
//     tickValues={data.opReturnBlocksPerDay.data.map((point) => point.x)} />
//   <YAxis title="# of blocks" />
// </XYPlot>
