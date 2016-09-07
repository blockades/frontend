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
    this.state = this._getDefaultState();
  }

  _getDefaultState() {
    return {
      crosshairValues: {
        blocks: [],
        transactions: [],
        signals: [],
      },
      pieValues: {
        blocks: [
          {angle: 1},
          {angle: 1},
        ],
        transactions: [
          {angle: 1},
          {angle: 1},
        ],
        signals: [
          {angle: 1},
          {angle: 1},
        ],
      },
    };
  }

  /**
   * Event handler for onNearestX.
   * @param {number} seriesIndex Index of the series.
   * @param {Object} value Selected value.
   * @private
   */
  _onNearestX(chartName, value) {
    const crosshairValues = {
      blocks: [
        this.props.data.blocks.data.find(pt => pt.x === value.x)
      ],
      transactions: [
        this.props.data.transactions.data.find(pt => pt.x === value.x)
      ],
      signals: [
        this.props.data.signals.data.find(pt => pt.x === value.x)
      ],
    };

    const points = {
      blocks: crosshairValues.blocks[0]
        || this.props.data.blocks.data[this.props.data.blocks.data.length - 1],
      transactions: crosshairValues.transactions[0]
        || this.props.data.transactions.data[this.props.data.transactions.data.length - 1],
      signals: crosshairValues.signals[0]
        || this.props.data.signals.data[this.props.data.signals.data.length - 1],
    };

    const pieValues = {
      blocks: [
        {angle: points.blocks.opReturn + 500}, // mock
        {angle: points.blocks.nonOpReturn},
      ],
      transactions: [
        {angle: points.transactions.opReturn + 500}, // mock
        {angle: points.transactions.nonOpReturn},
      ],
      signals: [
        {angle: points.signals.opReturn + 500}, // mock
        {angle: points.signals.nonOpReturn},
      ],
    };

    this.setState({
      crosshairValues,
      pieValues
    });
  }

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _onMouseLeave() {
    const state = this._getDefaultState();

    const last = {
      blocks: this.props.data.blocks.data[this.props.data.blocks.data.length - 1],
      transactions: this.props.data.transactions.data[this.props.data.transactions.data.length - 1],
      signals: this.props.data.signals.data[this.props.data.signals.data.length - 1],
    };

    state.pieValues = {
      blocks: [
        {angle: last.blocks.opReturn + Math.floor(last.blocks.nonOpReturn / 10)},
        {angle: last.blocks.nonOpReturn},
      ],
      transactions: [
        {angle: last.transactions.opReturn + Math.floor(last.transactions.nonOpReturn / 10)},
        {angle: last.transactions.nonOpReturn},
      ],
      signals: [
        {angle: last.signals.opReturn + Math.floor(last.signals.nonOpReturn / 10)},
        {angle: last.signals.nonOpReturn},
      ],
    };

    this.setState(state);
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

  _renderPlotTransactions(dataAll, dataOpReturn, dataNonOpReturn, ticks) {
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
            titleFormat={(values) => ({title: 'date', value: moment(values[0].x).format('MMM YYYY')})}
            itemsFormat={(values) => [
              {title: 'all', value: values[0].all},
              {title: 'OP_RETURN', value: values[0].opReturn},
              {title: 'non OP_RETURN', value: values[0].nonOpReturn},
            ]}
            values={this.state.crosshairValues.transactions}/>
        </XYPlot>
      </div>
    );
  }

  _renderPlotSignals(dataAll, dataOpReturn, dataNonOpReturn, ticks) {
    return (
      <div>
        <h4>Signals per Month</h4>
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
          <YAxis title="# of signals" />
          <Crosshair
            titleFormat={(values) => ({title: 'date', value: moment(values[0].x).format('MMM YYYY')})}
            itemsFormat={(values) => [
              {title: 'all', value: values[0].all},
              {title: 'OP_RETURN', value: values[0].opReturn},
              {title: 'non OP_RETURN', value: values[0].nonOpReturn},
            ]}
            values={this.state.crosshairValues.signals}/>
        </XYPlot>
      </div>
    );
  }

  _renderPieBlocks(data) {
    return (
      <span style={{display: 'inline-block', width: '200px'}}>
        <span>OP_RETURN Blocks vs All Blocks</span>
        <RadialChart
          data={data}
          width={200}
          height={200} />
      </span>
    );
  }

  _renderPieTransactions(data) {
    return (
      <span style={{display: 'inline-block', width: '200px'}}>
        <span>OP_RETURN Transactions vs All Transactions</span>
        <RadialChart
          data={data}
          width={200}
          height={200} />
      </span>
    );
  }

  _renderPieSignals(data) {
    return (
      <span style={{display: 'inline-block', width: '200px'}}>
        <span>OP_RETURN Signals vs All Signals</span>
        <RadialChart
          data={data}
          width={200}
          height={200} />
      </span>
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
        {this._renderPlotTransactions(
          data.transactions.data.map(pt => ({x: pt.x, y: pt.all})),
          data.transactions.data.map(pt => ({x: pt.x, y: pt.opReturn})),
          data.transactions.data.map(pt => ({x: pt.x, y: pt.nonOpReturn})),
          data.transactions.data.map(pt => pt.x)
        )}
        {this._renderPlotSignals(
          data.signals.data.map(pt => ({x: pt.x, y: pt.all})),
          data.signals.data.map(pt => ({x: pt.x, y: pt.opReturn})),
          data.signals.data.map(pt => ({x: pt.x, y: pt.nonOpReturn})),
          data.signals.data.map(pt => pt.x)
        )}
        {this._renderPieBlocks(this.state.pieValues.blocks)}
        {this._renderPieTransactions(this.state.pieValues.transactions)}
        {this._renderPieSignals(this.state.pieValues.signals)}
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
