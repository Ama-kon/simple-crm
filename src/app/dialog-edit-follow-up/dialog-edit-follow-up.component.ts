import {
  Component,
  Inject,
  inject,
  Output,
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
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { FollowUp } from '../../interfaces/followUp.interface';
import { FormatDateService } from '../services/formatDate.service';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

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
    MatSelectModule,
  ],
  providers: [provideNativeDateAdapter(), FormatDateService],
  templateUrl: './dialog-edit-follow-up.component.html',
  styleUrl: './dialog-edit-follow-up.component.scss',
})
export class DialogEditFollowUpComponent implements OnDestroy {
  user: User;
  userId: string;
  followUpId: string;
  currentFollowUp: FollowUp;
  loading = false;
  minDate: Date = new Date();
  private isGuest: boolean = false;
  private subscription: Subscription;

  actions = [
    { value: 'Call' },
    { value: 'Email' },
    { value: 'Meeting' },
    { value: 'Other' },
  ];

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
      followUps: FollowUp[];
    },
    private authService: AuthenticationService
  ) {
    this.user = data.user;
    this.userId = data.userId;
    this.followUpId = data.followUpId;

    const foundFollowUp = data.followUps.find(
      (followUp) => followUp.id === this.followUpId
    );

    if (foundFollowUp) {
      this.currentFollowUp = {
        id: foundFollowUp.id,
        action: foundFollowUp.action,
        category: foundFollowUp.category,
        createdAt: foundFollowUp.createdAt,
        deadline: foundFollowUp.deadline,
        description: foundFollowUp.description,
        status: foundFollowUp.status,
      };
    }

    this.subscription = this.authService.isGuest$.subscribe(
      (isGuest) => (this.isGuest = isGuest)
    );
  }

  saveEdit() {
    this.loading = true;
    const collectionPath = this.isGuest
      ? `guest/guestDoc/standardData`
      : 'standardData';

    const userDocRef = doc(this.firestore, collectionPath, this.userId);
    const followUpDocRef = doc(userDocRef, '/Follow-ups/', this.followUpId);

    const updatedFollowUp = {
      ...this.currentFollowUp,
      deadline: new Date(this.currentFollowUp.deadline).getTime(),
    };

    setDoc(followUpDocRef, updatedFollowUp).then(() => {
      this.loading = false;
      this.userUpdated.emit();
      this.closeDialog();
    });
  }

  formatDate(date: any): string {
    return this.formatDateService.formatDate(date);
  }

  closeDialog() {
    this.dialog.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
