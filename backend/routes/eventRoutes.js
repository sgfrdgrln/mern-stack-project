const express = require('express')
const router = express.Router()
const eventsController = require('../controllers/eventsController')
const verifyJWT = require('../middleware/verifyJWT')
const uploads = require('../middleware/upload')
const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middleware/verifyRoles')





router.route('/')
    .get(eventsController.getAllEvents)
    router.use(verifyJWT)
router.route('/')
    .post(verifyRoles(ROLES_LIST.Admin), uploads.single('thumbnail'), eventsController.createEvent) // Apply upload middleware only to the createEvent route
    .patch(verifyRoles(ROLES_LIST.Admin), uploads.single('thumbnail'), eventsController.updateEvent)
    .delete(verifyRoles(ROLES_LIST.Admin), eventsController.deleteEvent)

// router.route('/:id')
//     .get(usersController.getUser)
//     .delete(usersController.deleteUserById)
// router.patch('/:id', eventsController.updateEventById)
// router.get('/:id', eventsController.getEventById)

module.exports = router