import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  currentUserId: string;
  currentUser: User[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  private firestore = inject(Firestore);

  ngOnInit() {
    this.activatedRoute.params.subscribe((paramsId) => {
      this.currentUserId = paramsId['id'];
      this.getCurrentUser();
    });
  }

  getCurrentUser() {
    const userCollection = collection(this.firestore, 'users');
    const currentUserRef = doc(userCollection, this.currentUserId);

    from(getDoc(currentUserRef)).subscribe((document) => {
      if (document.exists()) {
        this.currentUser = [document.data() as User];
        console.log('User data:', this.currentUser);
      } else {
        console.log('No such document!');
      }
    });
  }

  editAddressCard() {
    const userCopy = { ...this.currentUser[0] };
    this.dialog.open(DialogEditAddressComponent, {
      data: { user: userCopy, userId: this.currentUserId },
    });
  }

  editNameCard() {
    const userCopy = { ...this.currentUser[0] };
    this.dialog.open(DialogEditNameComponent, {
      data: { user: userCopy, userId: this.currentUserId },
    });
  }
}
