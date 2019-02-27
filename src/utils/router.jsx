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
import createHistory from 'history/createBrowserHistory';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import paths from '../constants/paths';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const { ROOT } = paths;
const locationHelper = locationHelperBuilder({});
const history = createHistory();
const AUTHED_REDIRECT = 'AUTHED_REDIRECT';
const UNAUTHED_REDIRECT = 'UNAUTHED_REDIRECT';
const NOT_ADMIN_REDIRECT = 'NOT_ADMIN_REDIRECT';

/**
 * Higher Order Component that redirects to `/login` instead
 * rendering if user is not authenticated (default of redux-auth-wrapper).
 * @param {Component} componentToWrap - Component to wrap
 * @return {Component} wrappedComponent
 */
export const UserIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/login',
  AuthenticatingComponent: LoadingSpinner,
  wrapperDisplayName: 'UserIsAuthenticated',
  authenticatedSelector: ({ firebase: { auth } }) => !auth.isEmpty && !!auth.uid,
  authenticatingSelector: ({ firebase: { auth, profile } }) => !(auth.isLoaded && auth.uid && (profile && profile.permissionLevel)),
  redirectAction: newLoc => (dispatch) => {
    history.push(newLoc);
    dispatch({
      type: UNAUTHED_REDIRECT,
      payload: { message: 'User is not authenticated.' },
    });
  },
});

/**
 * Higher Order Component that redirects to listings page or most
 * recent route instead rendering if user is not authenticated. This is useful
 * routes that should not be displayed if a user is logged in, such as the
 * login route.
 * @param {Component} componentToWrap - Component to wrap
 * @return {Component} wrappedComponent
 */
export const UserIsNotAuthenticated = connectedRouterRedirect({
  AuthenticatingComponent: LoadingSpinner,
  wrapperDisplayName: 'UserIsNotAuthenticated',
  allowRedirectBack: false,
  authenticatedSelector: ({ firebase: { auth } }) => auth.isEmpty,
  authenticatingSelector: ({ firebase: { auth, isInitializing } }) => !auth.isLoaded
    || isInitializing,
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || ROOT,
  redirectAction: newLoc => (dispatch) => {
    history.push(newLoc);
    dispatch({
      type: AUTHED_REDIRECT,
      payload: { message: 'User is authenticated.' },
    });
  },
});

/**
 * Higher Order Component that redirects to `/login` instead
 * rendering if user is not authenticated (default of redux-auth-wrapper).
 * @param {Component} componentToWrap - Component to wrap
 * @return {Component} wrappedComponent
 */
export const UserIsAdmin = connectedRouterRedirect({
  redirectPath: '/',
  AuthenticatingComponent: LoadingSpinner,
  wrapperDisplayName: 'UserIsAuthenticated',
  authenticatedSelector: ({ firebase: { auth, profile } }) =>
    !!(!auth.isEmpty && !!auth.uid && !!(profile && profile.permissionLevel <= 1)),
  authenticatingSelector: ({ firebase: { auth, profile } }) =>
    !(auth.isLoaded && auth.uid && (profile && profile.permissionLevel)),
  redirectAction: newLoc => (dispatch) => {
    history.push(newLoc);
    dispatch({
      type: NOT_ADMIN_REDIRECT,
      payload: { message: 'User does not have sufficient permissions.' },
    });
  },
});
