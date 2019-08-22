import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvVarEditorComponent } from './env-var-editor.component';

describe('EnvVarEditorComponent', () => {
  let component: EnvVarEditorComponent;
  let fixture: ComponentFixture<EnvVarEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvVarEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvVarEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
