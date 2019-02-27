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
import PropTypes from 'prop-types';
import { Badge, Button } from 'react-bootstrap';

export default function Card(props) {
  const {
    fill, hCenter, title, category, content, ctAllIcons, ctTableFullWidth, ctTableUpgrade,
    ctTableResponsive, legend, stats, statsIcon, plain, badge, add, addFunc, cardStyles,
  } = props;
  return (
    <div className={`card ${fill ? 'fullPage' : ''} ${plain ? 'card-plain' : ''}`} {...cardStyles}>
      <div className={`header${hCenter ? ' text-center' : ''}`}>
        <h4 className="title">
          {title}&nbsp;&nbsp;&nbsp;
          <Badge>{badge}</Badge>&nbsp;&nbsp;&nbsp;
          {add && <Button bsStyle="primary" fill onClick={addFunc}>Add New</Button>}
        </h4>
        <div className="category">{category}</div>
      </div>
      {content && <hr />}
      <div className={`content${ctAllIcons ? ' all-icons' : ''}${ctTableFullWidth ? ' table-full-width' : ''}${ctTableResponsive ? ' table-responsive' : ''}${ctTableUpgrade ? ' table-upgrade' : ''}`}>
        {content}
        <div className="footer">
          {legend}
          {stats && <hr />}
          <div className="stats">
            <i className={statsIcon} />
            {' '}
            {stats}
          </div>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  fill: PropTypes.bool,
  hCenter: PropTypes.string,
  title: PropTypes.string,
  category: PropTypes.string,
  content: PropTypes.shape({}),
  ctAllIcons: PropTypes.string,
  ctTableFullWidth: PropTypes.string,
  ctTableUpgrade: PropTypes.string,
  ctTableResponsive: PropTypes.string,
  stats: PropTypes.string,
  statsIcon: PropTypes.string,
  plain: PropTypes.string,
  badge: PropTypes.number,
  add: PropTypes.bool,
  cardStyles: PropTypes.shape({}),
  addFunc: PropTypes.func,
};

Card.defaultProps = {
  fill: false,
  hCenter: '',
  title: '',
  category: '',
  content: null,
  ctAllIcons: '',
  ctTableFullWidth: '',
  ctTableUpgrade: '',
  ctTableResponsive: '',
  legend: '',
  stats: '',
  statsIcon: '',
  plain: '',
  badge: null,
  add: false,
  addFunc: () => {},
  cardStyles: {},
};
