var express = require('express');
var router = express.Router();
const mongoose=require("mongoose");
const dotnev=require("dotnev");
const helmet=require("helmet");
const morgan=require("morgan");

dotnev.config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
