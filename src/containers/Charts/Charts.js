import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as chartsActions from 'redux/modules/charts';
import {isLoaded, load as loadCharts} from 'redux/modules/charts';
import { asyncConnect } from 'redux-async-connect';
import { ErrorAlert, LoadingAlert } from 'components';
import AllOrNorPlot from './AllOrNorPlot';
import AllOrNorPie from './AllOrNorPie';
import TimeSpanSelector from './TimeSpanSelector';
import {DiscreteColorLegend} from 'react-vis';

@asyncConnect([{
  deferred: true,
  promise: ({location, store: {dispatch, getState}}) => {
    const {span, t} = location.query;
    if (!isLoaded(getState(), span, t)) {
      return dispatch(loadCharts(span, t));
    }
  }
}])
@connect(
  state => ({
    data: state.charts.data,
    error: state.charts.error,
    loading: state.charts.loading,
    span: state.charts.span,
    t: state.charts.t,
    tPrev: state.charts.tPrev,
    tNext: state.charts.tNext,
    crosshairValues: state.charts.crosshairValues,
    pieValues: state.charts.pieValues,
  }),
  {...chartsActions})
export default class Charts extends Component {

  static propTypes = {
    data: PropTypes.object,
    error: PropTypes.string,
    params: PropTypes.object,
    loading: PropTypes.bool,
    span: PropTypes.string,
    t: PropTypes.string,
    tPrev: PropTypes.string,
    tNext: PropTypes.string,
    location: PropTypes.object.isRequired,
    crosshairValues: PropTypes.object.isRequired,
    pieValues: PropTypes.object.isRequired,
    setCrosshairValues: PropTypes.func.isRequired,
    setPieValues: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this._updatePieValues();
  }

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

    if (!this.props.data) {
      return;
    }

    for (const [unit, points] of Object.entries(this.props.data)) {
      const values = this.props.crosshairValues[unit];
      const selected = values && values[0];

      if (!selected) {
        return;
      }

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
              data={data[unit]} span={this.props.span} unit={unit}
              crosshairValues={this.props.crosshairValues[unit]}
              clearCrosshairValues={::this._clearCrosshairValues}
              updateCrosshairValues={::this._updateCrosshairValues}
              updatePieValues={::this._updatePieValues} />
          </div>
        ))}
        <br />
        <h4>OP_RETURN vs All</h4>
        <br />
        <div className="row">
          <div className="col-md-3 col-xs-6">
            <AllOrNorPie data={this.props.pieValues.block} title="Blocks" />
          </div>
          <div className="col-md-3 col-xs-6">
            <AllOrNorPie data={this.props.pieValues.transaction} title="Transactions" />
          </div>
          <div className="col-md-3 col-xs-6">
            <AllOrNorPie data={this.props.pieValues.signal} title="Signals" />
          </div>
          <div className="col-md-3 col-xs-6">
            <DiscreteColorLegend orientation="vertical" width={200} items={['OP_RETURN', 'NON_OP_RETURN']} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {data, error, loading} = this.props;
    let {span, t, tPrev, tNext} = this.props;

    const styles = require('./Charts.scss');
    const title = 'Charts';

    return (
      <div className={styles.charts + ' container'}>
        <h1>{title}</h1>
        <Helmet title={title}/>
        <TimeSpanSelector span={span} t={t} tNext={tNext} tPrev={tPrev} />
        {loading && <LoadingAlert />}
        {error && <ErrorAlert error={error} />}
        {data && this._renderData(data)}
      </div>
    );
  }

}
