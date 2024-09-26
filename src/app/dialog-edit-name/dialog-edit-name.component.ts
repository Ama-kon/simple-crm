import { Component, Inject, Output, inject, EventEmitter } from '@angular/core';
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
export class DialogEditNameComponent {
  user: User;
  loading = false;
  private firestore: Firestore = inject(Firestore);
  @Output() userUpdated = new EventEmitter<User>();
  constructor(
    public dialog: MatDialogRef<DialogEditNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User; userId: string }
  ) {
    this.user = this.data.user;
  }

  ngOnInit(): void {}

  saveEdit() {
    this.loading = true;
    const userDocRef = doc(this.firestore, 'users', this.data.userId);
    updateDoc(userDocRef, { ...this.user });
    this.closeDialog();
    this.loading = false;
  }

  closeDialog() {
    this.dialog.close();
  }
}
