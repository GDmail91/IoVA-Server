/**
 * Created by YS on 2016-10-31.
 */
var DangerSchema = require('./dangerSchema');

/**
 * To saving danger information of my drive
 * @param obj - key : {user_id : Number, drive_id : Number}, lat : Number, lon : Number, act : String
 * @param callback(err, insert_id)
 */
exports.saveDangerInfo = function(obj, callback) {
    var dangerModel = new DangerSchema();

    dangerModel.key.user_id = obj.user_id;
    dangerModel.key.drive_id = obj.drive_id;
    dangerModel.location = [obj.lon, obj.lat];
    dangerModel.act = obj.act;

    dangerModel.save(function(err){
        if(err){
            console.error(err);
            return callback(err);
        }

        callback(null, dangerModel._id);

    });
};

/**
 * To get Information in range of obj's max
 * @param obj - limit : Number, max : Number, lon : Number, lat : Number
 * @param callback(err, locations)
 */
exports.getDistance = function (obj, callback) {

    var limit = 10;

    // get the max distance or set it to 8 kilometers
    var maxDistance = obj.max || 1;

    // we need to convert the distance to radians
    // the raduis of Earth is approximately 6371 kilometers
    maxDistance /= 6371;

    // get coordinates [ <longitude> , <latitude> ]
    var coords = [];
    coords[0] = obj.lon;
    coords[1] = obj.lat;

    // find a location
    DangerSchema.find({
        location: {
            $near: coords,
            $maxDistance: maxDistance
        }
    }).limit(limit).exec(function(err, locations) {
        if (err) {
            return callback(err);
        }

        callback(null, locations);
    });
};
