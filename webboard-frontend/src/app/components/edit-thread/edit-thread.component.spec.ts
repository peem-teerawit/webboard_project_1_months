import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditThreadComponent } from './edit-thread.component';

describe('EditThreadComponent', () => {
  let component: EditThreadComponent;
  let fixture: ComponentFixture<EditThreadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditThreadComponent]
    });
    fixture = TestBed.createComponent(EditThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
