import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { FormatDateService } from '../services/formatDate.service';
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
  providers: [FormatDateService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit, OnDestroy {
  user = new User();
  allUsers$: User[] = [];
  aToZ: boolean = true;
  private userSubscription: Subscription;
  private firestore: Firestore = inject(Firestore);

  constructor(
    public dialog: MatDialog,
    private formatDateService: FormatDateService
  ) {}

  ngOnInit(): void {
    const userCollection = collection(this.firestore, 'users');
    this.userSubscription = collectionData(userCollection, {
      idField: 'id',
    }).subscribe((changes: any) => {
      this.allUsers$ = changes;
    });
  }

  openDialog(): void {
    this.dialog.open(DialogAddUserComponent, {
      data: {},
    });
  }

  formatDate(birthDate: any): string {
    return this.formatDateService.formatDate(birthDate);
  }

  sortUsers(criteria: string) {
    if (this.aToZ) {
      this.sortFromAToZ(criteria);
      this.aToZ = false;
    } else {
      this.sortFromZToA(criteria);
      this.aToZ = true;
    }
  }

  sortFromAToZ(criteria: string) {
    this.allUsers$.sort((a, b) => {
      switch (criteria) {
        case 'firstName':
          return a.firstName.localeCompare(b.firstName);
        case 'lastName':
          return a.lastName.localeCompare(b.lastName);
        case 'birthDate':
          return (
            new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime()
          );
        case 'city':
          return a.city.localeCompare(b.city);
        case 'email':
          return a.email.localeCompare(b.email);
        default:
          return 0;
      }
    });
  }

  sortFromZToA(criteria: string) {
    this.allUsers$.sort((a, b) => {
      switch (criteria) {
        case 'firstName':
          return b.firstName.localeCompare(a.firstName);
        case 'lastName':
          return b.lastName.localeCompare(a.lastName);
        case 'birthDate':
          return (
            new Date(b.birthDate).getTime() - new Date(a.birthDate).getTime()
          );
        case 'city':
          return b.city.localeCompare(a.city);
        case 'email':
          return b.email.localeCompare(a.email);
        default:
          return 0;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
