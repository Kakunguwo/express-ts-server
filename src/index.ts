import { app } from "./app";
import dotenv from "dotenv";
import connectDatabase from "./config/db";

dotenv.config({
    path: '../.env'
})

const PORT = process.env.PORT || 8001


connectDatabase()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    })

