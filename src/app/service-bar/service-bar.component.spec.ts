import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBarComponent } from './service-bar.component';

describe('ServiceBarComponent', () => {
  let component: ServiceBarComponent;
  let fixture: ComponentFixture<ServiceBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
