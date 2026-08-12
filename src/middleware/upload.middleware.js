const multer = require('multer');
const { config } = require('../config/env');
const {
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_DOCUMENT_MIME_TYPES,
} = require('../config/constants');

const maxSizeBytes = config.maxFileSizeMB * 1024 * 1024;

const imageFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      `Invalid file type. Allowed image formats: ${ALLOWED_IMAGE_MIME_TYPES.join(', ')}`
    );
    error.statusCode = 400;
    cb(error, false);
  }
};

const documentFilter = (req, file, cb) => {
  if (ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      `Invalid file type. Allowed document formats: ${ALLOWED_DOCUMENT_MIME_TYPES.join(', ')}`
    );
    error.statusCode = 400;
    cb(error, false);
  }
};

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSizeBytes },
  fileFilter: imageFilter,
});

const uploadDocument = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSizeBytes },
  fileFilter: documentFilter,
});

module.exports = {
  uploadImage,
  uploadDocument,
};
