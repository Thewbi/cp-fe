import {Action, createReducer, on} from '@ngrx/store';

// import all actions defined in the device module
import {reset, retrieved} from './template.actions';
import {TemplateState} from './template.state';
import {initialTemplateState} from './template.state.initial';

// Inspired by:
// https://www.kimsereylam.com/angular/2019/11/01/feature-reducer-with-ngrx.html

// use the ngrx createReducer() function to define a reducer function
// https://ngrx.io/api/store/createReducer
const internalTemplateReducer = createReducer(
    initialTemplateState,

    // assemble a new GroupState slice from the data that the action carries
    // the action 'retrieved' is thrown from the group-effect which uses a
    // service to retrieve data from the backend
    on(retrieved,
       (state, action) => {
         console.log('reducer ', action);
         return {...state, templates: action.templates};
       }),

    // the reset action restores the initial state
    on(reset, () => initialTemplateState));

// https://angular.io/guide/aot-compiler
// for AoT (Ahead of Time) purposes, define the reducer as a private variable
// and expose a function reducer I do not know how that works exactly right now!
export function templateReducer(state: TemplateState|undefined, action: Action) {
  return internalTemplateReducer(state, action);
}
