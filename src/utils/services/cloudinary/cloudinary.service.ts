import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cloudinaryConfig } from './cloudinary.config';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  private _cloudinary: typeof v2;
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this._cloudinary = cloudinaryConfig(this.configService);
  }

  async deleteFile(public_id: string): Promise<void> {
    try {
      await this._cloudinary.uploader.destroy(public_id);
    } catch (error) {
      console.log('error while deleting file', error);

      throw new InternalServerErrorException(
        `faild to delete ${public_id} from cloud`,
      );
    }
  }

  async deleteAllFiles(path: string): Promise<void> {
    try {
      await this.cloudinary.api.delete_resources_by_prefix(
        path,
        (err: any, res: any) => {
          console.log('resources: ', res);
          console.log('resourceserr: ', err);
        },
      );
      await this.cloudinary.api.delete_folder(path, (err: any, res: any) => {
        console.log('res: ', res);
        console.log('reserr: ', err);
      });
    } catch (error) {
      console.log('error while delete all files or the folder ', error);

      throw new InternalServerErrorException(
        `faild to delete ${path} from cloud`,
      );
    }
  }

  async uploadFile({
    file,
    folder,
  }: {
    file: Express.Multer.File;
    folder: string;
  }): Promise<{
    public_id: string;
    secure_url: string;
  }> {
    try {
      const { public_id, secure_url } = await this._cloudinary.uploader.upload(
        file.path,
        {
          folder,
        },
      );
      return {
        public_id,
        secure_url,
      };
    } catch (error) {
      console.log('error while deleting file', error);

      throw new InternalServerErrorException(
        `faild to upload ${file.path} to the cloud`,
      );
    }
  }

  get cloudinary() {
    return this._cloudinary;
  }
}
