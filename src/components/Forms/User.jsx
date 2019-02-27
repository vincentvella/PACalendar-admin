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
import Select from 'react-select';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { withFirebase } from 'react-redux-firebase';
import { bindActionCreators, compose } from 'redux';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { Alert, Button, Container, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import FormInputs from '../FormInputs';
import { setOrgs } from '../../actions/orgs';
import { validateUser } from '../../utils/validators/user';
import withNotifications from '../Notifications/NotificationsHOC';

const { FormField, FormInput } = FormInputs;

const returnValueArray = (options, values) => {
  if (Array.isArray(values)) {
    return values.reduce((acc, value) => {
      const option = options.find(o => o.value === value);
      if (option) acc.push(option);
      return acc;
    }, []);
  }
  return [];
};

class User extends Component {
  constructor(props) {
    super(props);
    this.handleReset = this.handleReset.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordReset = this.handlePasswordReset.bind(this);
  }

  componentWillMount() {
    const { firebase, loadOrgs } = this.props;
    firebase.ref('/Orgs').once('value').then((snapshot) => {
      loadOrgs(snapshot.val());
    });
  }

  handleSubmit(user) {
    const { onSubmit } = this.props;
    return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
      validateUser(user);
    }).then(() => {
      onSubmit(user);
      this.handleReset();
    });
  }

  handleReset() {
    const { reset } = this.props;
    reset();
  }

  handlePasswordReset() {
    const { onPasswordReset } = this.props;
    onPasswordReset();
  }

  handleCancel() {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const {
      pristine, submitting, handleSubmit, orgs, permissionLevel, hasPasswordReset, hasSubmit,
      hasCancel, hasReset, hasUpdate, error,
    } = this.props;
    const orgOptions = [];
    Object.keys(orgs).forEach((orgKey) => {
      if (orgKey && orgs && orgs[orgKey] && orgs[orgKey].name) {
        orgOptions.push({ value: orgKey, label: orgs[orgKey].name });
      }
    });
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <FormField title="Email" required>
          <Field
            type="text"
            name="email"
            placeholder="Email"
            component={FormInput}
            className="form-control"
          />
        </FormField>
        <FormField title="Permission Level">
          <Field
            name="permissionLevel"
            component={props => (
              <Row>
                <Container fluid>
                  <ToggleButtonGroup
                    type="radio"
                    name="permissionLevel"
                    value={props.input.value}
                    onChange={props.input.onChange}
                  >
                    <ToggleButton value={1} variant={permissionLevel === 1 ? 'primary' : 'secondary'}>
                      Administrator
                    </ToggleButton>
                    <ToggleButton value={2} variant={permissionLevel === 2 ? 'primary' : 'secondary'}>
                      User
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Container>
              </Row>
            )}
          />
        </FormField>
        {permissionLevel === 2 &&
        <FormField title="Organization(s)" required>
          <Field
            name="orgs"
            component={props => (
              <Select
                isMulti
                clearValue={() => []}
                options={orgOptions}
                closeMenuOnSelect={false}
                value={returnValueArray(orgOptions, props.input.value)}
                onChange={val => props.input.onChange(val.map(v => (v.value ? v.value : v)))}
                styles={{
                  control: styles => ({ ...styles, borderColor: '#E3E3E3' }),
                  menuList: styles => ({ ...styles, maxHeight: 300 }),
                }}
              />
            )}
          />
        </FormField>}
        {error &&
        <Row>
          <Container fluid>
            <Alert variant="danger">
              <h5 className="alert-heading">
                There was a problem with your submission, please fix the following error(s)
                and resubmit.
              </h5>
              <ul>{error.map(err => <li key={err}>{err}</li>)}</ul>
            </Alert>
          </Container>
        </Row>}
        <Row>
          <Container fluid style={{ justifyContent: 'flex-end', display: 'flex' }}>
            {hasCancel &&
            <Fragment>
              <Button type="reset" variant="secondary" onClick={this.handleCancel}>
                {'Cancel'}
              </Button>&nbsp;
            </Fragment>}
            {hasReset &&
            <Fragment>
              <Button type="reset" variant="primary" disabled={pristine} onClick={this.handleReset}>
                {'Reset'}
              </Button>&nbsp;
            </Fragment>}
            {hasPasswordReset &&
            <Fragment>
              <Button type="button" variant="primary" onClick={this.handlePasswordReset}>
                {'Reset Password'}
              </Button>&nbsp;
            </Fragment>}
            {hasUpdate &&
            <Fragment>
              <Button type="submit" variant="success" disabled={submitting || pristine}>
                {submitting ? 'Updating' : 'Update'}
              </Button>&nbsp;
            </Fragment>}
            {hasSubmit &&
            <Fragment>
              <Button type="submit" variant="success" disabled={submitting}>
                {submitting ? 'Submitting' : 'Submit'}
              </Button>&nbsp;
            </Fragment>}
          </Container>
        </Row>
      </form>
    );
  }
}

User.propTypes = {
  reset: PropTypes.func,
  hasReset: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loadOrgs: PropTypes.func,
  hasSubmit: PropTypes.bool,
  hasCancel: PropTypes.bool,
  hasUpdate: PropTypes.bool,
  orgs: PropTypes.shape({}),
  firebase: PropTypes.shape({}),
  onPasswordReset: PropTypes.func,
  hasPasswordReset: PropTypes.bool,
  permissionLevel: PropTypes.number,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.shape({ _error: PropTypes.shape([]) }),
};

User.defaultProps = {
  orgs: {},
  error: null,
  firebase: {},
  reset: () => {},
  hasReset: false,
  hasSubmit: false,
  hasCancel: false,
  hasUpdate: false,
  permissionLevel: 1,
  loadOrgs: () => {},
  onCancel: () => {},
  onSubmit: () => {},
  hasPasswordReset: false,
  onPasswordReset: () => {},
};

const selector = (form, ...props) => (formValueSelector(form))(...props);

const mapDispatchToProps = dispatch => bindActionCreators({
  loadOrgs: setOrgs,
}, dispatch);

const mapStateToProps = (state, props) => ({
  permissionLevel: selector(props.form, state, 'permissionLevel'),
  orgs: state.orgs.model,
});

export default compose(
  reduxForm({
    initialValues: {
      email: '',
      orgs: [],
      permissionLevel: 1,
    },
  }),
  withFirebase,
  withNotifications,
  connect(mapStateToProps, mapDispatchToProps),
)(User);
