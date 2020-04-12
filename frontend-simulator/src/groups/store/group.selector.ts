import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from 'src/app/store/app.state';
import {Device} from 'src/devices/device.model';
import {getDeviceStateSelector} from 'src/devices/store/device.selector';
import {DeviceState} from 'src/devices/store/device.state';
import {Group} from 'src/groups/group.model';

import {GroupState} from './group.state';
import { isNullOrUndefined } from 'util';
import {isNil, isEmpty} from 'lodash';

/**
 * FeatureSelector for the groups slice of the global store state.
 */
export const getGroupStateSelector =
    createFeatureSelector<AppState, GroupState>('groups');

/**
 * Selector for the currently selected group in the groups slice.
 */
export const getCurrentGroupSelector =
    createSelector(getGroupStateSelector, groupState => {
      return groupState.currentGroup;
    });

/**
 * Selector for all devices within a specific group.
 */
export const getDevicesInGroupSelector = createSelector(
    getCurrentGroupSelector, getDeviceStateSelector,
    (currentGroup: Group, deviceState: DeviceState) => {

      const devicesInGroup: Array<Device> = [];

      // if there is no group selected or no there are no devices, return
      if (isNil(currentGroup) || isEmpty(deviceState.devices)) {
        return devicesInGroup;
      }

      // for all device references that the group has
      currentGroup.deviceReferences.forEach(deviceReference => {

        // over all devices in the device state slice
        deviceState.devices.forEach((device) => {

          // find all devices referenced by the device references
          if (deviceReference.guid === device.guid) {

            // add the device into the result
            devicesInGroup.push(device);
          }
        });
      });

      // return the result
      return devicesInGroup;
    });
