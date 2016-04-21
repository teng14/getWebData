var mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.ObjectId;  
  
var articleSchema = new Schema({  
	title: String,
	imgUrl: String,
	mall: String,
	info: String,
	time: String
});  
  
module.exports = mongoose.model('Article', articleSchema);   