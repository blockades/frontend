import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as blocksActions from 'redux/modules/blocks';
import {isLoaded, load as loadWidgets} from 'redux/modules/blocks';
import {initializeWithKey} from 'redux-form';
import { asyncConnect } from 'redux-async-connect';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadWidgets());
    }
  }
}])
@connect(
  state => ({
    data: state.blocks.data,
    editing: state.blocks.editing,
    error: state.blocks.error,
    loading: state.blocks.loading
  }),
  {...blocksActions, initializeWithKey })
export default class Widgets extends Component {
  static propTypes = {
    data: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    initializeWithKey: PropTypes.func.isRequired,
    editing: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired
  };

  render() {
    // const {data, editing, error, loading} = this.props;
    const {error, loading} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const styles = require('./Blocks.scss');
    return (
      <div className={styles.widgets + ' container'}>
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
          <XYPlot
            width={300}
            height={300}>
            <HorizontalGridLines />
            <LineSeries
              data={[
                {x: 1, y: 10},
                {x: 2, y: 5},
                {x: 3, y: 15}
              ]}/>
            <XAxis />
            <YAxis />
          </XYPlot>
        </div>
      </div>
    );
  }
}
