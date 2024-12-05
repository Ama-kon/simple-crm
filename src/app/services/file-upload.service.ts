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
export class FileUploadService {
  private storage: Storage = inject(Storage);

  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  async uploadPropertyImages(
    propertyId: string,
    files: File[]
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const path = `properties/${propertyId}/image_${index}_${file.name}`;
      return this.uploadImage(file, path);
    });
    return Promise.all(uploadPromises);
  }
}
