import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvEditorComponent } from './env-editor.component';

describe('EnvEditorComponent', () => {
  let component: EnvEditorComponent;
  let fixture: ComponentFixture<EnvEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
