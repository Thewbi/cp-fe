import {createAction, props} from '@ngrx/store';
import {Group} from '../group.model';

// call the ngrx createAction() method to create an action for loading groups
export const retrieveAction =
    createAction('[GROUPS] Retrieve', props<{rootGroup: Group}>());

export const retrievedAction =
    createAction('[GROUPS] Retrieved', props<{rootGroup: Group}>());

export const selectAction =
    createAction('[GROUPS] Select', props<{selectedGroup: Group}>());

// when the reset action is dispatched, the initial state will be restored
export const resetAction = createAction('[GROUPS] Reset');
