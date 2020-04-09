import {Device, DeviceCacheStatus, HomeDevice} from '../device.model';

/**
 * This interface defines the slice in the NgRx Store that deals with Devices.
 *
 * Used in device.reducer.ts to define the initial state.
 *
 * That initial state is used in app.reducer.ts to define a function
 * that returns the initial state of all slices to define the overall initial
 * store state.
 */
export interface DeviceState {
  devices: Device[];
  templatesAssigned: boolean;
  cacheStatus: DeviceCacheStatus;
  selectedHomeDevice: HomeDevice;
}
