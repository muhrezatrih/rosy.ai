const geminiService = require('../services/gemini.service');
const { OWNER_WHATSAPP_NUMBER, OWNER_WHATSAPP_DIGITS } = require('../config/kosPrompt');

/**
 * Helper to detect if question/answer requires owner escalation
 */
function detectEscalation(prompt, responseText) {
  const isEscalation =
    (OWNER_WHATSAPP_DIGITS && responseText.includes(OWNER_WHATSAPP_DIGITS)) ||
    responseText.toLowerCase().includes('pemilik') ||
    responseText.toLowerCase().includes('wewenang') ||
    /(telat|nunggak|cicil|keringanan|nego|diskon|izin khusus|kebijakan|darurat)/i.test(prompt || '');

  const defaultText = prompt
    ? `Halo Ibu Ros, saya ingin bertanya dan berdiskusi mengenai: "${prompt.slice(0, 100)}"`
    : 'Halo Ibu Ros, saya ingin berdiskusi mengenai sewa Kost Ibu Ros (Tiban Indah, Batam).';

  const encodedMessage = encodeURIComponent(defaultText);

  return {
    required: Boolean(isEscalation),
    ownerNumber: OWNER_WHATSAPP_NUMBER,
    whatsappUrl: `https://wa.me/${OWNER_WHATSAPP_DIGITS}?text=${encodedMessage}`,
    actionLabel: isEscalation ? 'Hubungi Langsung Ibu Ros di WhatsApp' : 'Chat WhatsApp Admin',
  };
}

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
    const escalation = detectEscalation(prompt, text);

    return res.status(200).json({
      success: true,
      result: text,
      escalation,
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
    const escalation = detectEscalation(prompt, text);

    return res.status(200).json({
      success: true,
      result: text,
      escalation,
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
    const escalation = detectEscalation(prompt, text);

    return res.status(200).json({
      success: true,
      result: text,
      escalation,
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

