import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddPropertyComponent } from './dialog-add-property.component';

describe('DialogAddPropertyComponent', () => {
  let component: DialogAddPropertyComponent;
  let fixture: ComponentFixture<DialogAddPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddPropertyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
