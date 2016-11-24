/**
 * Created by YS on 2016-11-09.
 */
var credentials = require('../../credentials');
var mysqlSetting = require('./mysqlSetting');

var driveInfoModel = {
    insert : function(access_token, drive_info) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [access_token,
                            drive_info.drive_id,
                            drive_info.request_id,
                            drive_info.vehicle_speed,
                            drive_info.front_distance,
                            drive_info.back_distance,
                            drive_info.side_distance,
                            drive_info.gps_latitude,
                            drive_info.gps_longitude,
                            drive_info.measure_time];
                        var sql = "INSERT INTO drive_info SET " +
                            "drive_user_id = (SELECT user_id FROM users WHERE access_token = ?), " +
                            "drive_id = ?," +
                            "request_id = ?," +
                            "vehicle_speed = ?," +
                            "front_distance = ?," +
                            "side_distance = ?," +
                            "back_distance = ?," +
                            "gps_latitude = ?," +
                            "gps_longitude = ?," +
                            "measure_time = ? ";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("Failed insert information");
                                error.status = 500;
                                console.error(err);
                                context.connection.rollback();
                                mysqlSetting.releaseConnection(context);
                                return rejected(error);
                            }

                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(mysqlSetting.releaseConnection)
                .then(function(data) {
                    return resolved(data);
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

};

module.exports = driveInfoModel;