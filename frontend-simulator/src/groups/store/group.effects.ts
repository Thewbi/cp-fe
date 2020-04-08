import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';

import {GroupService} from '../service/group.service';
import {retrieve, retrieved} from './group.actions';

@Injectable()
export class GroupEffects {
  constructor(private actions$: Actions, private groupService: GroupService) {}
  loadGroups$ = createEffect(
      () => this.actions$.pipe(
          ofType(retrieve),
          mergeMap(
              () => this.groupService.getRootGroup().pipe(
                  map(rootGroup => ({type: retrieved.type, rootGroup})),
                  catchError(() => EMPTY)))));
}
