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

import paths from './paths';
import icons from './icons';
import aliases from './aliases';

export default {
  [paths.ROOT]: {
    path: paths.ROOT,
  },
  [paths.LOGIN]: {
    path: paths.LOGIN,
  },
  [paths.NOT_FOUND]: {
    path: paths.NOT_FOUND,
  },
  [paths.ICONS]: {
    path: paths.ICONS,
    alias: aliases.ICONS,
    icon: icons.ICONS,
  },
  [paths.ADD_EVENT]: {
    path: paths.ADD_EVENT,
    alias: aliases.ADD_EVENT,
    icon: icons.ADD_EVENT,
  },
  [paths.GOD_MODE]: {
    path: paths.GOD_MODE,
    alias: aliases.GOD_MODE,
    icon: icons.GOD_MODE,
  },
  [paths.MAP]: {
    path: paths.MAP,
    alias: aliases.MAP,
    icon: icons.MAP,
  },
  [paths.SCRAPER]: {
    path: paths.SCRAPER,
    alias: aliases.SCRAPER,
    icon: icons.SCRAPER,
  },
  [paths.USER_MANAGER]: {
    path: paths.USER_MANAGER,
    alias: aliases.USER_MANAGER,
    icon: icons.USER_MANAGER,
  },
  [paths.ORG_MANAGER]: {
    path: paths.ORG_MANAGER,
    alias: aliases.ORG_MANAGER,
    icon: icons.ORG_MANAGER,
  },
  [paths.EVENT_MANAGER]: {
    path: paths.EVENT_MANAGER,
    alias: aliases.EVENT_MANAGER,
    icon: icons.EVENT_MANAGER,
  },
};
