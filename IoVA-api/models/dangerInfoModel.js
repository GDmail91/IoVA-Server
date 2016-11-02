/**
 * Created by YS on 2016-11-02.
 */
var credentials = require('../../credentials');
var mysqlSetting = require('./mysqlSetting');

var dangerPointModel = {

    getLevel : function(zone_name) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [zone_name];
                        var sql = "SELECT danger_level " +
                            "FROM DangerLevel " +
                            "WHERE info_zone_name = ? ";
                        context.connection.query(sql, select, function (err, rows) {

                            if (err) {
                                var error = new Error("Failed get danger levels");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if (rows.length == 0) {
                                context.result = {};
                                return resolved(context);
                            }

                            context.result = rows[0].danger_level;
                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(data){
                    return resolved(data);
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    },

    insert : function(access_token, zone_name, lat, lon, type) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [zone_name];
                        var sql = "SELECT zone_name " +
                            "FROM danger_level " +
                            "WHERE zone_name = ?";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("Failed insert information");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if(rows.length == 0) {
                                context.create_flag = true;
                            }

                            return resolved(context);
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        if (context.create_flag) {
                            var insert = [zone_name, access_token, lat, lon, type];
                            var sql = "INSERT INTO danger_level SET " +
                                "zone_name = ?, " +
                                "danger_level = 0," +
                                "danger_counter = 0";
                            context.connection.query(sql, insert, function (err, rows) {
                                if (err) {
                                    var error = new Error("Failed insert information");
                                    error.status = 500;
                                    console.error(err);
                                    return rejected(error);
                                }

                                return resolved(context);
                            });
                        } else {
                            return resolved(context);
                        }
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [zone_name, access_token, lat, lon, type];
                        var sql = "INSERT INTO danger_info SET " +
                            "info_zone_name = ?," +
                            "info_user_id = (SELECT user_id FROM users WHERE access_token = ?)," +
                            "latitude = ?," +
                            "longitude = ?, " +
                            "type = ?";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("Failed insert information");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            return resolved(context);
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [zone_name];
                        var sql = "SELECT COUNT(info_zone_name) AS counter " +
                            "FROM danger_info " +
                            "WHERE info_zone_name = ?";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("Failed count zone point");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            } else if (rows.length == 0) {
                                var error = new Error("No search result");
                                error.status = 500;
                                console.error(err);
                                return rejected(error);
                            }

                            context.result = rows[0].counter;

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

module.exports = dangerPointModel;