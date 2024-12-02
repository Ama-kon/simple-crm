import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-add-property',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-add-property.component.html',
  styleUrl: './dialog-add-property.component.scss',
})
export class DialogAddPropertyComponent {
  propertyForm: FormGroup;
  minDate: Date = new Date();

  constructor(
    public dialog: MatDialogRef<DialogAddPropertyComponent>,
    private fb: FormBuilder
  ) {
    this.propertyForm = this.fb.group({
      price: ['', Validators.required],
      livingSpace: ['', Validators.required],
      squareMeterPrice: [{ value: '', disabled: true }],
    });

    this.propertyForm.get('price')?.valueChanges.subscribe(() => {
      this.calculateSquareMeterPrice();
    });

    this.propertyForm.get('livingSpace')?.valueChanges.subscribe(() => {
      this.calculateSquareMeterPrice();
    });
  }

  calculateSquareMeterPrice() {
    const price = this.propertyForm.get('price')?.value;
    const livingSpace = this.propertyForm.get('livingSpace')?.value;

    if (price && livingSpace > 0) {
      const squareMeterPrice = price / livingSpace;
      this.propertyForm.patchValue({
        squareMeterPrice: squareMeterPrice.toFixed(2),
      });
    }
  }
}
