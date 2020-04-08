import { Template } from '../templates/template.model';

export class DevicePropertyOption {
  public label: string;
  public value: string;
}

export class DeviceProperty {
  public id: string;
  public description: string;
  public guid: string;
  public unit: string;
  public dco: string;
  public min: number;
  public max: number;
  public key: string;
  public type: string;
  public name: string;
  public readable: boolean;
  public writable: boolean;
  public observable: boolean;
  public valueOptions: DevicePropertyOption[];
  public options: DevicePropertyOption[];
  public value: any;
}

export type DeviceStatus = 'UNKNOWN'|'REMOVED'|'NOT_INITIALIZED'|'OFFLINE'|
    'ONLINE'|'INITIALIZING'|'CONFIGURED'|'REMOVING';

export type ProtocolAdapter = 'CAN'|'BACNET'|'BACnet'|'ICP';

export class Device {
  public guid: string;
  public label: string;
  public description: string;
  public location: string;
  public productId: string;
  public type: string;
  public errorCode: string;
  public errorMessage: string;
  public errorCodeMessage: string;
  public timestampAdded: number;
  public hardwareVendor: string;
  public hardwareVersion: string;
  public status: DeviceStatus;
  public protocolAdapter: ProtocolAdapter;
  public templateId: string;
  public properties: DeviceProperty[];
  public climateZoneId: string;
  // ui
  template: Template;
}

export class SelectableDevice extends Device {
  public selected: boolean = false;
}

export class DeviceMetadata {
  public guid: string;
  public newGuid: string|null;
  public name: string;
  public description: string;
  public location: string;
  public templateId: string;
}

export class DeviceMetadataRequest {
  public list: DeviceMetadata[];
}

export class HomeDevice {
  public parentName: string;
  public parentGuid: string;
  public guid: string;
  public name: string;
  public type: string;
  public errorCode: number;
  public errorMessage: string;
  public errorCodeMessage: string;
  public timestampAdded: number;
  public hardwareVendor: string;
  public hardwareVersion: string;
  public children: HomeDevice[];
  public deviceClasses: DeviceClassObject[];
  public status: DeviceStatus;
  public protocolAdapter: ProtocolAdapter;
  public properties: any;
}

export class DeviceClassObject {
  public deviceClass: string;
  public dco: string;
  public properties: DeviceProperty[];
  public operations: DeviceOperation[];
}

export class DeviceOperation {
  guid: string;
  dco: string;
  name: string;
  description: string;
  parameterDescription: string[];
}

export class ExecutableOperation {
  guid: string;
  dco: string;
  operation: string;
  parameters: any[];
}

export class PropertyUpdate {
  guid: string;
  dco: string;
  propertyName: string;
  value: any;
}

export class DeviceCacheStatus {
  static readonly RUNNING = 'RUNNING';
  static readonly ERROR = 'ERROR';
  static readonly COMPLETE = 'COMPLETE';
}
