import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';

import {GroupService} from '../service/group.service';
import {retrieveAction, retrievedAction} from './group.actions';

@Injectable()
export class GroupEffects {
  constructor(private actions$: Actions, private groupService: GroupService) {}
  loadGroups$ = createEffect(
      () => this.actions$.pipe(
          ofType(retrieveAction),
          mergeMap(
              () => this.groupService.getRootGroup().pipe(
                  // send a retrieved Action
                  map(rootGroup => (retrievedAction({rootGroup}))),
                  catchError(() => EMPTY)))));
}
