import { Component } from '@angular/core';
import { UsersChartComponent } from './users-chart/users-chart.component';
import { FollowUpsComponent } from './follow-ups-chart/follow-ups.component';
import { CustomersByAgeChartComponent } from './customers-by-age-chart/customers-by-age-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    UsersChartComponent,
    FollowUpsComponent,
    CustomersByAgeChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
