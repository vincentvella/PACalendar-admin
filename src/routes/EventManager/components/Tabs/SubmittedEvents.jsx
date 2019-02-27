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
import { withFirebase } from 'react-redux-firebase';
import { bindActionCreators, compose } from 'redux';
import { Col, ListGroup, Alert, Container } from 'react-bootstrap';
import Card from '../../../../components/Card/Card';
import Event from '../../../../components/Forms/Event';
import { setPendingEvents } from '../../../../actions/events';
import '../../../../../node_modules/react-datetime/css/react-datetime.css';
import { SUBMITTED_EVENTS_FORM_NAME } from '../../../../constants/formNames';
import withNotifications from '../../../../components/Notifications/NotificationsHOC';

class SubmittedEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
    };
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
  }

  componentWillMount() {
    this.props.firebase.ref('/Web/Events').once('value').then((snapshot) => {
      this.props.setPendingEvents(snapshot.val());
    });
  }

  clearSelected() {
    this.setState({ selected: '' });
    this.props.firebase.ref('/Web/Events').once('value').then((snapshot) => {
      this.props.setPendingEvents(snapshot.val());
    });
  }

  handleAccept(key) {
    const { pendingEvents, firebase, showError, showSuccess } = this.props;
    if (key && pendingEvents && pendingEvents[key]) {
      const event = pendingEvents[key];
      firebase.ref(`Mobile/Events/${key}`).update(event, (err) => {
        if (err) {
          showError(err);
        } else {
          firebase.ref(`Web/Events/${key}`).remove();
          showSuccess('Event has been successfully accepted.');
          this.clearSelected();
        }
      });
    }
  }

  handleDecline(key) {
    const { pendingEvents, firebase, showSuccess } = this.props;
    if (key && pendingEvents && pendingEvents[key]) {
      firebase.ref(`Web/Events/${key}`).remove();
      showSuccess('Event has been successfully declined');
      this.clearSelected();
    }
  }

  render() {
    const { pendingEvents } = this.props;
    const { selected } = this.state;
    let eventKeys = [];
    if (pendingEvents) {
      eventKeys = Object.keys(pendingEvents);
    }
    const cardProps = eventKeys && eventKeys.length && eventKeys.length <= 0 && { category: 'No Pending Events' };
    return (
      <Container fluid style={{ backgroundColor: '#f2f2f2', paddingTop: 10, paddingLeft: 0, paddingRight: 0 }}>
        <Col sm={12} md={12} lg={12}>
          <Card
            {...cardProps}
            title="Submitted Events"
            badge={eventKeys.length}
            content={(
              <Container fluid style={{ minHeight: 150, maxHeight: 150, overflowY: 'scroll' }}>
                {eventKeys.length && eventKeys.length > 0
                  ? (
                    <ListGroup>
                      {eventKeys.map((eventKey) => {
                        if (selected === eventKey) {
                          return (
                            <ListGroup.Item key={eventKey} active onClick={() => this.setState({ selected: eventKey })}>
                              {`${pendingEvents[eventKey].title} - ${new Date(pendingEvents[eventKey].startDateTime).toLocaleDateString()}`}
                            </ListGroup.Item>);
                        }
                        return (
                          <ListGroup.Item key={eventKey} onClick={() => this.setState({ selected: eventKey })}>
                            {`${pendingEvents[eventKey].title} = ${new Date(pendingEvents[eventKey].startDateTime).toLocaleDateString()}`}
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  ) : <Alert>No pending events...</Alert>}
              </Container>)}
          />
        </Col>
        <Col sm={12} md={12} lg={12}>
          {selected !== '' && pendingEvents && pendingEvents[selected]
            ? (
              <Card
                title="Review Event"
                content={
                  <Event
                    review
                    hasAccept
                    hasCancel
                    hasDelete
                    eventKey={selected}
                    customDeleteText="Decline"
                    onAccept={this.handleAccept}
                    onDelete={this.handleDecline}
                    onCancel={this.clearSelected}
                    form={SUBMITTED_EVENTS_FORM_NAME}
                    enableReinitialize
                    initialValues={{ key: selected, ...pendingEvents[selected] }}
                  />
                }
              />
            ) : (
              <Card
                title="Select an event to get started..."
                category="If there's no events listed, you have nothing that requires your approval."
              />
            )}
        </Col>
      </Container>
    );
  }
}

SubmittedEvents.propTypes = {
  pendingEvents: PropTypes.shape({}),
  notificationSystem: PropTypes.func,
};

SubmittedEvents.defaultProps = {
  pendingEvents: {},
  notificationSystem: () => {},
};

const mapStateToProps = state => ({
  orgs: state.orgs.model,
  pendingEvents: state.events.model.pending,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setPendingEvents,
}, dispatch);

export default compose(
  withFirebase,
  withNotifications,
  connect(mapStateToProps, mapDispatchToProps),
)(SubmittedEvents);
