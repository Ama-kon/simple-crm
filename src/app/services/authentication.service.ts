import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataHandlingService } from './data-handling.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isGuestSubject = new BehaviorSubject<boolean>(false);
  isGuest$ = this.isGuestSubject.asObservable();

  constructor(private dataHandlingService: DataHandlingService) {}

  setGuestMode(isGuest: boolean) {
    if (isGuest) {
      this.dataHandlingService.createGuestUserData();
    }
    this.isGuestSubject.next(isGuest);
  }

  logOut() {
    this.setGuestMode(false);
    this.dataHandlingService.deleteGuestData();
    console.log('abgemeldet');
  }
}
