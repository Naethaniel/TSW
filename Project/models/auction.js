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
  }
});

let Auction = module.exports = mongoose.model('Auction', AuctionSchema);

module.exports.createAuction = (newAuction, callback) =>{
  newAuction.startTime = new Date();
  newAuction.save(callback);
};

module.exports.getAuctionsByCreator = (id, callback) => {
  let query = {creator: id};
  Auction.find(query,callback);
};