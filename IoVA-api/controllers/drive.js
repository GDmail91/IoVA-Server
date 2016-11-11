/**
 * Created by YS on 2016-11-09.
 */
var driveInfoModel = require('../models/driveInfoModel');
var safeScoreModel = require('../models/safeScoreModel');
var lastDriveModel = require('../models/lastDriveModel');

/**
 * @type {{
 *  getLocationLevel: module.exports.getLocationLevel
 *  postDangerPoint: module.exports.postDangerPoint
 * }}
 */
module.exports = {

    postDriveInfo: function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        var drive_datas;
        var safe_score;

        var formidable = require('formidable');
        var form = new formidable.IncomingForm();

        // 파일 폼 파싱 ##
        form.parse(req, function(err, fields, files) {
            if(err) return next();

            (function() {
                return new Promise(function(resolved, rejected) {
                    var fs = require('fs');
                    var driveBuffer = new Buffer(0);

                    // Read in the file, convert it to base64
                    var driveFileStream = fs.createReadStream(files.raw_drive_data.path);

                    driveFileStream.on('error', function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                    driveFileStream.on('data', function (data) {
                        driveBuffer = Buffer.concat([driveBuffer, data]);
                    });
                    driveFileStream.on('end', function() {
                        drive_datas = JSON.parse(driveBuffer);
                        return resolved();
                    });
                });
            })()
                .then(function() {
                    return new Promise(function(resolved, rejected) {
                        var fs = require('fs');
                        var scoreBuffer = new Buffer(0);

                        // Read in the file, convert it to base64
                        var scoreFileStream = fs.createReadStream(files.raw_score_data.path);

                        scoreFileStream.on('error', function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                        scoreFileStream.on('data', function (data) {
                            scoreBuffer = Buffer.concat([scoreBuffer, data]);
                        });
                        scoreFileStream.on('end', function () {
                            safe_score = JSON.parse(scoreBuffer);
                            resolved();
                        });
                    });
                })
                .then(function() {
                    return new Promise(function(resolved, rejected) {
                        var count = 0;
                        drive_datas.forEach(function (drive_data, index) {
                            driveInfoModel.insert(data.access_token, drive_data)
                                .then(function (result) {
                                    if (++count == drive_datas.length) {
                                        resolved(drive_data);
                                    }
                                })
                                .catch(function (err) {
                                    res.statusCode = 500;
                                    return res.json({
                                        msg: "Error on insert data. Please check your data",
                                        data: {
                                            error_index: index
                                        }
                                    });
                                });
                        });
                    });
                })
                .then(function(last_data) {
                    return new Promise(function(resolved, rejected) {
                        lastDriveModel.update(data.access_token, last_data)
                            .then(resolved)
                            .catch(next);
                    });
                })
                .then(function() {
                    safe_score.forEach(function(each_score, index) {
                        safeScoreModel.insert(data.access_token, each_score)
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
                    });
                })
                .catch(next);
        });
    },

    getLastIndex: function(req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        lastDriveModel.selectLastIndex(data.access_token)
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