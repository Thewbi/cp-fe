import {HttpClient, HttpClientModule, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {from, Observable, of} from 'rxjs';
import {filter, take, tap} from 'rxjs/operators';
import {DeviceReference, DeviceReferenceRequest} from 'src/groups/group.model';

@Injectable({providedIn: 'root'})
export class BuildingServiceService {
  constructor(private httpClient: HttpClient) {}

  public createDeviceReferences(deviceReferenceRequest:
                                    DeviceReferenceRequest) {
    const url = 'http://127.0.0.1:8080/basic/api/tree/reference';

    // the headers for the post request
    // headers are one part of the post request configuration
    // const headers = new HttpHeaders({Accept: 'text/plain'});
    const headers = new HttpHeaders({Accept: 'application/json'});

    // the configuration for the post request
    const httpOptions = {headers, responseType: 'json' as 'json'};

    // put
    const postResponseObservable: Observable<HttpResponse<string>> =
        this.httpClient.put<HttpResponse<string>>(
            url, deviceReferenceRequest, httpOptions);

    postResponseObservable.subscribe(response => {
      console.log(response);
    });
  }
}
