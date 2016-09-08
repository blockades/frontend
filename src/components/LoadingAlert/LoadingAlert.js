import React, {Component} from 'react';

export default class LoadingAlert extends Component {
  render() {
    return (
      <div className="alert alert-info" role="alert">
        <span className="fa fa-refresh fa-spin" aria-hidden="true"></span> Loading...
      </div>
    );
  }
}
