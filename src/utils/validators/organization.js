/* eslint-disable no-underscore-dangle,no-param-reassign */
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
import { get } from 'lodash';
import { SubmissionError } from 'redux-form';

const pushError = (errObj, error) => {
  const obj = get(errObj, '_error', null);
  if (obj) {
    errObj._error.push(error);
  } else {
    errObj._error = [error];
  }
};

const minLength = (min, value) => value.length < min;
const pushMinLengthError = (errors, fieldName) => {
  pushError(errors, `${fieldName} must have a minimum length of 3 characters.`);
}
const checkRequired = value => !value || !!(value && value === '');
const pushRequiredError = (errors, fieldName) => {
  pushError(errors, `${fieldName} is a required field.`);
};
const checkRequiredArr = value => !value || !!(value && value.length <= 0);
const pushRequiredArrError = (errors, fieldName) => {
  pushError(errors, `You must select at least 1 ${fieldName}.`);
};

export const validateOrganization = (organization) => {
  const errors = {};
  if (organization) {
    if (checkRequired(organization.name)) {
      pushRequiredError(errors, 'Organization\'s Name');
    } else if (minLength(3, organization.name)) {
      pushMinLengthError(errors, 'Organization\'s Name');
    }
    if (checkRequiredArr(organization.genres)) {
      pushRequiredArrError(errors, 'category');
    }
  } else {
    throw new SubmissionError({ _error: ['There was an issue with the page, refresh the page and try again'] });
  }
  if (errors._error) {
    throw new SubmissionError({ _error: errors._error });
  }
  return organization;
};
