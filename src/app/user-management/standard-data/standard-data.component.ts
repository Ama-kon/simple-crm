import { Component, inject, OnInit } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-standard-data',
  standalone: true,
  imports: [],
  templateUrl: './standard-data.component.html',
})
export class StandardDataComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  ngOnInit() {
    this.initializeStandardData();
  }

  async initializeStandardData(): Promise<void> {
    console.log('Wir beginnen....');
    const standardDataCollection = collection(this.firestore, 'standardData');
    const standardDataSnapshot = await getDocs(standardDataCollection);

    if (standardDataSnapshot.empty) {
      const usersCollection = collection(this.firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        addDoc(standardDataCollection, userData);
      });
      console.log('Standard data initialized.');
    } else {
      console.log('Standard data already exists.');
    }
  }
}
