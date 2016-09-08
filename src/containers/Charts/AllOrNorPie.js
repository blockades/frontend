import React, {Component, PropTypes} from 'react';
import {
  RadialChart
} from 'react-vis';

export default class AllOrNorPie extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
  };

  render() {
    const {data, title} = this.props;
    return (
      <span style={{display: 'inline-block', width: '300px'}}>
        <span>{title}</span>
        <RadialChart
          data={data}
          width={200}
          height={200} />
      </span>
    );
  }

}
