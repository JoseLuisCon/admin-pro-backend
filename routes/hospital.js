// Ruta: /api/hospital

const { Router } = require ('express');
const { check } = require('express-validator');
const { validarCampos } = require ('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { crearHospital, getHospital, modificarHospital, borrarHospital } = require('../controllers/hospital');

const router = Router();

router.get( '/', getHospital);


router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos

], crearHospital);

router.put( '/:id',
    [
        validarJWT,
        check('id', 'El id no es un IdMongo correcto').isMongoId(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    modificarHospital
);

router.delete( '/:id',
    [
        validarJWT,
        check('id', 'El id no es un IdMongo correcto').isMongoId(),
        validarCampos
    ]
    ,
    borrarHospital
);


module.exports = router; 