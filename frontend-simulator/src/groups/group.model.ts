export class Group {
    public id: number;
    public guid: string;
    public version: number;
    public parentId: number;
    public listIndex: number;
    public description: string;
    public notes: string;
    public type: string;
    public email: string;
    public phone: string;
    public tenantId: number;
    public children: Group[];
    public deviceReferences: DeviceReference[];
}

export class SimpleGroup {
    public id: number;
    public description: string;
}

export interface DeviceReferenceRequest {
    references: DeviceReference[];
}

export interface DeviceReference {
    id?: number;
    version?: number;
    parentId: number;
    listIndex: number;
    guid: string;
}