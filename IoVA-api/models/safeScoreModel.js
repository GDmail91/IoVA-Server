/**
 * Created by YS on 2016-11-09.
 */
var credentials = require('../../credentials');
var mysqlSetting = require('./mysqlSetting');

var driveInfoModel = {
    insert : function(access_token, safe_score) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [access_token,
                            safe_score.drive_id,
                            safe_score.safe_distance_count,
                            safe_score.speeding_count,
                            safe_score.fast_acc_count,
                            safe_score.fast_break_count,
                            safe_score.sudden_start_count,
                            safe_score.sudden_stop_count,
                            safe_score.drive_start,
                            safe_score.drive_stop];
                        var sql = "INSERT INTO safe_score SET " +
                            "score_user_id = (SELECT user_id FROM users WHERE access_token = ?), " +
                            "score_drive_id = ?," +
                            "safe_distance_count = ?," +
                            "speeding_count = ?," +
                            "fast_acc_count = ?," +
                            "fast_break_count = ?," +
                            "sudden_start_count = ?," +
                            "sudden_stop_count = ?," +
                            "drive_start = ?," +
                            "drive_stop = ? ";
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
    }
};

module.exports = driveInfoModel;