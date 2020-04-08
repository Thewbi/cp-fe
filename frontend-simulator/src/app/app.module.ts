// angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// ngrx store
import { StoreModule } from '@ngrx/store'; // npm install @ngrx/store
import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // npm install @ngrx/store-devtools
import { EffectsModule } from '@ngrx/effects'; // npm install @ngrx/effects --save

// application / domain code
import { AppComponent } from './app.component';
import { GroupsModule } from 'src/groups/group.module';
import { DevicesModule } from 'src/devices/device.module';
import { TemplatesModule } from 'src/templates/template.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // import the HttpClientModule after the BrowserModule!
    HttpClientModule,
    StoreModule.forRoot({
      // intentionally empty, is extended by the individual modules
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      //logOnly: environment.production
    }),

    GroupsModule, // this module adds building structures (= groups) to the application
    DevicesModule, // this module adds Devices to the application
    TemplatesModule // this module adds Templates to the application
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
