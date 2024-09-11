import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';

export const cloudinaryConfig = (config: ConfigService): typeof v2 => {
  v2.config({
    cloud_name: config.get('CLOUD_NAME'),
    api_key: config.get('API_KEY'),
    api_secret: config.get('API_SECRET'),
  });

  return v2;
};
