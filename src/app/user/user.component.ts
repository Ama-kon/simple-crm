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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { UserSearchStateService } from '../services/userSearchState.service';
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
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  providers: [FormatDateService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit, OnDestroy {
  user = new User();
  allUsers$: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  aToZ: boolean = true;
  private userSubscription: Subscription;
  private firestore: Firestore = inject(Firestore);

  constructor(
    public dialog: MatDialog,
    private formatDateService: FormatDateService,
    private UserSearchStateService: UserSearchStateService
  ) {}

  ngOnInit(): void {
    const userCollection = collection(this.firestore, 'users');
    this.userSubscription = collectionData(userCollection, {
      idField: 'id',
    }).subscribe((changes: any) => {
      this.allUsers$ = changes;
      if (!this.UserSearchStateService.searchTerm) {
        this.UserSearchStateService.clearSearchState();
        this.filteredUsers = this.allUsers$;
      } else {
        this.searchTerm = this.UserSearchStateService.searchTerm;
        this.filterUsers();
      }
    });
    console.log(this.searchTerm);
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

  filterUsers(): void {
    if (!this.searchTerm) {
      this.showAllUsers();
    }
    this.filterAllUsers();
    this.UserSearchStateService.searchTerm = this.searchTerm;
    this.UserSearchStateService.filteredUsers = this.filteredUsers;
  }

  showAllUsers(): void {
    this.filteredUsers = this.allUsers$;
    this.UserSearchStateService.filteredUsers = [];
  }

  filterAllUsers(): void {
    this.filteredUsers = this.allUsers$.filter((user) => {
      const searchTermLower = this.searchTerm.toLowerCase();
      const formattedBirthDate = this.formatDateService.formatDate(
        user.birthDate
      );
      return (
        user.firstName.toLowerCase().includes(searchTermLower) ||
        user.lastName.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower) ||
        user.city.toLowerCase().includes(searchTermLower) ||
        user.street.toLowerCase().includes(searchTermLower) ||
        user.zipCode.toString().includes(searchTermLower) ||
        formattedBirthDate.toLowerCase().includes(searchTermLower)
      );
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
