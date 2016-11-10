/**
 * Created by YS on 2016-11-09.
 */
var driveInfoModel = require('../models/driveInfoModel');
var safeScoreModel = require('../models/safeScoreModel');

/**
 * @type {{
 *  getLocationLevel: module.exports.getLocationLevel
 *  postDangerPoint: module.exports.postDangerPoint
 * }}
 */
module.exports = {

    postDriveInfo: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            raw_drive_data: req.body.raw_drive_data,
            raw_safe_score: req.body.raw_safe_score
        };

        var drive_datas = JSON.parse(data.raw_drive_data);
        var safe_score = JSON.parse(data.raw_safe_score);
        var count = 0;

        drive_datas.forEach(function(drive_data, index) {
            driveInfoModel.insert(data.access_token, drive_data)
                .then(function(result) {
                    if (++count == drive_datas.length) {
                        safeScoreInsert();
                    }
                })
                .catch(function(err) {
                    res.statusCode = 500;
                    return res.json({
                        msg: "Error on insert data. Please check your data",
                        data: {
                            error_index: index
                        }
                    });
                });
        });

        function safeScoreInsert() {
            safeScoreModel.insert(data.access_token, safe_score)
                .then(function(result) {
                    res.statusCode = 200;
                    return res.json({
                        msg: "Completed insert",
                        data: {
                            insert_length: drive_datas.length
                        }
                    });
                })
                .catch(next);
        }
    },

    getLastIndex: function(req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        driveInfoModel.selectLastIndex(data.access_token)
            .then(function(result) {
                res.statusCode = 200;
                return res.json({
                    msg: "Last Index",
                    data: result
                });
            })
            .catch(next);
    }
};