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
   * Deletes the guest user data, including the guest document and all subcollections (properties,follow-ups and standardData).
   * This method first deletes all documents in the 'guest/guestDoc/properties', 'guest/guestDoc/standardData' and 'guest/guestDoc/standardData/Follow-ups' subcollections,
   * and then deletes the 'guestDoc' document in the 'guest' collection.
   */
  async deleteGuestData() {
    const guestStandardData = await getDocs(
      collection(this.firestore, 'guest/guestDoc/standardData')
    );

    for (const doc of guestStandardData.docs) {
      const followUpsCollection = collection(
        this.firestore,
        `guest/guestDoc/standardData/${doc.id}/Follow-ups`
      );

      const followUps = await getDocs(followUpsCollection);
      if (!followUps.empty) {
        for (const followUpDoc of followUps.docs) {
          await deleteDoc(followUpDoc.ref);
        }
      }
      await deleteDoc(doc.ref);
    }

    const guestProperties = await getDocs(
      collection(this.firestore, 'guest/guestDoc/properties')
    );
    for (const doc of guestProperties.docs) {
      await deleteDoc(doc.ref);
    }

    await deleteDoc(doc(this.firestore, 'guest', 'guestDoc'));
  }
}
