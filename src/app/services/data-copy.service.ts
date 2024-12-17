import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DataCopyService {
  private firestore: Firestore = inject(Firestore);

  /**
   * Creates guest user data by copying properties and users from the main collections to the guest subcollections.
   * This method first creates a 'guestDoc' document in the 'guest' collection, then copies all properties from the 'properties' collection to the 'guest/guestDoc/properties' subcollection, and all users from the 'users' collection to the 'guest/guestDoc/users' subcollection.
   */
  async createGuestUserData() {
    await setDoc(doc(this.firestore, 'guest', 'guestDoc'), {});

    const propertiesSnapshot = await getDocs(
      collection(this.firestore, 'properties')
    );
    propertiesSnapshot.forEach(async (doc) => {
      const propertyData = doc.data();
      await addDoc(
        collection(this.firestore, 'guest/guestDoc/properties'),
        propertyData
      );
    });

    const usersSnapshot = await getDocs(collection(this.firestore, 'users'));
    usersSnapshot.forEach(async (doc) => {
      const userData = doc.data();
      await addDoc(
        collection(this.firestore, 'guest/guestDoc/users'),
        userData
      );
    });
  }

  /**
   * Deletes the guest user data, including the properties and users subcollections.
   * This method first retrieves the documents from the 'guest/guestDoc/properties' and 'guest/guestDoc/users' subcollections, and then deletes each document.
   */
  async deleteGuestData() {
    const guestProperties = await getDocs(
      collection(this.firestore, 'guest/guestDoc/properties')
    );
    const guestUsers = await getDocs(
      collection(this.firestore, 'guest/guestDoc/users')
    );

    guestProperties.forEach(async (doc) => await deleteDoc(doc.ref));
    guestUsers.forEach(async (doc) => await deleteDoc(doc.ref));
  }
}
