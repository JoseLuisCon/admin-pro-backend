const {response} = require('express');
const bcrypt = require ('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async (req, res)=>{

    const usuarios = await Usuario.find({}, 'nombre email role google');
    
    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    });
}

const crearUsuario = async (req, res = response)=>{
    
    const {password, email } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });        
        if (existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está dado de alta en la base de datos'
            })
        }
        
        const usuario = new Usuario(req.body);

        // Encriptar contraseña

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync ( password, salt );

        //guardar Usuario
        await usuario.save();

        //generar token
        const token = await generarJWT(usuario.uid)
    
        res.json({
         ok: true,
         usuario,
         token

        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado... revisar logs"
        });
    }

}

const modificarUsuario = async (req, res= response)=>{

    const uid = req.params.id;
    

    try {

        const usuarioDB = await Usuario.findById(uid);
       
        if (!usuarioDB){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese usuario con ese Id'
            })
        }

        
        //Actualizaciones
        const {password, google, email, ...campos} = req.body; //quitamos por destructuración los campos que no queremos actualizar
        
        if ( usuarioDB.email !== email){
          
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese Email'
                })
            }
        }
        
        
        
        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new: true} );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
        
    } catch (error) {

        console.log(error);
        
        res.status(500).json({
            ok:false,
            msg: 'Error inexperado'
        })

    }

}

const borraUsuario = async(req, res = response) =>{
    const uid = req.params.id;

    try {

        const usuarioId  = await Usuario.findById(uid);
            
        if (!usuarioId){

            return res.status(404).json({
                ok: false,
                msg: 'El id de Usuario no existe en la base de datos'
            })

        }

        // await Usuario.deleteOne({ _id : uid  });
        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            msg: `El usuario ${usuarioId.nombre} ha sido borrado`
        })
         
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'           })
    }
}

module.exports = {
    borraUsuario,
    crearUsuario,
    getUsuarios,
    modificarUsuario
}