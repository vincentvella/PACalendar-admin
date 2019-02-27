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
import { Col, ListGroup, ListGroupItem, Alert, Container, Button, Collapse } from 'react-bootstrap';
import Card from '../../../components/Card/Card';
import { setUsers } from '../../../actions/users';
import User from '../../../components/Forms/User';
import { UserIsAdmin } from '../../../utils/router';
import withNotifications from '../../../components/Notifications/NotificationsHOC';
import { EDIT_USER_FORM_NAME, NEW_USER_FORM_NAME } from '../../../constants/formNames';
import '../../../../node_modules/react-datetime/css/react-datetime.css';

class UserManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      adding: false,
    };
    this.onSetAdd = this.onSetAdd.bind(this);
    this.onSetEdit = this.onSetEdit.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
  }

  componentWillMount() {
    const { firebase, loadUsers } = this.props;
    firebase.ref('Web/Users').once('value').then((snapshot) => {
      loadUsers(snapshot.val());
    });
  }

  onSetAdd() {
    this.clearSelected().then(() => this.setState({ adding: true }));
  }

  onSetEdit(selected) {
    this.clearSelected().then(() => this.setState({ adding: false, selected }));
  }

  async clearSelected() {
    const { loadUsers, firebase } = this.props;
    await this.setState({ selected: '', adding: false }, () => {
      firebase.ref('Web/Users').once('value').then((snapshot) => {
        loadUsers(snapshot.val());
      });
    });
  }

  handleEdit(user) {
    const { selected } = this.state;
    const { showError, showSuccess, firebase } = this.props;
    if (selected && selected !== '') {
      firebase.ref(`Web/Users/${selected}`).set(user, (err) => {
        if (err) {
          showError(err);
        } else {
          showSuccess('User has been edited successfully!');
          this.clearSelected();
        }
      });
    }
  }

  handleAdd(user) {
    const { selected } = this.state;
    const { showError, showSuccess } = this.props;
    if (!selected || selected === '') {
      fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user }),
      }).then(() => {
        showSuccess('User has been added successfully!');
        this.clearSelected();
      }).catch(error => showError(error));
    }
  }

  resetPassword() {
    const { selected } = this.state;
    const { showSuccess, showError, users, firebase } = this.props;
    firebase.auth().sendPasswordResetEmail(users[selected].email).then(() => {
      showSuccess(`A reset link has been sent to ${users[selected].email}`);
    }).catch((err) => {
      showError(err.message);
    });
  }

  render() {
    const { users } = this.props;
    const { selected, adding } = this.state;
    const userKeys = Object.keys(users).reduce((keys, curr) => {
      if (users[curr].permissionLevel !== 0) {
        keys.push(curr);
      }
      return keys;
    }, []);
    if (userKeys && userKeys.length && userKeys.length > 0) {
      userKeys.sort((a, b) =>
        (users[a].email.toLowerCase() < users[b].email.toLowerCase() ? -1 : 1));
    }
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
                title="Add User"
                content={
                  <User
                    hasCancel
                    hasReset
                    hasSubmit
                    onSubmit={this.handleAdd}
                    form={NEW_USER_FORM_NAME}
                    onCancel={this.clearSelected}
                  />
                }
              />
            </Col>
          </Collapse>
          <Collapse in={!!(selected !== '' && users && users[selected])}>
            <Col sm={12} md={12} lg={12}>
              <Card
                title="Edit User"
                content={
                  <User
                    hasCancel
                    hasReset
                    hasSubmit
                    hasPasswordReset
                    enableReinitialize
                    onSubmit={this.handleEdit}
                    form={EDIT_USER_FORM_NAME}
                    onCancel={this.clearSelected}
                    initialValues={users[selected]}
                    onPasswordReset={this.resetPassword}
                  />
                }
              />
            </Col>
          </Collapse>
          <Col sm={12} md={12} lg={12}>
            <Card
              title="Users"
              category="Select an users's email to edit."
              badge={userKeys.length}
              content={(
                <div style={{ minHeight: 400, maxHeight: 400, overflow: 'scroll', overflowX: 'hidden' }}>
                  {userKeys.length && userKeys.length > 0
                    ? (
                      <ListGroup>
                        {userKeys.map(userKey => (
                          <ListGroupItem
                            key={userKey}
                            active={selected === userKey}
                            onClick={() => this.onSetEdit(userKey)}
                          >
                            {users[userKey].email}
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    ) : <Alert>No users...</Alert>}
                </div>
              )}
            />
          </Col>
        </Container>
      </div>
    );
  }
}

UserManager.propTypes = {
  users: PropTypes.shape({}),
  showError: PropTypes.func,
  loadUsers: PropTypes.func,
  showSuccess: PropTypes.func,
  firebase: PropTypes.shape({}),
};

UserManager.defaultProps = {
  users: {},
  firebase: {},
  loadUsers: () => {},
  showError: () => {},
  showSuccess: () => {},
};

const mapStateToProps = state => ({
  users: state.users.model,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  loadUsers: setUsers,
}, dispatch);

export default compose(
  UserIsAdmin,
  withFirebase,
  withNotifications,
  connect(mapStateToProps, mapDispatchToProps),
)(UserManager);
