const {response} = require ('express');

const Usuario = require ('../models/usuario');
const Medico = require ('../models/medico');
const Hospital = require ( '../models/hospital');




const busquedaTotal = async (req, res = response) => {

    const  param  = req.params.param;
    const regex = new RegExp( param,'i')

    
    const [usuarios, medicos, hospitales] = await Promise.all(
       [
        Usuario.find({nombre: regex}),
        Medico.find({nombre: regex}),
        Hospital.find({nombre: regex})]
    )

    
    try {
        

        res.status(200).json({
            ok: true,
            usuarios,
            medicos,
            hospitales
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
   

}


module.exports = {
    busquedaTotal
}


