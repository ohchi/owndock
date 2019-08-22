import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import EnvVarModel from '../env-var-editor/env-var-model';
import Utils from '../utils';

@Component({
  selector: 'app-env-editor',
  templateUrl: './env-editor.component.html',
  styleUrls: ['./env-editor.component.scss']
})
export class EnvEditorComponent implements OnChanges {

  @Input() names: Array<string>;
  @Input() env;
  @Output() envChange = new EventEmitter();
  private envVars: Array<EnvVarModel> = [];
  private envVarsByCols: Array<Array<EnvVarModel>> = [];
  private envOld = null;
  private namesOld = null;
  private ddd: EnvVarModel = { name: 'aaa', value: 'bbb', type: 'ccc' };
  private bbb = [this.ddd];

  constructor() { }

  ngOnChanges() {

    if (!this.env || !this.names) return;

    this.envVars = this
                    .names
                    .map(key => {
                      let value = this.env[key];
                      return new EnvVarModel(key, value, this.getType(value));
                    })
                    .sort(function(a, b) {
                      if(a.name < b.name) { return -1; }
                      if(a.name > b.name) { return 1; }
                      return 0;
                    });

    this.envVarsByCols = Utils.splitIntoColumns(3, 4, this.envVars);
  }

  private getType(value: any): string {
    return typeof value == 'boolean' ? 'checkbox' : 'text';
  }

}
