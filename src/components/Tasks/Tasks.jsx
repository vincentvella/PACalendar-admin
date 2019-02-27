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

import React, { Component } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Checkbox from '../CustomCheckbox/CustomCheckbox';
import Button from '../CustomButton/CustomButton';

class Tasks extends Component {
  handleCheckbox(event) {
    const { target } = event;
    this.setState({
      [target.name]: target.checked,
    });
  }

  render() {
    const edit = <Tooltip id="edit_tooltip">Edit Task</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Remove</Tooltip>;
    const tasksTitle = [
      'Sign contract for "What are conference organizers afraid of?"',
      'Lines 4From Great Russian Literature? Or E-mails From My Boss?',
      'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroi',
      'Create 4 Invisible User Experiences you Never Knew About',
      'Read "Following makes Medium better"',
      'Unfollow 5 enemies from twitter',
    ];
    const tasks = [];
    let number;
    for (let i = 0; i < tasksTitle.length; i += 1) {
      number = `checkbox${i}`;
      tasks.push(
        <tr key={i}>
          <td>
            <Checkbox
              number={number}
              isChecked={i === 1 || i === 2}
            />
          </td>
          <td>{tasksTitle[i]}</td>
          <td className="td-actions text-right">
            <OverlayTrigger placement="top" overlay={edit}>
              <Button bsStyle="info" simple type="button" bsSize="xs">
                <i className="fa fa-edit" />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={remove}>
              <Button bsStyle="danger" simple type="button" bsSize="xs">
                <i className="fa fa-times" />
              </Button>
            </OverlayTrigger>
          </td>
        </tr>,
      );
    }
    return <tbody>{tasks}</tbody>;
  }
}

export default Tasks;
