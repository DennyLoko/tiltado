const mongoose = require("mongoose");
const databaseVariable = process.env["DATABASE_CONNECTION"];
module.exports = function () {
  var mongoURI = databaseVariable ? databaseVariable: "mongodb://localhost:27017/tiltado";
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection
    .on("error", function (err) {
      console.log(err.message);
    })
    .once("open", function () {
      console.log("mongodb connection open");
    });
  mongoose.Promise = require("bluebird");
};
