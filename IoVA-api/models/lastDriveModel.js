/**
 * Created by YS on 2016-11-11.
 */
var credentials = require('../../credentials');
var mysqlSetting = require('./mysqlSetting');
var lastDriveModel = require('./lastDriveModel');

var lastDriveModel = {
    update : function(access_token, drive_info) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [access_token,
                            drive_info.drive_id,
                            drive_info.request_id,
                            drive_info.drive_id,
                            drive_info.request_id];
                        var sql = "INSERT INTO last_drive_index SET " +
                            "last_user_id = (SELECT user_id FROM users WHERE access_token = ?), " +
                            "last_drive_id = ?," +
                            "last_request_id = ? " +
                            "ON DUPLICATE KEY UPDATE " +
                            "last_drive_id = ?," +
                            "last_request_id = ?";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("Failed insert information");
                                error.status = 500;
                                console.error(err);
                                context.connection.rollback();
                                return rejected(error);
                            }

                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(data) {
                    return resolved(data);
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    selectLastIndex : function(access_token) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [access_token];
                        var sql = "SELECT last_drive_id, last_request_id " +
                            "FROM last_drive_index " +
                            "WHERE last_user_id = (SELECT user_id FROM users WHERE access_token = ?) " +
                            "ORDER BY last_drive_id DESC, last_request_id DESC " +
                            "LIMIT 1 ";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("Failed get information");
                                error.status = 500;
                                console.error(err);
                                context.connection.rollback();
                                return rejected(error);
                            } else if (rows.length == 0) {
                                context.result = {};
                                return resolved(context);
                            }

                            context.result = rows[0];
                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(data) {
                    return resolved(data);
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    }
};

module.exports = lastDriveModel;