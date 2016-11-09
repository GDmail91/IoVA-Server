/**
 * Created by YS on 2016-11-09.
 */
var driveInfoModel = require('../models/driveInfoModel');

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
            drive_raw_data: req.body.drive_raw_data
        };

        var drive_datas = JSON.parse(data.drive_raw_data);
        var error_index = [];
        drive_datas.forEach(function(drive_data, index) {
            driveInfoModel.insert(data.access_token, drive_data)
                .catch(function(result) {
                    error.push(error_index);
                });
        });

        if (error_index.length > 0) {
            res.statusCode = 500;
            return res.json({
                msg: "Error on insert data. Please check index",
                data: {
                    error_index: error_index
                }
            });
        }

        res.statusCode = 200;
        return res.json({
            msg: "Completed insert",
            data: {
                insert_length: drive_datas.length
            }
        });
    }
};