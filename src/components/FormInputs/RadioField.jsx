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
import { Container, Form, Row } from 'react-bootstrap';
import FormField from './FormField';

const RadioField = (props) => {
  const { title, children } = props;
  return (
    <FormField title={title}>
      <Row>
        <Container fluid style={{ display: 'inline-flex', alignItems: 'center' }}>
          {children[0]}
          <Form.Label style={{ paddingTop: 3, marginBottom: 0 }}>&nbsp;Yes</Form.Label>
          <Container fluid style={{ display: 'inline-flex', alignItems: 'center' }}>
            {children[1]}
            <Form.Label style={{ paddingTop: 3, marginBottom: 0 }}>&nbsp;No</Form.Label>
          </Container>
        </Container>
      </Row>
    </FormField>
  );
};

RadioField.defaultProps = {
  title: '',
  children: <div />,
};

RadioField.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default RadioField;
