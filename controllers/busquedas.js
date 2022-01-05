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

const busquedaPorColeccion = async (req, res = response) => {
    
    const param  = req.params.param;
    const coleccion  = req.params.tabla;
    const regex = new RegExp( param,'i') 
    let data = [];


    
    try {
        
        switch (coleccion) {
            case 'medicos':
                data = await Medico.find({nombre: regex})
                                        .populate('usuario', 'nombre img')
                                        .populate('hospital', 'nombre img');
                break;
            case 'hospitales':
                data = await Hospital.find({nombre: regex})
                                        .populate('usuario', 'nombre img');
              
                break;
            case 'usuarios':
                data = await Usuario.find({nombre: regex});
                
                break;
        
            default:

                return res.status(400).json({
                    ok: false,
                    msg: 'La coleccion tiene que ser usuarios/medicos/hospitales'
                })
                
                
            }        
            
            res.status(200).json({
                ok: true,
                data
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
    busquedaTotal,
    busquedaPorColeccion
}


