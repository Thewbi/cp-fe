import {Action, createReducer, on} from '@ngrx/store';
import {createFeatureSelector, createSelector, ActionReducer, combineReducers } from '@ngrx/store';

// import all actions defined in the groups module
import {reset, retrieved, select} from './group.actions';
import {GroupState} from './group.state';
import {Group} from '../group.model';
import {AppState} from 'src/app/store/app.state';
import {initialGroupState} from './group.state.initial';

// Inspired by:
// https://www.kimsereylam.com/angular/2019/11/01/feature-reducer-with-ngrx.html

// use the ngrx createReducer() function to define a reducer function
// https://ngrx.io/api/store/createReducer
const internalGroupReducer = createReducer(
    initialGroupState,

    // assemble a new GroupState slice from the data that the action carries
    // the action 'retrieved' is thrown from the group-effect which uses a
    // service to retrieve data from the backend
    on(retrieved,
       (state, action) => {

         console.log('reducer state: ', state);
         console.log('reducer action: ', action);

         // combine new state from old state
         const newState = {...state, rootGroup: action.rootGroup};

         console.log('reducer newState: ', newState);

         return newState;

       }),



    on(select, (state, action) => {

      console.log('reducer ', state, action);

      let newState = Object.assign({}, state);
      newState.currentGroup = action.selectedGroup;

      //const newState = {...state, currentGroup: action.selectedGroup};

      return newState;
    }),

    // the reset action restores the initial state
    on(reset, () => initialGroupState),
  );

// https://angular.io/guide/aot-compiler
// for AoT (Ahead of Time) purposes, define the reducer as a private variable
// and expose a function reducer I do not know how that works exactly right now!
export function groupReducer(state: GroupState|undefined, action: Action) {
  return internalGroupReducer(state, action);
}

export const getGroupState = createFeatureSelector<AppState, GroupState>('groups');
export const getCurrentGroup = createSelector(
      getGroupState,
      groupState => { 
        return groupState.currentGroup;
      });

// export const getTest = createSelector(
//     getCurrentGroup,
//     (group: Group) => {

//       console.log('bla: ' + group);

//       return group;
//     });
