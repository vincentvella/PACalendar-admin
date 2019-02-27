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
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

const FormField = (props) => {
  const { title, children, required } = props;
  return (
    <Form.Group>
      <Form.Label>{title}</Form.Label>
      {required && <span style={{ color: 'red' }}>&nbsp;*</span>}
      {children}
    </Form.Group>
  );
};

FormField.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  required: PropTypes.bool,
};

FormField.defaultProps = {
  title: '',
  children: <div />,
  required: false,
};

export default FormField;
