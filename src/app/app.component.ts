import { Component, Inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { StandardDataComponent } from './user-management/standard-data/standard-data.component';
import { AuthPageComponent } from './auth-page/auth-page/auth-page.component';
import { NgClass } from '@angular/common';
import { AuthenticationService } from './services/authentication.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    StandardDataComponent,
    AuthPageComponent,
    NgClass,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'simple-crm';
  isGuest: boolean = false;
  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.isGuest$.subscribe((isGuest) => {
      this.isGuest = isGuest;
    });
  }

  logOut() {
    this.authenticationService.logOut();
  }
}
