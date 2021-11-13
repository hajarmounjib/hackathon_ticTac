var mongoose = require('mongoose')

var bookingSchema = mongoose.Schema({
    tickets: {type: mongoose.Schema.Types.ObjectId,ref:'journeys'},
})

var bookingModel = mongoose.model('bookings', bookingSchema)

module.exports = bookingModel;



