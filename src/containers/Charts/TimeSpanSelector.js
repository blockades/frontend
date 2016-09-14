import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import moment from 'moment';

export default class TimeSpanSelector extends Component {

  static propTypes = {
    span: PropTypes.string.isRequired,
    t: PropTypes.string,
    tNext: PropTypes.string,
    tPrev: PropTypes.string,
  };

  render() {
    const styles = require('./Charts.scss');
    const {span, t, tNext, tPrev} = this.props;

    const getActiveCls = (spanToCheck) => {
      if (span === spanToCheck) {
        return styles.itemActive;
      }
      return '';
    };

    const spanName = (rawSpan) => {
      let name = rawSpan;
      if (rawSpan === 'day') name = 'Day';
      if (rawSpan === 'week') name = 'Week';
      if (rawSpan === 'month') name = 'Month';
      if (rawSpan === 'year') name = 'Year';
      if (rawSpan === 'alltime') name = 'All Time';
      return name;
    };

    return (
      <div>
        <ul className={styles.spansList}>
          {
            ['month', 'year', 'alltime'].map(listSpan => {
              let tNew;

              if (t && span === 'year' && listSpan === 'month') {
                tNew = 'Jan ' + t;
              }

              if (t && span === 'month' && listSpan === 'year') {
                tNew = moment(t, 'MMM YYYY').year() + '';
              }

              return (
                <li className={getActiveCls(listSpan)} key={listSpan}>
                  <Link to={{
                    pathname: '/charts',
                    query: {
                      span: listSpan,
                      t: tNew
                    }
                  }}>{spanName(listSpan)}</Link>
                </li>
              );
            })
          }
        </ul>
        {t &&
          <p className={styles.timeNavBar}>
            {tPrev && <Link to={{pathname: '/charts', query: {span, t: tPrev}}} className={styles.timeNavArrow}>&lt;&lt;</Link>}
            <span>{t}</span>
            {tNext && <Link to={{pathname: '/charts', query: {span, t: tNext}}} className={styles.timeNavArrow}>&gt;&gt;</Link>}
          </p>
        }
      </div>
    );
  }

}
