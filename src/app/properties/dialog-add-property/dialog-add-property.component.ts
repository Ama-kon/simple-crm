import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ImageUploadService } from '../../services/imageUpload.service';
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
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-add-property.component.html',
  styleUrl: './dialog-add-property.component.scss',
})
export class DialogAddPropertyComponent {
  propertyForm: FormGroup;
  minDate: Date = new Date();
  selectedFiles: any[] = [];

  constructor(
    public dialog: MatDialogRef<DialogAddPropertyComponent>,
    private firestore: Firestore,
    private imageUploadService: ImageUploadService,
    private fb: FormBuilder
  ) {
    this.propertyForm = this.fb.group({
      available: ['', Validators.required],
      livingSpace: ['', Validators.required],
      owner: ['', Validators.required],
      ownerAdress: ['', Validators.required],
      ownerMail: ['', Validators.required],
      ownerPhone: ['', Validators.required],
      parking: ['', Validators.required],
      price: ['', Validators.required],
      sqmPrice: [{ value: '', disabled: true }],
      streetNumber: ['', Validators.required],
      type: ['', Validators.required],
      yearbuilt: ['', Validators.required],
      zipCity: ['', Validators.required],
      imageUrls: [[]],
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
        sqmPrice: squareMeterPrice.toFixed(2),
      });
    }
  }

  async onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    const newFiles = files.map((file) => ({
      file,
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file),
    }));
    this.selectedFiles = [...this.selectedFiles, ...newFiles];
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files || []) as File[];
    const newFiles = files.map((file) => ({
      file,
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file),
    }));
    this.selectedFiles = [...this.selectedFiles, ...newFiles];
  }

  removeFile(fileToRemove: any) {
    const index = this.selectedFiles.indexOf(fileToRemove);
    if (index > -1) {
      // Revoke the object URL to free up memory
      URL.revokeObjectURL(fileToRemove.preview);
      this.selectedFiles.splice(index, 1);
    }
  }

  async onSave() {
    if (this.validateForm()) {
      try {
        const filesToUpload = this.selectedFiles.map((fileObj) => fileObj.file);
        if (filesToUpload.length > 0) {
          const urls = await this.imageUploadService.uploadPropertyImages(
            filesToUpload
          );
          this.propertyForm.patchValue({ imageUrls: urls });
        }

        const availableDate = this.propertyForm.get('available')?.value;
        const availableTimestamp = new Date(availableDate).getTime();

        const propertiesRef = collection(this.firestore, 'properties');
        const propertyData = {
          ...this.propertyForm.getRawValue(),
          available: availableTimestamp,
          createdAt: new Date(),
        };

        await addDoc(propertiesRef, propertyData);
        this.dialog.close(propertyData);
      } catch (error) {
        console.error('Error saving property:', error);
      }
    }
  }

  private validateForm(): boolean {
    if (this.propertyForm.valid) {
      return true;
    }

    Object.keys(this.propertyForm.controls).forEach((key) => {
      const control = this.propertyForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
    return false;
  }
}
