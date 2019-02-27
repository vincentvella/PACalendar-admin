/**
 *   PACalendar - the first Penn State based arts events calendar for students, by students
 *   Copyright (C) 2019 Vincent Vella
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { compose } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, withFirebase } from 'react-redux-firebase';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import logo from '../../assets/img/pacalendar.png';

class Header extends Component {
  constructor(props) {
    super(props);
    this.redirectAction = this.redirectAction.bind(this);
  }

  redirectAction(e, location) {
    const { toggleSidebar, history } = this.props;
    toggleSidebar(e);
    history.push(location);
  }

  renderActionButton() {
    const { firebase, auth } = this.props;
    const { logout } = firebase;
    switch (!isEmpty(auth)) {
      case true:
        return <LogoutButton logout={logout} />;
      case false:
        return <LoginButton color="black" />;
      default:
        return null;
    }
  }

  render() {
    const { toggleSidebar } = this.props;
    return (
      <Navbar expand="lg" bg="light" variant="light" sticky="top" style={{ flexWrap: 'wrap', minWidth: 250, borderRadius: 0, display: 'flex', justifyContent: 'flex-start', position: 'sticky', boxShadow: '0 8px 6px -6px #999' }}>
        <Navbar.Toggle style={{ borderColor: '#FFFFFF', padding: 0 }}>
          <Navbar.Brand to="/" as={Link} style={{ padding: 0, margin: 0, boxShadow: '0 6px 15px -6px #999' }}>
            <img src={logo} alt="logo" width="50" height="50" className="d-inline-block align-top" />
          </Navbar.Brand>
          <Navbar.Brand to="/" as={Link} style={{ margin: 0, paddingLeft: 5 }}>&nbsp;PACalendar</Navbar.Brand>
        </Navbar.Toggle>
        <Navbar.Toggle onClick={toggleSidebar} style={{ position: 'absolute', top: 15, right: 15, cursor: 'pointer' }} />
        <Navbar.Collapse style={{ position: 'absolute', top: 0, right: 0, padding: 10, cursor: 'pointer' }}>
          {this.renderActionButton()}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default compose(
  withRouter,
  withFirebase,
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(Header);
