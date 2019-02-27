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
import React, { Component } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import { UserIsAdmin } from '../../../utils/router';
import SubmittedEvents from './Tabs/SubmittedEvents';
import '../../../../node_modules/react-datetime/css/react-datetime.css';

class EventManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 'submitted',
    };
  }

  render() {
    const { key } = this.state;
    return (
      <div className="full-screen">
        <Container fluid style={{ backgroundColor: '#f2f2f2', paddingTop: 10 }}>
          <Tabs activeKey={key} id="controlled-tab-example" onSelect={k => this.setState({ key: k })}>
            <Tab eventKey="submitted" title="Submitted Events" />
          </Tabs>
          {key === 'submitted' && <SubmittedEvents />}
        </Container>
      </div>
    );
  }
}

export default compose(
  UserIsAdmin,
)(EventManager);
