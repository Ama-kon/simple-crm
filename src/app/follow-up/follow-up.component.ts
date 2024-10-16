import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';
import { CommonModule, NgFor } from '@angular/common';
import { FormatDateService } from '../services/formatDate.service';

@Component({
  selector: 'app-follow-up',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, MatButtonModule, CommonModule, NgFor],
  providers: [FormatDateService],
  templateUrl: './follow-up.component.html',
  styleUrl: './follow-up.component.scss',
})
export class FollowUpComponent {
  private firestore: Firestore = inject(Firestore);
  private formatDateService = inject(FormatDateService);

  allFollowUps: any[] = [];
  followUpCategory: any[] = [];
  leadNurturingCategory: any[] = [];
  afterSalesCategory: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.getAllFollowUps();
  }

  async getAllFollowUps() {
    const standardDataRef = collection(this.firestore, 'standardData');
    const standardDataSnapshot = await getDocs(standardDataRef);

    for (const userDoc of standardDataSnapshot.docs) {
      const followUpsCollectionRef = collection(userDoc.ref, 'Follow-ups');
      const followUpsSnapshot = await getDocs(followUpsCollectionRef);

      if (!followUpsSnapshot.empty) {
        const userData = userDoc.data();

        followUpsSnapshot.forEach((followUpDoc) => {
          this.allFollowUps.push({
            userId: userDoc.id,
            followUpId: followUpDoc.id,
            userData: {
              firstName: userData['firstName'],
              lastName: userData['lastName'],
              email: userData['email'],
              city: userData['city'],
              street: userData['street'],
              houseNumber: userData['houseNumber'],
              zipCode: userData['zipCode'],
              birthDate: userData['birthDate'],
            },
            ...followUpDoc.data(),
          });
        });
      }
    }
    this.categorizeFollowUps();
  }

  categorizeFollowUps() {
    this.allFollowUps.forEach((followUp) => {
      if (followUp.category == 'Follow up') {
        this.followUpCategory.push(followUp);
      } else if (followUp.category == 'Lead Nurturing') {
        this.leadNurturingCategory.push(followUp);
      } else if (followUp.category == 'After Sales') {
        this.afterSalesCategory.push(followUp);
      }
    });
  }

  formatDate(date: string) {
    return this.formatDateService.formatDate(date);
  }
}
