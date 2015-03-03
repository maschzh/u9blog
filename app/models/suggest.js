var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SuggestSchema = new Schema ({
	message : String,
	user : Object,
	createTime : Date
});

module.exports = mongoose.model('Suggest', SuggestSchema);
