const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    url: {
        type: String,
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }
})


imageSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

imageSchema.set('toJSON', {
    virtuals: true,
});

exports.Image = mongoose.model('Image', imageSchema);