import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagThreadComponent } from './tag-thread.component';

describe('TagThreadComponent', () => {
  let component: TagThreadComponent;
  let fixture: ComponentFixture<TagThreadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TagThreadComponent]
    });
    fixture = TestBed.createComponent(TagThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
