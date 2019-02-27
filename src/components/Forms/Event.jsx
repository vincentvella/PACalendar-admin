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
import { Line } from 'rc-progress';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DateTimeField from 'react-datetime';
import React, { Component, Fragment } from 'react';
import { withFirebase } from 'react-redux-firebase';
import { bindActionCreators, compose } from 'redux';
import FileUploader from 'react-firebase-file-uploader';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import FormInputs from '../FormInputs';
import { setOrgs } from '../../actions/orgs';
import { validateEvent } from '../../utils/validators/event';
import withNotifications from '../Notifications/NotificationsHOC';

const { FormField, FormInput, RadioField } = FormInputs;

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      isUploading: false,
    };
    this.categories = [
      { value: 'A Cappella/Vocal', label: 'A Cappella/Vocal' },
      { value: 'Dance', label: 'Dance' },
      { value: 'Comedy', label: 'Comedy' },
      { value: 'Visual Arts', label: 'Visual Arts' },
      { value: 'Theatre', label: 'Theatre' },
      { value: 'Music/Instrumental', label: 'Music/Instrumental' },
      { value: 'Writing', label: 'Writing' },
    ];
    const { firebase } = props;
    this.storageRef = firebase.storage().ref('images');
    this.handleReset = this.handleReset.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
  }

  componentWillMount() {
    const { firebase, loadOrgs } = this.props;
    firebase.ref('/Orgs').once('value').then((snapshot) => {
      loadOrgs(snapshot.val());
    });
  }

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

  handleProgress = progress => this.setState({ progress });

  handleUploadError = (error) => {
    const { showError } = this.props;
    this.setState({ isUploading: false });
    showError(`There was an error uploading that image. ${error}`);
  };

  handleUploadSuccess = (filename, onChange) => {
    this.setState({ progress: 100, isUploading: false });
    this.storageRef.child(filename).getDownloadURL().then(url => onChange(url));
  };

  handleSubmit(event) {
    const { onSubmit, reset } = this.props;
    return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
      validateEvent(event);
    }).then(() => {
      onSubmit({
        ...event,
        startDateTime: event.startDateTime.toString(),
        endDateTime: event.endDateTime.toString(),
      });
      reset();
    });
  }

  handleAccept(key) {
    const { onAccept } = this.props;
    onAccept(key);
  }

  handleReset() {
    const { reset } = this.props;
    reset();
  }

  handleDelete(key) {
    const { onDelete } = this.props;
    onDelete(key);
  }

  handleCancel() {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { isUploading, progress } = this.state;
    const {
      pristine, submitting, handleSubmit, orgs, profile, free, url, eventKey, hasAccept,
      hasSubmit, hasCancel, hasReset, hasDelete, hasUpdate, error, review, customDeleteText,
    } = this.props;
    const orgOptions = [];
    Object.keys(orgs).forEach((orgKey) => {
      if (orgKey && orgs && orgs[orgKey] && orgs[orgKey].name) {
        const { permissionLevel } = profile;
        if (permissionLevel >= 2 && orgs[orgKey]) {
          orgOptions.push({ value: orgKey, label: orgs[orgKey].name });
        }
        if (permissionLevel <= 1) {
          orgOptions.push({ value: orgKey, label: orgs[orgKey].name });
        }
      }
    });
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <FormField title="Title" required>
          <Field
            type="text"
            name="title"
            placeholder="Title"
            component={FormInput}
            className="form-control"
            props={{ disabled: review }}
          />
        </FormField>
        <FormField title="Event Subtitle">
          <Field
            type="text"
            name="subtitle"
            component={FormInput}
            placeholder="Subtitle"
            className="form-control"
            props={{ disabled: review }}
          />
        </FormField>
        <FormField title="Event Description" required>
          <Field
            rows="3"
            as="textarea"
            name="description"
            component={FormInput}
            props={{ disabled: review }}
            placeholder="Describe your event..."
          />
        </FormField>
        <Row>
          <Col sm={12} md={6} lg={6}>
            <FormField title="Event Start Date/Time" required>
              <Field
                name="startDateTime"
                component={props => (
                  <DateTimeField
                    input={false}
                    value={new Date(props.input.value)}
                    onChange={val => !review && props.input.onChange(val.toDate())}
                  />
                )}
              />
            </FormField>
          </Col>
          <Col sm={12} md={6} lg={6}>
            <FormField title="Event End Date/Time" required>
              <Field
                name="endDateTime"
                component={props => (
                  <DateTimeField
                    input={false}
                    value={new Date(props.input.value)}
                    onChange={val => !review && props.input.onChange(val.toDate())}
                  />
                )}
              />
            </FormField>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} lg={6}>
            <RadioField title="Free Event ?">
              <Field name="free" type="radio" props={{ disabled: review }} value="free" component="input" />
              <Field name="free" type="radio" props={{ disabled: review }} value="paid" component="input" />
            </RadioField>
          </Col>
          {free === 'paid' &&
          <Col sm={12} md={6} lg={6}>
            <RadioField title="Tickets Available at Door ?">
              <Field name="available" type="radio" props={{ disabled: review }} value="yes" component="input" />
              <Field name="available" type="radio" props={{ disabled: review }} value="no" component="input" />
            </RadioField>
          </Col>}
        </Row>
        {free === 'paid' &&
        <Fragment>
          <FormField title="Ticket Details">
            <Field
              rows="3"
              as="textarea"
              name="ticketDetails"
              component={FormInput}
              props={{ disabled: review }}
              placeholder="Please be as detailed as possible (children's ticket prices, student discounts, general admission, etc...)"
            />
          </FormField>
          <FormField title="Ticket Link">
            <Field
              type="text"
              name="link"
              component={FormInput}
              className="form-control"
              props={{ disabled: review }}
              placeholder="https://oss.ticketmaster.com/aps/psuarts/..."
            />
          </FormField>
        </Fragment>}
        <FormField title="Performing Organization(s)" required>
          <Field
            name="orgs"
            component={props => (
              <Select
                isMulti
                clearValue={() => []}
                isDisabled={review}
                options={orgOptions}
                closeMenuOnSelect={false}
                value={props.input.value}
                onChange={props.input.onChange}
                styles={{
                  control: styles => ({ ...styles, borderColor: '#E3E3E3' }),
                  menuList: styles => ({ ...styles, maxHeight: 300 }),
                }}
              />
            )}
          />
        </FormField>
        <FormField title="Category" required>
          <Field
            name="category"
            component={props => (
              <Select
                isMulti
                clearValue={() => []}
                isDisabled={review}
                options={this.categories}
                closeMenuOnSelect={false}
                value={props.input.value}
                onChange={props.input.onChange}
                styles={{
                  control: styles => ({ ...styles, borderColor: '#E3E3E3' }),
                  menuList: styles => ({ ...styles, maxHeight: 230 }),
                }}
              />
            )}
          />
        </FormField>
        <FormField title="Location" required>
          <Field
            type="text"
            name="location"
            component={FormInput}
            className="form-control"
            props={{ disabled: review }}
            placeholder="Add a location so people know where to show up..."
          />
        </FormField>
        <Row>
          {!review &&
          <Col sm={4}>
            <FormField title="Image Upload">
              <Row>
                <Container fluid>
                  <Field
                    name="url"
                    component={props => (
                      <label
                        style={{
                          backgroundColor: '#428bca',
                          color: 'white',
                          padding: 10,
                          borderRadius: 4,
                          pointer: 'cursor',
                        }}
                      >
                        Upload File
                        <FileUploader
                          hidden
                          disabled={review}
                          randomizeFilename
                          accept="image/*"
                          storageRef={this.storageRef}
                          onUploadStart={this.handleUploadStart}
                          onUploadError={this.handleUploadError}
                          onUploadSuccess={(filename) => {
                            this.handleUploadSuccess(filename, props.input.onChange);
                          }}
                          onProgress={this.handleProgress}
                        />
                      </label>
                    )}
                  />
                </Container>
              </Row>
            </FormField>
          </Col>}
          <Col sm={14}>
            {isUploading && (
              <p>
                Progress:
                {<Line percent={progress} strokeWidth="4" strokeColor="#D3D3D3" />}
              </p>
            )}
            {url && <img alt=" " src={url} width="200px" height="auto" style={{ paddingBottom: '25px' }} />}
          </Col>
        </Row>
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
            {hasDelete &&
            <Fragment>
              <Button type="button" variant="danger" onClick={() => this.handleDelete(eventKey)}>
                {customDeleteText || 'Delete'}
              </Button>&nbsp;
            </Fragment>}
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
            {hasUpdate &&
            <Fragment>
              <Button type="submit" variant="success" disabled={submitting}>
                {submitting ? 'Updating' : 'Update'}
              </Button>&nbsp;
            </Fragment>}
            {hasSubmit &&
            <Fragment>
              <Button type="submit" variant="success" disabled={submitting}>
                {submitting ? 'Submitting' : 'Submit'}
              </Button>&nbsp;
            </Fragment>}
            {hasAccept &&
            <Fragment>
              <Button type="button" variant="success" onClick={() => this.handleAccept(eventKey)}>
                {submitting ? 'Accepting' : 'Accept'}
              </Button>&nbsp;
            </Fragment>}
          </Container>
        </Row>
      </form>
    );
  }
}

Event.propTypes = {
  url: PropTypes.string,
  reset: PropTypes.func,
  free: PropTypes.string,
  review: PropTypes.bool,
  hasReset: PropTypes.bool,
  onAccept: PropTypes.func,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loadOrgs: PropTypes.func,
  hasDelete: PropTypes.bool,
  hasSubmit: PropTypes.bool,
  hasCancel: PropTypes.bool,
  hasAccept: PropTypes.bool,
  hasUpdate: PropTypes.bool,
  orgs: PropTypes.shape({}),
  showError: PropTypes.func,
  eventKey: PropTypes.string,
  firebase: PropTypes.shape({}),
  customDeleteText: PropTypes.string,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.shape({ _error: PropTypes.shape([]) }),
  profile: PropTypes.shape({ permissionLevel: PropTypes.number }),
};

Event.defaultProps = {
  url: '',
  orgs: {},
  eventKey: null,
  error: null,
  free: 'free',
  review: false,
  reset: () => {},
  firebase: {},
  hasDelete: false,
  hasSubmit: false,
  hasCancel: false,
  hasReset: false,
  hasUpdate: false,
  hasAccept: false,
  onAccept: () => {},
  loadOrgs: () => {},
  onCancel: () => {},
  onSubmit: () => {},
  onDelete: () => {},
  showError: () => {},
  customDeleteText: null,
  profile: { permissionLevel: 3 },
};

const selector = (form, ...props) => (formValueSelector(form))(...props);

const mapStateToProps = (state, props) => ({
  free: selector(props.form, state, 'free'),
  url: selector(props.form, state, 'url'),
  orgs: state.orgs.model,
  login: state.login.model,
  auth: state.firebase.auth,
  profile: state.firebase.profile,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  loadOrgs: setOrgs,
}, dispatch);

export default compose(
  reduxForm({
    initialValues: {
      title: '',
      subtitle: '',
      description: '',
      free: 'free',
      available: 'yes',
      startDateTime: new Date(new Date().setHours(0, 0, 0, 0)),
      endDateTime: new Date(new Date().setHours(0, 0, 0, 0)),
      link: '',
      ticketDetails: '',
      category: [],
      orgs: [],
      location: '',
      url: '',
    },
  }),
  withFirebase,
  withNotifications,
  connect(mapStateToProps, mapDispatchToProps),
)(Event);
