/**
 * Created by YS on 2016-11-02.
 */
var credentials = require('../../credentials');
var mysqlSetting = require('./mysqlSetting');

var dangerLevelModel = {

    getLevel : function(zone_name) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [zone_name];
                        var sql = "SELECT danger_level " +
                            "FROM danger_level " +
                            "WHERE zone_name = ? ";
                        context.connection.query(sql, select, function (err, rows) {

                            if (err) {
                                var error = new Error("Failed get danger levels");
                                error.status = 500;
                                console.error(err);
                                context.connection.rollback();
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

    updateCounter : function(zone_name, danger_counter) {
        var danger_level = 0;
        if (typeof danger_counter == 'undefined') danger_counter = 0;

        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var select = [zone_name];
                        var sql = "SELECT danger_level, danger_counter " +
                            "FROM danger_level " +
                            "WHERE zone_name = ?";
                        context.connection.query(sql, select, function (err, rows) {
                            if (err) {
                                var error = new Error("Failed get danger levels");
                                error.status = 500;
                                console.error(err);
                                context.connection.rollback();
                                return rejected(error);
                            } else if (rows.length == 0) {
                                context.result = {};
                                return resolved(context);
                            }

                            danger_counter += rows[0].danger_counter;
                            // TODO danger_counter 의 평균 값 구할 것
                            if (danger_counter > 200) {
                                danger_level = 3;
                            } else if (danger_counter > 100) {
                                danger_level = 2;
                            } else if (danger_counter > 50) {
                                danger_level = 1;
                            }

                            return resolved(context);
                        });
                    });
                })
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [zone_name, danger_level, danger_counter, danger_level, danger_counter];
                        var sql = "INSERT INTO danger_level SET " +
                            "zone_name = ?," +
                            "danger_level = ?," +
                            "danger_counter = ? " +
                            "ON DUPLICATE KEY UPDATE " +
                            "danger_level = ?, " +
                            "danger_counter = ?";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("Failed zone update");
                                error.status = 500;
                                console.error(err);
                                context.connection.rollback();
                                return rejected(error);
                            }

                            context.result = danger_level;
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

module.exports = dangerLevelModel;