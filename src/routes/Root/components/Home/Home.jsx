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
import { Container } from 'react-bootstrap';

const Home = () => (
  <div className="full-screen">
    <Container fluid style={{ backgroundColor: '#f2f2f2', paddingTop: 10 }}>
      <Container>
        <strong>Background</strong>
        <div>
          Over the past year, the Performing Arts Council has developed Penn State’s first
          centralised calendar for the visual and performing arts. In the past, various entities
          (such as the Penn State School of Music, School of Theatre, ect) utilized separate
          calendars for the promotion of events to students, staff, and community members.
          Unfortunately, by having this information spread across various locations, many
          opportunities for cross promotion and user-discovery have been missed. This project,
          conceptualized and developed from scratch by students, was born out of the desire
          to engage a larger portion of our university with the diverse and growing Penn State arts
          community. To accomplish this goal, the PAC App pulls information from several prominent
          arts calendars and complies them into a single, easily accessible location. In addition
          to organizations covered by the primary source calendars, additional arts organizations
          can submit their own events for publication on the calendar.
        </div>
        <br />
        <strong>How do the events get onto the calendar?</strong>
        <div>
          Center for the Performing Arts, School of Music, and School of Theatre events are
          automatically pulled from their existing online calendars. This ensures accuracy for the
          calendar and eliminates any extra work for faculty and staff members. Student
          Organizations and community organizations (i.e The Penn State Thespians) will have
          their own accounts where they can manually insert their upcoming events. These accounts
          are managed by the respective organizations. Events are approved by the PAC Communications
          Team before they appear on The PACalendar.
        </div>
        <br />
        <strong>How Do I make an Account?</strong>
        <div>Users may log into The PACalendar via their Facebook Accounts or Google Accounts.</div>
        <br />
        <strong>Is the App Free?</strong>
        <div>Yes, the app is free!</div>
        <br />
        <strong>How Can I help with the app?</strong>
        <div>
          If you would like to provide feedback to the App Development Team, feel free to email
          us at psuperformingartscouncil@gmail.com or utilize the ‘Submit Feedback’ function on the
          app itself. If you are interested in helping with the app on an administrative level,
          please reach out to our team at psuperformingartscouncil@gmail.com.
        </div>
        <br />
        <strong>Why Create The PACalendar?</strong>
        <div>
          This project, conceptualized and developed by Penn State students, was born out of the
          desire to engage a larger portion of our university with the diverse and growing Penn
          State arts community. In the past, various entities (such as the Penn State School of
          Music, School of Theatre, etc.) utilized separate calendars for the promotion of events
          to students, staff, and community members. Unfortunately, by having this information
          spread across various locations, many opportunities for cross promotion and user-discovery
          have been missed. By combining various arts calendars from across the university, we
          believe The PACalendar will help to unite and promote the vibrant arts community at Penn
          State.
        </div>
        <br />
        <strong>Who runs the app?</strong>
        <div>
          The PACalendar is run by the Performing Arts Council with the approval of the Penn State
          University administration.
        </div>
        <br />
        <strong>Is this replacing any existing calendars?</strong>
        <div>PACalendar is a supplement to existing calendars, not a replacement.</div>
        <br />
        <strong>Is this just for campus orgs? Or, will it cover off campus orgs?</strong>
        <div>
          At the present time, The PACalendar only covers campus organizations affiliated with the
          university. In the future, The PACalendar may cover both on-campus and off-campus
          organizations in the State College Area.
        </div>
        <br />
        <strong>Is this university approved?</strong>
        <div>
          Yes, the Performing Arts Council has received approval from the university administration
          to administer the PACalendar. Further, entities including (but not limited to) the Penn
          State School of Music and Penn State School of Theatre have individually endorsed the app.
        </div>
        <br />
        <strong>Who manages the data? Is it “safe”?</strong>
        <div>
          All data used for PACalendar (dates for events, locations for events, etc.) is sourced
          from public websites and calendars.
        </div>
        <br />
        <strong>How can arts organizations successfully utilize the PACalendar?</strong>
        <div>
          Arts organizations of all types will benefit from this additional promotional platform.
          It is our hope that, by centralizing the university arts calendars into a single place,
          we will encourage audiences to discover new arts organizations and foster an environment
          of collaboration and promotion across organizations.
        </div>
        <br />
        <strong>What Organizations are Included on the PACalendar?</strong>
        <div>
          All student arts organizations are invited to participate on the app. Partner
          organizations include School of Music, School of Theatre, Palmer Museum of Arts,
          Center for the Performing Arts at Penn State, and Student Affairs. In the future
          we hope to include applicable events from the Bryce Jordan Center, State Theatre,
          and the Palmer Museum of the Arts.
        </div>
        <br />
      </Container>
    </Container>
  </div>
);

export default Home;
