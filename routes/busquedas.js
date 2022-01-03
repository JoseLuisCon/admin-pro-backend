// Ruta: /api/todo

const { Router } = require('express');

const { busquedaTotal } = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');




const router = Router();



router.get('/:param', validarJWT, busquedaTotal)



module.exports = router; 