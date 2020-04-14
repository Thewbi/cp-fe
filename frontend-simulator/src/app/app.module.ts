import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTreeModule} from '@angular/material/tree';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {BuildingModule} from 'src/building/building.module';
import {DevicesModule} from 'src/devices/device.module';
import {GroupsModule} from 'src/groups/group.module';
import {TemplatesModule} from 'src/templates/template.module';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule, AppRoutingModule,
    // import the HttpClientModule after the BrowserModule!
    HttpClientModule,
    StoreModule.forRoot({
        // intentionally empty, is extended by the individual modules
        // groups: groupReducer
    }),
    EffectsModule.forRoot([]), StoreDevtoolsModule.instrument({
      maxAge: 25,
      // logOnly: environment.production
    }),
    GroupsModule,     // this module adds building structures (= groups) to the
                      // application
    DevicesModule,    // this module adds Devices to the application
    TemplatesModule,  // this module adds Templates to the application
    MatToolbarModule, MatIconModule, MatButtonModule, MatTreeModule,
    MatSliderModule, BuildingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
