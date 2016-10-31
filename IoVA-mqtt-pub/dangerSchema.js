/**
 * Created by YS on 2016-10-31.
 */

// MongoDB module
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/iova_db');

var Schema = mongoose.Schema;

var dangerSchema = new Schema({
    key : {
        user_id : { type: Number },
        drive_id : { type: Number }
    },
    location: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'      // create the geospatial index
    },
    act : { type: String }
});

module.exports = mongoose.model('dangerModel', dangerSchema);