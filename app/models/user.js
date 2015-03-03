var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	nickname: String,
	name : String,
	email : String,
	password: String,
	lastLogin:Date,
	createTime : Date,
	modifiedTime :Date,
	telephone : String,
	birthday : String,
	age : Number,
	sex : String,
	address : String,
	role : String
});

UserSchema.methods.findByName = function(name, callback){
	return this.model('User').findOne({name : name}, callback);
};
UserSchema.statics.findByName = function(name, password, callback){
	return this.model('User').findOne({name : name, password : password}, callback);
};

UserSchema.methods.findByIdPsd = function(userid, password, callback){
	return this.model('User').findOne({_id : userid, password : password}, callback);
};
UserSchema.statics.findByIdPsd = function(userid, password, callback){
	return this.model('User').findOne({_id : userid, password : password}, callback);
};

module.exports = mongoose.model('User', UserSchema);