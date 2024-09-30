import { Injectable } from '@angular/core';
import { User } from '../../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class UserSearchStateService {
  searchTerm: string = '';
  filteredUsers: User[] = [];

  constructor() {}

  clearSearchState() {
    this.searchTerm = '';
    this.filteredUsers = [];
  }
}
