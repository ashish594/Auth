const User = require('./../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

// token is required because user shouldn't get check for every request. So,
// once user authorized, with the token he/she gets access via this token set in session.
function tokenForUser(user) {
    const timeStamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret); // adding a secret to the userId and creating a token out of it
}

exports.signin = function(req, res, next) {
    return res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {

    const { email, password } = req.body;

    if(!email || !password) {
        res.status(422).send('request must contain a username and password');
    }



    User.findOne({ email: email }, function(err, existingUser) {

        // if something goes wrong like Connection
        if(err) {
            return next(err);
        }

        // If user already existing
        if(existingUser) {
            return res.status(422).send('Email already in use');
        }

        const user = new User({
            email: email,
            password: password
        });

        user.save(function (err) {
            if(err) {
                return next(err);
            }

            res.json({ token: tokenForUser(user) });
        }); // save the given credentials to DB

    })
};