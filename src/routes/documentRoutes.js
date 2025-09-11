// /backend/src/routes/documentRoutes.js

import express from 'express';
import multer from 'multer';
import { processDocument, getDocumentHistory } from '../controllers/documentController.js';

// This is the definitive, correct import path based on your file structure
import { verifyJWT  } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Configure multer for temporary file storage
const upload = multer({ dest: 'uploads/' });

// Defines the route for processing a new document
// Full path will be: POST /api/v1/documents/process
router.post('/process', verifyJWT , upload.single('document'), processDocument);

// Defines the route for fetching the user's document history
// Full path will be: GET /api/v1/documents/history
router.get('/history', verifyJWT , getDocumentHistory);

export default router;