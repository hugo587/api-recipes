//configuração do mongoDb
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/basehosp',{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false });

mongoose.Promise = global.Promise;



module.exports = mongoose;