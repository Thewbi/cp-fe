import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
//import {GroupDeviceTableComponentComponent} from 'src/devices/component/group-device-table-component/group-device-table-component.component';
import {DevicesModule} from 'src/devices/device.module';
import {GroupsModule} from 'src/groups/group.module';
import {TemplatesModule} from 'src/templates/template.module';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {groupReducer} from 'src/groups/store/group.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, AppRoutingModule,
    // import the HttpClientModule after the BrowserModule!
    HttpClientModule,
    StoreModule.forRoot({
        // intentionally empty, is extended by the individual modules
        //groups: groupReducer
    }),
    EffectsModule.forRoot([]), StoreDevtoolsModule.instrument({
      maxAge: 25,
      // logOnly: environment.production
    }),

    GroupsModule,    // this module adds building structures (= groups) to the
                     // application
    DevicesModule,   // this module adds Devices to the application
    TemplatesModule  // this module adds Templates to the application
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
