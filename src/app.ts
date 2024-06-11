import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'

dotenv.config()

const app = express()

app.use(express.json())

//Routes

// autenticacion
app.use('/auth', authRoutes)
app.use('/users', userRoutes)

// user

export default app