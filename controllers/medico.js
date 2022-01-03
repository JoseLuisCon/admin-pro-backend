const {response} = require('express');



const Medico = require('../models/medico');



const getMedicos = async (req, res)=>{

    const medicos = await Medico.find()
                        .populate('usuario', 'nombre email')
                        .populate('hospital', 'nombre');
    
    res.json({
        ok: true,
        medicos
    });
}

const crearMedico = async (req, res = response)=>{
    
    const { nombre, hospital } = req.body;
    const uid = req.uid;

    try {

        const nameMedico = await Medico.findOne({ nombre });        
        if (nameMedico){
            return res.status(400).json({
                ok: false,
                msg: `El Medico: ${nameMedico.nombre} ya existe en la base de datos`
            })
        }
        
        
        const newMedico = new Medico(req.body);
        newMedico.usuario = uid;
        newMedico.hospital = hospital;
           
        
        //guardar Medico
        await newMedico.save();

          
        res.json({
         ok: true,
         newMedico
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado... revisar logs"
        });
    }

}

const modificarMedico = async (req, res= response)=>{

    const id = req.params.id;
    

    try {

        const medicoDB = await Medico.findById(id);
       
        if (!medicoDB){
            return res.status(400).json({
                ok: false,
                msg: 'No existe el Médico con ese Id'
            })
        }

            
        
       const medicoActualizado = await Medico.findByIdAndUpdate( id, req.body, {new: true} );

        res.json({
            ok: true,
            medicoActualizado
        })
        
    } catch (error) {

        console.log(error);
        
        res.status(500).json({
            ok:false,
            msg: 'Error inexperado'
        })

    }

}

const borrarMedico = async(req, res = response) =>{
    
    const id = req.params.id;

    try {

        const medicoId  = await Medico.findById(id);
            
        if (!medicoId){

            return res.status(404).json({
                ok: false,
                msg: 'El id del médico no existe en la base de datos'
            })

        }

        
        await Medico.findByIdAndDelete(id);

        res.status(200).json({
            ok: true,
            msg: `El médico ${medicoId.nombre} ha sido borrado`
        })
         
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'})
    }
}

module.exports = {

    getMedicos,
    crearMedico,
    modificarMedico,
    borrarMedico

}