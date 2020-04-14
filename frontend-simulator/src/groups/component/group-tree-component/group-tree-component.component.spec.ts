import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTreeComponentComponent } from './group-tree-component.component';

describe('GroupTreeComponentComponent', () => {
  let component: GroupTreeComponentComponent;
  let fixture: ComponentFixture<GroupTreeComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTreeComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTreeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
