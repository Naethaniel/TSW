const express = require('express');
const router = express.Router();
let Auction = require('../models/auction');

const ensureAuthenticated = (req, res, next) =>{
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/login');
  }
};

router.get('/create',ensureAuthenticated , (req, res) => {
  res.render('addAuction');
});

router.get('/', (req, res) => {
  let skip = 0;
  let limit = 2;
  Auction.getAuctions(skip, limit, (err, collection) => {
    if (err) throw err;
    res.render('viewAuctions', {collection});
  });
});

router.get('/paginate', (req, res) => {
  let skip = parseInt(req.query.skip) || 0;
  let limit = 2;
  let user = req.user;
  Auction.getAuctions(skip, limit, (err, collection) => {
    if (err) throw err;
    res.setHeader('Content-Type', 'application/json');
    if(user){
      res.send(JSON.stringify({collection, userName: user.username}));
    }else{
      res.send(JSON.stringify({collection, userName: null}));
    }
  });
});

router.post('/buy', ensureAuthenticated, (req, res) => {
  let user = res.locals.user;
  let auctionId = req.body.id;
  let userName = user.username;
  if (auctionId) {
    //create buyAuction in the auction model

    Auction.buy(auctionId, userName, (err, auction) => {
      if (err) throw err;
      if (auction.nModified !== 0) {
        res.sendStatus(200);
      } else {
        res.sendStatus(400);
      }

    });
  }
  else {
    res.sendStatus(400);
  }
});

router.post('/bid', ensureAuthenticated, (req, res) => {
  let user = res.locals.user;
  let auctionId = req.body.id;
  let ammount = parseInt(req.body.ammount);
  let userId = user._id;
  if (auctionId && ammount) {
    //create bidAuction in the auction model
    res.sendStatus(200);

  } else {
    res.sendStatus(400);
  }
});

  router.get('/won',ensureAuthenticated , (req, res) => {
    let username = req.user.username;
    Auction.getWonAuctions(username, (err, collection) => {
      if(err) throw err;
      res.render('viewWonAuctions', {collection});
    });

});

  router.get('/created',ensureAuthenticated , (req, res) => {
    let id = req.user.id;
    Auction.getAuctionsByCreator(id, (err, collection) => {
      if (err) throw err;
      res.render('viewCreatedAuctions', {collection});
    });
});

  router.post('/create',ensureAuthenticated , (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let type = req.body.auctionType;
    let endTime = req.body.endtime;
    let creator = req.user.id;
    let isBuyNow = (type === 'buyNow');
    let price = req.body.price;

    // console.log(title);
    // console.log(description);
    // console.log(type);
    // console.log(endTime);
    // console.log(creator);
    // console.log(isBuyNow);
    // console.log(price);

    //validation
    req.checkBody('title', 'Title must not be empty').notEmpty();
    req.checkBody('description', 'Description must not be empty').notEmpty();
    req.checkBody('endtime', 'You must set an end time for auction').notEmpty();
    req.checkBody('price', 'Price must not be empty').notEmpty();
    req.checkBody('price', 'Price must be a number').isNumeric();

    let errors = req.validationErrors();

    if (errors) {
      res.render('addAuction', {errors});
    } else {
      let newAuction = new Auction({
        title, description, isBuyNow, currentWinner: null, endTime, creator, price
      });
      Auction.createAuction(newAuction, (err, auction) => {
        if (err) throw err;
      });
      req.flash('success_msg', 'You successfully created new auction');
      res.redirect('/auctions/created');
    }
  });

  module.exports = router;