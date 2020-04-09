import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDeviceTableComponentComponent } from './group-device-table-component.component';

describe('GroupDeviceTableComponentComponent', () => {
  let component: GroupDeviceTableComponentComponent;
  let fixture: ComponentFixture<GroupDeviceTableComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDeviceTableComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDeviceTableComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
