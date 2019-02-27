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

import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { required, validateEmail } from '../../../../utils/form';
import { LOGIN_FORM_NAME } from '../../../../constants/formNames';

const LoginForm = ({ pristine, submitting, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Email</label>
      <Field
        name="email"
        label="Email"
        component="input"
        autoComplete="email"
        className="form-control"
        inputlabelprops={{ shrink: true }}
        validate={[required, validateEmail]}
      />
    </div>
    <div className="form-group">
      <label>Password</label>
      <Field
        name="password"
        type="password"
        label="Password"
        component="input"
        validate={required}
        className="form-control"
        autoComplete="current-password"
        inputlabelprops={{ shrink: true }}
      />
    </div>
    <Button type="submit" variant="primary" disabled={submitting || pristine}>
      {submitting ? 'Logging In' : 'Login'}
    </Button>
  </form>
);

LoginForm.propTypes = {
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default compose(reduxForm({ form: LOGIN_FORM_NAME }))(LoginForm);
