import validator from 'validator';
import { CreatePatientRequest } from '../../interfaces/patient.interface';


export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export const validatePatientInput = (data: CreatePatientRequest): void => {
    const { name, email, gender } = data;

    // Required fields validation
    if (!name?.trim()) {
        throw new ValidationError('Name is required');
    }

    if (!email?.trim()) {
        throw new ValidationError('Email is required');
    }

    if (!gender) {
        throw new ValidationError('Gender is required');
    }

    // Format validation
    if (!validator.isEmail(email)) {
        throw new ValidationError('Invalid email format');
    }

    // Enum validation
    if (!['male', 'female'].includes(gender)) {
        throw new ValidationError('Gender must be either male or female');
    }

    // Length validation
    if (name.trim().length < 2) {
        throw new ValidationError('Name must be at least 2 characters long');
    }

    if (name.trim().length > 50) {
        throw new ValidationError('Name must not exceed 50 characters');
    }
};
