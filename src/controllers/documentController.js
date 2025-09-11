// /controllers/documentController.js
import asyncHandler from 'express-async-handler';
import { spawn } from 'child_process';
import fs from 'fs';
import Document from '../models/documentModel.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Gemini Summarization Service ---
const getSummaryFromGemini = async (text) => {
  if (!text || text.trim() === '') return 'No text provided for summarization.';
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Summarize the following text extracted from a document: "${text}"`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Summary generation failed.';
  }
};

// --- OCR Python Script Runner ---
const runOCR = (filePath) => {
  return new Promise((resolve, reject) => {
    // Path is relative to the backend's root directory
    const pythonProcess = spawn('python', ['./services/ocr.py', filePath]); 
    let resultJson = '';
    let errorLog = '';
    pythonProcess.stdout.on('data', (data) => (resultJson += data.toString()));
    pythonProcess.stderr.on('data', (data) => (errorLog += data.toString()));
    pythonProcess.on('close', (code) => {
      if (code !== 0) return reject(new Error(errorLog));
      try {
        resolve(JSON.parse(resultJson));
      } catch (e) {
        reject(new Error('Failed to parse JSON from OCR script.'));
      }
    });
  });
};

// --- Controller Functions ---

// @desc    Process a new document via OCR and Summary
// @route   POST /api/documents/process
// @access  Private
export const processDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded.');
  }

  const { path: filePath, originalname } = req.file;

  try {
    const ocrResult = await runOCR(filePath);
    if (ocrResult.error) throw new Error(ocrResult.error);

    const summary = await getSummaryFromGemini(ocrResult.extracted_text);

    const newDocument = await Document.create({
      user: req.user._id, // req.user comes from the protect middleware
      originalFilename: originalname,
      extractedText: ocrResult.extracted_text,
      summary: summary,
      processedImage: ocrResult.extracted_image,
    });

    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500);
    throw new Error(`Processing failed: ${error.message}`);
  } finally {
    // Clean up the temporary file
    fs.unlink(filePath, () => {});
  }
});

// @desc    Get the logged-in user's document history
// @route   GET /api/documents
// @access  Private
export const getDocumentHistory = asyncHandler(async (req, res) => {
    const documents = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(documents);
});