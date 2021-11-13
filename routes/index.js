var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var journeyModel = require('../models/journey')
var userModel = require('../models/user')
var bookingModel = require('../models/booking')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

// Remplissage de la base de donnée
router.get('/save', async function(req, res, next) {
  // How many journeys we want
  var count = 300
  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
      console.log('searchTrip',searchTrip)

  }
  res.render('index', { title: 'Express' });
}});

// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result',async  function(req, res, next) {
  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){
    journeyModel.find( ﻿
      { departure: city[i] } , //filtre
      function (err, journey) {
          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )
  }
  res.render('index', { title: 'Express' });
});


/* GET Login page. */
router.get('/', function(req, res, next) {
  if (req.session.user === undefined) {
    req.session.user;
  };
  req.session.message;
  res.render('login', {user: req.session.user, message: req.session.message});
});

/*  HOME PAGE */
router.get('/home', async function(req, res, next){
  if (req.session.user === undefined) {
    req.session.user;
  };
    res.render('index', {user:req.session.user} )
  }
);
/* POST SEARCH RESULTS */
router.post('/results', async function(req, res, next){
  var date = req.body.date;
  var utcDate = new Date(date);
  console.log(utcDate);
  /* FONCTION FORMATAGE NOM PROPRE */
  var formatName = function(name){
    return name.charAt(0).toUpperCase() + name.substring(1).toLowerCase()
  }
  var searchTrip = await journeyModel.find({
    departure: formatName(req.body.from),
    arrival : formatName(req.body.to),
    date : date
  });
  console.log(searchTrip)
  res.render('searchResults',{searchTrip, user: req.session.user})
});

/* BOOKING */
router.get('/booking', async function(req, res, next){
 if (req.session.myBookings === undefined) {
    req.session.myBookings = [];
  };
  let trip = await journeyModel.findById(req.query.ticket);
  req.session.myBookings.push(trip);
  let user = await userModel.findById(req.session.user);
  user.trips.push(trip);
  await user.save();
  let totalPrice = 0;
  for (let i=0 ; i < req.session.myBookings.length ; i++) {
    totalPrice += req.session.myBookings[i].price; trip.date
  }
  res.render('booking', {myBookings: req.session.myBookings, totalPrice,user: req.session.user});
});

/* BOOKING : DELETE TRIP */
router.get('/delete', async function(req, res, next){
  if (req.session.myBookings === undefined) {
    req.session.myBookings = [];
  };
  let trip = await journeyModel.findById(req.query.ticket);
  let deleteTrip = (tab) => {
    let filteredTab = [];
    for (let i = 0 ; i < tab.length ; i++) {
    if (tab[i]._id !== req.query.ticket) {
      filteredTab.push(tab);
      }
    }  
    tab = filteredTab;
    return tab;
  }
  req.session.myBookings = deleteTrip(req.session.myBookings);
  console.log("delete after filter", req.session.myBookings);
  let user = await userModel.findById(req.session.user);
  user.trips = req.session.myBookings;
  await user.save();
  let totalPrice = 0;
  for (let i=0 ; i < req.session.myBookings.length ; i++) {
    totalPrice += req.session.myBookings[i].price; trip.date
  }
  res.render('booking', {myBookings: req.session.myBookings, totalPrice,user: req.session.user});
});

/*  LAST TRIPS */
router.get('/last-trips', async function(req, res, next){
  let user = await userModel.findById(req.session.user).populate('trips');
  console.log("last trips> user", user);
  res.render('lastTrips',{myBookings: user.trips, user: req.session.user})
});

/*  SIGNUP */
router.post('/sign-up',async function(req, res, next) {
  var searchUser = await userModel.findOne({
    email: req.body.email
  });
  if(!searchUser){
    var newUser = new userModel({
      name: req.body.last_name,
      firstName:req.body.first_name,
      email: req.body.email,
      password: req.body.password,
    })
    await newUser.save();
    req.session.user = newUser._id;
    res.redirect('/home')
  } else {
    req.session.user = undefined;
    req.session.message = ' email address '+req.body.email+' is already linked to an account. Please log in.';
    res.render('login', { user: req.session.user, message: req.session.message });
  }
});

/*  SIGNIN */
router.post('/sign-in', async function(req,res,next){
  var searchUser = await userModel.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if(searchUser!= null){
    req.session.user = searchUser._id;
    console.log("sign in > req sess user", req.session.user);
    res.redirect('/home')
  } else {
    req.session.user = undefined;
    req.session.message = 'There is no account linked to this email and password.'
    res.render('login', { user: req.session.user, message: req.session.message })
  }
});


/*  LOGOUT*/
router.get('/log-out', function(req,res,next){
  req.session.myBookings = [];
  req.session.user = undefined;
  req.session.message = 'You are now logged out. See you soon for another trip !'
  res.redirect('/')
});


module.exports = router;
