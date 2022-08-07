const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const producerCommentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        ///called from token ?
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const producerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }, 
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    // contact info? phone num, email, external website info //
    comments: [producerCommentSchema]
}, {
    timestamps: true
});

const Producer = mongoose.model('Producer', producerSchema);

module.exports = Producer;