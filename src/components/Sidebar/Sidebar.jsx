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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Nav } from 'react-bootstrap';
import React, { Component } from 'react';
import { isEmpty, withFirebase } from 'react-redux-firebase';
import { adminRoutes, godRoutes, userRoutes } from '../../routes';
import imagine from '../../assets/img/dancer.jpg';
import logo from '../../assets/img/pacalendar.png';
import { Link, withRouter } from "react-router-dom";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
    };
    this.redirectAction = this.redirectAction.bind(this);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  activeRoute() {
    return '';
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }

  redirectAction(e, location) {
    const { toggleSidebar, history } = this.props;
    toggleSidebar(e);
    history.push(location);
  }

  renderActionButton() {
    const { firebase, auth, toggleSidebar } = this.props;
    const { logout } = firebase;
    switch (!isEmpty(auth)) {
      case true:
        return (
          <Nav.Link
            className="nav-link"
            activeclassname="active"
            onClick={(e) => {
              toggleSidebar(e);
              logout();
            }}
          >
            <i className="fa fa-sign-out" />
            <p>Log Out</p>
          </Nav.Link>
        );
      case false:
        return (
          <Nav.Link className="nav-link" activeclassname="active" onClick={e => this.redirectAction(e, '/login')}>
            <i className="fa fa-sign-out" />
            <p>Log In</p>
          </Nav.Link>
        );
      default:
        return null;
    }
  }

  renderRoutes(auth, profile) {
    let routes = [];
    if (!isEmpty(auth) && profile && typeof profile.permissionLevel !== 'undefined' && profile.permissionLevel !== null) {
      switch (profile.permissionLevel) {
        case 0:
          routes = [...userRoutes, ...adminRoutes, ...godRoutes];
          break;
        case 1:
          routes = [...userRoutes, ...adminRoutes];
          break;
        case 2:
          routes = [...userRoutes];
          break;
        default:
          console.log('USER DOES NOT HAVE PERMISSIONS SOMEHOW');
      }
      return routes.map((route, index) => (
        <li className={this.activeRoute(route.path)} key={index}>
          <Nav.Link className="nav-link" activeclassname="active" onClick={e => this.redirectAction(e, route.path)}>
            <i className={route.icon} />
            <p>{route.alias}</p>
          </Nav.Link>
        </li>
      ));
    }
    return [];
  }

  render() {
    const { width } = this.state;
    const { auth, profile } = this.props;
    const sidebarBackground = { backgroundImage: `url(${imagine})` };
    return (
      <div id="sidebar" className="sidebar" data-color="black" data-image={imagine}>
        <div className="sidebar-background" style={sidebarBackground} />
        <div className="logo">
          <Link to="/" className="logo-container" onClick={e => this.redirectAction(e, '/')}>
            <img src={logo} alt="logo_image" className="logo-img" />
            <div className="simple-text logo-text">&nbsp;PACalendar</div>
          </Link>
        </div>
        <div className="sidebar-wrapper">
          <ul className="nav">
            <li className={this.activeRoute('/')} key={-1}>
              {width <= 991 && this.renderActionButton()}
            </li>
            {this.renderRoutes(auth, profile)}
          </ul>
        </div>
      </div>
    );
  }
}


Sidebar.propTypes = {
  permissions: PropTypes.number,
};

Sidebar.defaultProps = {
  permissions: 3,
};

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
});

export default compose(
  withRouter,
  withFirebase,
  connect(mapStateToProps),
)(Sidebar);
