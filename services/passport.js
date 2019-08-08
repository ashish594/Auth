const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, function (email, password, done) {

    User.findOne({ email: email}, function (err, user) {
        if(err) return done(err, false);

        if(!user) return done(null, false);

        // compare user.password with password if it's same then sign in
        // Note: we hashed the password while storing into database with bcrypt,
        // so we just can't compare with strings
        user.comparePasswords(password, function (err, isMatch) {
            if(err) return done(err, false);

            if(!isMatch) return done(null, false);

            return done(null, user);

        })

    })


});


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// creating a Jwt Strategy

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {

    User.findById(payload.sub, function (err, user) {

        if(err) { return done(err, false) }

        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }

    });
});

// tell passport to use this strategy

passport.use(jwtLogin);

passport.use(localLogin);
