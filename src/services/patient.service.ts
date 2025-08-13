import Patient from '../models/patient.model';
import { IPatient, CreatePatientRequest } from '../interfaces/patient.interface';

export class PatientService {
    /**
     * Check if a patient with the same details already exists
     */
    async findExistingPatient(name: string, email: string): Promise<IPatient | null> {
        return await Patient.findOne({
            name: name.trim().toLowerCase(),
            email: email.trim().toLowerCase()
        });
    }

    /**
     * Create a new patient
     */
    async createPatient(patientData: CreatePatientRequest, userId: string): Promise<IPatient> {
        const newPatient = await Patient.create({
            addedBy: userId,
            name: patientData.name.trim(),
            email: patientData.email.trim().toLowerCase(),
            gender: patientData.gender,
            condition: patientData.condition?.trim() || ''
        });

        if (!newPatient) {
            throw new Error('Failed to create patient');
        }

        return newPatient.toObject({
            transform: (doc, ret) => {
                ret._id = ret._id.toString();
                return ret;
            }
        });
    }

    /**
     * Get all patients for a specific user
     */
    async getPatientsByUser(userId: string): Promise<IPatient[]> {
        return await Patient.find({ addedBy: userId })
            .populate('addedBy', 'name email')
            .sort({ createdAt: -1 });
    }

    /**
     * Get a patient by ID
     */
    async getPatientById(patientId: string, userId: string): Promise<IPatient | null> {
        return await Patient.findOne({ _id: patientId, addedBy: userId });
    }

    /**
     * Update a patient
     */
    async updatePatient(
        patientId: string,
        userId: string,
        updateData: Partial<CreatePatientRequest>
    ): Promise<IPatient | null> {
        return await Patient.findOneAndUpdate(
            { _id: patientId, addedBy: userId },
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    /**
     * Delete a patient
     */
    async deletePatient(patientId: string, userId: string): Promise<boolean> {
        const result = await Patient.findOneAndDelete({ _id: patientId, addedBy: userId });
        return !!result;
    }
}
