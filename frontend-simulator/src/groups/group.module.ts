import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTreeModule} from '@angular/material/tree';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {GroupTreeComponentComponent} from './component/group-tree-component/group-tree-component.component';
import {GroupEffects} from './store/group.effects';
import {groupReducer} from './store/group.reducer';

@NgModule({
  imports: [
    BrowserModule, BrowserAnimationsModule, CommonModule,
    StoreModule.forFeature('groups', groupReducer),
    EffectsModule.forFeature([GroupEffects]), MatToolbarModule, MatIconModule,
    MatButtonModule, MatTreeModule
  ],
  declarations: [GroupTreeComponentComponent],
  exports: [GroupTreeComponentComponent],
  providers: []
})
export class GroupsModule {
}
