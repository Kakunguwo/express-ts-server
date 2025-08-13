import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import { CreatePatientRequest, PatientResponse } from "../interfaces/patient.interface";
import { validatePatientInput, ValidationError } from "../lib/validators/patient.validator";
import { PatientService } from "../services/patient.service";

const patientService = new PatientService();

/**
 * Add a new patient
 * @route POST /api/patients
 * @access Private
 */
export const addPatient = async (
    req: AuthenticatedRequest,
    res: Response<PatientResponse>,
    _next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                message: "User authentication required",
                success: false
            });
            return;
        }

        const patientData: CreatePatientRequest = req.body;

        // Validate input data
        validatePatientInput(patientData);

        // Check for existing patient
        const existingPatient = await patientService.findExistingPatient(
            patientData.name,
            patientData.email
        );

        if (existingPatient) {
            res.status(409).json({
                message: "Patient with these details already exists",
                success: false
            });
            return;
        }

        // Create new patient
        const newPatient = await patientService.createPatient(patientData, userId);

        res.status(201).json({
            message: "Patient successfully added",
            success: true,
            data: newPatient
        });

    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({
                message: error.message,
                success: false
            });
            return;
        }

        console.error("Error adding patient:", error);
        res.status(500).json({
            message: "Internal server error while adding patient",
            success: false
        });
    }
};

/**
 * Get all patients for the authenticated user
 * @route GET /api/patients
 * @access Private
 */
export const getPatients = async (
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                message: "User authentication required",
                success: false
            });
            return;
        }

        const patients = await patientService.getPatientsByUser(userId);

        res.status(200).json({
            message: "Patients retrieved successfully",
            success: true,
            data: patients,
            count: patients.length
        });

    } catch (error) {
        console.error("Error retrieving patients:", error);
        res.status(500).json({
            message: "Internal server error while retrieving patients",
            success: false
        });
    }
};

/**
 * Get a specific patient by ID
 * @route GET /api/patients/:id
 * @access Private
 */
export const getPatientById = async (
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({
                message: "User authentication required",
                success: false
            });
            return;
        }

        const patient = await patientService.getPatientById(id, userId);

        if (!patient) {
            res.status(404).json({
                message: "Patient not found",
                success: false
            });
            return;
        }

        res.status(200).json({
            message: "Patient retrieved successfully",
            success: true,
            data: patient
        });

    } catch (error) {
        console.error("Error retrieving patient:", error);
        res.status(500).json({
            message: "Internal server error while retrieving patient",
            success: false
        });
    }
};