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
import React, { Component } from 'react';
import { Card, Container } from 'react-bootstrap';
import { RotateSpinner } from 'react-spinners-kit';

const containerStyle = {
  backgroundColor: '#f2f2f2',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
};

const cardStyle = {
  flex: 1,
  padding: 30,
  minHeight: 300,
  maxHeight: 200,
  maxWidth: 400,
  justifyContent: 'center',
  alignItems: 'center',
};

class LoadingSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  render() {
    const { loading } = this.state;
    const spinnerProps = { loading, size: 100, color: '#686769' };
    return (
      <Container fluid style={containerStyle}>
        <Card style={cardStyle}>
          <RotateSpinner {...spinnerProps} />
        </Card>
      </Container>
    );
  }
}

export default LoadingSpinner;
