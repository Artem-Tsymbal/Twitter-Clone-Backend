/* eslint-disable class-methods-use-this */
import express from 'express';
import cloudinary from '../core/cloudinary';

class UploadFileController {
  async upload(req: express.Request, res: express.Response): Promise<void> {
    const { file } = req;

    cloudinary.uploader
      .upload_stream({ resource_type: 'auto' }, (error, result) => {
        console.log(result, error);
        if (error || !result) {
          return res.status(500).json({
            status: 'error',
            message: error || 'upload error',
          });
        }

        return res.status(201).json(result);
      })
      .end(file.buffer);
  }
}

export default new UploadFileController();
