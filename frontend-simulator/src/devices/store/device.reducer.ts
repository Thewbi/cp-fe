import {Action, createReducer, on, ActionReducerMap} from '@ngrx/store';

// import all actions defined in the device module
import {reset, retrieved} from './device.actions';
import {DeviceState} from './device.state';
import {initialDeviceState} from './device.state.initial';

// Inspired by:
// https://www.kimsereylam.com/angular/2019/11/01/feature-reducer-with-ngrx.html

// use the ngrx createReducer() function to define a reducer function
// https://ngrx.io/api/store/createReducer
const internalDeviceReducer = createReducer(
    initialDeviceState,

    // assemble a new GroupState slice from the data that the action carries
    // the action 'retrieved' is thrown from the group-effect which uses a
    // service to retrieve data from the backend
    on(retrieved,
       (state, action) => {
         console.log('reducer ', action);
         return {...state, devices: action.devices};
       }),

    // the reset action restores the initial state
    on(reset, () => initialDeviceState)
  );

// https://angular.io/guide/aot-compiler
// for AoT (Ahead of Time) purposes, define the reducer as a private variable
// and expose a function reducer I do not know how that works exactly right now!
export function deviceReducer(state: DeviceState|undefined, action: Action) {
  return internalDeviceReducer(state, action);
}

/**
 * This does not work!
 * How and when are ActionReducerMaps used???
 */
// export const deviceReducers: ActionReducerMap<DeviceState> = {
//   devices: deviceReducer
// };
