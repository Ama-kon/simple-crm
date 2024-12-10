import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../../models/user.class';
import { from } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditNameComponent } from '../dialog-edit-name/dialog-edit-name.component';
import { Subscription } from 'rxjs';
import { FormatDateService } from '../services/formatDate.service';
import { MatTooltip } from '@angular/material/tooltip';
import { FollowUp } from '../../interfaces/followUp.interface';
import { DialogEditFollowUpComponent } from '../dialog-edit-follow-up/dialog-edit-follow-up.component';
import { DialogAddFollowUpComponent } from '../dialog-add-follow-up/dialog-add-follow-up.component';
import { DialogDeleteUserComponent } from './dialog-delete-user/dialog-delete-user.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink,
    DialogEditAddressComponent,
    DialogEditNameComponent,
    DialogEditFollowUpComponent,
    DialogDeleteUserComponent,
    MatTooltip,
  ],
  providers: [FormatDateService],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  currentUserId: string;
  currentUser: User[] = [];
  followUps: FollowUp[] = [];
  followUpId: string;
  index: number;
  private paramsSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private formatDateService: FormatDateService
  ) {}

  private firestore = inject(Firestore);

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (paramsId) => {
        this.currentUserId = paramsId['id'];
        this.getCurrentUser();
      }
    );
    this.getFollowUps(this.currentUserId);
  }

  getCurrentUser() {
    const userCollection = collection(this.firestore, 'standardData');
    const currentUserRef = doc(userCollection, this.currentUserId);

    this.userSubscription = from(getDoc(currentUserRef)).subscribe(
      (document) => {
        if (document.exists()) {
          this.currentUser = [document.data() as User];
        }
      }
    );
  }

  async getFollowUps(userId: string) {
    const followUpsRef = collection(
      this.firestore,
      `standardData/${userId}/Follow-ups`
    );
    const followUpsSnapshot = await getDocs(followUpsRef);

    if (followUpsSnapshot.empty) {
      return null;
    } else {
      const followUps = followUpsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          category: data['category'] || '',
          createdAt: data['createdAt'] || 0,
          deadline: data['deadline'] || 0,
          description: data['description'] || '',
          action: data['action'] || '',
          status: data['status'] || '',
        } as FollowUp;
      });
      this.followUps = followUps;
      return followUps;
    }
  }

  editAddressCard() {
    const userCopy = { ...this.currentUser[0] };
    const dialogRef = this.dialog.open(DialogEditAddressComponent, {
      data: { user: userCopy, userId: this.currentUserId },
    });
    const dialogComponent = dialogRef.componentInstance;
    dialogComponent.userUpdated.subscribe(() => {
      this.getCurrentUser();
    });
  }

  editNameCard() {
    const userCopy = { ...this.currentUser[0] };
    const dialogRef = this.dialog.open(DialogEditNameComponent, {
      data: { user: userCopy, userId: this.currentUserId },
    });
    const dialogComponent = dialogRef.componentInstance;
    dialogComponent.userUpdated.subscribe(() => {
      this.getCurrentUser();
    });
  }

  editFollowUpCard(index: number) {
    this.index = index;
    const userCopy = { ...this.currentUser[0] };
    const dialogRef = this.dialog.open(DialogEditFollowUpComponent, {
      data: {
        user: userCopy,
        userId: this.currentUserId,
        followUps: this.followUps,
        followUpId: this.followUpId,
        index: this.index,
      },
    });
    const dialogComponent = dialogRef.componentInstance;
    dialogComponent.userUpdated.subscribe(() => {
      this.getCurrentUser();
    });
  }

  formatDate(date: any): string {
    return this.formatDateService.formatDate(date);
  }

  get hasFollowUps(): boolean {
    if (this.followUps.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  addNewFollowUp() {
    const userCopy = { ...this.currentUser[0] };
    const dialogRef = this.dialog.open(DialogAddFollowUpComponent, {
      data: {
        user: userCopy,
        userId: this.currentUserId,
        followUps: this.followUps,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getFollowUps(this.currentUserId);
    });
  }

  deleteUser() {
    const dialogRef = this.dialog.open(DialogDeleteUserComponent, {
      data: { userId: this.currentUserId },
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
