// Este es el verdadero punto de entrada del proyecto.

import app from './app'

const port = process.env.PORT

app.listen(port, ()=>{
    console.log(`Servidor corriendo en puerto ${port}`);
    
})