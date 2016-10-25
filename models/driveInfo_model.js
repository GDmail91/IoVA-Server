/**
 * Created by YS on 2016-10-25.
 */
var credentials = require('../credentials');
var mysqlSetting = require('./mysqlSetting');

var driveInfo_model = {

    insert_driveInfo : function (data) {
        // DB에 운행정보 저장
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(function(context) {
                    var insert = [data.user_id, data.drive_id, data.request_id, data.speed, data.front, data.back, data.lat, data.lon, data.time];
                    var sql = "INSERT INTO driveinfo SET "+
                        "user_id = ?, " +
                        "drive_id = ?, "+
                        "request_id = ?, "+
                        "speed = ?, "+
                        "front = ?, "+
                        "back = ?, "+
                        "lat = ?, "+
                        "lon = ?, "+
                        "time = ? ";

                    context.connection.query(sql, insert, function (err, rows) {
                        if (err) {
                            var error = new Error("운행정보 저장 실패");
                            error.status = 500;
                            console.error(err);
                            return rejected(error);
                        } else if(rows.affectedRows == 0) {
                            var error = new Error("저장된 운행정보 없음");
                            error.status = 500;
                            return rejected(error);
                        }
                        
                        context.connection.release();
                        return resolved(rows.insertId);
                    });
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    }
};

module.exports = driveInfo_model;