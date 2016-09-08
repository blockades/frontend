import React, {Component, PropTypes} from 'react';

export default class ErrorAlert extends Component {
  static propTypes = {
    error: PropTypes.any
  }

  render() {
    let {error} = this.props;

    if (!error) {
      error = 'Unknown error occured. Nobody knows what\'s wrong, sorry... maybe it\'ll work tomorrow!';
    } else if (typeof error.message === 'string') {
      error = error.message;
    } else {
      error = JSON.stringify(error);
    }

    return (
      <div className="alert alert-danger" role="alert">
        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> {error}
      </div>
    );
  }
}
