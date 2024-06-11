import { hash } from "crypto";
import { Request, Response } from "express";
import { compareHash, hashPassword } from "../service/password.service";
import prisma from '../models/user.prisma'
import { generateToken } from "../service/auth.service";
import { error } from "console";

//controlador del registro
export const register = async(req:Request, res:Response):Promise<void>=>{ // al estar trabajando con ts necesitamos pasarle el tipado
    
    const {email, password} = req.body

    try {

        //manejo de error por falta de mail o pass y asi evitar que pase por el hash
        if(!email || !password){
            res.status(400).json({error:'Email y contraseña son obligatorios'})
            return
        }

        const hashedPassword = await hashPassword(password) //funcion traida de service
        const user = await prisma.create( //creo un usuario de prisma. Es una instancia de prisma para poder conectarnos a una db sql
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        )

        // pasar token para que una vez registrado ingrese al sitio
        const token = generateToken(user) // funcion traida de service

        res.status(201).json({token})

    } catch (error:any) {
        if(error?.code === 'P2002' && error?.meta?.target?.includes('email')){
            res.status(400).json({message: 'El mail ingresado ya se encuentra registrado.'})
        }

        console.log(error);
        res.status(500).json({error: 'Hubo un error en el registro'})
    }
}

//Controlador del login
export const login = async(req:Request, res:Response):Promise<void>=>{
    
    const {email, password} = req.body

    try {
        
        if (!email || !password){
            res.status(404).json({error: 'Email y password son obligatorios'})
            return
        }

        const userRegister = await prisma.findUnique({where: {email}}) // metodo propio de prisma para buscar un elemento en la db
        if(!userRegister){
            res.status(404).json({error: 'Usuario inexistente'})
            return
        }

        //Si el usuario esta registrado hacemos la comparacion de los hash
        const passwordMatch = await compareHash(password, userRegister.password)//  servicio de password que compara
        if(!passwordMatch){
            res.status(401).json({ error: 'Usuario o contraseña incorrecto.'})
            return
        }
        
        const token = generateToken(userRegister)
        res.status(200).json({token})
    
    } catch (error) {
        console.log('Eror: ', error);
        
    }
}