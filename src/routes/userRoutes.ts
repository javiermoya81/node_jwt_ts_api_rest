// rutas autenticacion para manejo de usuario

import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/usersController'

const router = express.Router()
const jwt_secret = process.env.JWT_SECRET || 'default-secret'

//Middleware de JWT para ver si estamos autenticados
const authenticateToken = (req:Request, res:Response, next:NextFunction)=>{
    const authHeader = req.headers['authorization'] //capturar los datos que vienen en el header de la req
    const token = authHeader && authHeader.split(' ')[1] //tomar el toquen
    
    if(!token){
        return res.status(401).json({error: 'No autorizado.'})
    }

    //importamos jwt de jsonwebtoken y usamos su funcion verify que lleba como param el token obtenido, la palabra secreta de la env y una callback
    jwt.verify(token, jwt_secret, (err, decoded)=>{
        if(err){
            console.error('Error en la autenticación: ', err);
            res.status(403).json({error: 'No tiene autorización.'})            
        }

        next()
    })
} 

router.post('/', authenticateToken,createUser)
router.get('/',authenticateToken,getAllUsers)
router.get('/:id',authenticateToken,getUserById)
router.put('/:id',authenticateToken, updateUser)
router.delete('/:id',authenticateToken,deleteUser)

export default router;