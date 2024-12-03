import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private storage: Storage = inject(Storage);

  async uploadPropertyImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const timestamp = new Date().getTime();
      const path = `properties/${timestamp}_${file.name}`;
      const storageRef = ref(this.storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    });

    return Promise.all(uploadPromises);
  }
}
