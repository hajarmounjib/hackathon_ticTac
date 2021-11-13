var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: String,
    firstName: String,
    email: String,
    password: String,
    trips: [{type: mongoose.Schema.Types.ObjectId,ref:'journey'}]
  });
  
  var userModel = mongoose.model('users', userSchema);
  
  module.exports = userModel;