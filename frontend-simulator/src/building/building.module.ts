import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule, HttpHeaders, HttpResponse} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DevicesModule} from 'src/devices/device.module';
import {GroupsModule} from 'src/groups/group.module';

import {GroupDeviceComponent} from './group-device/group-device.component';


@NgModule({
  imports: [
    BrowserModule, BrowserAnimationsModule, CommonModule, GroupsModule,
    DevicesModule, MatButtonModule, HttpClientModule
  ],
  declarations: [GroupDeviceComponent],
  exports: [GroupDeviceComponent],
})
export class BuildingModule {
}
