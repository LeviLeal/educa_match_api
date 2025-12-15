import "reflect-metadata";
import express, { Request, Response } from "express"
import cors from 'cors'
import AppDataSource from "./AppDataSource"

import AutenticateRoute from "./routes/authRoute"
import SkillsRoute from "./routes/skillRoute"

const app = express()

app.use(express.json())
app.use(cors())

AppDataSource.initialize().then(() => {

    const PORT = 3000

    app.listen(PORT, () => {
        console.log(`Server running on address http://localhost:${PORT}/`)

        app.get("/", (req: Request, res: Response) => {
            return res.json({
                status: "OK",
            });
        })

        app.use("/authenticate/", AutenticateRoute)
        app.use("/skills/", SkillsRoute)

    })
}).catch((error) => {
    console.log(`Initializing server error: ${error}`)
})


