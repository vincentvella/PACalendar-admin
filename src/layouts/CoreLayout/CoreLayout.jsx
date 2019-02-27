/* eslint-disable no-undef,react/no-string-refs,react/destructuring-assignment,no-underscore-dangle,no-shadow,no-array-index-key */
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

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { isLoaded } from 'react-redux-firebase';
import NotificationSystem from 'react-notification-system';
import { logOut } from '../../actions/login';
import { style } from '../../variables/Variables';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';

class CoreLayout extends Component {
  constructor(props) {
    super(props);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.state = {
      sidebarExists: false,
    };
  }

  toggleSidebar(e) {
    const { sidebarExists } = this.state;
    if (sidebarExists === false) this.setState({ sidebarExists: true });
    e.preventDefault();
    document.documentElement.classList.toggle('nav-open');
    const node = document.createElement('div');
    node.onclick = () => {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle('nav-open');
    };
    document.body.appendChild(node);
    return true;
  }

  render() {
    const { logOut, children } = this.props;
    return (
      <div className="wrapper">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Sidebar {...this.props} logOut={logOut} toggleSidebar={this.toggleSidebar} />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <Header logOut={logOut} toggleSidebar={this.toggleSidebar} />
          {isLoaded ? children : null}
        </div>
      </div>
    );
  }
}

CoreLayout.propTypes = {
  logOut: PropTypes.func,
  permissions: PropTypes.number,
};

CoreLayout.defaultProps = {
  logOut: () => {},
  permissions: 3,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  logOut,
}, dispatch);

export default connect(
  ({ firebase: { auth, profile } }) => ({ auth, profile }),
  mapDispatchToProps,
  null,
  { pure: false },
)(CoreLayout);
