import {Action, ActionReducerMap, createReducer, on} from '@ngrx/store';
import {cloneDeep, isEmpty, isNil} from 'lodash';

// import all actions defined in the device module
import {changedAction, changedEventAction, resetAction, retrievedAction} from './device.actions';
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
    on(retrievedAction,
       (state, action) => {
         // console.log('reducer ', action);
         return {...state, devices: action.devices};
       }),

    // the reset action restores the initial state
    on(resetAction, () => initialDeviceState),

    on(changedAction,
       (state, action) => {
         // console.log('reducer ', action);

         // return {...state, devices: action.devices};
         //
         // https:
         // stackoverflow.com/questions/49489981/angular5-ngrx-store-changing-a-value-of-array
         // return {...state, devices: Array.of(action.device)};

         // const newState = cloneDeep(state);

         const index = state.devices.map(device => device.guid)
                           .indexOf(action.device.guid);

         // https://stackoverflow.com/questions/41572559/angular-2-ngrx-what-is-the-proper-way-to-immutably-update-an-array-of-objects
         return {
           ...state,
           devices: [
             ...state.devices.slice(0, index),
             Object.assign({}, state.devices[index], action.device),
             ...state.devices.slice(index + 1)
           ]
         };

         // return state;
       }),

    on(changedEventAction,
       (state, action) => {
         // find the device
         let device = state.devices.find(device => device.guid);

         // if the device has no template, return
         if (isNil(device) || isNil(device.template)) {
           return;
         }

         // copy because otherwise I cannot change attributes of the device!
         device = cloneDeep(device);

         const pushEventDto = action.pushEventDto;

         const logicalDeviceId = pushEventDto.event.logicalDeviceId;
         const templatePropertyName = pushEventDto.event.templatePropertyName;
         const newValue = pushEventDto.event.value;
         const template = device.template;

         template.logicalDevices
             .filter(logicalDevice => logicalDevice.id === logicalDeviceId)
             .map(logicalDevice => logicalDevice.properties)
             // combine the property arrays of each
             // property to one large property array
             .reduce((prev, curr) => prev.concat(curr))
             .filter(
                 templateProperty =>
                     templateProperty.id === templatePropertyName)
             .map(templateProperty => templateProperty.states)
             // combine the property arrays of each
             // property to one large property array
             .reduce((prev, curr) => prev.concat(curr))
             .map(state => {
               // turn all states off
               state.active = false;
               return state;
             })
             .filter(state => state.value === newValue)
             .forEach(state => {
               // set this one state on
               state.active = true;
               // this.store.dispatch(changedAction({device}));
             });

         const index =
             state.devices.map(device => device.guid).indexOf(device.guid);

         // https://stackoverflow.com/questions/41572559/angular-2-ngrx-what-is-the-proper-way-to-immutably-update-an-array-of-objects
         return {
           ...state,
           devices: [
             ...state.devices.slice(0, index),
             Object.assign({}, state.devices[index], device),
             ...state.devices.slice(index + 1)
           ]
         };

         return state;
       })

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
