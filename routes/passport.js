
const express = require('express');
require('dotenv').config({ path: '../.env' });
const FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user.js');
const session=require('express-session')
passport=require('passport');

module.exports = function (app,passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({secret:'keyboard cat', resave:false,saveUninitialized:true,cookie:{secure:false}}));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id,function(err,user){
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({

        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL:process.env.CLIENTURL,
        profileFields:process.env.CLIENTPROFILEFIELDS
    
    }, function (accessToken, refreshToken, profile, done) {

        User.findOne({ id: profile.id }, function (err, user) {
            if (err) throw err;
            if (user){ return done(null, user);}
            else{
            var newUser = new UserFacebook()
                newUser.id= profile.id;
                newUser.name= profile.displayName;
                newUser.token=accessToken;
                newUser.city=profile.location;
            
            newUser.save(function (err) {
                
                if (err) throw err;

               return done(null,newUser); 
            });
        }
        });
    }));

    app.get('/auth/facebook',passport.authenticate('facebook'),function(req,res){
        console.log(prueba);
    });
    
    app.get('/auth/facebook/callback',passport.authenticate('facebook'
    ,{
        successRedirect:'/',
        failureRedirect:'/login'
    },function(err){
        console.log(err);
    }));

}