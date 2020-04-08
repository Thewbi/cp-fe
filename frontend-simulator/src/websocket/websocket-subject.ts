import { attempt, isError } from 'lodash';
import { interval, Observable, Observer, Subject, Subscription, timer } from 'rxjs';
import { concatMap, distinctUntilChanged, share, takeWhile } from 'rxjs/operators';
import { webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';

/**
 * This subject class, wraps a RxJs websocket subject.
 * It inherits from the ordinary rxjs Subject and wraps a websocket subject.
 * 
 * It extends the WebSocket functionality by an automatic reconnect mechanism.
 * 
 * It makes sure the application is either connected to the websocket at all times
 * or reloads until it is connected to the websocket again.
 * 
 * USAGE:
 * 
 * Dependencies:
 * 
 * install lodash
 * npm i -g npm
 * npm i --save lodash
 * npm i lodash
 * npm install --save-dev @types/lodash
 * 
 * // import
 * import { WebsocketSubject } from '../websocket/websocket-subject';
 * 
 * // define a variable
 * public ws$: WebsocketSubject<any>;
 * 
 * // connect to the websocket url which creates the websocket object
 * this.ws$ = new WebsocketSubject(this.getWSURL());
 * 
 * // handle incoming websocket messages:
 * this.ws$.pipe(filter(e => e !== undefined)).subscribe(
 *          res => {
 *              const payload = res;
 *              console.log('WS ', payload);
 *          }
 *
 * // disconnect
 *  if (this.ws$ !== undefined) {
 *           this.ws$.disconnect();
 *           this.ws$ = undefined;
 *        }
 */
export class WebsocketSubject<T> extends Subject<T> {

    /** Used to govern the reconnection behaviour */
    private reconnectionObservable?: Observable<number>;

    /** The configuration needed to create an RxJs WebSocket Subject. */
    private wsSubjectConfig: WebSocketSubjectConfig<T>;

    /** The RxJs WebSocket subject wrapped inside this subject */
    private socket?: WebSocketSubject<any>;

    /** Outputs true if a connection was established and false if a connecton was lost. */
    private connectionObserver: Observer<boolean>;

    /** Can be subscribed to, to get informed about connection loss or gain.
     * It is used to call reconnect() whenever a connection is lost.
     */
    public connectionStatusObservable: Observable<boolean>;

    private subs: Subscription[] = [];

    /** reconnection counter */
    private counter: number = 0;

    /** reconnection threshold */
    private _wsMaxAttempts: number;

    set wsMaxAttempts(wsMaxAttempts: number) {
        this._wsMaxAttempts = wsMaxAttempts;
    }

    get wsMaxAttempts() {
        return this._wsMaxAttempts;
    }

    constructor(url: string) {

        // call parent constructor
        super();

        // Turn an observer into a observable.
        // Maybe behaviour subject could be used instead?
        // I think a BehaviourSubject combines observer and observable.
        //
        // the connectionStatus observable itself observers the connectionObserver.
        //
        // The connectionObserver is used in the WebserviceSubject config's closeObserver
        // and openObserver.
        //
        // When the connection is closed, the closeObserver detects this and puts the value
        // 'false' into the connectionObserver. Any object subscribed to the connectionObserver
        // will get notified about the connection loss.
        //
        // When the connection is established, the openObserver detects this and puts the value
        // 'true' into the connectionObserver. Any object subscribed to the connectionObserver
        // will get notified about the new connection.
        //
        // I DO NOT UNDERSTAND THIS SYNTAX!
        this.connectionStatusObservable = (new Observable(observer => {
            this.connectionObserver = observer;
        }) as Observable<boolean>).pipe(

            // ???
            share(),

            // ???
            distinctUntilChanged()
        );

        // config for WebSocketSubject
        // aside from the url, the config contains closeObserver and openObserver to update connection status
        // and a deserializer
        this.wsSubjectConfig = {

            // the websocket URL
            url,

            // gets informed about lost connections
            closeObserver: {
                next: (e: CloseEvent) => {

                    // when the connection was forecully closed, set the socket to undefined
                    if (this.socket !== undefined) {
                        this.socket = undefined;
                    }

                    // increase a disconnection counter
                    this.counter++;

                    // when the disconnection counter exceeds a threshold, reload the entire application
                    if (this.counter > this.wsMaxAttempts) {

                        console.warn('WS - Force reload');
                        window.location.reload();
                    }

                    // notify all subscribes that a connection was lost => 'false'
                    this.connectionObserver.next(false);
                }
            },

            // gets informed about new connections
            openObserver: {
                next: (e: Event) => {

                    // reset the discconnection counter so that the app does not reload
                    this.counter = 0;

                    // notify all subscribes that a connection has been established => 'true'
                    this.connectionObserver.next(true);
                }
            },

            // ???
            deserializer: this.deserializer
        };

        // we connect
        this.connect();

        // we follow the connection status and run the reconnect should the connection be lost
        this.subs.push(

            // subscribe to the connections status
            this.connectionStatusObservable.subscribe(isConnected => {

                // if the connection is lost and the reconnectionObservable returns false
                // then call reconnect()
                if (!this.reconnectionObservable && typeof isConnected === 'boolean' && !isConnected) {

                    // reconnect
                    this.reconnect();
                }
            })
        );
    }

    deserializer = (e: MessageEvent): T => {
        const data: T | Error = attempt(JSON.parse.bind(null, e.data));
        return isError(data) ? undefined : data;
    };

    connect(): void {

        // create the socket using the configuration
        this.socket = webSocket(this.wsSubjectConfig);

        // subscribe to the wrapped RxJs SocketSubject.
        // Whenever the subject produces a new value, return that value as your own value.
        this.subs.push(

            // subscribe to the wrapped rxjs websocket subject
            this.socket.subscribe(

                // return the websocket value as your own value
                m => this.next(m),

                // error handling
                (error: Event) => {
                    if (!this.socket || event.type === 'error') {

                        // first clean up the broken socket rxjs subject
                        this.socket = undefined;

                        // in case of an error with a loss of connection, we restore it
                        this.reconnect();
                    }
                }
            )
        );
    }

    /**
     * Performs a disconnect. 
     */
    disconnect(): void {

        // if there currently is a connection on the wrapped subject, disconnect it by calling complete.
        if (this.socket !== undefined) {
            this.socket.complete();
        }

        // complete yourself
        this.complete();

        // tell all subscribers to unsubscribe
        this.subs.forEach(s => s.unsubscribe());
    }

    /**
     * reconnection
     */ 
    reconnect(): void {

        // delay retries; increase delay after each retry by one second
        this.reconnectionObservable = interval(1000).pipe(
            concatMap(i => timer(i * 1000)),
            takeWhile(() => !this.socket)
        );
        
        this.subs.push(
            this.reconnectionObservable.subscribe(() => {
                this.connect();
            })
        );
    }

    /**
     * sending a message
     * @param data the data to send.
     */ 
    send(data: any): void {

        // if there is a connected wrapped rxjs websocket subject, 
        // send the message through it
        if (this.socket !== undefined) {
            this.socket.next(data);
        }
    }
}
