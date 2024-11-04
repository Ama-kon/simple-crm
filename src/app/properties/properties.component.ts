import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import properties from './../../assets/properties.json';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, CommonModule, NgIf],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent {
  properties = properties;
}
