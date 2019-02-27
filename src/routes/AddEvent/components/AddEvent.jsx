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
import { Container } from 'react-bootstrap';
import { bindActionCreators, compose } from 'redux';
import { withFirebase } from 'react-redux-firebase';
import Card from '../../../components/Card/Card';
import { setUsers } from '../../../actions/users';
import Event from '../../../components/Forms/Event';
import { UserIsAuthenticated } from '../../../utils/router';
import { EVENT_FORM_NAME } from '../../../constants/formNames';
import withNotifications from '../../../components/Notifications/NotificationsHOC';
import '../../../../node_modules/react-datetime/css/react-datetime.css';

class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const { firebase, loadUsers } = this.props;
    firebase.ref('Web/Users').once('value').then((snapshot) => {
      loadUsers(snapshot.val());
    });
  }

  handleSubmit(event) {
    const { showError, showSuccess, firebase } = this.props;
    firebase.ref('Web/Events').push(event, (err) => {
      if (err) {
        showError(err);
      } else {
        fetch(`${process.env.REACT_APP_API_URL}/api/new-event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `A new event has been created - ${event.title}` }),
        }).then(() => {
          showSuccess('Event has been added successfully and is ready for review!');
        }).catch((error) => {
          console.error(error);
          showError(error);
        });
      }
    });
  }

  render() {
    return (
      <Container fluid style={{ backgroundColor: '#f2f2f2', paddingTop: 10 }}>
        <Card
          title="Add Event"
          content={<Event hasReset hasSubmit onSubmit={this.handleSubmit} form={EVENT_FORM_NAME} />}
        />
      </Container>
    );
  }
}

AddEvent.defaultProps = {
  orgs: {},
  firebase: {},
  showError: () => {},
  loadUsers: () => {},
  showSuccess: () => {},
};

AddEvent.propTypes = {
  orgs: PropTypes.shape({}),
  showError: PropTypes.func,
  loadUsers: PropTypes.func,
  showSuccess: PropTypes.func,
  firebase: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  orgs: state.orgs.model,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  loadUsers: setUsers,
}, dispatch);


export default compose(
  UserIsAuthenticated,
  withFirebase,
  withNotifications,
  connect(mapStateToProps, mapDispatchToProps),
)(AddEvent);
