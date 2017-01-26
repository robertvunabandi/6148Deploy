var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');
// connect to database? WHAT'S THIS?
// mongoose.connect('mongodb://localhost/auth_test');
var chalk = require('chalk');
function pLog(val){
    console.log(chalk.bgYellow(val));
}
var User = new Schema({
	username: {type:String, required:true, unique:true},
	// userPassword: {type:String, required:true},
	email: {type:String, required:true},
	userBirthday: {type:String, required:true},
	userActivity: [String],
    userFolders: [{
        folderName:{type:String, required:true, unique:true},
        listsID:[Number],
        private: Boolean
    }],
	userLists: [{
		listName:{type:String, required:true},
		wordIds:[Number],
		private: Boolean,
        id:Number
	}],
	userWords: [{
		word:String,
		id:Number
	}]
});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);






