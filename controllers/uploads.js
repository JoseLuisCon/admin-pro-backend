const path = require('path');
const fs = require ('fs');

const response = require ('express');

const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');



const fileUpload = (req, res= response) =>{

    const coleccion = req.params.coleccion;
    const id = req.params.id;

    //VALIDAR TIPO
    const coleccValida = [ 'hospitales', 'medicos', 'usuarios']
    if (!coleccValida.includes(coleccion)){
        return res.status(400).json({
            ok: false,
            msg: 'La colección no es la correcta'
        })
    }
    //VALIDAR QUE EXISTA UN ARCHIVO PARA SUBIR AL SERVIDOR
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo para subir'
        });
      }

    //TODO: PROCESAR LA IMAGEN
      const file = req.files.imagen;

      const nombreCordato = file.name.split('.');
      const extensionArchivo = nombreCordato[nombreCordato.length - 1 ];

    // VALIDAR EXTENSIÓN
      const extesionesValidas = ['png', 'jpg', 'jpeg', 'gif']

      if (!extesionesValidas) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo de archivo no es permitido'
        })
      }

      // Generar el nombre del archivo

      const nombreArchivo = `${ uuidv4() }.${extensionArchivo}`;

      // Path para guardar la imagen

      const path = `./uploads/${coleccion}/${nombreArchivo}`

      // Mover la imagen
        file.mv(path, function(err) {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen al servidor'
            });
        }

      // Actulizar base de datos
        actualizarImagen(coleccion, id, nombreArchivo);

        res.status(200).json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        })
          
  });


   
}

const retornaImagen = (req, res = response) =>{

  const tipo = req.params.coleccion;
  const foto = req.params.foto;

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`)

  // imagen por defecto

  if (fs.existsSync(pathImg)){
    res.sendFile(pathImg);
  }else {
    const pathImg = path.join(__dirname,`../uploads/no-img.jpg`);
    res.sendFile(pathImg)
  }


}


module.exports = {
    fileUpload,
    retornaImagen
}