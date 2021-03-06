const mongoose = require('mongoose');

//auction schema
let AuctionSchema = mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String
  },
  isBuyNow: {
    type: Boolean
  },
  currentWinner: {
    type: String
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  creator: {
    type: String
  },
  price: {
    type: Number
  },
  isFinished: {
    type: Boolean
  }
});

let Auction = module.exports = mongoose.model('Auction', AuctionSchema);

module.exports.createAuction = (newAuction, callback) =>{
  newAuction.startTime = new Date();
  newAuction.isFinished = false;
  newAuction.currentWinner = '';
  newAuction.save(callback);
};

module.exports.getAuctionsByCreator = (id, callback) => {
  let query = {creator: id};
  Auction.find(query,callback);
};

module.exports.getAuctions = (skip, limit, callback) => {
  let query = Auction.find({isFinished: false}).limit(limit).skip(skip);
  query.exec(callback);
};

module.exports.getWonAuctions = (userName, callback) =>{
  let query = Auction.find({currentWinner: userName, isFinished: true});
  query.exec(callback);
};

module.exports.getById = (id, callback) => {
  let query = {_id: id};
  Auction.find(query, callback);
};

module.exports.buy = (auctionId, userName, callback) => {
  Auction.update({_id: auctionId, isFinished: false}, {$set: {isFinished: true, currentWinner: userName, endTime: new Date()}}, callback);
};

module.exports.bid = (auctionId, userName, amount, callback) => {
  Auction.update({_id: auctionId, isFinished: false}, {$set: {currentWinner: userName, price: amount}}, callback);
};

module.exports.endStandardAuction = (auctionId, callback) => {
  Auction.update({_id: auctionId}, {$set: {isFinished: true}}, callback);
};