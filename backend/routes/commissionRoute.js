const express = require('express')
const router = express.Router()
const excelController = require('../controllers/excelController')
const verifyJWT = require('../middleware/verifyJWT')
const uploads = require('../middleware/upload')
const ROLES_LIST = require('../config/roles_list')
const verifyRoles = require('../middleware/verifyRoles')
const imageProcessing = require('../utils/imageProcessing')

// router.use(verifyJWT)
router.route('/')
    .post(uploads.single('fileUpload'), excelController.addCommissionList);

    
module.exports = router;