import { Component, Inject, inject, Output, EventEmitter } from '@angular/core';
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
import { FollowUp } from '../../interfaces/followUp.interface';
import { FormatDateService } from '../services/formatDate.service';

@Component({
  selector: 'app-dialog-edit-follow-up',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    FormsModule,
    MatProgressBarModule,
    CommonModule,
  ],
  providers: [provideNativeDateAdapter(), FormatDateService],
  templateUrl: './dialog-edit-follow-up.component.html',
  styleUrl: './dialog-edit-follow-up.component.scss',
})
export class DialogEditFollowUpComponent {
  user: User;
  userId: string;
  followUpId: string;
  index: number;
  currentFollowUp: FollowUp;
  loading = false;

  private firestore: Firestore = inject(Firestore);
  private formatDateService = inject(FormatDateService);
  @Output() userUpdated = new EventEmitter<void>();

  constructor(
    public dialog: MatDialogRef<DialogEditFollowUpComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      user: User;
      userId: string;
      followUpId: string;
      index: number;
      followUps: any[];
    }
  ) {
    console.log('data', data);
    this.user = data.user;
    this.userId = data.userId;
    this.followUpId = data.followUpId;
    this.index = data.index;
    this.currentFollowUp = this.data.followUps[this.data.index];
  }

  formatDate(date: any): string {
    return this.formatDateService.formatDate(date);
  }

  // save funktioniert nicht, hier weiter machen - letzter Stand 400 bad request

  // saveEdit() {
  //   console.log('currentFollowUp', this.currentFollowUp);
  //   console.log('currentUser', this.user);
  //   console.log('followUpId', this.followUpId);
  //   this.loading = true;
  //   const userDocRef = doc(this.firestore, 'users', this.data.userId);
  //   const followUpDocRef = doc(
  //     userDocRef,
  //     'Follow-ups',
  //     this.currentFollowUp.id
  //   );

  //   updateDoc(followUpDocRef, { ...this.currentFollowUp })
  //     .then(() => {
  //       this.loading = false;
  //       this.userUpdated.emit();
  //       this.closeDialog();
  //     })
  //     .catch((error) => {
  //       console.error('Error updating follow-up:', error);
  //       this.loading = false;
  //     });
  // }

  closeDialog() {
    this.dialog.close();
  }
}