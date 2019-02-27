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
import { Nav } from 'react-bootstrap';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const LogoutButton = () => {
  const navLink = {
    padding: 10,
    color: 'black',
    outlineWidth: 1,
    cursor: 'pointer',
    alignItems: 'center',
    display: 'inline-flex',
  };
  return (
    <Fragment>
      <Nav.Item>
        <Nav.Link as={Link} to="/login" style={navLink}>
          <i className="fa fa-sign-out" />
          &nbsp;Log in
        </Nav.Link>
      </Nav.Item>
    </Fragment>
  );
};

export default LogoutButton;
