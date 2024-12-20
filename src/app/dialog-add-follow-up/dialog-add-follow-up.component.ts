import {
  Component,
  EventEmitter,
  Inject,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { User } from '../../models/user.class';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FollowUp } from '../../interfaces/followUp.interface';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormatDateService } from '../services/formatDate.service';
import { MatSelectModule } from '@angular/material/select';
import { AuthenticationService } from '../services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-add-follow-up',
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
  templateUrl: './dialog-add-follow-up.component.html',
  styleUrl: './dialog-add-follow-up.component.scss',
})
export class DialogAddFollowUpComponent implements OnInit, OnDestroy {
  user: User;
  loading = false;
  minDate: Date = new Date();
  private isGuest: boolean = false;
  private subscription: Subscription;

  categories = [
    { value: 'Follow up' },
    { value: 'Lead Nurturing' },
    { value: 'After Sales' },
  ];

  actions = [
    { value: 'Call' },
    { value: 'Email' },
    { value: 'Meeting' },
    { value: 'Other' },
  ];

  newFollowUp: FollowUp = {
    id: '',
    category: '',
    createdAt: 0,
    deadline: 0,
    description: '',
    action: '',
    status: 'open',
  };

  private firestore: Firestore = inject(Firestore);
  private formatDateService = inject(FormatDateService);
  @Output() userUpdated = new EventEmitter<void>();

  constructor(
    public dialog: MatDialogRef<DialogAddFollowUpComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { user: User; userId: string; followUps: FollowUp[] },
    private authService: AuthenticationService
  ) {
    this.user = this.data.user;
    this.user.followUps = this.data.followUps;
    this.subscription = this.authService.isGuest$.subscribe(
      (isGuest) => (this.isGuest = isGuest)
    );
  }

  ngOnInit(): void {
    this.newFollowUp.createdAt = new Date().getTime();
  }

  saveNew() {
    this.loading = true;
    const collectionPath = this.isGuest
      ? `guest/guestDoc/standardData`
      : 'standardData';

    const userDocRef = doc(this.firestore, collectionPath, this.data.userId);
    const followUpsCollectionRef = collection(userDocRef, 'Follow-ups');
    this.newFollowUp.deadline = new Date(this.newFollowUp.deadline).getTime();

    addDoc(followUpsCollectionRef, this.newFollowUp).then((docRef) => {
      this.newFollowUp.id = docRef.id;

      setDoc(docRef, this.newFollowUp).then(() => {
        this.userUpdated.emit();
        this.dialog.close();
        this.loading = false;
      });
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
