const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
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
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const eventSchema = new Schema({
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
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;