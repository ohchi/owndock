import { Component, Output, Input, EventEmitter } from '@angular/core';
import ServiceListItem from './service-list-item';
import { deepStrictEqual } from 'assert';
import { isLoweredSymbol } from '@angular/compiler';
import Utils from '../utils';

@Component({
  selector: 'app-service-bar',
  templateUrl: './service-bar.component.html',
  styleUrls: ['./service-bar.component.scss']
})
export class ServiceBarComponent {

  servicesAvailable: Array<ServiceListItem>;
  servicesAvailableByCols: Array<Array<ServiceListItem>>;
  @Input() env;
  @Input() compose: any; 
  @Input('enabled') servicesEnabled: Array<string>;
  @Output('enabledChange') servicesEnabledChange = new EventEmitter();

  ngOnChanges() {

    if (this.compose && !this.servicesAvailable) {

      this.servicesAvailable = Object
                                .keys(this.compose.services)
                                .map(function(key) {
                                  return { name: key, refCount: 0, refLock: 0 };
                                })
                                .sort(function(a, b) {
                                  if(a.name < b.name) { return -1; }
                                  if(a.name > b.name) { return 1; }
                                  return 0;
                                });

      this.servicesAvailableByCols = Utils.splitIntoColumns(6, 4, this.servicesAvailable);

    }
  }

  enabledChange($event, item) {

    if (item.enable) {
      item.refCount++;
      item.refLock = 1;
    } else {
      item.refCount--;
      item.refLock = 0;
    }

    let deps = this.getDeps([item.name]);

    while (deps.length) {
      
      for (let name of deps) {
      
        let dep = this.getItemByName(name);

        if (item.enable) dep.refCount++;
        else dep.refCount--;

        dep.enable = dep.refCount > 0;
        dep.lock = dep.refCount > dep.refLock;
      }

      deps = this.getDeps(deps);
    }

    this.servicesEnabled = this.servicesAvailable.filter(e => e.enable).map(e => e.name);

    this.servicesEnabledChange.emit(this.servicesEnabled);
  }

  private getDeps(names: Array<string>): Array<string> {

    let deps = [];

    for (let name of names) {

      let dependsOn = this.compose.services[name].depends_on || [];

      dependsOn = dependsOn.map(d => {

        let envVarName = this.getEnvVarName(d);
        let serviceName = envVarName ? this.env[envVarName] : d;
  
        return serviceName;
      });

      deps = deps.concat(dependsOn);
    }

    deps = deps.filter((e, i, self) => self.indexOf(e) === i);  // unique

    return deps;
  }

  private getItemByName(name: string): ServiceListItem {

    return this.servicesAvailable.find(e => e.name == name);
  }

  private getEnvVarName(name: string): string {

    let arr = name.match(/\${(.*)}/);

    if (arr) return arr[1];
    
    return null;
  }
 }