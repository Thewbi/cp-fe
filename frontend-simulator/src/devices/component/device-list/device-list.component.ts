import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from 'src/app/store/app.state';
import {Device} from 'src/devices/device.model';
import {getAllDevicesSelector} from 'src/devices/store/device.selector';

@Component({
  selector: 'cockpit-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {
  devices: Observable<Device[]>;

  @Output() deviceSelected = new EventEmitter<Device>();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // subscribe to the selection of groups
    this.devices = this.store.select(getAllDevicesSelector);
  }

  elementClick(device: Device) {
    // console.log('Device: ', device);
    this.deviceSelected.emit(device);
  }
}
