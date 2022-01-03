const {response} = require('express');



const Hospital = require('../models/hospital');



const getHospital = async (req, res)=>{

    const hospitales = await Hospital.find().populate('usuario', 'nombre email');
    
    res.json({
        ok: true,
        hospitales
    });
}

const crearHospital = async (req, res = response)=>{
    
    const { nombre } = req.body;

    const uid = req.uid;

    console.log(uid);

    try {

        const nameHospital = await Hospital.findOne({ nombre });        
        if (nameHospital){
            return res.status(400).json({
                ok: false,
                msg: `El Hospital: ${nameHospital.nombre} ya existe en la base de datos`
            })
        }
        
        
        const newHospital = new Hospital(req.body);
        newHospital.usuario = uid;
        
        
        //guardar Hospital
        await newHospital.save();

          
        res.json({
         ok: true,
         newHospital
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado... revisar logs"
        });
    }

}

const modificarHospital = async (req, res= response)=>{

    const id = req.params.id;
    

    try {

        const hospitalDB = await Hospital.findById(id);
       
        if (!hospitalDB){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ese Hospital con ese Id'
            })
        }

            
        
       const hospitalActualizado = await Hospital.findByIdAndUpdate( id, req.body, {new: true} );

        res.json({
            ok: true,
            hospitalActualizado
        })
        
    } catch (error) {

        console.log(error);
        
        res.status(500).json({
            ok:false,
            msg: 'Error inexperado'
        })

    }

}

const borrarHospital = async(req, res = response) =>{
    
    const id = req.params.id;

    try {

        const hospitalId  = await Hospital.findById(id);
            
        if (!hospitalId){

            return res.status(404).json({
                ok: false,
                msg: 'El id del Hospital no existe en la base de datos'
            })

        }

        
        await Hospital.findByIdAndDelete(id);

        res.status(200).json({
            ok: true,
            msg: `El Hosptial ${hospitalId.nombre} ha sido borrado`
        })
         
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'})
    }
}

module.exports = {

    getHospital,
    crearHospital,
    modificarHospital,
    borrarHospital

}