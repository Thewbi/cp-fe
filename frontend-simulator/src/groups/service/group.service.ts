import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {Group} from '../group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private httpClient: HttpClient) {}

  getRootGroup(): Observable<Group> {
    console.log('getRootGroup()');

    const rootGroupUrl = 'http://127.0.0.1:8080/basic/api/tree';

    return this.httpClient.get<Group>(rootGroupUrl);
  }
}
