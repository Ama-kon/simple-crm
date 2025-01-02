import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private isGuest: boolean;

  constructor(private authService: AuthenticationService) {
    this.authService.isGuest$.subscribe((value) => {
      this.isGuest = value;
      console.log('isGuest:', this.isGuest);
    });
  }
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
    const isGuest = await firstValueFrom(this.authService.isGuest$);
    const basePath = isGuest ? 'guest/properties' : 'properties';

    const uploadPromises = files.map((file, index) => {
      const path = `${basePath}/${propertyId}/image_${index}_${file.name}`;
      return this.uploadImage(file, path);
    });
    return Promise.all(uploadPromises);
  }
}
