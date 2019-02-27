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
import { compose } from 'redux';
import Select from 'react-select';
import { Line } from 'rc-progress';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import { withFirebase } from 'react-redux-firebase';
import FileUploader from 'react-firebase-file-uploader';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import FormInputs from '../FormInputs';
import withNotifications from '../Notifications/NotificationsHOC';
import { validateOrganization } from '../../utils/validators/organization';

const { FormField, FormInput } = FormInputs;

const returnValueArray = (options, values) => {
  if (Array.isArray(values)) {
    return values.reduce((acc, value) => {
      let option = options.find(o => o.value === value);
      if (option) acc.push(option);
      return acc;
    }, []);
  }
  return [];
};

class Organization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      isUploading: false,
    };
    this.genres = [
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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
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

  handleSubmit(organization) {
    const { onSubmit } = this.props;
    return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
      validateOrganization(organization);
    }).then(() => {
      onSubmit(organization);
      this.handleReset();
    });
  }

  handleReset() {
    const { reset } = this.props;
    reset();
  }

  handleCancel() {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { isUploading, progress } = this.state;
    const {
      pristine, submitting, handleSubmit, imageURL,
      hasSubmit, hasCancel, hasReset, hasUpdate, error,
    } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <FormField title="Name" required>
          <Field
            type="text"
            name="name"
            placeholder="Organization's Name"
            component={FormInput}
            className="form-control"
          />
        </FormField>
        <FormField title="Website">
          <Field
            type="text"
            name="website"
            component={FormInput}
            placeholder="i.e. http://www.thepennharmonics.com/"
            className="form-control"
          />
        </FormField>
        <FormField title="Category" required>
          <Field
            name="genres"
            component={props => (
              <Select
                isMulti
                clearValue={() => []}
                options={this.genres}
                closeMenuOnSelect={false}
                value={returnValueArray(this.genres, props.input.value)}
                onChange={val => props.input.onChange(val.map(v => (v.value ? v.value : v)))}
                styles={{
                  control: styles => ({ ...styles, borderColor: '#E3E3E3' }),
                  menuList: styles => ({ ...styles, maxHeight: 230 }),
                }}
              />
            )}
          />
        </FormField>
        <Row>
          <Col sm={4}>
            <FormField title="Image Upload">
              <Row>
                <Container fluid>
                  <Field
                    name="imageURL"
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
                          randomizeFilename
                          accept="image/*"
                          storageRef={this.storageRef}
                          onProgress={this.handleProgress}
                          onUploadStart={this.handleUploadStart}
                          onUploadError={this.handleUploadError}
                          onUploadSuccess={(filename) => {
                            this.handleUploadSuccess(filename, props.input.onChange);
                          }}
                        />
                      </label>
                    )}
                  />
                </Container>
              </Row>
            </FormField>
          </Col>
          <Col sm={14}>
            {isUploading && (
              <p>
                Progress:
                {<Line percent={progress} strokeWidth="4" strokeColor="#D3D3D3" />}
              </p>
            )}
            {imageURL && <img alt=" " src={imageURL} width="200px" height="auto" style={{ paddingBottom: '25px' }} />}
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

Organization.propTypes = {
  imageURL: PropTypes.string,
  hasReset: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  hasSubmit: PropTypes.bool,
  hasCancel: PropTypes.bool,
  hasUpdate: PropTypes.bool,
  showError: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.shape({ _error: PropTypes.shape([]) }),
  profile: PropTypes.shape({ permissionLevel: PropTypes.number }),
};

Organization.defaultProps = {
  imageURL: '',
  error: null,
  hasSubmit: false,
  hasCancel: false,
  hasReset: false,
  hasUpdate: false,
  onCancel: () => {},
  onSubmit: () => {},
  showError: () => {},
  profile: { permissionLevel: 3 },
};

const selector = (form, ...props) => (formValueSelector(form))(...props);

const mapStateToProps = (state, props) => ({
  imageURL: selector(props.form, state, 'imageURL'),
  profile: state.firebase.profile,
});

export default compose(
  reduxForm({
    initialValues: {
      name: '',
      website: '',
      genres: [],
      imageURL: '',
    },
  }),
  withFirebase,
  withNotifications,
  connect(mapStateToProps),
)(Organization);
