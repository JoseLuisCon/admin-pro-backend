// Ruta: /api/medico

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require ('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getMedicos, crearMedico, modificarMedico, borrarMedico } = require('../controllers/medico');

const router = Router();

router.get( '/', validarJWT, getMedicos);


router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('hospital', 'El id de Hospital es obligatorio').notEmpty(),
    check('hospital', 'El id del hospital no es un MongoId válido').isMongoId(),
    validarCampos

], crearMedico);

router.put( '/:id',
    [
        validarJWT,
        check('id', 'El id no es un IdMongo correcto').isMongoId(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    modificarMedico
);

router.delete( '/:id',
    [
        validarJWT,
        check('id', 'El id no es un IdMongo correcto').isMongoId(),
        validarCampos
    ]
    ,
    borrarMedico
);


module.exports = router; 