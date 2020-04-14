import {Component, OnInit} from '@angular/core';
import {isNil} from 'lodash';
import {BuildingServiceService} from 'src/building/service/building-service.service';

/**
 * This component combines a list of devices and a tree of groups.
 * It allows the user to assign devices to groups.
 */
@Component({
  selector: 'cockpit-group-device',
  templateUrl: './group-device.component.html',
  styleUrls: ['./group-device.component.css']
})
export class GroupDeviceComponent implements OnInit {
  selectedGroup: Group;
  selectedDevice: Device;

  constructor(private buildingServiceService: BuildingServiceService) {}

  ngOnInit(): void {}

  deviceSelected(device: Device) {
    console.log('device: ', device);

    // TODO: dispatch selection to store (Maybe this local state does not need
    // to go into the store?!?)
    this.selectedDevice = device;
  }

  groupSelected(group: Group) {
    console.log('group: ', group);

    // TODO: dispatch selection to store (Maybe this local state does not need
    // to go into the store?!?)
    this.selectedGroup = group;
  }

  handleAssignButtonClick(event: any) {
    // TODO: retrieve selection from store
    // call service to create the assignment in the backend
    if (isNil(this.selectedGroup) || isNil(this.selectedDevice)) {
      console.log('Please select a group and a device');
      return;
    }

    const deviceReference: DeviceReference = {
      guid: this.selectedDevice.guid,
      parentId: this.selectedGroup.id,
      listIndex: 0
    };

    const deviceReferenceRequest:
        DeviceReferenceRequest = {references: Array.of(deviceReference)};

    this.buildingServiceService.createDeviceReferences(deviceReferenceRequest);

    // make the device appear as a child of the group node
    this.selectedGroup.deviceReferences.push(deviceReference);
  }
}
import {Device} from 'src/devices/device.model';
import {Group} from 'src/groups/group.model';
import {DeviceReference, DeviceReferenceRequest} from 'src/groups/group.model';
