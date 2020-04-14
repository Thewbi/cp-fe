import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY, of} from 'rxjs';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';
import {TemplateService} from 'src/templates/service/template.service';
import {Template} from 'src/templates/template.model';

import {Device} from '../device.model';
import {DeviceService} from '../service/device.service';

import {retrieveAction, retrievedAction} from './device.actions';

@Injectable()
export class DeviceEffects {
  /**
   * ctor
   * @param actions$
   * @param deviceService
   */
  constructor(
      private actions$: Actions, private deviceService: DeviceService,
      private templateService: TemplateService) {}

  /**
   * Effect for loadDevices via a retrieveAction.
   */
  loadDevices$ = createEffect(

      // subscribe to the stream of all actions flowing through the application
      () => this.actions$.pipe(

          // only deal with retrieveAction elements within the stream of all
          // actions
          ofType(retrieveAction),

          // convert retrieveAction elements to an observable returned by the
          // templateService.getTemplates() call
          mergeMap(
              () => this.templateService.getTemplates().pipe(

                  // convert the template elements from the template observable
                  mergeMap((templates) => {
                    console.log(templates);

                    // build and return a new observable
                    // This new observable will be an observable of devices.
                    // The devices will be enriched by their templates.
                    return this.deviceService.getDevices().pipe(

                        // convert devices elements in the stream to devices!
                        // But enrich the devices in the process!
                        mergeMap((devices) => {
                          this.assignTemplate(devices, templates);

                          return of(devices);
                        }));
                  }),

                  // map(devices => ({type: retrieved.type, devices})),
                  map(devices => {
                    // console.log(devices);

                    return retrievedAction({devices});
                  }),
                  catchError(() => EMPTY))

                  )));

  assignTemplate(devices: Device[], templates: Template[]) {
    templates.forEach(template => {
      // build an id of of template properties.
      // This id is used in devices to reference a template
      const templateId = template.productId + '->' + template.productVariation;

      // find all devices that have this tempalteId assigned and enrich
      // the real template
      devices.filter(d => d.templateId === templateId).forEach(d => {
        d.template = template;
      });
    });
  }
}
