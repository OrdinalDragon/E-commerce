import multer from 'multer';
import { Upload } from '@aws-sdk/lib-storage';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/s3.js';
import ApiError from '../utils/ApiError.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only JPEG, PNG and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

const uploadToS3 = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, 'No file provided'));
    }

    const timestamp = Date.now();
    const ext = req.file.originalname.split('.').pop();
    const key = `products/${timestamp}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const parallelUpload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      },
    });

    await parallelUpload.done();

    req.fileUrl = `${process.env.S3_BUCKET_URL}/${key}`;
    next();
  } catch (error) {
    next(new ApiError(500, 'Error uploading file to S3'));
  }
};

export { upload, uploadToS3 };
