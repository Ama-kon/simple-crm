import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../models/user.class';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatButtonModule,
    FormsModule,
    MatProgressBarModule,
    CommonModule,
  ],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss',
})
export class DialogAddUserComponent {
  user = new User();
  birthDate: Date;
  loading = false;
  private isGuest: boolean = false;
  private subscription: Subscription;
  private firestore: Firestore = inject(Firestore);
  constructor(
    private authService: AuthenticationService,
    public dialog: MatDialogRef<DialogAddUserComponent>
  ) {
    this.subscription = this.authService.isGuest$.subscribe(
      (isGuest) => (this.isGuest = isGuest)
    );
  }

  async saveUser() {
    this.loading = true;
    this.user.birthDate = this.birthDate.getTime();
    const userCollection = collection(this.firestore, 'standardData');
    const guestCollection = collection(
      this.firestore,
      'guest',
      'guestDoc',
      'standardData'
    );
    const userToJson = Object.assign({}, this.user);

    if (this.isGuest) {
      await addDoc(guestCollection, userToJson);
    } else {
      await addDoc(userCollection, userToJson);
    }
    this.clearForm();
    this.loading = false;
    this.dialog.close();
  }

  closeDialog() {
    this.dialog.close();
  }

  clearForm() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      input.value = '';
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
