import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {cloneDeep, isEmpty, isNil} from 'lodash';
import {filter, take, tap} from 'rxjs/operators';
import {Device} from 'src/devices/device.model';
import {changedAction} from 'src/devices/store/device.actions';
import {changedEventAction} from 'src/devices/store/device.actions';
import {getDeviceByIdSelector} from 'src/devices/store/device.selector';
import {Group} from 'src/groups/group.model';
import {selectAction} from 'src/groups/store/group.actions';
import {retrieveAction} from 'src/groups/store/group.actions';
import {getCurrentGroupSelector, getGroupStateSelector} from 'src/groups/store/group.selector';
import {GroupState} from 'src/groups/store/group.state';
import {Notification} from 'src/notifications/notification.model';
import {PushEventDto} from 'src/notifications/notification.model';

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
    console.log('AppComponent - ngOnInit()');

    // the url to post to
    const loginUrl = 'http://127.0.0.1:8080/basic/api/webapp/login';

    // the object to post
    const usernamePasswordCredentials = {username: 'admin', password: 'admin2'};

    // the headers for the post request
    // headers are one part of the post request configuration
    const headers = new HttpHeaders({Accept: 'text/plain'});

    // the configuration for the post request
    const httpOptions = {headers, responseType: 'text' as 'json'};

    // Login
    //
    // perform the post and process the result.
    // The subscribe call at the end does actually perform the post
    this.httpClient
        .post<HttpResponse<string>>(
            loginUrl, usernamePasswordCredentials,
            httpOptions)
        .pipe(
            tap(  // Log the result or error
                data => {
                    // console.log(data);
                },
                error => {
                  console.log(error);
                }),
            take(1), tap((response: HttpResponse<string>) => {
              // console.log(response);

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
        .subscribe(
            response => {
                // console.log(response);
            });

    // connect to the websocket
    this.ws$ = new WebsocketSubject('ws://127.0.0.1:8080/basic/push');

    // handle incoming websocket messages:
    this.ws$.pipe(filter(event => event !== undefined)).subscribe(event => {
      // cast to type
      const pushEventDto = event as PushEventDto;

      // DEBUG: log
      // console.log('WS ', event);
      // console.log(pushEventDto);


      // // subscribe to all changes of the device!
      // this.store.select(getDeviceByIdSelector, {guid:
      // pushEventDto.event.guid})
      //     .subscribe((device) => {
      //       this.eventForDevice(device, pushEventDto);
      //     });


      // const deviceObservable = this.store.select(
      //     getDeviceByIdSelector, {guid: pushEventDto.event.guid});
      // const deviceObservableSubscription =
      //     deviceObservable.subscribe((device) => {
      //       this.eventForDevice(device, pushEventDto);
      //     });
      // deviceObservableSubscription.unsubscribe();


      this.store.dispatch(changedEventAction({pushEventDto}));
    });

    // subscribe to the selection of groups
    this.store.select(getGroupStateSelector)
        .subscribe(this.groupsSelected.bind(this));

    // load root group (building structure)
    this.store.dispatch({type: '[GROUPS] Retrieve'});

    // load devices
    this.store.dispatch({type: '[DEVICES] Retrieve'});

    // load templates
    this.store.dispatch({type: '[TEMPLATES] Retrieve'});

    // // test: select a group
    // const group = new Group();
    // group.id = 123;
    // group.description = 'dddddescription';
    // this.store.dispatch({ type: '[GROUPS] Select', selectedGroup: group });

    // // output the complete store state for debugging
    // this.store.select<AppState>((state: AppState) => state)
    //     .subscribe((appState: AppState) => console.log('appState: ',
    //     appState));
  }

  eventForDevice(device: Device, pushEventDto: PushEventDto) {
    // if the device has no template, return
    if (isNil(device.template)) {
      return;
    }

    // copy because otherwise I cannot change attributes of the device!
    device = cloneDeep(device);

    const logicalDeviceId = pushEventDto.event.logicalDeviceId;
    const templatePropertyName = pushEventDto.event.templatePropertyName;
    const newValue = pushEventDto.event.value;
    const template = device.template;

    template.logicalDevices.filter(ld => ld.id === logicalDeviceId)
        .map(ld => ld.properties)
        // combine the property arrays of each
        // property to one large property array
        .reduce((prev, curr) => prev.concat(curr))
        .filter(p => p.id === templatePropertyName)
        .map(p => p.states)
        // combine the property arrays of each
        // property to one large property array
        .reduce((prev, curr) => prev.concat(curr))
        .map(state => {
          // turn all states off
          state.active = false;
          return state;
        })
        .filter(state => state.value === newValue)
        .forEach(state => {
          // set this one state on
          state.active = true;
          this.store.dispatch(changedAction({device}));
        });
  }

  /**
   * Called when the group state changes.
   * TEST: Selects one of the groups.
   *
   * @param groupState the groupState slice
   */
  groupsSelected(groupState: GroupState) {
    console.log('groupState: ', groupState);

    // if no group is selected yet and there is group state, select one of the
    // groups
    if (isNil(groupState.currentGroup) && groupState.rootGroup) {
      this.selectRandomGroup(groupState.rootGroup);
    }
  }

  /**
   * Dispatches an action that selects one of the groups.
   *
   * @param rootGroup the root of the group hierarchy
   */
  selectRandomGroup(rootGroup: Group) {
    console.log('selectRandomGroup.rootGroup: ', rootGroup);

    const firstChild = rootGroup.children[0];
    if (isNil(firstChild)) {
      return;
    }

    // dispatch action to the store that selects the group specified in the
    // payload
    this.store.dispatch(selectAction({selectedGroup: firstChild}));
  }
}
