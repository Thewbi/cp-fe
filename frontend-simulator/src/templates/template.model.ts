import {isNil} from 'lodash';
import {Device} from '../devices/device.model';

export interface TemplateState {
  loading: boolean;
  templates: Template[];
}

/**
 * A Device describes a real device instance in the real world (RWS with CAN
 * address 1) A Device is connected to a Template.
 *
 * A Template describes one or more LogicalDevices. That means a Device acts as
 * one or more than one LogicalDevice, depending on which Template was assigned
 * to the Device.
 *
 * A LogicalDevice has Properties > State > Action.
 */
export class Template {
  public productId: string;
  public productVariation: string;
  public protocolType: string;
  public translationKey: string;
  public logicalDevices: LogicalDevice[] = [];

  get id() {
    return `${this.productId}->${this.productVariation}`;
  }

  constructor(template?: Template) {
    if (template) {
      this.productId = template.productId;
      this.protocolType = template.protocolType;
      this.translationKey = template.translationKey;
      this.productVariation = template.productVariation;
      this.logicalDevices = [];
      template.logicalDevices.forEach((l: LogicalDevice) => {
        this.logicalDevices.push(new LogicalDevice(l));
      });
    }
  }
}

export class LogicalDevice {
  public id: string;
  public icon: string;
  public translationKey: string;
  public properties: Property[] = [];
  // ui
  public updated = false;
  public color: {} = {};

  constructor(l?: LogicalDevice) {
    if (l) {
      this.id = l.id;
      this.icon = l.icon;
      this.translationKey = l.translationKey;
      this.updated = l.updated || false;
      this.color = l.color || {};
      this.properties = [];
      l.properties.forEach((p: Property) => {
        this.properties.push(new Property(p));
      });
    }
  }

  setProperty(n: Property) {
    // remove old property (by name)
    this.properties = this.properties.filter(p => p.id !== n.id) || [];
    // add new property
    this.properties.push(new Property(n));
  }
}

export class WrappedLogicalDevice extends LogicalDevice {
  public isOnline = false;
  public isTemplateOk = false;

  /**
   *
   * @param l The LogicalDevice defined by a Template.
   * @param d The real Device instance from the device model.
   */
  constructor(l?: LogicalDevice, d?: Device) {
    super(l);
    if (!isNil(d)) {
      this.isOnline = d.status === 'ONLINE' ? true : false;

      if (!isNil(d.template)) {
        this.isTemplateOk = d.template.productId === d.productId;
      }
    }
  }

  deviceOfflineOrTemplateError(): boolean {
    return !this.isOnline || !this.isTemplateOk;
  }
}

export class Property {
  public id: string;
  public translationKey: string;
  public type: 'MASTER'|'STATE'|'SIMPLE'|string;
  public states: State[];

  constructor(p?: Property) {
    if (p) {
      this.id = p.id;
      this.translationKey = p.translationKey;
      this.type = p.type;
      this.states = [];
      p.states.forEach((s: State) => {
        this.states.push(new State(s));
      });
    }
  }
}

export class State {
  public translationKey: string;
  public value: any;
  public icon: string;
  public color: string;
  public orderIndex: number;
  public action: Action;
  public toggle: boolean;
  // ui only
  // public active: boolean;
  public active = false;
  public blocked: boolean;
  /**
   * preActive is set after executing an action of an inactive state.
   * while the request is pending or the new state is not yet active,
   * the preActive state will be shown.
   */
  public preActive: boolean;
  /**
   * lastActive is used to store the last active state.
   * When a preActive state is reset via timeout, the last
   * active state should be restored.
   */
  public lastActive: boolean;
  isCustomSystemAlarm: boolean;

  constructor(s?: State) {
    if (s) {
      this.active = s.active;
      this.blocked = s.blocked || false;
      this.preActive = s.preActive;
      this.lastActive = s.lastActive;
      this.translationKey = s.translationKey;
      this.value = s.value;
      this.icon = s.icon;
      this.color = s.color;
      this.orderIndex = s.orderIndex;
      this.action = s.action;
      this.toggle = s.toggle;
      this.isCustomSystemAlarm = s.isCustomSystemAlarm;
    }
  }
}

export class SelectableState extends State {
  public selected: boolean;

  constructor(state?: State) {
    if (state) {
      super(state);
    }
  }
}

export class Action {
  public name: string;
  public targetValue: any;
}
