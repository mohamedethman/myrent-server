const mongoose = require('mongoose');


const itemSchema = mongoose.Schema({
    name: String, 
    image: String,
    desc: String,
    nbrbed: Number,
    nbrbr: Number,
    images: String,
    telephone: String
})


exports.Item = mongoose.model('Item', itemSchema);