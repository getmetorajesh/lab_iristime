'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');
const config = require('../config');

service.get('/service/:location', (req, res, next) => {
  console.log('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key=' + config.googleGeoApiKey);
  request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key=' + config.googleGeoApiKey, (err, response) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }

    const location = response.body.results[0].geometry.location;
    const timestamp = +moment().format('X');

    request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&key=' + config.googleTimeApiKey, (err, response) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      const result = response.body;

      const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

      res.json({ result: timeString });
    });
  });

});

module.exports = service;
