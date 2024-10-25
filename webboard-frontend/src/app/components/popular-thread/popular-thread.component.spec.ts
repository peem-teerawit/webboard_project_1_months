import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularThreadComponent } from './popular-thread.component';

describe('PopularThreadComponent', () => {
  let component: PopularThreadComponent;
  let fixture: ComponentFixture<PopularThreadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopularThreadComponent]
    });
    fixture = TestBed.createComponent(PopularThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
