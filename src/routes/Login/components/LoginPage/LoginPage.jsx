/* eslint-disable no-shadow */
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
import { Card, Container } from 'react-bootstrap';
import { bindActionCreators, compose } from 'redux';
import { withFirebase } from 'react-redux-firebase';
import LoginForm from '../LoginForm/LoginForm';
import { authUser, setUserInfo } from '../../../../actions/login';
import { UserIsNotAuthenticated } from '../../../../utils/router';

const performance = require('../../../../assets/img/opt-performance.jpeg');

const containerStyle = {
  backgroundColor: '#f2f2f2',
  backgroundImage: `url(${performance})`,
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
};

class LoginPage extends Component {
  static onSubmitFail(formErrs, dispatch, err) {
    console.error(formErrs ? 'Form Invalid' : err.message || 'Error');
  }

  constructor(props) {
    super(props);
    this.emailLogin = this.emailLogin.bind(this);
  }

  emailLogin(creds) {
    const { firebase } = this.props;
    firebase.login(creds).catch(err => console.error(err.message));
  }

  render() {
    return (
      <Container fluid style={containerStyle}>
        <Card style={{ flex: 1, padding: 30, minHeight: 300, maxHeight: 200, maxWidth: 400 }}>
          <LoginForm onSubmit={this.emailLogin} onSubmitFail={LoginPage.onSubmitFail} />
        </Card>
      </Container>
    );
  }
}

LoginPage.propTypes = {
  firebase: PropTypes.shape({}),
};

LoginPage.defaultProps = {
  firebase: {},
};

const mapDispatchToProps = dispatch => bindActionCreators({
  setUserInfo,
  authUser,
}, dispatch);

export default compose(
  UserIsNotAuthenticated,
  withFirebase,
  connect(null, mapDispatchToProps),
)(LoginPage);
