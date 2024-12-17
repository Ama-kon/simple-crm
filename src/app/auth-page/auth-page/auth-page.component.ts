import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { LogInComponent } from '../log-in/log-in.component';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    LogInComponent,
    SignInComponent,
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
})
export class AuthPageComponent {
  constructor(private authenticationService: AuthenticationService) {}
  showSignUp: boolean = false;

  toggleLoginSignUp(): void {
    this.showSignUp = !this.showSignUp;
  }

  guestLogIn() {
    this.authenticationService.setGuestMode(true);
    console.log('guest angemeldet');
  }
}
