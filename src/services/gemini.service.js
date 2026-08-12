const { GoogleGenAI } = require('@google/genai');
const { config } = require('../config/env');

class GeminiService {
  constructor() {
    this._ai = null;
  }

  get ai() {
    if (!this._ai) {
      if (!config.geminiApiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
      }
      this._ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    }
    return this._ai;
  }

  /**
   * Generate text response from prompt
   * @param {string} prompt
   * @param {string} [modelOverride]
   * @returns {Promise<string>}
   */
  async generateText(prompt, modelOverride) {
    const model = modelOverride || config.geminiModel;
    const response = await this.ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  }

  /**
   * Generate content from image and optional prompt
   * @param {Buffer} imageBuffer
   * @param {string} mimeType
   * @param {string} [prompt]
   * @param {string} [modelOverride]
   * @returns {Promise<string>}
   */
  async generateFromImage(imageBuffer, mimeType, prompt, modelOverride) {
    const model = modelOverride || config.geminiModel;
    const base64Image = imageBuffer.toString('base64');
    const contents = [];

    if (prompt && prompt.trim()) {
      contents.push({ text: prompt.trim() });
    }

    contents.push({
      inlineData: { data: base64Image, mimeType },
    });

    const response = await this.ai.models.generateContent({
      model,
      contents,
    });
    return response.text;
  }

  /**
   * Generate content from document and optional prompt
   * @param {Buffer} documentBuffer
   * @param {string} mimeType
   * @param {string} [prompt]
   * @param {string} [modelOverride]
   * @returns {Promise<string>}
   */
  async generateFromDocument(documentBuffer, mimeType, prompt, modelOverride) {
    const model = modelOverride || config.geminiModel;
    const base64Document = documentBuffer.toString('base64');
    const defaultPrompt = 'Tolong buat ringkasan dari dokumen berikut.';
    
    const contents = [
      { text: (prompt && prompt.trim()) ? prompt.trim() : defaultPrompt },
      {
        inlineData: { data: base64Document, mimeType },
      },
    ];

    const response = await this.ai.models.generateContent({
      model,
      contents,
    });
    return response.text;
  }
}

module.exports = new GeminiService();
