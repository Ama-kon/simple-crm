import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-customers-by-age-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './customers-by-age-chart.component.html',
  styleUrl: './customers-by-age-chart.component.scss',
})
export class CustomersByAgeChartComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);

  data: any;
  options: any;

  users18To34: number = 0;
  users35To49: number = 0;
  users50To69: number = 0;
  users70Plus: number = 0;

  async ngOnInit() {
    await this.checkAges();
    this.showChart();
  }

  async checkAges() {
    const userCollection = collection(this.firestore, 'standardData');
    const querySnapshot = await getDocs(userCollection);
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const birthDate = userData['birthDate'];
      const age = this.calculateAge(birthDate);
      this.categorizeAge(age);
    });
  }

  calculateAge(birthDate: any): number {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  }

  categorizeAge(age: number) {
    if (age >= 18 && age <= 34) this.users18To34++;
    else if (age >= 35 && age <= 49) this.users35To49++;
    else if (age >= 50 && age <= 69) this.users50To69++;
    else if (age >= 70) this.users70Plus++;
  }

  showChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['18-34', '35-49', '50-69', '70+'],
      datasets: [
        {
          data: [
            this.users18To34,
            this.users35To49,
            this.users50To69,
            this.users70Plus,
          ],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--pink-500'),
            documentStyle.getPropertyValue('--grey-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--pink-400'),
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
