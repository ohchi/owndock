import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import EnvVarModel from '../env-var-editor/env-var-model';
import Utils from '../utils';

@Component({
  selector: 'app-service-editor',
  templateUrl: './service-editor.component.html',
  styleUrls: ['./service-editor.component.scss']
})
export class ServiceEditorComponent implements OnChanges {

  @Input() service;
  @Input() env;
  @Output() envChange = new EventEmitter();
  private serviceEnvVars: Array<EnvVarModel> = [];
  private serviceEnvVarsByCols: Array<Array<EnvVarModel>> = [];
  private formHash: string;

  pristine: boolean = true;

  constructor() { }

  ngOnChanges() {

    if (!this.service || !this.env) return;

    this.serviceEnvVars = Utils
                            .collectEnvVarNames(this.service)
                            .map(key => {
                              let value = this.env[key];
                              return new EnvVarModel(key, value, this.getType(value));
                            });

    this.serviceEnvVarsByCols = Utils.splitIntoColumns(3, 4, this.serviceEnvVars);

    this.formHash = this.getFormHash();

  }

  ngDoCheck() {
    this.pristine = this.formHash == this.getFormHash();
  }

  apply() {

    for (let arg of this.serviceEnvVars) {
      this.env[arg.name] = arg.value;
    }

    this.formHash = this.getFormHash();
    this.envChange.emit(this.env);
  }

  private getType(value: any): string {
    return typeof value == 'boolean' ? 'checkbox' : 'text';
  }

  private getFormHash(): string {
    return Utils.getObjectHash(this.serviceEnvVars);
  }
}
