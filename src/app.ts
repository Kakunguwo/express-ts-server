import express, { Application } from 'express';
import cors from "cors";

import healthCheckRoute from "./routes/healthChecker";
import { errorHandler, notFound } from './middleware/error';


const app: Application = express();


app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use("/api/v1/healthCheck", healthCheckRoute)

app.use(notFound);
app.use(errorHandler);


export { app }