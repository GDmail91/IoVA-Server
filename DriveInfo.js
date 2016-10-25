/**
 * Created by YS on 2016-10-25.
 */
var DriveInfo = function() {
}

DriveInfo.prototype.init = function(user_id, drive_id) {
	this.user_id = user_id;
	this.drive_id =  drive_id;
	return this;
} 
DriveInfo.prototype.initByString = function(string) {
	var parsedString = string.split('|');
	var driveInfo = new DriveInfo().init(parsedString[0], parsedString[1]);
	driveInfo.setReqId(parsedString[3]);
	driveInfo.setInfo({
		speed: parsedString[4], 
		front: parsedString[5], 
		back: parsedString[6], 
		lat: parsedString[7], 
		lon: parsedString[8]
	});

	return driveInfo;
}

DriveInfo.prototype.user_id = null;
DriveInfo.prototype.drive_id = null;
DriveInfo.prototype.request_id = null;
DriveInfo.prototype.speed = null;
DriveInfo.prototype.front = null;
DriveInfo.prototype.back = null;
DriveInfo.prototype.lat = null;
DriveInfo.prototype.lon = null;
DriveInfo.prototype.time = null;

// Method
DriveInfo.prototype.setInfo = function(obj) {
	this.speed= obj.speed;
	this.front= obj.front;
	this.back= obj.back;
	this.lat= obj.lat;
	this.lon= obj.lon;
	this.time= Date.now();
}

DriveInfo.prototype.setReqId = function(id) {
	this.request_id = id;
	return this.toString();
}

DriveInfo.prototype.toString = function() {
  return this.user_id+"|"+this.drive_id+"|"+this.request_id+"|"+this.speed+
    "|"+this.front+"|"+this.back+"|"+this.lat+"|"+this.lon+"|"+this.time;
};

module.exports = DriveInfo;