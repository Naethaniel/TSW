const express = require('express');
const router = express.Router();

//Routing
router.get('/',(req, res) => {
    res.render('./index', {title: 'uBuy'});
  });

module.exports = router;