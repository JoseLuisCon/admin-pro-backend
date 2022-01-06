const bcrypt = require('bcryptjs/dist/bcrypt');
const { response } = require('express');
const { googleVerify } = require('../helpers/google-verify');
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


const loginGoogle = async (req, res= response) =>{

    
    try {
        const {token} = req.body;
        
        const {name, email, picture} = await googleVerify(token);

        // comprobar si ya existe el usuario en la base de datos

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            //no existe creamos uno
            usuario = new Usuario({
                nombre: name, 
                email,
                password: '@@',
                img: picture,
                google: true
            });
            


        }else {
            //existe actualizamos base de datos => google = true
            usuario = usuarioDB;
            usuario.google= true;
            usuario.password = '@@@'
            
        }


        //guardar en DB
        await usuario.save();
        
        //generar TOKEN
        const tokenJWT = await generarJWT(usuario.uid)
        

        res.status(200).json({
            ok: true,
           tokenJWT
        })

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        })
    }

}

module.exports = {
    login,
    loginGoogle
}