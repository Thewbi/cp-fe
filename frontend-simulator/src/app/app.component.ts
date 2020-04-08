import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Component, OnInit } from '@angular/core';
import {select, Store} from '@ngrx/store';
import {filter, take, tap} from 'rxjs/operators';

import {WebsocketSubject} from '../websocket/websocket-subject';

import {AppState} from './store/app.state';

@Component({
  selector: 'cockpit-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-simulator';

  public ws$: WebsocketSubject<any>;

  /**
   * ctor
   *
   * @param httpClient the angular http client
   */
  constructor(private httpClient: HttpClient, private store: Store<AppState>) {}

  /**
   * ngOnInit()
   */
  ngOnInit() {
    // console.log('ngOnInit()');

    // the url to post to
    const loginUrl = 'http://127.0.0.1:8080/basic/api/webapp/login';

    // the object to post
    const usernamePasswordCredentials = {username: 'admin', password: 'admin2'};

    // the headers for the post request
    // headers are one part of the post request configuration
    const headers = new HttpHeaders({
      Accept: 'text/plain'  //,
      //'Content-Type':  'application/json' //,
      //'Authorization': 'my-auth-token'
    });

    // the configuration for the post request
    const httpOptions = {headers, responseType: 'text' as 'json'};

    // perform the post and process the result.
    // The subscribe call at the end does actually perform the post
    this.httpClient
        .post<HttpResponse<string>>(
            loginUrl, usernamePasswordCredentials,
            httpOptions)
        .pipe(
            tap(  // Log the result or error
                data => { 
                  //console.log(data);
                }, 
                error => {
                  console.log(error)
                }
                ),
            take(1), tap((response: HttpResponse<string>) => {
              //console.log(response);

              // if (!(response instanceof Response) && response.body !==
              // undefined) {
              //     this.token.setToken(response.body);
              //     const now = Math.floor(new Date().getTime() / 1000);
              //     const iat =
              //     JSON.parse(atob(response.body.split('.')[1]))['iat']; const
              //     diff = iat - now; // iat in the past -> diff is negativ [in
              //     sec] sessionStorage.setItem('time-offset',
              //     diff.toString());
              // }

              // store the jwt into the session
              sessionStorage.setItem('jwt', response.body);
            }))
        .subscribe(response => {
          //console.log(response);
        });

    // connect to the websocket
    this.ws$ = new WebsocketSubject('ws://127.0.0.1:8080/basic/push');

    // handle incoming websocket messages:
    this.ws$.pipe(filter(e => e !== undefined)).subscribe(res => {
      const payload = res;
      // console.log('WS ', payload);
    });

    // load root group
    this.store.dispatch({ type: '[GROUPS] Retrieve' });

    // load devices
    this.store.dispatch({ type: '[DEVICES] Retrieve' });

    // load templates
    this.store.dispatch({ type: '[TEMPLATES] Retrieve' });

    // output the complete store state for debugging
    this.store.select<AppState>((state: AppState) => state)
        .subscribe((completeState: AppState) => console.log(completeState));
  }
}
