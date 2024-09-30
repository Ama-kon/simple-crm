import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersByAgeChartComponent } from './customers-by-age-chart.component';

describe('CustomersByAgeChartComponent', () => {
  let component: CustomersByAgeChartComponent;
  let fixture: ComponentFixture<CustomersByAgeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersByAgeChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomersByAgeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
