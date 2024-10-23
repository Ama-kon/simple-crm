import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { ChartModule } from 'primeng/chart';
import { from, Subscription } from 'rxjs';

@Component({
  selector: 'app-follow-ups',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './follow-ups.component.html',
  styleUrl: './follow-ups.component.scss',
})
export class FollowUpsComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  data: any;
  options: any;
  allFollowUps: any[] = [];
  doneFollowUps: any[] = [];
  undoneFollowUps: any[] = [];
  followUpSubscription: Subscription;

  async ngOnInit() {
    await this.getAllFollowUps();
    this.showChart();
  }

  async getAllFollowUps() {
    const standardDataRef = collection(this.firestore, 'standardData');
    const querySnapshot = await getDocs(standardDataRef);

    for (const doc of querySnapshot.docs) {
      const followUpsRef = collection(
        this.firestore,
        `standardData/${doc.id}/Follow-ups`
      );
      const followUpsSnapshot = await getDocs(followUpsRef);

      followUpsSnapshot.forEach((followUp) => {
        this.allFollowUps.push(followUp.data());
      });
    }
    this.filterDoneFollowUps();
  }

  filterDoneFollowUps() {
    this.doneFollowUps = this.allFollowUps.filter(
      (followUp) => followUp.status == 'closed'
    );
    this.undoneFollowUps = this.allFollowUps.filter(
      (followUp) => followUp.status != 'closed'
    );
    console.log('gemachte:', this.doneFollowUps);
    console.log('ungemachte:', this.undoneFollowUps);
  }

  showChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['Follow ups', 'Done'],
      datasets: [
        {
          data: [this.undoneFollowUps.length, this.doneFollowUps.length],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
          ],
        },
      ],
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }
}
