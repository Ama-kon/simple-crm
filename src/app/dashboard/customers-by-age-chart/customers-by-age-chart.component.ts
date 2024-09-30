import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-customers-by-age-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './customers-by-age-chart.component.html',
  styleUrl: './customers-by-age-chart.component.scss',
})
export class CustomersByAgeChartComponent implements OnInit {
  data: any;

  options: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['18-34', '35-49', '50-69', '70+'],
      datasets: [
        {
          data: [42, 68, 18, 0],
          backgroundColor: [
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--blue-500'),
            // documentStyle.getPropertyValue('--red-500'),
            // documentStyle.getPropertyValue('--orange-500'),
            documentStyle.getPropertyValue('--grey-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--blue-400'),
            // documentStyle.getPropertyValue('--red-400'),
            // documentStyle.getPropertyValue('--orange-400'),
            documentStyle.getPropertyValue('--grey-400'),
          ],
        },
      ],
    };

    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };
  }
}
