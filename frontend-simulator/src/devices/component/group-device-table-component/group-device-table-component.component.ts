// import 'rxjs/add/operator/map';

import {Component, OnInit} from '@angular/core';
import {resultMemoize, Store} from '@ngrx/store';
import {isEmpty, isNil} from 'lodash';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map, take, tap} from 'rxjs/operators';
import {AppState} from 'src/app/store/app.state';
import {DeviceRow} from 'src/devices/device.dto';
import {Device} from 'src/devices/device.model';
import {Group} from 'src/groups/group.model';
import {getCurrentGroupSelector, getDevicesInGroupSelector} from 'src/groups/store/group.selector';

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
  deviceRows: Observable<DeviceRow[]> = new BehaviorSubject([]);

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

    // export interface DeviceRow {
    //   guid?: string;
    //   device?: string;
    //   productId?: string;
    //   templateId?: string;
    //   template?: string;
    //   logicalDevice?: string;
    //   property?: string;
    //   state?: string;
    // }

    this.deviceRows =
        this.store.select(getDevicesInGroupSelector).pipe(map(deviceArray => {
          const result = new Array<DeviceRow>();

          deviceArray.forEach(device => {
            // const deviceRow: DeviceRow = {
            //   guid: device.guid,
            //   device: device.description,
            //   productId: device.productId,
            //   templateId: device.templateId,
            //   template: device.template.productId
            // };

            device.template.logicalDevices.forEach(ld => {
              // deviceRow.logicalDevice = ld.id + ' ' + ld.icon;

              ld.properties.forEach(p => {
                // deviceRow.property = p.id + ' ' + p.type;

                p.states.forEach(s => {
                  const deviceRow: DeviceRow = {
                    guid: device.guid,
                    device: device.description,
                    productId: device.productId,
                    templateId: device.templateId,
                    template: device.template.productId
                  };

                  deviceRow.logicalDevice = ld.id + ' ' + ld.icon;
                  deviceRow.property = p.id + ' ' + p.type;
                  deviceRow.state =
                      s.translationKey + ' ' + s.active + ' ' + s.icon;

                  result.push(deviceRow);
                });
              });
            });

            // result.push(deviceRow);
          });

          return result;
        }));

    // //this.deviceRows = new Array<DeviceRow>();
    // this.devices.pipe(map(
    //     d => {

    //       d.forEach(device => {
    //       const deviceRow: DeviceRow = { guid: device.guid };
    //       return deviceRow;
    //     })
    //     }));

    // this.devices.pipe(  // => Observable<string[]>
    //     map(r => r.map(
    //             v => ({guid: v.guid})))  // => Observable<{ name: string }[]>
    //         .subscribe(r => this.deviceRows.next(r)));

    // this.deviceRows
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
