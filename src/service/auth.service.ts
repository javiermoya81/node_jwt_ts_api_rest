// servicio para generar token jwt

import { User } from "../models/user.interface"
import jwt from 'jsonwebtoken'

// palabra secreta para generar token
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'

//funcion para generar token. Se llama en authContoller
export const generateToken =(user:User):string =>{ // recibe como param un usuario
    return jwt.sign({id:user.id, email: user.email}, JWT_SECRET, {expiresIn: '1h'}) // funcion sign propia de jwt pasamos obj usuario, secreto, duracion
}