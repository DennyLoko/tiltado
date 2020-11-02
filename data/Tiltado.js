var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var model = new Schema(
  {
    name: String,
    //Timestamp
    lastTilt: Number,
    record: Number
  },
  {
    strict: false,
  }
);

module.exports = mongoose.model("Tiltados", model);