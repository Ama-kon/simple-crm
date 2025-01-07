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
import { AuthenticationService } from '../services/authentication.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FollowUp } from '../../interfaces/followUp.interface';

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
    MatCheckboxModule,
    MatTooltipModule,
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
  private authSubscription: Subscription;
  private isGuest: boolean = false;

  allFollowUps: any[] = [];
  followUpCategory: any[] = [];
  leadNurturingCategory: any[] = [];
  afterSalesCategory: any[] = [];
  currentUser: User[] = [];
  currentUserFollowUps: any[] = [];
  indexOfFollowUp: number;

  constructor(
    public dialog: MatDialog,
    private authService: AuthenticationService
  ) {
    this.authSubscription = this.authService.isGuest$.subscribe((isGuest) => {
      this.isGuest = isGuest;
      if (this.allFollowUps.length > 0) {
        this.emptyAllArrays();
        this.getAllFollowUps();
      }
    });
  }

  ngOnInit(): void {
    this.getAllFollowUps();
  }

  async getAllFollowUps() {
    this.showHideOverlay();
    const collectionPath = this.isGuest
      ? 'guest/guestDoc/standardData'
      : 'standardData';

    const standardDataRef = collection(this.firestore, collectionPath);

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
    this.sortByDeadline();
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
    console.log(task);
    this.showHideOverlay();
    await this.getCurrentUser(task.userId);

    await this.getIndexOfFollowUp(task.userId, task.followUpId);
    this.openDialog(task);
    this.showHideOverlay();
  }

  async getIndexOfFollowUp(userId: string, followUpId: string) {
    const collectionPath = this.isGuest
      ? 'guest/guestDoc/standardData'
      : 'standardData';

    const userCollection = collection(this.firestore, collectionPath);
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
    console.log('Task:', task);
    console.log('Current User Follow-ups:', this.currentUserFollowUps);
    console.log('Index:', this.indexOfFollowUp);

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
    const dialogComponent = dialogRef.componentInstance;
    dialogComponent.userUpdated.subscribe(() => {
      this.emptyAllArrays();
      this.getAllFollowUps();
    });
  }

  async getCurrentUser(id: string) {
    const collectionPath = this.isGuest
      ? 'guest/guestDoc/standardData'
      : 'standardData';

    const userCollection = collection(this.firestore, collectionPath);
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

  /**
   * Sorts tasks in multiple categories by their deadline in ascending order.
   *
   * This function iterates over three categories: `followUpCategory`, `leadNurturingCategory`,
   * and `afterSalesCategory`. Each category is expected to be an array of objects, where each
   * object contains a `deadline` property (a valid date string). The function converts these
   * deadlines to timestamps and sorts each category in place based on the earliest deadline.
   *
   * @function
   * @returns {void} - This function does not return any value. It sorts the arrays in place.
   */
  sortByDeadline() {
    const sortFunction = (a: any, b: any) => {
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return dateA - dateB;
    };
    this.followUpCategory.sort(sortFunction);
    this.leadNurturingCategory.sort(sortFunction);
    this.afterSalesCategory.sort(sortFunction);
  }

  /**
   * Determines if a task deadline is within the next 5 days.
   *
   * @param {Date | string} deadline - The deadline date or a date string for the task.
   * @returns {boolean} Returns `true` if the task's deadline is within the next 5 days, otherwise `false`.
   *
   */
  isUrgent(deadline: any): boolean {
    const today = new Date().getTime();
    const taskDeadline = new Date(deadline).getTime();
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
    const timeDifference = taskDeadline - today;
    return timeDifference <= fiveDaysInMs && timeDifference > 0;
  }

  markAsNotDone(task: FollowUp[]) {
    console.log(task);
  }

  ngOnDestroy() {
    if (this.followUpSubscription) {
      this.followUpSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
