// servicio de hasheo de pass con bcript

import bcrypt from  'bcrypt'

const saltos: number = 10 // cantidad de saltos o vueltas para encriptar 

//funcoin para hashear pass. Se llama en auth controller
export const hashPassword = async (password:string): Promise<string>=>{
    return await bcrypt.hash(password, saltos) // función encriptadora recibe como param pass y vueltas
}

//funcion para comparar hash
export const compareHash = async(password:string, hash:string): Promise<boolean> =>{ //devuelve promesa true o false
    return await bcrypt.compare(password, hash) // funcion de bcrypt para comparar los hash
}