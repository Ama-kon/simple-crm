import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';
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
    MatTooltip,
  ],
  providers: [FormatDateService],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  currentUserId: string;
  currentUser: User[] = [];
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

  formatDate(birthDate: any): string {
    return this.formatDateService.formatDate(birthDate);
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
