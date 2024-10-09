import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddFollowUpComponent } from './dialog-add-follow-up.component';

describe('DialogAddFollowUpComponent', () => {
  let component: DialogAddFollowUpComponent;
  let fixture: ComponentFixture<DialogAddFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddFollowUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
