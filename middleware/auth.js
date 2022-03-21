const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const models = require("../models/index");

module.exports = function(passport) {

    passport.use(
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, async(req, email, password, done) => {
            // Match user

            try {
                const user = await models.User.findOne({ where: { email: email } });

                if (!user) {
                    return done(null, false, req.flash("errors", `Invalid login credential`));
                }
                if (user) {
                    bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
                        if (err) {
                            console.log(err);
                            return done(null, false, req.flash("errors", "Invalid login credential"));
                        }
                        if (isMatch) {
                            return done(null, user, null);
                        } else {
                            return done(null, false, req.flash("errors", "Invalid login credential"));

                        }

                    });

                }


            } catch (error) {
                console.log(error);
                return done(null, false, { message: error });
            }
        })



    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        try {
            const user = await models.User.findOne({ where: { id: id } });

            if (!user) {
                res.redirect('/admin/login');
            } else {
                console.log(user);
                done(null, user);
            }

        } catch (error) {
            done(err, null);
        }

    });
};