
const express = require('express');
require('dotenv').config({ path: '../.env' });
passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user.js');
const session = require('express-session');
const jwt = require('jsonwebtoken');

module.exports = function (app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));

    passport.serializeUser(function (user, done) {
        token = jwt.sign({ username: user.name, email: user.email }, secret = process.env.SECRET, { expiresIn: '24h' });
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);

    });

    passport.use(new FacebookStrategy({

        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL: process.env.CLIENTURL,
        profileFields: ['id', 'displayName', 'email']

    }, function (accessToken, refreshToken, profile, done) {

        User.findOne({ id: profile.id }, function (err, user) {
            if (err) {
                console.log(err);
                done(err);
            }
            if (user && user !== null) {
                console.log(profile);
                return done(null, user);
            }
            else {
                var newUser = new User()

                newUser.id = profile.id;
                newUser.name = profile.displayName;
                newUser.email = profile.emails[0].value;
                newUser.save(function (err) {

                    if (err) {

                        return console.log(err);
                    }

                    return done(null, newUser);
                });
            }
        });
    }));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    app.get('/auth/facebook/callback', passport.authenticate('facebook'
        , {
            failureRedirect: '/login'
        }), function (req, res) {
            res.redirect('/facebook/' + token);
        });

}