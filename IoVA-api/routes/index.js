/**
 * Created by YS on 2016-11-02.
 */
var express = require('express');
var api = require('../controllers');
var router = express.Router();

module.exports = function(){

  // DangerLocation controller
  router.get('/danger_location/:zone_name', api.danger.getLocationLevel);        // 위험 레벨 가져오기
  router.post('/danger_location/:zone_name', api.danger.postDangerPoint);        // 위험 지수 추가하기

  // catch 404 and forward to error handler
  router.all('/', function() {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  return router;
};

