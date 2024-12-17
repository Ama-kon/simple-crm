import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataCopyService } from './data-copy.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isGuestSubject = new BehaviorSubject<boolean>(false);
  isGuest$ = this.isGuestSubject.asObservable();

  constructor(private dataCopyService: DataCopyService) {}

  setGuestMode(isGuest: boolean) {
    if (isGuest) {
      this.dataCopyService.createGuestUserData();
    }
    this.isGuestSubject.next(isGuest);
  }

  logOut() {
    this.setGuestMode(false);
    console.log('abgemeldet');
  }
}
