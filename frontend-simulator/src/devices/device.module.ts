import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';  // npm install @ngrx/effects --save
import {StoreModule} from '@ngrx/store';      // npm install @ngrx/store

import {GroupDeviceTableComponentComponent} from './component/group-device-table-component/group-device-table-component.component';
import {DeviceEffects} from './store/device.effects';
import {deviceReducer} from './store/device.reducer';

@NgModule({
  imports: [
    CommonModule, StoreModule.forFeature('devices', deviceReducer),
    EffectsModule.forFeature([DeviceEffects])
  ],
  exports: [GroupDeviceTableComponentComponent],
  declarations: [GroupDeviceTableComponentComponent],
  providers: []
})
export class DevicesModule {
}
