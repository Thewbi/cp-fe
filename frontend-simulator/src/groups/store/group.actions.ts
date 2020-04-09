import {createAction, props} from '@ngrx/store';
import {Group} from '../group.model';

// call the ngrx createAction() method to create an action for loading groups
export const retrieve =
    createAction('[GROUPS] Retrieve', props<{rootGroup: Group}>());

export const retrieved =
    createAction('[GROUPS] Retrieved', props<{rootGroup: Group}>());

export const select =
    createAction('[GROUPS] Select', props<{selectedGroup: Group}>());

// when the reset action is dispatched, the initial state will be restored
export const reset = createAction('[GROUPS] Reset');
