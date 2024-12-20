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
export class DataHandlingService {
  private firestore: Firestore = inject(Firestore);

  async createGuestUserData() {
    await setDoc(doc(this.firestore, 'guest', 'guestDoc'), {});

    const propertiesSnapshot = await getDocs(
      collection(this.firestore, 'properties')
    );
    for (const propertyDoc of propertiesSnapshot.docs) {
      const propertyData = propertyDoc.data();
      await addDoc(
        collection(this.firestore, 'guest/guestDoc/properties'),
        propertyData
      );
    }

    const usersSnapshot = await getDocs(
      collection(this.firestore, 'standardData')
    );
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userRef = await addDoc(
        collection(this.firestore, 'guest/guestDoc/standardData'),
        userData
      );

      const followUpSnapshot = await getDocs(
        collection(this.firestore, `standardData/${userDoc.id}/Follow-ups`)
      );
      for (const followUpDoc of followUpSnapshot.docs) {
        const followUpData = followUpDoc.data();
        await setDoc(
          doc(
            this.firestore,
            `guest/guestDoc/standardData/${userRef.id}/Follow-ups/${followUpDoc.id}`
          ),
          followUpData
        );
      }
    }
  }

  /**
   * Deletes the guest user data, including the guest document and all subcollections (properties and standardData).
   * This method first deletes all documents in the 'guest/guestDoc/properties' and 'guest/guestDoc/standardData' subcollections,
   * and then deletes the 'guestDoc' document in the 'guest' collection.
   */
  async deleteGuestData() {
    const guestProperties = await getDocs(
      collection(this.firestore, 'guest/guestDoc/properties')
    );
    const guestStandardData = await getDocs(
      collection(this.firestore, 'guest/guestDoc/standardData')
    );

    await Promise.all([
      ...guestProperties.docs.map((doc) => deleteDoc(doc.ref)),
      ...guestStandardData.docs.map((doc) => deleteDoc(doc.ref)),
    ]);

    await deleteDoc(doc(this.firestore, 'guest', 'guestDoc'));
  }
}
