const express = require('express');
const router = express.Router();
const casoController = require('../controllers/casoController');

router.get('/daily', casoController.getDailyCaso);
router.post('/daily/mandado', casoController.validarMandadoDiario); 

router.get('/rank/:rank', casoController.getCasosPorRank);
router.get('/:id', casoController.getCasoPorId);
router.post('/:id/mandado', casoController.validarMandado);

module.exports = router;