import { Component, Input, Output, EventEmitter } from '@angular/core';
import EnvVarModel from './env-var-model';

@Component({
  selector: 'app-env-var-editor',
  templateUrl: './env-var-editor.component.html',
  styleUrls: ['./env-var-editor.component.scss']
})
export class EnvVarEditorComponent {

  @Input() envVar: EnvVarModel;
  @Output() envVarChange = new EventEmitter();

  private envVarChangeHandler(value) {

    this.envVar.value = value;
    this.envVarChange.emit(this.envVar);
  }
}
