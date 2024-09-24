import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from '../../models/user.class';
import { MatCardModule } from '@angular/material/card';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatIcon,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user = new User();
  allUsers$: User[] = [];
  private firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    const userCollection = collection(this.firestore, 'users');
    collectionData(userCollection, { idField: 'id' }).subscribe(
      (changes: any) => {
        this.allUsers$ = changes;
      }
    );
  }

  openDialog(): void {
    this.dialog.open(DialogAddUserComponent, {
      data: {},
    });
  }
}
