import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';

export default class TimeSpanSelector extends Component {

  static propTypes = {
    period: PropTypes.string.isRequired,
  };

  render() {
    const styles = require('./Charts.scss');
    const period = this.props.period;

    const getActiveCls = (periodToCheck) => {
      if (period === periodToCheck) {
        return styles.itemActive;
      }
      return '';
    };

    return (
      <ul className={styles.spansList}>
        {
          ['day', 'week', 'month', 'year'].map(span => (
            <li className={getActiveCls(span)} key={span}>
              <Link to={`/charts/${span}`}>{span}</Link>
            </li>
          ))
        }
      </ul>
    );
  }

}
