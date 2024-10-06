import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditFollowUpComponent } from './dialog-edit-follow-up.component';

describe('DialogEditFollowUpComponent', () => {
  let component: DialogEditFollowUpComponent;
  let fixture: ComponentFixture<DialogEditFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditFollowUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEditFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
