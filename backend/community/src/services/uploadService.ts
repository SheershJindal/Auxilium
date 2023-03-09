import { IToken } from '@/interfaces/IToken';
import { unlink } from 'fs/promises';
import { resolve } from 'path';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { StorageService } from './storageService';

@Service()
export class UploadService {
  protected storageServiceInstance: StorageService;
  protected logger: Logger;

  constructor(storageService: StorageService, @Inject('logger') logger: Logger) {
    this.logger = logger;
    this.storageServiceInstance = storageService;
  }

  public uploadFiles = async (
    userId: IToken['userId'],
    files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[],
  ) => {
    const photosPromises = [];
    const videosPromises = [];

    if (files && files['photos']) {
      const photos = files['photos'];
      photos.map(photo => {
        const fileName = photo.filename;
        const path = resolve(photo.path);
        const metaData = { userId, original_name: photo.originalname };
        const fileType = photo.mimetype;
        photosPromises.push(this.storageServiceInstance.uploadToStore(fileName, path, metaData, fileType));
      });
    }

    if (files && files['videos']) {
      const videos = files['videos'];
      videos.map(video => {
        const fileName = video.filename;
        const path = resolve(video.path);
        const metaData = { userId, original_name: video.originalname };
        const fileType = video.mimetype;
        videosPromises.push(this.storageServiceInstance.uploadToStore(fileName, path, metaData, fileType));
      });
    }
    const photos = (await Promise.all(photosPromises)).map(promise => promise.url);
    const videos = (await Promise.all(videosPromises)).map(promise => promise.url);

    /**
     * Unlinking files
     */
    if (files && files['photos']) {
      let ph = files['photos'];
      ph.map(p => {
        const path = resolve(p.path);
        unlink(path);
      });
    }
    if (files && files['videos']) {
      let vi = files['videos'];
      vi.map(v => {
        const path = resolve(v.path);
        unlink(path);
      });
    }

    return { photos, videos };
  };
}
