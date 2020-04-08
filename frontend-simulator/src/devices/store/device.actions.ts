import {createAction, props} from '@ngrx/store';
import {Device} from '../device.model';

// call the ngrx createAction() method to create an action for loading devices
export const retrieve =
    createAction('[DEVICES] Retrieve', props<{devices: Device[]}>());

export const retrieved =
    createAction('[DEVICES] Retrieved', props<{devices: Device[]}>());

// when the reset action is dispatched, the initial state will be restored
export const reset = createAction('[DEVICES] Reset');
