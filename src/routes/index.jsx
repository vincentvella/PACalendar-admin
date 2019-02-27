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
import { Switch, Route } from 'react-router-dom';
import Map from './Maps';
import Root from './Root';
import Login from './Login';
import Icons from './Icons';
import Scraper from './Scraper';
import GodMode from './GodMode';
import AddEvent from './AddEvent';
import NotFound from './NotFound';
import OrgManager from './OrgManager';
import UserManager from './UserManager';
import EventManager from './EventManager';
import CoreLayout from '../layouts/CoreLayout';

export const godRoutes = [
  Map,
  Icons,
];

export const adminRoutes = [
  EventManager,
  OrgManager,
  UserManager,
  Scraper,
  GodMode,
];

export const userRoutes = [
  AddEvent,
];

const routes = [
  Login,
  AddEvent,
  Scraper,
  GodMode,
  OrgManager,
  UserManager,
  EventManager,
  Map,
  Icons,
];

export const sidebarRoutes = [
  AddEvent,
  UserManager,
  OrgManager,
  EventManager,
  Scraper,
  GodMode,
  Map,
  Icons,
];

const createRoutes = () => (
  <CoreLayout>
    <Switch>
      <Route exact path={Root.path} component={Root.component} />
      {routes.map((settings, index) => (<Route key={`Route-${index}`} {...settings} />))}
      <Route component={NotFound.component} />
    </Switch>
  </CoreLayout>
);

export default createRoutes;


// const indexRoutes = [{ path: '/', name: 'Home', component: Dashboard }];
//
// export default indexRoutes;