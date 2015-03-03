var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = Schema({
	name :String,
	head :String,
	title : String,
	tags: String,
	content: String,
	createTime: Date,
	modifyTime: Date,
	createdBy:String,
	user:String,
	comments:[],
});

module.exports = mongoose.model('Post', PostSchema);