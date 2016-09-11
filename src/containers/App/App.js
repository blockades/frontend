import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import * as appActions from 'redux/modules/app';
import { push } from 'react-router-redux';
import config from '../../config';
import Input from 'react-bootstrap/lib/Input';

@connect(
  state => ({
    searchQuery: state.app.searchQuery,
  }),
  {...appActions, pushState: push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    searchQuery: PropTypes.string,
    location: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.setSearchQuery(this.props.location.query.q || '');
  }

  handleSearchChange(event) {
    this.props.setSearchQuery(event.target.value);
  }

  handleSearchKeyPress(target) {
    if (target.charCode === 13) {
      const query = this.props.searchQuery;
      if (query) {
        this.props.pushState({
          pathname: '/search',
          query: {
            q: query
          }
        });
      }
    }
  }

  render() {
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/" activeStyle={{color: '#33e0ff'}}>
                <div className={styles.brand}/>
                <span>{config.app.title}</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>

          <Navbar.Collapse eventKey={0}>
            <Nav navbar>
              <LinkContainer to="/stats">
                <NavItem eventKey={2}>Stats</NavItem>
              </LinkContainer>
              <LinkContainer to="/charts" activeStyle={{color: '#33e0ff'}}>
                <NavItem eventKey={2}>Charts</NavItem>
              </LinkContainer>
            </Nav>
            <Nav navbar pullRight className={styles.rightNav}>
              <NavItem className={styles.searchItem}>
                <Input type="text" placeholder="Search" value={this.props.searchQuery || ''}
                  onChange={::this.handleSearchChange} onKeyPress={::this.handleSearchKeyPress} />
              </NavItem>
              <NavItem className={styles.githubItem} eventKey={1} target="_blank"
                  title="View on Github" href={config.app.github}>
                <i className="fa fa-github"/>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          {this.props.children}
        </div>

        <footer className="well text-center" style={{marginBottom: 0}}>
          OpenBlockChain 2016
        </footer>
      </div>
    );
  }
}
