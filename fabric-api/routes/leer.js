const express = require('express');
const router = express.Router();
const { leerJson } = require('../controllers/leerController');

router.get('/:txid', leerJson);

module.exports = router;
