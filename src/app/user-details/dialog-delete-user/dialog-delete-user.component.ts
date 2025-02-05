import { Component, Inject, inject } from '@angular/core';
import { collection, deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-dialog-delete-user',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './dialog-delete-user.component.html',
  styleUrl: './dialog-delete-user.component.scss',
})
export class DialogDeleteUserComponent {
  loading = false;
  constructor(
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef<DialogDeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string },
    private router: Router
  ) {}
  private firestore = inject(Firestore);

  closeDialog() {
    this.dialogRef.close();
  }

  deleteUser() {
    this.loading = true;

    this.authenticationService.isGuest$.subscribe((isGuest) => {
      const collectionPath = isGuest
        ? `guest/guestDoc/standardData`
        : 'standardData';
      const userCollection = collection(this.firestore, collectionPath);
      const currentUserRef = doc(userCollection, this.data.userId);

      deleteDoc(currentUserRef);
      console.log('User deleted successfully');
      this.closeDialog();
      this.router.navigate(['/user']);
      this.loading = false;
    });
  }
}
