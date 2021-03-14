import { Router } from 'express';
import multer from 'multer';
import uploadFileController from '../controllers/uploadFileController';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), uploadFileController.upload);

module.exports = router;
