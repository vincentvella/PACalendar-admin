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

import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DateTimeField from 'react-datetime';
import React, { Component, Fragment } from 'react';
import { withFirebase } from 'react-redux-firebase';
import { bindActionCreators, compose } from 'redux';
import { Col, ListGroup, Row, Container } from 'react-bootstrap';
import Card from '../../../components/Card/Card';
import { setUsers } from '../../../actions/users';
import { UserIsAdmin } from '../../../utils/router';
import Event from '../../../components/Forms/Event';
import { setMobileEvents } from '../../../actions/events';
import { GOD_MODE_FORM_NAME } from '../../../constants/formNames';
import Button from '../../../components/CustomButton/CustomButton';
import withNotifications from '../../../components/Notifications/NotificationsHOC';

class GodMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      selectedDate: null,
    };
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.resetCalendar = this.resetCalendar.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
  }

  componentWillMount() {
    const { firebase, setEvents, loadUsers } = this.props;
    firebase.ref('Mobile/Events').once('value').then((snapshot) => {
      setEvents(snapshot.val());
    });
    firebase.ref('Web/Users').once('value').then((snapshot) => {
      loadUsers(snapshot.val());
    });
  }

  onEdit(event) {
    const { selected } = this.state;
    const { firebase, showSuccess, showError } = this.props;
    firebase.ref(`Mobile/Events/${selected}`).set(event, (err) => {
      if (err) {
        showError(err.message);
      } else {
        this.clearSelected();
        showSuccess('You\'ve edited an in-app event!');
      }
    });
  }

  onDelete() {
    const { selected } = this.state;
    const { firebase, showSuccess, showError } = this.props;
    firebase.ref(`Mobile/Events/${selected || 1}`).remove((error) => {
      if (error) {
        showError(error.message);
      } else {
        this.clearSelected();
        showSuccess('Event successfully removed');
      }
    });
  }

  clearSelected() {
    const { firebase, setEvents } = this.props;
    this.setState({ selected: '' });
    firebase.ref('Mobile/Events').once('value').then((snapshot) => {
      setEvents(snapshot.val());
    });
  }

  resetCalendar() {
    this.setState({ selectedDate: null });
  }

  render() {
    const { events } = this.props;
    const { selected, selectedDate } = this.state;
    const eventKeys = Object.keys(events).reduce((keys, curr) => {
      if (selectedDate) {
        if (moment(new Date(events[curr].startDateTime)).format('DD MM YYYY') === moment(new Date(selectedDate)).format('DD MM YYYY')) {
          keys.push(curr);
        }
      } else {
        keys.push(curr);
      }
      return keys;
    }, []);
    if (eventKeys && eventKeys.length && eventKeys.length > 0) {
      eventKeys.sort((a, b) =>
        (new Date(events[a].startDateTime).getTime() < new Date(events[b].startDateTime).getTime()
          ? -1
          : 1
        ));
    }
    return (
      <div className="full-screen">
        <Container fluid style={{ backgroundColor: '#f2f2f2' }}>
          <Row>
            <Col sm={12} md={6} lg={6}>
              <Card
                cardStyles={{ style: { minHeight: 450 } }}
                title="Filter events"
                category="Select a date to narrow down event results."
                content={(
                  <Container fluid>
                    <Col sm={16} md={16} lg={8}>
                      <div>
                        <DateTimeField
                          input={false}
                          timeFormat={false}
                          onChange={newVal => this.setState({ selectedDate: newVal.toDate() })}
                          value={selectedDate}
                        />
                      </div>
                    </Col>
                    <Col sm={4} md={6} lg={4}>
                      <Button variant="primary" type="submit" onClick={this.resetCalendar}>
                        Reset
                      </Button>
                    </Col>
                  </Container>
                )}
              />
            </Col>
            <Col sm={16} md={6} lg={6}>
              <Card
                badge={eventKeys.length}
                title="Mobile App Events"
                category="Select an event to get started"
                cardStyles={{ style: { minHeight: 450, maxHeight: 450 } }}
                content={(
                  <div style={{ minHeight: 250, maxHeight: 250, overflow: 'scroll', overflowX: 'hidden' }}>
                    {eventKeys.length && eventKeys.length > 0
                      ? (
                        <ListGroup>
                          {eventKeys.map(eventKey => (
                            <ListGroup.Item
                              key={eventKey}
                              active={selected === eventKey}
                              onClick={() => this.setState({ selected: eventKey })}
                            >
                              {`${events[eventKey].title} - ${new Date(events[eventKey].startDateTime).toLocaleDateString()}`}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )
                      : <div>No events found.</div>
                    }
                  </div>
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={16} md={12} lg={16}>
              {selected !== '' && events && events[selected]
                ? (
                  <Card
                    title="Edit Event"
                    content={(
                      <Fragment>
                        <Event
                          hasUpdate
                          hasReset
                          hasCancel
                          hasDelete
                          enableReinitialize
                          onSubmit={this.onEdit}
                          onDelete={this.onDelete}
                          form={GOD_MODE_FORM_NAME}
                          onCancel={this.clearSelected}
                          initialValues={{ key: selected, ...events[selected] }}
                        />
                      </Fragment>
                    )}
                  />
                )
                : (
                  <Card
                    title="Select listed event to edit."
                    category="Keep in mind that you will be directly editing the in-app events from here."
                  />
                )
              }
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

GodMode.defaultProps = {
  orgs: {},
  events: {},
  firebase: {},
  loadUsers: () => {},
  setEvents: () => {},
  showError: () => {},
  showSuccess: () => {},
};

GodMode.propTypes = {
  setEvents: PropTypes.func,
  showError: PropTypes.func,
  orgs: PropTypes.shape({}),
  loadUsers: PropTypes.func,
  events: PropTypes.shape({}),
  showSuccess: PropTypes.func,
  firebase: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  orgs: state.orgs.model,
  users: state.users.model,
  events: state.events.model.mobile,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  loadUsers: setUsers,
  setEvents: setMobileEvents,
}, dispatch);

export default compose(
  UserIsAdmin,
  withFirebase,
  withNotifications,
  connect(mapStateToProps, mapDispatchToProps),
)(GodMode);
