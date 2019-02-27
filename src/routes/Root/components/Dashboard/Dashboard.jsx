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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { isEmpty, withFirebase } from 'react-redux-firebase';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import { setOrgs } from '../../../../actions/orgs';
import { setMobileEvents } from '../../../../actions/events';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
    };
    this.getUserStats = this.getUserStats.bind(this);
  }

  componentWillMount() {
    const { firebase, loadOrgs, loadMobileEvents } = this.props;
    firebase.ref('/Orgs').once('value').then((snapshot) => {
      loadOrgs(snapshot.val());
    });
    firebase.ref('/Mobile/Events').once('value').then((snapshot) => {
      loadMobileEvents(snapshot.val());
    });
    this.getUserStats();
  }

  async getUserStats() {
    const rawUserData = await fetch(`${process.env.REACT_APP_API_URL}/api/users-summary`);
    const userData = await rawUserData.json();
    this.setState({ userData });
  }

  render() {
    const { userData } = this.state;
    const { profile, auth, events } = this.props;
    let creationData = { labels: [], series: [] };
    let signInData = { labels: [], series: [] };
    if (userData) {
      const { creation, signIn } = userData;
      if (creation) {
        const series = [Object.keys(creation).map(timeKey => creation[timeKey])];
        creationData = { labels: [], series };
      }
      if (signIn) {
        const series = [Object.keys(signIn).map(timeKey => signIn[timeKey])];
        signInData = { labels: [], series };
      }
    }
    const eventData = Object.keys(events).reduce((eventGenres, eventKey) => {
      events[eventKey].category.forEach((c) => {
        const index = eventGenres.labels.indexOf(c.value);
        if (index > -1) {
          eventGenres.series[index] += 1;
        }
      });
      return eventGenres;
    }, {
      labels: ['Dance', 'Theatre', 'Visual Arts', 'Comedy', 'Music/Instrumental', 'A Cappella/Vocal', 'Writing'],
      series: [0, 0, 0, 0, 0, 0, 0],
    });
    if (!isEmpty(auth) && profile && typeof profile.permissionLevel !== 'undefined' && profile.permissionLevel !== null) {
      if (profile.permissionLevel >= 2) {
        return (
          <UserDashboard />
        );
      }
      return (
        <AdminDashboard
          userData={userData}
          eventData={eventData}
          signInData={signInData}
          creationData={creationData}
        />
      );
    }
    return <LoadingSpinner />;
  }
}

Dashboard.propTypes = {
  loadOrgs: PropTypes.func,
  loadMobileEvents: PropTypes.func,
};

Dashboard.defaultProps = {
  events: {},
  loadOrgs: () => {},
  loadMobileEvents: () => {},
};

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  events: state.events.model.mobile,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  loadOrgs: setOrgs,
  loadMobileEvents: setMobileEvents,
}, dispatch);

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps),
)(Dashboard);
