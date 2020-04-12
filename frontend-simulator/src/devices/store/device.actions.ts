import {createAction, props} from '@ngrx/store';
import {PushEventDto} from 'src/notifications/notification.model';

import {Device} from '../device.model';

// call the ngrx createAction() method to create an action for loading devices
export const retrieveAction =
    createAction('[DEVICES] Retrieve', props<{devices: Device[]}>());

export const retrievedAction =
    createAction('[DEVICES] Retrieved', props<{devices: Device[]}>());

// when the reset action is dispatched, the initial state will be restored
export const resetAction = createAction('[DEVICES] Reset');

export const changedAction =
    createAction('[DEVICES] Changed', props<{device: Device}>());

export const changedEventAction = createAction(
    '[DEVICES] ChangedEvent', props<{pushEventDto: PushEventDto}>());
