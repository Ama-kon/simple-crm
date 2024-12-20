import {
  Component,
  Inject,
  Output,
  inject,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../models/user.class';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-edit-name',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    MatProgressBarModule,
    CommonModule,
  ],
  templateUrl: './dialog-edit-name.component.html',
  styleUrl: './dialog-edit-name.component.scss',
})
export class DialogEditNameComponent implements OnDestroy {
  user: User;
  loading = false;
  private firestore: Firestore = inject(Firestore);
  private isGuest: boolean = false;
  private subscription: Subscription;
  @Output() userUpdated = new EventEmitter<void>();

  constructor(
    public dialog: MatDialogRef<DialogEditNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User; userId: string },
    private authService: AuthenticationService
  ) {
    this.user = this.data.user;
    this.subscription = this.authService.isGuest$.subscribe(
      (isGuest) => (this.isGuest = isGuest)
    );
  }

  saveEdit() {
    this.loading = true;
    const collectionPath = this.isGuest
      ? `guest/guestDoc/standardData`
      : 'standardData';

    const userDocRef = doc(this.firestore, collectionPath, this.data.userId);

    updateDoc(userDocRef, { ...this.user }).then(() => {
      this.loading = false;
      this.userUpdated.emit();
      this.closeDialog();
    });
  }

  closeDialog() {
    this.dialog.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
