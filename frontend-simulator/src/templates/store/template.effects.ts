import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';

import {TemplateService} from '../service/template.service';
import {retrieve, retrieved} from './template.actions';

@Injectable()
export class TemplateEffects {
  constructor(private actions$: Actions, private templateService: TemplateService) {}
  loadTemplate$ = createEffect(
      () => this.actions$.pipe(
          ofType(retrieve),
          mergeMap(
              () => this.templateService.getTemplates().pipe(
                  map(templates => ({type: retrieved.type, templates})),
                  catchError(() => EMPTY)))));
}
