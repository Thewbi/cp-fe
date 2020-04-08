import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';  // npm install @ngrx/effects --save
import {StoreModule} from '@ngrx/store';      // npm install @ngrx/store

import {DeviceEffects} from './store/device.effects';
import {deviceReducer} from './store/device.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('devices', {DeviceState: deviceReducer}),
    EffectsModule.forFeature([DeviceEffects])
  ],
  exports: [],
  declarations: [],
  providers: []
})
export class DevicesModule {
}
