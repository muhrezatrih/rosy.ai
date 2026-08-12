const express = require('express');
const {
  generateText,
  generateFromImage,
  generateFromDocument,
} = require('../controllers/ai.controller');
const {
  uploadImage,
  uploadDocument,
} = require('../middleware/upload.middleware');

const router = express.Router();

router.post('/generate-text', generateText);
router.post('/generate-from-image', uploadImage.single('image'), generateFromImage);
router.post('/generate-from-document', uploadDocument.single('document'), generateFromDocument);

module.exports = router;
