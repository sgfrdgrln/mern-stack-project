const mongoose = require('mongoose')


// Define the event schema
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rtfContent: {
        type: mongoose.Schema.Types.Mixed, // Store as JSON or text
        required: true
    },
    thumbnail: {
        type: String, // Store the path to the image file
        required: true
    },
    eventDateCreated: {
        type: Date,
        default: Date.now  // Automatically set to the current date/time
    }
});

// Create the event model
const Event = mongoose.model('Event', eventSchema)

module.exports = Event;
