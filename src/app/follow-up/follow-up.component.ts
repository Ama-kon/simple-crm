import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  collection,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { CommonModule, NgFor } from '@angular/common';
import { FormatDateService } from '../services/formatDate.service';
import { from, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditFollowUpComponent } from '../dialog-edit-follow-up/dialog-edit-follow-up.component';
import { User } from '../../models/user.class';

@Component({
  selector: 'app-follow-up',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    NgFor,
    DialogEditFollowUpComponent,
  ],
  providers: [FormatDateService],
  templateUrl: './follow-up.component.html',
  styleUrl: './follow-up.component.scss',
})
export class FollowUpComponent implements OnInit, OnDestroy {
  private firestore: Firestore = inject(Firestore);
  private formatDateService = inject(FormatDateService);
  private followUpSubscription: Subscription;
  private userSubscription: Subscription;

  allFollowUps: any[] = [];
  followUpCategory: any[] = [];
  leadNurturingCategory: any[] = [];
  afterSalesCategory: any[] = [];
  currentUser: User[] = [];
  currentUserFollowUps: any[] = [];
  indexOfFollowUp: number;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllFollowUps();
  }

  /**
   * Retrieves and processes all follow-ups for all users from the Firestore database.
   *
   * This function:
   * 1. Shows an overlay to indicate loading.
   * 2. Creates a reference to the 'standardData' collection in Firestore.
   * 3. Subscribes to the collection data and processes it asynchronously.
   * 4. Stores the processed follow-ups in the component's allFollowUps array.
   * 5. Categorizes the follow-ups.
   * 6. Hides the loading overlay when done.
   */
  async getAllFollowUps() {
    this.showHideOverlay();
    const standardDataRef = collection(this.firestore, 'standardData');

    this.followUpSubscription = from(getDocs(standardDataRef)).subscribe(
      async (standardDataSnapshot) => {
        this.allFollowUps = await this.processUserDocuments(
          standardDataSnapshot
        );
        this.categorizeFollowUps();
        this.showHideOverlay();
      }
    );
  }

  /**
   * Processes user documents to extract and compile follow-up data.
   *
   * @param standardDataSnapshot - A snapshot of the standard data collection.
   * @returns A promise that resolves to an array of all processed follow-ups.
   *
   * This function:
   * 1. Iterates through each user document in the snapshot.
   * 2. Retrieves the 'Follow-ups' subcollection for each user.
   * 3. If follow-ups exist, processes them using the processFollowUps method.
   * 4. Concatenates all processed follow-ups into a single array.
   */
  async processUserDocuments(standardDataSnapshot: any): Promise<any[]> {
    let allFollowUps: any[] = [];
    for (const userDoc of standardDataSnapshot.docs) {
      const followUpsCollectionRef = collection(userDoc.ref, 'Follow-ups');
      const followUpsSnapshot = await getDocs(followUpsCollectionRef);

      if (!followUpsSnapshot.empty) {
        const userData = userDoc.data();
        const processedFollowUps = this.processFollowUps(
          userDoc.id,
          userData,
          followUpsSnapshot
        );
        allFollowUps = allFollowUps.concat(processedFollowUps);
      }
    }
    return allFollowUps;
  }

  /**
   * Processes follow-ups for a single user.
   *
   * @param userId - The ID of the user.
   * @param userData - The data of the user.
   * @param followUpsSnapshot - A snapshot of the user's follow-ups.
   * @returns An array of processed follow-ups for the user.
   *
   * This function:
   * 1. Maps over each follow-up document in the snapshot.
   * 2. Creates a new object for each follow-up, combining:
   *    - User ID
   *    - Follow-up ID
   *    - Relevant user data
   *    - All data from the follow-up document
   */
  processFollowUps(
    userId: string,
    userData: any,
    followUpsSnapshot: any
  ): any[] {
    return followUpsSnapshot.docs.map(
      (followUpDoc: QueryDocumentSnapshot<DocumentData>) => ({
        userId: userId,
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
      })
    );
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

  async editDialog(task: any) {
    this.showHideOverlay();
    await this.getCurrentUser(task.userId);
    await this.getIndexOfFollowUp(task.userId, task.followUpId);
    this.openDialog(task);
    this.showHideOverlay();
  }

  async getIndexOfFollowUp(userId: string, followUpId: string) {
    const userCollection = collection(this.firestore, 'standardData');
    const userDocRef = doc(userCollection, userId);
    const followUpsCollectionRef = collection(userDocRef, 'Follow-ups');

    const followUpsSnapshot = await getDocs(followUpsCollectionRef);
    const followUps = followUpsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    this.currentUserFollowUps = followUps;
    const index = followUps.findIndex((followUp) => followUp.id === followUpId);
    this.indexOfFollowUp = index;
  }

  openDialog(task: any) {
    const userCopy = { ...this.currentUser };
    const dialogRef = this.dialog.open(DialogEditFollowUpComponent, {
      data: {
        user: userCopy,
        userId: task.userId,
        followUps: this.currentUserFollowUps,
        followUpId: task.followUpId,
        index: this.indexOfFollowUp,
      },
    });
    this.emptyAllArrays();
    const dialogComponent = dialogRef.componentInstance;
    dialogComponent.userUpdated.subscribe(() => {
      this.getAllFollowUps();
    });
  }

  getCurrentUser(id: string) {
    const userCollection = collection(this.firestore, 'standardData');
    const currentUserRef = doc(userCollection, id);
    this.userSubscription = from(getDoc(currentUserRef)).subscribe(
      (document) => {
        if (document.exists()) {
          this.currentUser = [document.data() as User];
        }
      }
    );
  }

  emptyAllArrays() {
    this.followUpCategory = [];
    this.leadNurturingCategory = [];
    this.afterSalesCategory = [];
    this.allFollowUps = [];
  }

  ngOnDestroy() {
    if (this.followUpSubscription) {
      this.followUpSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
