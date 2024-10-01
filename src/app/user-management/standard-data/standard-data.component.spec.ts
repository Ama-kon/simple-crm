import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardDataComponent } from './standard-data.component';

describe('StandardDataComponent', () => {
  let component: StandardDataComponent;
  let fixture: ComponentFixture<StandardDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StandardDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
