// CONTROLADORES DE RUTAS USUARIOS

import { Request, Response } from "express";
import { hashPassword } from "../service/password.service";
import prisma from "../models/user.prisma";
import { log } from "console";

//Controlador Post - creacion de un usuario
export const createUser = async (req:Request, res:Response): Promise<void> => {

    try {
        
        const {email, password} = req.body
        if(!email || !password){
            res.status(400).json({error:'Email y contraseña son obligatorios'})
            return
        }

        const hashedPassword = await hashPassword(password)

        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        )

        res.status(201).json(user)
    } catch (error:any) {
        if (error?.code === 'P2002' && error?.meta?.target.includes('email')){
            res.status(400).json({message: 'El mail ingresado ya existe.'})
        }
        console.log(error);
        res.status(500).json({error: 'Hubo un error en el registro.'})
    }
}


// Controlador Get - Traer todos los usuarios

export const getAllUsers = async (req:Request, res:Response):Promise<void>=>{
    try {
        
        const users = await prisma.findMany()
        res.status(200).json(users)

    } catch (error) {
        
        console.log(error);
        res.status(500).json({error: 'Hubo un error en la busqueda.'})
        
    }
}

// Controlador Get by id - Trae un solo usuario por id

export const getUserById = async (req:Request, res:Response): Promise<void>=>{
    try {
        const userId = parseInt(req.params.id)
        const user = await prisma.findUnique({where:{id: userId}})
        
        if(!user){
            res.status(404).json({error: 'No se halló el usuario.'})
            return
        }

        res.status(200).json(user)
    } catch (error:any) {
        console.log(error);
        res.status(500).json({error: 'Hubo un error. Intente mas tarde.'})
    }
}


// Controlador Put - Actulizar usuario

export const updateUser = async(req:Request, res:Response): Promise<void>=>{

    try {
        
        const userId = parseInt(req.params.id) // tomamos el ide de los parametros de la url
        const {email, password} = req.body // guardamos la pass para hashearla

        let dataToUpdate: any = {...req.body} //creamos la info nueva

        if(password){
            const hashedPassword = await hashPassword(password)
            dataToUpdate.password = hashedPassword
        }

        // if(email){
        //     dataToUpdate.email = email
        // } ver si funciona sin esta linea

        const user = await prisma.update(
            {
                where: {id: userId},
                data: dataToUpdate
            }
        )
        res.status(200).json(user)

    } catch (error: any) {

        if (error?.code === 'P2002' && error?.meta?.target.includes('email')){
            res.status(400).json({message: 'El mail ingresado ya existe.'})
        } else if(error?.code == 'P2025'){
            res.status(404).json('Usuario no encontrado.')
        } else{
            console.log(error);
            res.status(500).json({error: 'Se ha producido un error. Intente nuevamente'})    
        }
    }
}

export const deleteUser = async (req:Request, res:Response): Promise<void>=>{
    try {
        const userId = parseInt(req.params.id)
        await prisma.delete({
            where:{
                id: userId
            }
        })

        res.status(200).json({message: `El usuario ${userId} ha sido eliminado`}).end()

    } catch (error:any) {
        if(error?.code == 'P2025'){
            res.status(404).json('Usuario no encontrado.')
        } else{
            console.log(error);
            res.status(500).json({error: 'Se ha producido un error. Intente nuevamente'})    
        }
    }
}