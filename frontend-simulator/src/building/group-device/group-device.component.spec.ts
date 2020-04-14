import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDeviceComponent } from './group-device.component';

describe('GroupDeviceComponent', () => {
  let component: GroupDeviceComponent;
  let fixture: ComponentFixture<GroupDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
