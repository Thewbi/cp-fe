import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';

import {DeviceService} from '../service/device.service';
import {retrieve, retrieved} from './device.actions';

@Injectable()
export class DeviceEffects {
  constructor(private actions$: Actions, private deviceService: DeviceService) {}
  loadDevices$ = createEffect(
      () => this.actions$.pipe(
          ofType(retrieve),
          mergeMap(
              () => this.deviceService.getDevices().pipe(
                  map(devices => ({type: retrieved.type, devices})),
                  catchError(() => EMPTY)))));
}
