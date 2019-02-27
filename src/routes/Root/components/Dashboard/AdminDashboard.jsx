/* eslint-disable no-unused-vars,no-undef */
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
import ChartistGraph from 'react-chartist';
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Card from '../../../../components/Card/Card';
import { StatsCard } from '../../../../components/StatsCard/StatsCard';
import { optionsSales, responsiveSales, signInLegend, createdLegend } from '../../../../variables/Variables';

const createLegend = (json) => {
  const legend = [];
  for (let i = 0; i < json.names.length; i++) {
    const type = `fa fa-circle text-${json.types[i]}`;
    legend.push(<i className={type} key={i} />);
    legend.push(' ');
    legend.push(json.names[i]);
  }
  return legend;
};

const AdminDashboard = (props) => {
  const { userData, creationData, signInData, eventData } = props;
  const { facebook, google } = userData;
  return (
    <div className="full-screen">
      <Container fluid style={{ backgroundColor: '#f2f2f2' }}>
        <Row>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<i className="fa fa-facebook-square text-primary" />}
              statsText="Users"
              statsValue={facebook}
              statsIcon={<i className="fa fa-calendar-o" />}
              statsIconText="Last 90 days"
            />
          </Col>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<i className="fa fa-google-plus-square text-danger" />}
              statsText="Users"
              statsValue={google}
              statsIcon={<i className="fa fa-calendar-o" />}
              statsIconText="Last 90 days"
            />
          </Col>
          <Col lg={2} sm={4}>
            <StatsCard
              bigIcon={<i className="pe-7s-graph1 text-danger" />}
              statsText="Errors"
              statsValue="2"
              statsIcon={<i className="fa fa-clock-o" />}
              statsIconText="In the last 30 days"
            />
          </Col>
          <Col lg={2} sm={4}>
            <StatsCard
              bigIcon={<i className="fa fa-apple text-default" />}
              statsText="Total Downloads"
              statsValue="336"
              statsIcon={<i className="fa fa-refresh" />}
              statsIconText="Updated now"
            />
          </Col>
          <Col lg={2} sm={4}>
            <StatsCard
              bigIcon={<i className="fa fa-android text-success" />}
              statsText="Total Downloads"
              statsValue="134"
              statsIcon={<i className="fa fa-refresh" />}
              statsIconText="Updated now"
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card
              id="chartHours"
              title="Users Behavior"
              statsIcon="fa fa-calendar-o"
              stats="Last 90 days"
              content={(
                <div className="ct-chart">
                  <ChartistGraph
                    data={creationData}
                    type="Line"
                    options={optionsSales}
                    responsiveOptions={responsiveSales}
                  />
                </div>
              )}
              legend={
                <div className="legend">{createLegend(createdLegend)}</div>
              }
            />
          </Col>
          <Col md={6}>
            <Card
              id="chartHours"
              title="Event Breakdown"
              category="Broken down by category"
              statsIcon="fa fa-calendar-o"
              stats="All Event Types"
              content={(
                <div className="ct-chart">
                  <ChartistGraph
                    data={eventData}
                    type="Pie"
                    options={{ chartMargin: 40, chartPadding: 60, labelOffset: 65, labelDirection: 'explode' }}
                  />
                </div>
              )}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

AdminDashboard.propTypes = {
  userData: PropTypes.shape({}),
  creationData: PropTypes.shape({}),
  signInData: PropTypes.shape({}),
};

AdminDashboard.defaultProps = {
  userData: {
    facebook: {},
    google: {},
  },
  creationData: {},
  signInData: {},
};

export default AdminDashboard;
