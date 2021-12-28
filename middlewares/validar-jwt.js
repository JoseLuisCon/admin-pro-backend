
const {request, response } = require('express');

const jwt = require('jsonwebtoken');


const validarJWT = (req = request, res =response, next) =>{

    //TODO: Leer el token

    const  token  = req.header('x-token');

    if (!token) {  //SI NO HAY TOKEN EN EL HEADER
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify( token, process.env.JWT_SECRET);

        req.uid = uid; //añadimos a la request el uid autenticado
        
        next();
    } catch (error) {

        return res.status(401).json({
            ok: false,
            msg: 'Token no es válido'
        })
        
    }




}


module.exports = {
    validarJWT
}