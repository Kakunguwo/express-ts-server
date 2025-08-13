import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { addPatient, getPatients, getPatientById } from '../controllers/patients';

const router = Router();

// All patient routes require authentication
router.use(authMiddleware);

// POST /api/patients - Add a new patient
router.post('/', addPatient);

// GET /api/patients - Get all patients for authenticated user
router.get('/', getPatients);

// GET /api/patients/:id - Get specific patient by ID
router.get('/:id', getPatientById);

export default router;
