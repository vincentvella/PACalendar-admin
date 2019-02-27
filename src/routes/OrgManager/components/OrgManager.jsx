/* eslint-disable no-nested-ternary */
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
import { withFirebase } from 'react-redux-firebase';
import { Col, ListGroup, Alert, Container, Button, Collapse } from 'react-bootstrap';
import { setOrgs } from '../../../actions/orgs';
import Card from '../../../components/Card/Card';
import Organization from '../../../components/Forms/Organization';
import '../../../../node_modules/react-datetime/css/react-datetime.css';
import withNotifications from '../../../components/Notifications/NotificationsHOC';
import { EDIT_ORG_FORM_NAME, NEW_ORG_FORM_NAME } from '../../../constants/formNames';
import { UserIsAdmin } from "../../../utils/router";

class OrgManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      adding: false,
    };
    this.onSetAdd = this.onSetAdd.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
  }

  componentWillMount() {
    const { loadOrgs, firebase } = this.props;
    firebase.ref('/Orgs').once('value').then((snapshot) => {
      loadOrgs(snapshot.val());
    });
  }

  onSetAdd() {
    this.clearSelected().then(() => this.setState({ adding: true }));
  }

  onSetEdit(selected) {
    this.clearSelected().then(() => this.setState({ adding: false, selected }));
  }

  async clearSelected() {
    const { loadOrgs, firebase } = this.props;
    await this.setState({ selected: '', adding: false }, () => {
      firebase.ref('Orgs/').once('value').then((snapshot) => {
        loadOrgs(snapshot.val());
      });
    });
  }

  handleEdit(organization) {
    const { selected } = this.state;
    const { showError, showSuccess, firebase } = this.props;
    if (selected && selected !== '') {
      firebase.ref(`Orgs/${selected}`).set(organization, (err) => {
        if (err) {
          showError(err);
        } else {
          showSuccess('Organization has been edited successfully!');
          this.clearSelected();
        }
      });
    }
  }

  handleAdd(organization) {
    const { selected } = this.state;
    const { showError, showSuccess, firebase } = this.props;
    if (!selected || selected === '') {
      firebase.ref('Orgs/').push(organization, (err) => {
        if (err) {
          showError(err);
        } else {
          showSuccess('Organization has been added successfully!');
          this.clearSelected();
        }
      });
    }
  }

  render() {
    const { orgs } = this.props;
    const { adding, selected } = this.state;
    const orgKeys = Object.keys(orgs);
    return (
      <div className="full-screen">
        <Container fluid style={{ backgroundColor: '#f2f2f2', paddingTop: 10 }}>
          <Container fluid>
            <Button
              type="reset"
              variant="primary"
              disabled={adding}
              onClick={this.onSetAdd}
              style={{ marginBottom: 10 }}
            >
              Add New
            </Button>
          </Container>
          <Collapse in={adding}>
            <Col sm={12} md={12} lg={12}>
              <Card
                title="Add Organization"
                content={
                  <Organization
                    hasReset
                    hasCancel
                    hasSubmit
                    form={NEW_ORG_FORM_NAME}
                    onSubmit={this.handleAdd}
                    onCancel={this.clearSelected}
                  />
                }
              />
            </Col>
          </Collapse>
          <Collapse in={!!(selected !== '' && orgs && orgs[selected])}>
            <Col sm={12} md={12} lg={12}>
              <Card
                title="Edit Organization"
                content={
                  <Organization
                    hasReset
                    hasCancel
                    hasUpdate
                    enableReinitialize
                    form={EDIT_ORG_FORM_NAME}
                    onSubmit={this.handleEdit}
                    onCancel={this.clearSelected}
                    initialValues={orgs[selected]}
                  />
                }
              />
            </Col>
          </Collapse>
          <Col sm={12} md={12} lg={12}>
            <Card
              title="Organizations"
              category="Select an organization's name to edit."
              badge={orgKeys.length}
              content={(
                <div style={{ minHeight: 400, maxHeight: 400, overflow: 'scroll', overflowX: 'hidden' }}>
                  {orgKeys.length && orgKeys.length > 0 ?
                    <ListGroup>
                      {orgKeys.map(orgKey => (
                        <ListGroup.Item
                          key={orgKey}
                          active={selected === orgKey}
                          onClick={() => this.onSetEdit(orgKey)}
                        >
                          {orgs[orgKey].name}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                    : <Alert variant="dark">No organizations...</Alert>}
                </div>
              )}
            />
          </Col>
        </Container>
      </div>
    );
  }
}

OrgManager.propTypes = {
  orgs: PropTypes.shape({}),
  loadOrgs: PropTypes.func,
  showError: PropTypes.func,
  showSuccess: PropTypes.func,
  firebase: PropTypes.shape({}),
};

OrgManager.defaultProps = {
  orgs: {},
  firebase: {},
  loadOrgs: () => {},
  showError: () => {},
  showSuccess: () => {},
};

const mapStateToProps = state => ({
  orgs: state.orgs.model,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  loadOrgs: setOrgs,
}, dispatch);

export default compose(
  UserIsAdmin,
  withFirebase,
  withNotifications,
  connect(mapStateToProps, mapDispatchToProps),
)(OrgManager);
