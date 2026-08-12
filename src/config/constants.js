const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const ALLOWED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const DEFAULT_MAX_FILE_SIZE_MB = 10;

module.exports = {
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_DOCUMENT_MIME_TYPES,
  DEFAULT_GEMINI_MODEL,
  DEFAULT_MAX_FILE_SIZE_MB,
};
