import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {Device} from '../device.model';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(private httpClient: HttpClient) {}

  getDevices(): Observable<Device[]> {
    console.log('getDevices()');

    const allDevicesUrl = 'http://127.0.0.1:8080/basic/api/device/all';

    return this.httpClient.get<Device[]>(allDevicesUrl);
  }
}
