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
    const period = getState().routing.locationBeforeTransitions.query.period || 'month';
    if (!isLoaded(getState())) {
      return dispatch(loadBlocks(period));
    }
  }
}])
@connect(
  state => ({
    data: state.blocks.data,
    error: state.blocks.error,
    loading: state.blocks.loading,
    period: state.blocks.period
  }),
  {...blocksActions})
export default class Blocks extends Component {
  static propTypes = {
    data: PropTypes.object,
    error: PropTypes.object,
    loading: PropTypes.bool,
    period: PropTypes.string,
    load: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = this._getDefaultState(); // TODO: move internal state to redux
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
        this.props.data.blocks.find(pt => pt.x === value.x)
      ],
      transactions: [
        this.props.data.transactions.find(pt => pt.x === value.x)
      ],
      signals: [
        this.props.data.signals.find(pt => pt.x === value.x)
      ],
    };

    const points = {
      blocks: crosshairValues.blocks[0]
        || this.props.data.blocks[this.props.data.blocks.length - 1],
      transactions: crosshairValues.transactions[0]
        || this.props.data.transactions[this.props.data.transactions.length - 1],
      signals: crosshairValues.signals[0]
        || this.props.data.signals[this.props.data.signals.length - 1],
    };

    const pieValues = {
      blocks: [
        {angle: points.blocks.op_return},
        {angle: points.blocks.non_op_return},
      ],
      transactions: [
        {angle: points.transactions.op_return},
        {angle: points.transactions.non_op_return},
      ],
      signals: [
        {angle: points.signals.op_return},
        {angle: points.signals.non_op_return},
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
      blocks: this.props.data.blocks[this.props.data.blocks.length - 1],
      transactions: this.props.data.transactions[this.props.data.transactions.length - 1],
      signals: this.props.data.signals[this.props.data.signals.length - 1],
    };

    state.pieValues = {
      blocks: [
        {angle: last.blocks.op_return + Math.floor(last.blocks.non_op_return / 10)},
        {angle: last.blocks.non_op_return},
      ],
      transactions: [
        {angle: last.transactions.op_return + Math.floor(last.transactions.non_op_return / 10)},
        {angle: last.transactions.non_op_return},
      ],
      signals: [
        {angle: last.signals.op_return + Math.floor(last.signals.non_op_return / 10)},
        {angle: last.signals.non_op_return},
      ],
    };

    this.setState(state);
  }

  _renderPlotBlocks(dataAll, dataOpReturn, dataNonOpReturn, ticks) {
    const period = this.props.period;
    let dateFormat = 'MMM YYYY';
    if (period === 'day') dateFormat = 'DD MMM YYYY';
    if (period === 'year') dateFormat = 'YYYY';
    return (
      <div>
        <h4>Blocks per {period}</h4>
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
            title={period}
            labelFormat={(xVal) => moment(xVal).format(dateFormat)}
            labelValues={ticks}
            tickValues={ticks} />
          <YAxis title="# of blocks" />
          <Crosshair
            titleFormat={(values) => ({title: 'date', value: moment(values[0].x).format(dateFormat)})}
            itemsFormat={(values) => [
              {title: 'all', value: values[0].all},
              {title: 'OP_RETURN', value: values[0].op_return},
              {title: 'non OP_RETURN', value: values[0].non_op_return},
            ]}
            values={this.state.crosshairValues.blocks}/>
        </XYPlot>
      </div>
    );
  }

  _renderPlotTransactions(dataAll, dataOpReturn, dataNonOpReturn, ticks) {
    const period = this.props.period;
    let dateFormat = 'MMM YYYY';
    if (period === 'day') dateFormat = 'DD MMM YYYY';
    if (period === 'year') dateFormat = 'YYYY';
    return (
      <div>
        <h4>Transactions per {period}</h4>
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
            title={period}
            labelFormat={(xVal) => moment(xVal).format(dateFormat)}
            labelValues={ticks}
            tickValues={ticks} />
          <YAxis title="# of transactions" />
          <Crosshair
            titleFormat={(values) => ({title: 'date', value: moment(values[0].x).format(dateFormat)})}
            itemsFormat={(values) => [
              {title: 'all', value: values[0].all},
              {title: 'OP_RETURN', value: values[0].op_return},
              {title: 'non OP_RETURN', value: values[0].non_op_return},
            ]}
            values={this.state.crosshairValues.transactions}/>
        </XYPlot>
      </div>
    );
  }

  _renderPlotSignals(dataAll, dataOpReturn, dataNonOpReturn, ticks) {
    const period = this.props.period;
    let dateFormat = 'MMM YYYY';
    if (period === 'day') dateFormat = 'DD MMM YYYY';
    if (period === 'year') dateFormat = 'YYYY';
    return (
      <div>
        <h4>Signals per {period}</h4>
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
            title={period}
            labelFormat={(xVal) => moment(xVal).format(dateFormat)}
            labelValues={ticks}
            tickValues={ticks} />
          <YAxis title="# of signals" />
          <Crosshair
            titleFormat={(values) => ({title: 'date', value: moment(values[0].x).format(dateFormat)})}
            itemsFormat={(values) => [
              {title: 'all', value: values[0].all},
              {title: 'OP_RETURN', value: values[0].op_return},
              {title: 'non OP_RETURN', value: values[0].non_op_return},
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
          data.blocks.map(pt => ({x: pt.x, y: pt.all})),
          data.blocks.map(pt => ({x: pt.x, y: pt.op_return})),
          data.blocks.map(pt => ({x: pt.x, y: pt.non_op_return})),
          data.blocks.map(pt => pt.x)
        )}
        {this._renderPlotTransactions(
          data.transactions.map(pt => ({x: pt.x, y: pt.all})),
          data.transactions.map(pt => ({x: pt.x, y: pt.op_return})),
          data.transactions.map(pt => ({x: pt.x, y: pt.non_op_return})),
          data.transactions.map(pt => pt.x)
        )}
        {this._renderPlotSignals(
          data.signals.map(pt => ({x: pt.x, y: pt.all})),
          data.signals.map(pt => ({x: pt.x, y: pt.op_return})),
          data.signals.map(pt => ({x: pt.x, y: pt.non_op_return})),
          data.signals.map(pt => pt.x)
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
        {'Will work tomorrow :)' || error.message || error}
      </div>
    );
  }

  render() {
    const {period, data, error} = this.props;
    // let refreshClassName = 'fa fa-refresh';
    // if (loading) {
    //   refreshClassName += ' fa-spin';
    // }
    const styles = require('./Blocks.scss');
    return (
      <div className={styles.blocks + ' container'}>
        <h1>Blocks ({period})</h1>
        <Helmet title="Blocks"/>
        {error && this._renderError(error)}
        {data && this._renderAllData(data)}
      </div>
    );
  }

}
