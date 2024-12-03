import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogAddPropertyComponent } from './dialog-add-property/dialog-add-property.component';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { FormatDateService } from '../services/formatDate.service';
import { Property } from '../../interfaces/property.interface';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    MatCardModule,
    MatGridListModule,
    CommonModule,
    NgIf,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DialogAddPropertyComponent,
  ],
  providers: [FormatDateService],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent implements OnInit, OnDestroy {
  properties: any[] = [];
  currentImageIndices: { [key: string]: number } = {};
  private firestore: Firestore = inject(Firestore);
  private propertySubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private formatDateService: FormatDateService
  ) {}

  ngOnInit(): void {
    this.loadProperties();
    console.log(this.properties);
  }

  loadProperties() {
    const propertyCollection = collection(this.firestore, 'properties');

    this.propertySubscription = collectionData(propertyCollection, {
      idField: 'id',
    }).subscribe((changes: any[]) => {
      this.properties = changes.map((property: any) => ({
        ...property,
        imageUrls: property.imageUrls || [],
      })) as Property[];
    });
  }

  formatDate(date: any): string {
    return this.formatDateService.formatDate(date);
  }

  openDialog(): void {
    this.dialog.open(DialogAddPropertyComponent, {
      data: {},
      width: '50%',
      maxWidth: '700px',
    });
  }

  nextImage(property: Property) {
    if (!this.currentImageIndices[property.id]) {
      this.currentImageIndices[property.id] = 0;
    }

    if (this.currentImageIndices[property.id] < property.imageUrls.length - 1) {
      this.currentImageIndices[property.id]++;
    } else {
      this.currentImageIndices[property.id] = 0;
    }
  }

  previousImage(property: Property) {
    if (!this.currentImageIndices[property.id]) {
      this.currentImageIndices[property.id] = 0;
    }

    if (this.currentImageIndices[property.id] > 0) {
      this.currentImageIndices[property.id]--;
    } else {
      this.currentImageIndices[property.id] = property.imageUrls.length - 1;
    }
  }

  ngOnDestroy() {
    if (this.propertySubscription) {
      this.propertySubscription.unsubscribe();
    }
  }
}
