/**
 * Created by YS on 2016-11-02.
 */
var dangerLevelModel = require('../models/dangerLevelModel');
var dangerPointModel = require('../models/dangerInfoModel');

/**
 *
 * @type {{
 *  getLocationLevel: module.exports.getLocationLevel
 *  postDangerPoint: module.exports.postDangerPoint
 * }}
 */
module.exports = {

    getLocationLevel: function (req, res, next) {
        var data = {
            zone_name: req.params.zone_name
        };

        dangerLevelModel.getLevel(data.zone_name)
            .then(function(result) {
                res.statusCode = 200;
                res.json({
                    msg: "Send zone level",
                    data: {
                        zone_name: data.zone_name,
                        level: result
                    }
                });
            })
            .catch(next);
    },

    postDangerPoint: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            zone_name: req.params.zone_name,
            lat: req.body.lat,
            lon: req.body.lon,
            type: req.body.type
        };

        dangerPointModel.insert(data.access_token, data.zone_name, data.lat, data.lon, data.type)
            .then(function(result) {
                data.level = result;
                return dangerLevelModel.updateCounter(data.zone_name, result)
            })
            .then(function(result) {
                res.statusCode = 200;
                res.json({
                    msg: "Completed insert",
                    data: {
                        zone_name: data.zone_name,
                        level: result
                    }
                });
            })
            .catch(next);
    }
};