import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry, map, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable, of, throwError, Subject } from 'rxjs';
import { memoize } from './memoizee';
import Utils from './utils';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'owndock';
  compose: any;
  env: any;
  servicesEnabled: Array<string> = [];
  selectedServiceKey: string = null;
  envVarNames: Array<string> = [];
  search: string;
  searchChanged: Subject<string> = new Subject<string>();

  private dataHash: string;
  isAppPristine: boolean = this.getDataHash() == this.dataHash;
  currentSectionId = 'servicesEditing';

  constructor(private http: HttpClient) {

    this
      .searchChanged
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe(value => {

          this.search = value;
      });
  }

  ngOnInit() {

    this.http
        .get<any>(`${environment.apiUrl}/api/laradock`)
        .pipe(
          tap(_ => console.log(`fetched compose info`)),
          catchError(this.handleError)
        )
        .subscribe((data) => {
          this.compose = data.compose;
          this.env = this.correctEnvTypes(data.env);
          this.dataHash = this.getDataHash();
        });
  }

  ngDoCheck() {
    this.isAppPristine = this.dataHash == this.getDataHash();
  }

  private handleError(error)  {

    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    window.alert(errorMessage);

    return throwError(errorMessage);
  }

  enabledChangeHandler(arr: Array<string>) {

    this.servicesEnabled = arr;

    if (arr.indexOf(this.selectedServiceKey) < 0) this.selectedServiceKey = null;
  }

  private getDataHash(): string {

    let data = {
      env: this.env,
      servicesEnabled: this.servicesEnabled
    };

    let hash = Utils.getObjectHash(data);

    return hash;
  }

  private correctEnvTypes(env): object {

    for (let key in env) {
      let value = env[key];
      if (typeof value == 'number') env[key] = value.toString();
    }

    return env;
  }

  submitHandler() {

    let ownCompose = this.getOwnCompose(this.servicesEnabled);
    let ownEnv = this.getOwnEnv(ownCompose);

    this.http
        .post(`${environment.apiUrl}/api/download`, {
          env: ownEnv,
          compose: ownCompose,
          arch_type: 'zip'
        }, {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'
          }),
          responseType: 'blob'
        })
        .pipe(
          tap(_ => console.log('data posted')),
          catchError(this.handleError)
        )
        .subscribe((blob) => {
          
          // window.open(window.URL.createObjectURL(blob));
          saveAs(blob, 'owndock.zip');
        });
  }

  private getOwnEnv(compose: object): object {

    let ownEnv = {};
    let names = Utils.collectEnvVarNames(compose);

    for (let name of names) {
      ownEnv[name] = this.env[name];
    }

    return ownEnv;
  }

  private getOwnCompose(services: Array<string>): object {

    // deep clone compose
    let ownCompose = JSON.parse(JSON.stringify(this.compose));

    // Remove top-level volumes definition, because it seems to be unused for now
    delete ownCompose.volumes;

    // Attach enabled services only
    ownCompose.services = {};
    for (let name of services) {
      // deep clone service
      let s = JSON.parse(JSON.stringify(this.compose.services[name]));
      // attach service copy
      ownCompose.services[name] = s;
    }

    return ownCompose;
  }

  getSectionTitle(id: string): string {

    if (id == 'servicesEditing') return 'services';
    if (id == 'serviceEnvEditing') return this.selectedServiceKey + ' environment';
    if (id == 'allEnvEditing') return 'dotenv';

    return '';
  }

  private serviceClickHandler(key) {

    this.selectedServiceKey = key;
    this.currentSectionId = 'serviceEnvEditing';
    this.envVarNames = Utils.collectEnvVarNames(this.compose.services[this.selectedServiceKey]);
  }

  servicesEditingButtonHandler() {

    this.selectedServiceKey = null;
    this.currentSectionId = 'servicesEditing';
  }

  allEnvEditingButtonHandler() {

    this.selectedServiceKey = null;
    this.currentSectionId = 'allEnvEditing';
    this.envVarNames = Object.keys(this.env);
  }

  @memoize()
  getEnvVarNames(selectedServiceKey, env, search): Array<string> {

    let names = null;

    if (selectedServiceKey) {

      names = Utils.collectEnvVarNames(this.compose.services[selectedServiceKey]);

    } else if (env) {

      names = Object.keys(env);
    }
    
    if (search) {

      names = names.filter(e => e.toLowerCase().indexOf(search.toLowerCase()) >= 0);
    }


    return names;

  }

  private onSearchChange(search:string) {

    this.searchChanged.next(search);
  }
}
