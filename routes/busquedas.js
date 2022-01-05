// Ruta: /api/todo

const { Router } = require('express');

const { busquedaTotal, busquedaPorColeccion } = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');




const router = Router();



router.get('/:param', validarJWT, busquedaTotal)

router.get('/coleccion/:tabla/:param', validarJWT, busquedaPorColeccion)



module.exports = router; 