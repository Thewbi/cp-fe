import {createAction, props} from '@ngrx/store';
import {Template} from '../template.model';

// call the ngrx createAction() method to create an action for loading devices
export const retrieve =
    createAction('[TEMPLATES] Retrieve', props<{templates: Template[]}>());

export const retrieved =
    createAction('[TEMPLATES] Retrieved', props<{templates: Template[]}>());

// when the reset action is dispatched, the initial state will be restored
export const reset = createAction('[TEMPLATES] Reset');
