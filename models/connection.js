var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect('mongodb+srv://admin:admin@cluster0.jf5nw.mongodb.net/tic-et-tac?retryWrites=true&w=majority',
    options,
    function(err){
        console.log(err);
    }
)