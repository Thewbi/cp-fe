import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';  // npm install @ngrx/effects --save
import {StoreModule} from '@ngrx/store';      // npm install @ngrx/store

import {GroupEffects} from './store/group.effects';
import {groupReducer} from './store/group.reducer';

@NgModule({
  imports: [
    CommonModule, StoreModule.forFeature('groups', groupReducer),
    EffectsModule.forFeature([GroupEffects])
  ],
  exports: [],
  declarations: [],
  providers: []
})
export class GroupsModule {
}
