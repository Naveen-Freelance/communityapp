var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserRegistrationSchema = new Schema({
	user_name: {type:String,required:true},
	bussiness_type: {type:String,required:true},
	mobile_number: {type:Number,required:true},
	email: {type:String,required:true,unique: true},
	address: {type:String,required:true},
	business_card: { data: Buffer, contentType: String },
	aadhar_card: { data: Buffer, contentType: String }
});

module.exports = mongoose.model('User', UserRegistrationSchema);