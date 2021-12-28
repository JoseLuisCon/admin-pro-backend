const bcrypt = require('bcryptjs/dist/bcrypt');
const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const  Usuario  = require('../models/usuario');


const login = async (req, res= response)=>{

    const { email, password } = req.body;

    try {
        
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Email no válido'
            })

        }

        // Verificar contraseña

        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            })
        }
        
        //TODO: Auntenticación = Generar JWT
        
        const token = await generarJWT( usuarioDB.id );
        
        res.status(200).json({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        })
    }
}


module.exports = {
    login
}