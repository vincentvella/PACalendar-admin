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
import { Col, Container, Row } from 'react-bootstrap';
import Card from '../../../components/Card/Card';
import { iconsArray } from '../../../variables/Variables';
import { UserIsAuthenticated } from "../../../utils/router";
import { compose } from "redux";

const Icons = () => {
  return (
    <div className="content">
      <Container fluid>
        <Row>
          <Col md={12}>
            <Card
              title="202 Awesome Stroke Icons"
              ctAllIcons
              category={(
                <span>
                    Handcrafted by our friends from
                  {' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="http://themes-pixeden.com/font-demos/7-stroke/index.html"
                  >
                      Pixeden
                    </a>
                  </span>
              )}
              content={(
                <Row>
                  {iconsArray.map((prop, key) => (
                    <Col
                      lg={2}
                      md={3}
                      sm={4}
                      xs={6}
                      className="font-icon-list"
                      key={key}
                    >
                      <div className="font-icon-detail">
                        <i className={prop} />
                        <input type="text" defaultValue={prop} />
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default compose(
  UserIsAuthenticated,
)(Icons);
