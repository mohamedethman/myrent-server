const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
    },

    image: {
        type: String,
        default: ''
    },

    nbrbed: {
        type: Number,
        default:0
    },
    nbrbr : {
        type: Number,
        default:0
    },

    space : {
        type: Number,
        default:0
    },
    images: [{
        type: String
    }],

    price: {
        type: Number
    },

   
    telephone: {
        type: String
    },
   
    desc: {
        type: String,
        required: true
    },
    
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    
    
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});


exports.Product = mongoose.model('Product', productSchema);
