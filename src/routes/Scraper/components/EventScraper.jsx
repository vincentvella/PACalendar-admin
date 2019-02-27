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
import ReactHtmlParser from 'react-html-parser';
import { bindActionCreators, compose } from 'redux';
import { withFirebase } from 'react-redux-firebase';
import { Col, ListGroup, Button, Row, Alert, Container, Collapse } from 'react-bootstrap';
import { setOrgs } from '../../../actions/orgs';
import Card from '../../../components/Card/Card';
import { setUsers } from '../../../actions/users';
import Event from '../../../components/Forms/Event';
import { UserIsAdmin } from '../../../utils/router';
import { setScrapedEvents } from '../../../actions/events';
import { EVENT_SCRAPER_FORM_NAME } from '../../../constants/formNames';
import withNotifications from '../../../components/Notifications/NotificationsHOC';

class EventScraper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
  }

  componentWillMount() {
    const { firebase, loadEvents, loadUsers, loadOrgs } = this.props;
    firebase.ref('ScrapedEvents/Pending').once('value').then((snapshot) => {
      loadEvents(snapshot.val());
    });
    firebase.ref('Web/Users').once('value').then((snapshot) => {
      loadUsers(snapshot.val());
    });
    firebase.ref('/Orgs').once('value').then((snapshot) => {
      loadOrgs(snapshot.val());
    });
  }

  async clearSelected() {
    const { loadEvents, firebase } = this.props;
    await this.setState({ selected: '' }, () => {
      firebase.ref('ScrapedEvents/Pending').once('value').then((snapshot) => {
        loadEvents(snapshot.val());
      });
    });
  }

  handleDelete() {
    const { selected } = this.state;
    const { firebase, events, showError, showSuccess } = this.props;
    firebase.ref(`ScrapedEvents/${selected || 1}`).update(events[selected], (err) => {
      if (err) {
        showError(err.message);
      } else {
        firebase.ref(`ScrapedEvents/Pending/${selected}`).remove();
        showSuccess('Event has been deleted.');
        this.clearSelected();
      }
    });
  }

  handleSubmit(event) {
    const { selected } = this.state;
    const { firebase, events, showError, showSuccess } = this.props;
    firebase.ref(`Web/Events/${selected || 1}`).update(event, (error) => {
      if (error) {
        showError(error.message);
      } else {
        firebase.ref(`ScrapedEvents/${selected || 1}`).update(events[selected], (err) => {
          if (err) {
            showError(err.message);
          } else {
            firebase.ref(`ScrapedEvents/Pending/${selected}`).remove();
            showSuccess('Event has been added and is ready for approval.');
            this.clearSelected();
          }
        });
      }
    });
  }

  render() {
    const { selected } = this.state;
    const { events } = this.props;
    let eventKeys = [];
    const keys = Object.keys(events);
    if (keys && keys.length && keys.length > 0) {
      eventKeys = keys;
    }
    return (
      <div className="full-screen">
        <Container fluid style={{ backgroundColor: '#f2f2f2', paddingTop: 10 }}>
          <Card
            title="Scraped Events"
            badge={eventKeys.length}
            category="Select an event to get started."
            content={(
              <div style={{ minHeight: 400, maxHeight: 350, overflow: 'scroll', overflowX: 'hidden' }}>
                {eventKeys.length && eventKeys.length > 0 ?
                  <ListGroup>
                    {eventKeys.map(eventKey => (
                      <ListGroup.Item
                        key={eventKey}
                        onClick={() => this.setState({ selected: eventKey })}
                      >
                        {selected === eventKey
                          ? (
                            <div>
                              <div>{`Title: ${events[eventKey].title}`}</div>
                              <div>{`Date: ${events[eventKey].timeDate} ${events[eventKey].year}`}</div>
                              <div>Description:</div>
                              <div>{ReactHtmlParser(events[eventKey].details)}</div>
                              <Button type="button" variant="danger" onClick={() => this.handleDelete(selected)}>
                                {'Delete'}
                              </Button>&nbsp;
                            </div>
                          )
                          : `${events[eventKey].title} -  ${events[eventKey].timeDate} ${events[eventKey].year}`}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  : <Alert variant="dark">No organizations...</Alert>}
              </div>
            )}
          />
          <Collapse in={selected !== ''}>
            <Row>
              <Col sm={12} md={12} lg={12}>
                <Card
                  title="Add Event"
                  content={
                    <Event
                      hasReset
                      hasCancel
                      hasSubmit
                      onSubmit={this.handleSubmit}
                      onCancel={this.clearSelected}
                      form={EVENT_SCRAPER_FORM_NAME}
                    />
                  }
                />
              </Col>
            </Row>
          </Collapse>
        </Container>
      </div>
    );
  }
}

EventScraper.defaultProps = {
  events: {},
  firebase: {},
  loadOrgs: () => {},
  loadUsers: () => {},
  showError: () => {},
  loadEvents: () => {},
  showSuccess: () => {},
};

EventScraper.propTypes = {
  loadOrgs: PropTypes.func,
  loadUsers: PropTypes.func,
  showError: PropTypes.func,
  loadEvents: PropTypes.func,
  events: PropTypes.shape({}),
  showSuccess: PropTypes.func,
  firebase: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  orgs: state.orgs.model,
  events: state.events.model.scraped,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  loadEvents: setScrapedEvents,
  loadUsers: setUsers,
  loadOrgs: setOrgs,
}, dispatch);

export default compose(
  UserIsAdmin,
  withFirebase,
  withNotifications,
  connect(mapStateToProps, mapDispatchToProps),
)(EventScraper);
