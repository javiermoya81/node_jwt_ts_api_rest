// rutas autenticacion para login y registro

import express from 'express'
import { login, register } from '../controllers/authController';

const router = express.Router()

router.post('/register', register) // register: controlador exportado
router.post('/login', login) // login: controlador exportado

export default router;