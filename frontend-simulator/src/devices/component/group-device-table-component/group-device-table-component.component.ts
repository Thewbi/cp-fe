import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {isEmpty, isNil} from 'lodash';
import {Observable} from 'rxjs';
import {AppState} from 'src/app/store/app.state';
import {Device} from 'src/devices/device.model';
import {Group} from 'src/groups/group.model';
import {getCurrentGroupSelector, getDevicesInGroupSelector} from 'src/groups/store/group.selector';
import {isNullOrUndefined} from 'util';

/**
 * group-device-table-component is a component that renders all devices assigned
 * to the currently selected group as a table.
 */
@Component({
  selector: 'cockpit-group-device-table-component',
  templateUrl: './group-device-table-component.component.html',
  styleUrls: ['./group-device-table-component.component.css']
})
export class GroupDeviceTableComponentComponent implements OnInit {
  devices: Observable<Device[]>;

  /**
   * ctor
   *
   * @param store the global ngrx store.
   */
  constructor(private store: Store<AppState>) {}

  /**
   * ngOnInit() angular component lifecycle method.
   */
  ngOnInit(): void {
    console.log('GroupDeviceTableComponentComponent - ngOnInit()');

    // // DEBUG output the complete store state for debugging
    // this.store.select<AppState>((state: AppState) => state)
    //     .subscribe((appState: AppState) => {
    //       console.log('appState: ', appState);
    //     });

    // subscribe to when the user selects a group.
    // The store internally saves the currently selected group as part of it's
    // state
    this.store.select(getCurrentGroupSelector)
        .subscribe(this.selectedGroupChanged.bind(this));

    // subscribe to all the devices inside the selected group.
    // The store knows which group is selected because the selected group is
    // part of it's internal state
    this.store.select(getDevicesInGroupSelector)
        .subscribe(this.devicesInGroupChanged.bind(this));

    // store the observable
    // Using this variable in the components template will make the template
    // automatically rerender when the device data in the store changes!
    this.devices = this.store.select(getDevicesInGroupSelector);
  }

  /**
   * This method gets called, when the user selects a group in the group
   * hierarchy.
   *
   * DEBUG: For debugging purposes the app.component will simulate
   * group selection by dispatching a selectAction
   *
   * @param currentGroup the selected group in the group hierarchy
   */
  selectedGroupChanged(currentGroup: Group) {
    if (isNil(currentGroup)) {
      return;
    }

    console.log('currentGroup: ', currentGroup);

    // retrieve all device guid of devices assigned to this group
    const deviceReferences = currentGroup.deviceReferences;

    if (isEmpty(deviceReferences)) {
      return;
    }

    const guid = deviceReferences[0];

    console.log(guid);

    // TODO: erase all components of the old group
    // TODO: create components for each device in the new group
    // TODO: render the components within the template of the
    // group-device-table-component

    // TODO: select all devices from the deviceReferences array from the store
    // TODO: display those devices on the template
  }

  devicesInGroupChanged(devices: Array<Device>) {
    console.log('Devices in group changed', devices);
  }
}
