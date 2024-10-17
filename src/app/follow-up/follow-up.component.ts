import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
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

  /**
   * Retrieves all follow-ups for all users from the Firestore database.
   *
   * This function performs the following steps:
   * 1. Fetches all documents from the 'standardData' collection.
   * 2. For each user document, it retrieves all documents from the 'Follow-ups' subcollection.
   * 3. Combines user data with follow-up data for each follow-up.
   * 4. Stores the combined data in the `allFollowUps` array.
   * 5. Calls the `categorizeFollowUps` function to organize the retrieved data.
   *
   * @returns {Promise<void>}
   */
  async getAllFollowUps() {
    this.showHideOverlay();
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
    this.showHideOverlay();
  }

  /**
   * Categorizes the follow-ups stored in the `allFollowUps` array based on their category.
   *
   * This function iterates through all follow-ups and distributes them into three category arrays:
   * - followUpCategory: Contains follow-ups with the category "Follow up"
   * - leadNurturingCategory: Contains follow-ups with the category "Lead Nurturing"
   * - afterSalesCategory: Contains follow-ups with the category "After Sales"
   *
   * Each follow-up is placed into its corresponding category array for further use in the component.
   */
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

  hasClosedTasks(
    category: 'followUp' | 'leadNurturing' | 'afterSales'
  ): boolean {
    let arrayToCheck: any[];
    switch (category) {
      case 'followUp':
        arrayToCheck = this.followUpCategory;
        break;
      case 'leadNurturing':
        arrayToCheck = this.leadNurturingCategory;
        break;
      case 'afterSales':
        arrayToCheck = this.afterSalesCategory;
        break;
      default:
        arrayToCheck = [];
    }
    return arrayToCheck.some((task) => task.status === 'closed');
  }

  showHideOverlay() {
    const overlay = document.getElementById('overlay');
    overlay?.classList.toggle('d-none');
  }
}
