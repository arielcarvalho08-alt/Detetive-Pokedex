const express = require('express');
const router = express.Router();
const path = require('path');

const viewsDir = path.resolve(__dirname, '../views');

router.get('/', (req, res) => {
  res.sendFile(path.join(viewsDir, 'index.html'));
});

router.get('/diario', (req, res) => {
  res.sendFile(path.join(viewsDir, 'diario.html'));
});

router.get('/campanha', (req, res) => {
  res.sendFile(path.join(viewsDir, 'campanha.html'));
});

router.get('/investigacao', (req, res) => {
  res.sendFile(path.join(viewsDir, 'caso.html'));
});
  
router.get('/conclusao', (req, res) => {
  res.sendFile(path.join(viewsDir, 'conclusao.html'));
});

module.exports = router;