import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as chartsActions from 'redux/modules/charts';
import {isLoaded, load as loadCharts} from 'redux/modules/charts';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-async-connect';
import { ErrorAlert, LoadingAlert } from 'components';
import AllOrNorPlot from './AllOrNorPlot';
import AllOrNorPie from './AllOrNorPie';
import TimeSpanSelector from './TimeSpanSelector';
import {DiscreteColorLegend} from 'react-vis';

@asyncConnect([{
  deferred: true,
  promise: ({params: {period}, store: {dispatch, getState}}) => {
    if (!period) {
      return dispatch(push('/charts/year'));
    }

    if (!isLoaded(getState(), period)) {
      return dispatch(loadCharts(period));
    }
  }
}])
@connect(
  state => ({
    data: state.charts.data,
    error: state.charts.error,
    loading: state.charts.loading,
    crosshairValues: state.charts.crosshairValues,
    pieValues: state.charts.pieValues,
  }),
  {...chartsActions})
export default class Charts extends Component {

  static propTypes = {
    data: PropTypes.object,
    error: PropTypes.object,
    params: PropTypes.object,
    loading: PropTypes.bool,
    crosshairValues: PropTypes.object.isRequired,
    pieValues: PropTypes.object.isRequired,
    setCrosshairValues: PropTypes.func.isRequired,
    setPieValues: PropTypes.func.isRequired,
  };

  _updateCrosshairValues(x) {
    const findX = (pt) => pt.x === x;
    const crosshairValues = {};

    for (const [unit, points] of Object.entries(this.props.data)) {
      crosshairValues[unit] = [points.find(findX)];
    }

    this.props.setCrosshairValues(crosshairValues);
  }

  _clearCrosshairValues() {
    const crosshairValues = {};

    for (const [unit] of Object.entries(this.props.data)) {
      crosshairValues[unit] = [];
    }

    this.props.setCrosshairValues(crosshairValues);
  }

  _updatePieValues() {
    const pieValues = {};

    for (const [unit, points] of Object.entries(this.props.data)) {
      const selected = this.props.crosshairValues[unit][0];
      const last = points[points.length - 1];
      const value = selected || last;

      pieValues[unit] = [
        {angle: value.op_return},
        {angle: value.non_op_return},
      ];
    }

    this.props.setPieValues(pieValues);
  }

  _renderData(data) {
    const styles = require('./Charts.scss');
    return (
      <div>
        <div className="row">
          <div className={styles.legendContainer}>
            <DiscreteColorLegend orientation="horizontal" width={300} items={['ALL', 'OP_RETURN', 'NON_OP_RETURN']} />
          </div>
        </div>
        {['block', 'transaction', 'signal'].map(unit => (
          <div className="row" key={unit}>
            <AllOrNorPlot
              data={data[unit]} period={this.props.params.period} unit={unit}
              crosshairValues={this.props.crosshairValues[unit]}
              clearCrosshairValues={::this._clearCrosshairValues}
              updateCrosshairValues={::this._updateCrosshairValues}
              updatePieValues={::this._updatePieValues} />
          </div>
        ))}
        <div className="row">
          <div className="col-md-4">
            <AllOrNorPie data={this.props.pieValues.block} title="OP_RETURN Blocks vs All" />
          </div>
          <div className="col-md-4">
            <AllOrNorPie data={this.props.pieValues.transaction} title="OP_RETURN Transactions vs All" />
          </div>
          <div className="col-md-4">
            <AllOrNorPie data={this.props.pieValues.signal} title="OP_RETURN Signals vs All" />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {params: {period}, data, error, loading} = this.props;

    const styles = require('./Charts.scss');
    const title = period ? `Charts (${period})` : 'Charts';

    return (
      <div className={styles.charts + ' container'}>
        <h1>{title}</h1>
        <Helmet title={title}/>
        <TimeSpanSelector period={period} />
        {loading && <LoadingAlert />}
        {error && <ErrorAlert error={error} />}
        {data && this._renderData(data)}
      </div>
    );
  }

}
