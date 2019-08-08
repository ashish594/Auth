const mongoose = require('mongoose');
const bcript = require('bcrypt-nodejs');
const Schema = mongoose.Schema;


// create a schema
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});


// create a hook to encrypt the password using bcript
userSchema.pre('save', function (next) {

    const user = this;

   bcript.genSalt(10, function (err, salt) {
       if(err) { return next(err); }

       // hash out password using salt
       bcript.hash(user.password, salt, null, function (err, hash) {
           if(err) { return next(err); }

           user.password = hash;
           next();
       })


   })
});


// comparing the passwords during sign in
userSchema.methods.comparePasswords = function(candidatePassword, callback) {
    bcript.compare(candidatePassword, this.password, function (err, isMatch) {
        if(err) { return callback(err); }

        return callback(null, isMatch);
    });
};

// create a model

const ModelClass = mongoose.model('user', userSchema);


// export Model

module.exports = ModelClass;