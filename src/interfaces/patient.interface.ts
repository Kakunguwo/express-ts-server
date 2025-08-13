export interface IPatient {
    _id?: string;
    addedBy: string;
    name: string;
    email: string;
    gender: 'male' | 'female';
    condition?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreatePatientRequest {
    name: string;
    email: string;
    gender: 'male' | 'female';
    condition?: string;
}

export interface PatientResponse {
    message: string;
    success: boolean;
    data?: IPatient;
}
