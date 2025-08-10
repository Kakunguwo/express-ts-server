import { app } from "./app";
import dotenv from "dotenv";

dotenv.config({
    path: '../.env'
})

const PORT = process.env.PORT || 8001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))