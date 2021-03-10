/* eslint-disable class-methods-use-this */
import express from 'express';
import cloudinary from '../core/cloudinary';

// interface IImageRequest extends express.Request {
//   type: string
// }

class UploadFileController {
  async upload(req: express.Request, res: express.Response): Promise<void> {
    const { file } = req;
    const { type } = req.body;
    let options;

    switch (type) {
      case 'avatar':
        options = { resource_type: 'auto', width: 300, height: 300, crop: 'fill', radius: 'max' };
        break;
      case 'background':
        options = { resource_type: 'auto', width: 1200, height: 400, crop: 'fill' };
        break;
      default:
        options = { resource_type: 'auto', width: 1000, height: 600, crop: 'fill' };
        break;
    }

    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error || !result) {
          return res.status(500).json({
            status: 'error',
            message: error || 'upload error',
          });
        }

        return res.status(201).json({
          url: result.url,
          size: Math.round(result.bytes / 1024),
          height: result.height,
          width: result.width,
        });
      })
      .end(file.buffer);
  }
}

export default new UploadFileController();
