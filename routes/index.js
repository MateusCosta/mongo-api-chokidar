const express = require('express');

const router = new express.Router();

router.get('/main', (req, res) => {
  res.send('Retorno da rota');
});



module.exports = router;