/* eslint-disable no-unused-vars,no-undef */
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
import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import { bindActionCreators, compose } from 'redux';
import Card from '../../../../components/Card/Card';
import { setOrgs } from '../../../../actions/orgs';
import { setMobileEvents } from '../../../../actions/events';

const UserDashboard = () => (
  <Container fluid style={{ backgroundColor: '#f2f2f2', paddingTop: 10, width: '100%', height: '100%' }}>
    <Card
      title="More Coming Soon"
      category="We're always adding new features to the system so keep an eye out for more!"
    />
  </Container>
);

UserDashboard.propTypes = {
  setOrgs: PropTypes.func,
};

UserDashboard.defaultProps = {
  setOrgs: () => {},
};

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setOrgs,
  setMobileEvents,
}, dispatch);

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps),
)(UserDashboard);
