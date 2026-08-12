const geminiService = require('../services/gemini.service');

/**
 * Controller for /generate-text
 */
async function generateText(req, res, next) {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Prompt parameter is required and must be a non-empty string', code: 'BAD_REQUEST' },
      });
    }

    const text = await geminiService.generateText(prompt.trim());
    return res.status(200).json({
      success: true,
      result: text,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller for /generate-from-image
 */
async function generateFromImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required',
        error: { message: 'Image file is required', code: 'BAD_REQUEST' },
      });
    }

    const { prompt } = req.body;
    const text = await geminiService.generateFromImage(
      req.file.buffer,
      req.file.mimetype,
      prompt
    );

    return res.status(200).json({
      success: true,
      result: text,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller for /generate-from-document
 */
async function generateFromDocument(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Document file is required',
        error: { message: 'Document file is required', code: 'BAD_REQUEST' },
      });
    }

    const { prompt } = req.body;
    const text = await geminiService.generateFromDocument(
      req.file.buffer,
      req.file.mimetype,
      prompt
    );

    return res.status(200).json({
      success: true,
      result: text,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  generateText,
  generateFromImage,
  generateFromDocument,
};
