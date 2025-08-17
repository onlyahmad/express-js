import express from "express"
import dotenv from "dotenv"
import appMiddleware from "../src/middleware/index.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(appMiddleware)

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`)
})
