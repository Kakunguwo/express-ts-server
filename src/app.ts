import express, { Application } from 'express';
import cors from "cors";

import healthCheckRoute from "./routes/healthChecker";


const app: Application = express();

app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use("/api/v1/healthCheck", healthCheckRoute)


export { app }