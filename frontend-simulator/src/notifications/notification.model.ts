import {merge} from 'lodash';
import * as moment from 'moment';
// import { Device } from '../../basic/devices/device.models';
// import { CareAlarmOptions } from '../../care/components/alarms/alarm.models';
// import { InacNotificationEvent } from '../../inac/events/events.models';
// import { OrderNotificationEvent } from '../../inac/orders/orders.models';
import {Group, SimpleGroup} from 'src/groups/group.model';

export abstract class EventLogType {
  abstract getEventType(): EventType;

  isResetted() {
    return this.getEventType() === 'SYSTEM_ALARM_RESET' ||
        this.getEventType() === 'ALARM_RESET';
  }

  isActive() {
    return this.getEventType() === 'SYSTEM_ALARM' ||
        this.getEventType() === 'ALARM_NORMAL';
  }

  isAcknowledged() {
    return this.getEventType() === 'SYSTEM_ALARM_ACKNOWLEDGED' ||
        this.getEventType() === 'ALARM_ACKNOWLEDGED';
  }

  isNotification() {
    return (
        this.getEventType() !== 'ALARM_NORMAL' &&
        this.getEventType() !== 'ALARM_RESET' &&
        this.getEventType() !== 'ALARM_ACKNOWLEDGED');
  }

  isSystemAlarm() {
    return (
        this.getEventType() === 'SYSTEM_ALARM' ||
        this.getEventType() === 'SYSTEM_ALARM_RESET' ||
        this.getEventType() === 'SYSTEM_ALARM_ACKNOWLEDGED');
  }

  isNormalAlarm() {
    return !this.isNotification();
  }

  isDeviceEvent() {
    return this.getEventType() === 'NORMAL' ||
        this.getEventType() === 'DEVICE_ALARM';
  }

  getEventTypeOrder(): number {
    switch (this.getEventType()) {
      case 'DEVICE_ALARM':
        return 0;
      case 'SYSTEM_ALARM':
      case 'SYSTEM_ALARM_ACKNOWLEDGED':
        return 1;
      case 'NORMAL':
        return 2;
      case 'SYSTEM_ALARM_RESET':
        return 4;
      default:
        return 4;
    }
  }
}
/**
 * Class to represent an event log entry either in the basic event log view
 * or the visu event window.
 */
export class Notification extends EventLogType {
  public id: number;
  public guid: string;
  public eventType: EventType;
  // Temporal Properties
  public timestamp: number;
  public acknowledgeTimestamp: number;

  public groupId: number;

  // HDMState
  public orderIndex?: number;
  public translationKey: string;
  public icon?: string;
  public color: {} = {};

  // HDMProperty
  public propertyTranslationKey: string;

  // Device Properties
  public deviceName: string;
  public deviceDescription?: string;
  public deviceLocation: string;
  public deviceType: string;

  // Org Groups Properties
  public groups: Array<Group|SimpleGroup>;

  // State
  public active = true;
  public initialState?: string;
  public actualState?: string;
  public value?: any;

  // Original update data if any
  public originalData?: PushEventDto;

  public user?: string;

  constructor(options?: Notification) {
    super();
    if (options) {
      merge(this, options);
    }
  }

  match(other: Notification) {
    // match when guid, logical device and timestamp are equal
    const sameGuid = this.guid === other.guid;
    const sameEventType = this.eventType === other.eventType;
    const sameLogicalDevice = this.deviceType === other.deviceType;
    const sameTimestamp =
        moment(this.timestamp).unix() === moment(other.timestamp).unix();
    return sameGuid && sameLogicalDevice && sameTimestamp && sameEventType;
  }

  getEventType() {
    return this.eventType;
  }
}

/**
 * Types of events that are pushed via websocket.
 */
export enum PushEventType {
  DEVICE_CHANGED = 'DEVICE_CHANGED',
  DEVICE_ADDED = 'DEVICE_ADDED',
  DEVICE_REMOVED = 'DEVICE_REMOVED',
  BACKGROUND_UPDATE_RUNNING = 'BACKGROUND_UPDATE_RUNNING',
  FAILED_EMAIL_DELIVERY = 'ALARM_EMAIL_SENDING_FAILED',
  DATE_TIME_UPDATE = 'DATE_TIME_UPDATE',
  EVENTLOG = 'EVENTLOG',
  ORDER_EVENT = 'ORDER_EVENT',
  INAC_EVENT = 'INAC_EVENT',
  EVENTLOG_STORAGE_LIMIT_ESCALATION = 'EVENTLOG_STORAGE_LIMIT_ESCALATION',
  ERROR = 'ERROR'
}

/**
 * Container class for any push event.
 
export class PushEventDto {
  public name: PushEventType;
  //public event: NotificationUpdateType;
}*/

export class PushEventDto {
  public name: PushEventType;
  public event: EventLogDto;
}

export class EventLogDto extends EventLogType {
  id: number;
  type: EventType;
  time: string;
  timestamp?: number;
  acknowledgeTime: string;
  acknowledgeTimestamp?: number;
  logicalDeviceTranslationKey: string;
  previousValueTranslationKey?: string;
  propertyTranslationKey: string;
  valueTranslationKey: string;
  deviceName: string;
  location: string;
  deviceTranslationKey: string;
  groupIds: SimpleGroup[];
  username?: string;
  guid: string;  // device guid

  // from NotificationEvent
  logicalDeviceId: string;
  groupId: number;
  templatePropertyName: string;
  value: any;
  previousValue: any;

  // from PendingAlarmDto
  alarmId: number;
  alarmName: string;
  alarmToneName: string;

  updated: boolean;
  acknowledgeRequired: boolean;
  acknowledgeState: AcknowledgeStateType;
  //   options: CareAlarmOptions;
  popupHtml: string;

  // ui
  alarmActive: boolean;

  constructor(public eventLogDto?: Partial<EventLogDto>) {
    super();
    merge(this, eventLogDto);
    delete this.eventLogDto;
  }
  getEventType() {
    return this.type;
  }
}

export class DeviceHeader {
  public guid: string;
  public parentGuid: string;
}

export class UpdateEvent {
  updateRunning: boolean;
}

export type PendingAlarmDto = Partial<EventLogDto>;

export class FailedEmailDeliveryEvent {
  to: string;
  subject: string;
  message: string;
  parameters: any;
  sendingFailedMessage: string;
}

export type AcknowledgeStateType =
    'NEVER'|'PENDING'|'PENDING_PROCESSED'|'ACKNOWLEDGED'|'RESET_TRIGGERED';

export type DeviceStatusType = 'UNKNOWN'|'REMOVED'|'NOT_INITIALIZED'|'OFFLINE'|
    'ONLINE'|'INITIALIZING'|'CONFIGURED'|'REMOVING';

// export type NotificationUpdateType =
//     |EventLogDto|UpdateEvent|FailedEmailDeliveryEvent|Device|DeviceHeader|
//     OrderNotificationEvent|InacNotificationEvent;

export type EventType =
    |'NORMAL'|'DEVICE_ALARM'|'ALARM_NORMAL'|'ALARM_RESET'|'ALARM_ACKNOWLEDGED'|
    'SYSTEM_ALARM'|'SYSTEM_ALARM_RESET'|'SYSTEM_ALARM_ACKNOWLEDGED';
