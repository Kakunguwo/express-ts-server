import { Schema, model } from "mongoose";

const patientSchema = new Schema({
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    condition: {
        type: String,
    }
}, { timestamps: true })

const Patient = model("Patient", patientSchema);

export default Patient;