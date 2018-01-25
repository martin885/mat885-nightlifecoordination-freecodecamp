const express = require('express');
const router = express.Router({ caseSensitive: true });
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const yelp = require('yelp-fusion');
const client = yelp.client(process.env.KEYYELP);
var User = require('../models/user.js');



var Bars = require('../models/bars.js');







router.put('/api/location/:name', function (req, res) {
    Bars.findOne({ name: req.params.name }, function (err, bar) {
        if (err) {
            return res.status(400).send(err);


        }
        if (!bar) {
            return res.status(404).send('No bar found with this name');
        }
        bar.users.push(req.body.user);
        bar.save(function (err, response) {
            if (err) {
                return res.status(400).send(err);
            }
            return res.status(201).send(response);
        });
    });
});



router.put('/api/location/leave/:name', function (req, res) {
    Bars.findOne({ name: req.params.name }, function (err, bar) {
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }
        if (!bar) {
            return res.status(404).send('No bar found with this name');
        }
        for (var i = 0; i < bar.users.length; i++) {
            if (bar, users[i].name === req.body.user.name) {
                bar.users.splice(bar.users[i], 1);
                bar.save(function (err, response) {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    return res.status(201).send(response);
                });
            }
            else {
                return res.status(404).send('No use removed from bar');
            }
        }
    });
});



router.get('/api/location/:city', function (req, res) {
    Bars.find({ city: req.params.city }, function (err, bars) {
        if (err) {
            return res.status(400).send(err);
        }
        if (bars.length === 0) {
            var bars = [];
            client.search({
                term: 'bars',
                location: req.params.city
            }).then(function (data) {
                for (var i = 0; i < data.jsonBody.businesses.length; i++) {
                    var bar = new Bars();
                    bar.name = data.jsonBody.businesses[i].name;
                    bar.image_url = data.jsonBody.businesses[i].image_url;
                    bar.city = req.params.city;
                    bar.save();
                }

                data.jsonBody.businesses.forEach(function (business) {
                    business.users = [];
                });

                return res.status(200).send(data);

            }).catch(e => {
                console.log(e);
                return res.status(400).send(err);
            });
        }
        else {



            console.log('bars for ' + req.params.city + bars);
            return res.status(200).send({
                businesses: bars
            })
        }
    });


});



module.exports = router;