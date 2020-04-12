import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';

import {TemplateService} from '../service/template.service';

import {retrieveAction, retrievedAction} from './template.actions';

@Injectable()
export class TemplateEffects {
  /**
   * ctor
   *
   * @param actions$ all actions that travel through the application.
   * @param templateService template REST API interaction.
   */
  constructor(
      private actions$: Actions, private templateService: TemplateService) {}

  /**
   * Effect for retrieving templates.
   */
  loadTemplate$ = createEffect(
      () => this.actions$.pipe(
          ofType(retrieveAction),
          mergeMap(
              () => this.templateService.getTemplates().pipe(
                  map(templates => (retrievedAction({templates}))),
                  catchError(() => EMPTY)))));
}
