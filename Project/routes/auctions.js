const express = require('express');
const router = express.Router();
let Auction = require('../models/auction');

router.get('/create', (req, res) => {
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

router.post('/', (req, res) => {
  let skip = req.body.skip || 0;
  let limit = req.body.limit || 2;
  Auction.getAuctions(skip, limit, (err, collection) => {
    if (err) throw err;
    console.log("paginate/");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(collection));
  });
});

  router.get('/bidded', (req, res) => {
    res.render('viewBiddedAuctions');
});

  router.get('/created', (req, res) => {
    let id = req.user.id;
    Auction.getAuctionsByCreator(id, (err, collection) => {
      if (err) throw err;
      res.render('viewCreatedAuctions', {collection});
    });
});

  router.post('/create', (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let type = req.body.auctionType;
    let endTime = req.body.endtime;
    let creator = req.user.id;
    let isBuyNow = (type === 'buyNow');
    let price = req.body.price;

    console.log(title);
    console.log(description);
    console.log(type);
    console.log(endTime);
    console.log(creator);
    console.log(isBuyNow);
    console.log(price);

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
      console.log(newAuction);
      Auction.createAuction(newAuction, (err, auction) => {
        if (err) throw err;
        console.log(auction);
      });
      req.flash('success_msg', 'You successfully created new auction');
      res.redirect('/auctions/created');
    }

  });

  module.exports = router;