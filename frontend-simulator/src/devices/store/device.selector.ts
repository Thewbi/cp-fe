/**
 * Selector that selects all devices of a group is in
 * ../../groups/store/group.selector.ts
 */

import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from 'src/app/store/app.state';

import {DeviceState} from './device.state';

export const getDeviceStateSelector =
    createFeatureSelector<AppState, DeviceState>('devices');

/** Select a device by guid */
export const getDeviceByIdSelector =
    createSelector(getDeviceStateSelector, (deviceState, props) => {
      // console.log(props);

      return deviceState.devices.find(device => {
        return device.guid === props.guid;
      });
    });

/** Select a device by template */
export const getDeviceByTemplateSelector =
    createSelector(getDeviceStateSelector, (deviceState, props) => {
      // console.log(props);

      return deviceState.devices.find(device => {
        return device.templateId === props.templateId;
      });
    });
