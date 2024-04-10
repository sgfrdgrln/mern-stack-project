const Event = require('../models/Event')
const asyncHandler = require('express-async-handler')
const fs = require('fs')
const imageProcessing = require('../utils/imageProcessing')
const path = require('path')

class EventController {
// CREATE
static createEvent = asyncHandler(async (req, res) => {
    try {
        // Process the image before creating the event
        await imageProcessing(req, res); // <-- Here's the addition

        // Get other fields from request body
        const { title, description, rtfContent } = req.body;

        // Check if event title is a duplicate
        const duplicate = await Event.findOne({ title }).lean().exec();
        if (duplicate) {
            // If a duplicate title is found, delete the uploaded file
            if (req.processedImage) {
                fs.unlinkSync(req.processedImage ? `uploads/${req.processedImage}` : null);
            }
            return res.status(400).json({ message: 'Duplicate title event' });
        }

        // Get uploaded file path (if any)
        const thumbnail = req.processedImage ? `uploads/${req.processedImage}` : null;

        // Create new event in database
        const event = new Event({
            title,
            description,
            rtfContent,
            thumbnail
        });
        await event.save();

        if (event) {
            res.status(201).json({ message: 'Event created successfully', event });
        } else {
            res.status(400).json({ message: 'Invalid event data received' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

 
// READ
static getAllEvents = asyncHandler(async (req, res) => {

    const events = await Event.find();

    if(!events?.length) {
        return res.status(400).json('No events found');
    }
    res.json(events);
});

// const createEvent = asyncHandler(async (req, res) => {

//     const {title, description, rtfContent, thumbnail} = req.body

//     if(!title || !description || !rtfContent || !thumbnail) {
//         return res.status(400).json('All fields required')
//     }
//     const duplicate = await Event.findOne({title}).lean().exec()

//     if(duplicate) {
//         return res.status(409).json('Duplicate title event')
//     }
//     const eventObject = {title, description, rtfContent, thumbnail}
//     const event = await Event.create(eventObject)

//     if(event) {
//         return res.status(201).json(`Event ${event.title} has been created`)
//     }
//     else {
//         return res.status(400).json('Invalid event data received')
//     }

// })

// UPDATE
static updateEvent = asyncHandler(async (req, res) => {
    const { id, title, description, rtfContent } = req.body;

    if (!id || !title || !description || !rtfContent) {
        return res.status(400).json({ message: 'All fields required' });
    }

    try {
        // Process the image before updating the event

        const duplicate = await Event.findOne({ title }).lean().exec();

        if (duplicate && duplicate._id.toString() !== id) {
            return res.status(409).json({ message: 'Duplicate title event' });
        }

        if (req.file) {
            await imageProcessing(req, res); // <-- Process the image if a new one is provided
        }

       

        const event = await Event.findById(id).exec();

        if (!event) {
            return res.status(404).json({ message: 'No event found' });
        }

        let thumbnailPath = event.thumbnail; // Default thumbnail path

        // Check if a new thumbnail is provided
        if (req.file) {
            fs.unlinkSync(thumbnailPath); // removes the old file
            thumbnailPath = req.processedImage ?  `uploads/${req.processedImage}` : null; // Access processed image filename from req object
        }

        // Update event fields
        event.title = title;
        event.description = description;
        event.rtfContent = rtfContent;
        event.thumbnail = thumbnailPath;

        const updatedEvent = await event.save();

        res.json({ message: `Event ${updatedEvent.title} updated` });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// DELETE
static deleteEvent = asyncHandler(async (req, res) => {

    const {id} = req.body;

    if(!id) {
        return res.status(400).json({message: 'Event ID required'});
    }

    const event = await Event.findById(id).exec()
    if(!event) {
        return res.status(400).json({message: 'No event found'});
    }

    const imagePath = path.join( './', event.thumbnail);
    try {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
    } catch (error) {
        console.error('Error deleting image file:', error);
    }

    await event.deleteOne();

    const reply = `Event ${event.title} with ID ${event._id} has been deleted`;
    res.json(reply);
});
// const updateEventById = asyncHandler(async (req, res) => {
//     const eventId = req.params.id;

//     const event = await Event.findById(eventId).exec()

//     if(!event) {
//         return res.status(400).json({message: 'No event found'})
//     }

//     const { title, description, rtfContent } = req.body;

//     if (!title || !description || !rtfContent) {
//         res.status(400).json({message: 'All fields required'})
//     }
//     const thumbnail = req.file; // Assuming multer middleware handles the file upload

//     try {
//         const event = await Event.findById(eventId).exec();

//         if (!event) {
//             return res.status(404).json({ message: 'Event not found' });
//         }

//         const duplicate = await Event.findOne({ title }).lean().exec();

//         if (duplicate && duplicate._id.toString() !== eventId) {
//             return res.status(409).json({ message: 'Duplicate title event' });
//         }

//         event.title = title;
//         event.description = description;
//         event.rtfContent = rtfContent;

//         // Update thumbnail only if a new one was provided
//         if (thumbnail) {
//             event.thumbnail = thumbnail.path; // Adjust this based on how multer saves the file
//         }

//         const updatedEvent = await event.save();

//         res.json({ message: `Event ${updatedEvent.title} updated` });
//     } catch (error) {
//         console.error('Error updating event:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });


// const getEventById = asyncHandler(async (req, res) => {
//     const eventId = req.params.id;

//     const event = await Event.findById(eventId).exec();

//     if (!event) {
//         return res.status(404).json({ message: 'Event not found' });
//     }

//     res.json(event);
// });
}


module.exports = EventController;