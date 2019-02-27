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
import { connect } from 'react-redux';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import Home from './Home/Home';
import Dashboard from './Dashboard';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';

const Root = ({ auth }) => {
  switch (!isEmpty(auth) && isLoaded(auth)) {
    case true:
      return <Dashboard />;
    case false:
      if (!isLoaded(auth)) {
        return <LoadingSpinner />;
      }
      return <Home />;
    default:
      return null;
  }
};

Root.propTypes = {
  auth: PropTypes.shape({
    isEmpty: PropTypes.bool,
    isLoaded: PropTypes.isLoaded,
  }).isRequired,
};

export default compose(connect(({ firebase: { auth, profile } }) => ({ auth, profile })))(Root);
