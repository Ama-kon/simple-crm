import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditNameComponent } from './dialog-edit-name.component';

describe('DialogEditNameComponent', () => {
  let component: DialogEditNameComponent;
  let fixture: ComponentFixture<DialogEditNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEditNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
