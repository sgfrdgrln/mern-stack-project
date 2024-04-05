const express = require('express')
const router = express.Router()
const eventsController = require('../controllers/eventsController')
const verifyJWT = require('../middleware/verifyJWT')
const upload = require('../middleware/upload')

//router.use(verifyJWT)

router.get('/events/:id', (req, res) => {
    const id = req.params.id;
    res.sendFile(path.join(__dirname, '../views', 'updateEvent.html'));
});


router.route('/')
    .get(eventsController.getAllEvents)
    .post(upload.single('thumbnail'), eventsController.createEvent) // Apply upload middleware only to the createEvent route
    .patch(eventsController.updateEvent)
    .delete(eventsController.deleteEvent)

// router.route('/:id')
//     .get(usersController.getUser)
//     .delete(usersController.deleteUserById)
// router.patch('/:id', eventsController.updateEventById)
// router.get('/:id', eventsController.getEventById)

module.exports = router