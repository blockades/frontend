import React, {Component, PropTypes} from 'react';
import numeral from 'numeral';
import moment from 'moment';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  Crosshair,
  makeWidthFlexible
} from 'react-vis';

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

export default class AllOrNorPlot extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    span: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    crosshairValues: PropTypes.array.isRequired,
    clearCrosshairValues: PropTypes.func.isRequired,
    updateCrosshairValues: PropTypes.func.isRequired,
    updatePieValues: PropTypes.func.isRequired,
  };

  _onNearestX(value) {
    this.props.updateCrosshairValues(value.x);
    this.props.updatePieValues();
  }

  _onMouseLeave() {
    this.props.clearCrosshairValues();
    this.props.updatePieValues();
  }

  render() {
    const {data, span, unit, crosshairValues} = this.props;

    const dataAll = data.map(pt => ({x: pt.x, y: pt.all}));
    const dataOpReturn = data.map(pt => ({x: pt.x, y: pt.op_return}));
    const dataNonOpReturn = data.map(pt => ({x: pt.x, y: pt.non_op_return}));
    const ticks = data
      .map(pt => pt.x);

    let dateFormat = 'DD MMM YYYY';
    if (span === 'year') dateFormat = 'MMM YYYY';
    if (span === 'alltime') dateFormat = 'YYYY';

    let tickFormat = 'D';
    if (span === 'month') tickFormat = 'D';
    if (span === 'year') tickFormat = 'MMM';
    if (span === 'alltime') tickFormat = 'YYYY';

    let unitNamePl;
    if (unit === 'block') unitNamePl = 'Blocks';
    if (unit === 'transaction') unitNamePl = 'Transactions';
    if (unit === 'signal') unitNamePl = 'Signals';

    const titleFormat = (values) => ({
      title: 'date',
      value: values[0] && values[0].x && moment(values[0].x).format(dateFormat) || ''
    });

    const itemsFormat = (values) => [
      {title: 'ALL', value: values[0] && values[0].all || '-'},
      {title: 'OP_RETURN', value: values[0] && values[0].op_return || '-'},
      {title: 'NON_OP_RETURN', value: values[0] && values[0].non_op_return || '-'},
    ];

    const timeTickFormat = (xVal) => {
      return moment(xVal).format(tickFormat);
    };

    const numTickFormat = (yVal) => {
      return numeral(yVal).format('0a');
    };

    const margins = {
      left: 40,
      right: 20,
      top: 10,
      bottom: 40,
    };

    return (
      <div>
        <h4>{unitNamePl} per {span}</h4>
        <FlexibleXYPlot onMouseLeave={::this._onMouseLeave} height={300} xType="time-utc" margin={margins}>
          <HorizontalGridLines />
          <VerticalGridLines tickValues={ticks} />
          <LineSeries onNearestX={::this._onNearestX} data={dataAll} />
          <LineSeries data={dataOpReturn} />
          <LineSeries data={dataNonOpReturn} />
          <XAxis title="time" tickFormat={timeTickFormat} tickValues={ticks} />
          <YAxis title={`# of ${unit}s`} tickFormat={numTickFormat} />
          <Crosshair titleFormat={titleFormat} itemsFormat={itemsFormat} values={crosshairValues} />
        </FlexibleXYPlot>
      </div>
    );
  }

}
