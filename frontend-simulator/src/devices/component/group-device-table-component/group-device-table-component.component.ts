import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from 'src/app/store/app.state';
import {GroupState} from 'src/groups/store/group.state';

import {createFeatureSelector, createSelector, ActionReducer, combineReducers } from '@ngrx/store';

import {getGroupState, getCurrentGroup} from 'src/groups/store/group.reducer';

@Component({
  selector: 'cockpit-group-device-table-component',
  templateUrl: './group-device-table-component.component.html',
  styleUrls: ['./group-device-table-component.component.css']
})
export class GroupDeviceTableComponentComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {

    console.log('GroupDeviceTableComponentComponent - ngOnInit()');

    // output the complete store state for debugging
    this.store.select<AppState>((state: AppState) => state)
        .subscribe((appState: AppState) => {
          console.log('appState: ', appState);
        });

    //export const selectUser = (state: AppState) => state.groups.selectedGroup;

    //this.store.select('devices'); //.pipe(() => { console.log('a group was selected!')});

    

    //this.store.select(getGroupState).subscribe((groupState) => { console.log('groupstate: ', groupState); });

    this.store.select(getCurrentGroup).subscribe((currentGroup) => { 
      console.log('currentGroup: ', currentGroup); 
    });

    // this.store.select(getTest).subscribe((currentGroup) => { 
    //   console.log('currentGroup: ', currentGroup); 
    // });

  // .map(state => state.pizzas)
  // .map(pizzas => pizza.entities);
  }

}
