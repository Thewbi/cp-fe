import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {Template} from '../template.model';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  constructor(private httpClient: HttpClient) {}

  getTemplates(): Observable<Template[]> {
    console.log('getTemplates()');

    const allTemplatesUrl = 'http://127.0.0.1:8080/basic/api/template';

    return this.httpClient.get<Template[]>(allTemplatesUrl);
  }
}
