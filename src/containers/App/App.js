import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import { push } from 'react-router-redux';
import config from '../../config';
import Input from 'react-bootstrap/lib/Input';

@connect(
  null,
  {pushState: push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {}; // TODO use redux
  }

  handleSearchChange(event) {
    this.setState({searchValue: event.target.value});
  }

  handleSearchKeyPress(target) {
    if (target.charCode === 13) {
      const value = this.state.searchValue;
      if (value) {
        if (value.length === 64) {
          // tx or block
        } else {
          this.props.pushState('/blocks/' + value);
        }
      }
    }
  }

  render() {
    // const {user} = this.props;
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
              <LinkContainer to="/charts">
                <NavItem eventKey={2}>Charts</NavItem>
              </LinkContainer>
            </Nav>
            <Nav navbar pullRight className={styles.rightNav}>
              <NavItem className={styles.searchItem}>
                <Input type="text" placeholder="Search..." value={this.state.searchValue || ''}
                  onChange={::this.handleSearchChange} onKeyPress={::this.handleSearchKeyPress} />
              </NavItem>
              <NavItem className={styles.githubItem} eventKey={1} target="_blank"
                  title="View on Github" href="https://github.com/dan-mi-sun/frontend">
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
