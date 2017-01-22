var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
// var bcrypt = require('bcrypt');
var bcrypt = require('bcryptjs'); //because I can't install bcrypt
var SALT_WORK_FACTOR = 10;

// TODO: Fill out the userSchema.
// Hint: a user is an object such as
//     {'username': 'Isaac', 'favoriteFruit': 'apple'}
var userSchema = new Schema({
	userName: {type:String, required:true, unique:true},
	userPassword: {type:String, required:true},
	userEmail: {type:String, required:true},
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

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', userSchema);
module.exports = User;
/*
READ THIS TO UNDERSTAND WHAT IS GOING ON NEXT
http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
I need to install bcrypt, but "npm install --save bcrypt" does not work?
*
UserSchema.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('userPassword')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
*/








