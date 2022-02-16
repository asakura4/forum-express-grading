const express = require('express')
const router = express.Router()
const upload = require('../../../middleware/multer')
const adminController = require('../../../controllers/apis/admin-controller')

router.get('/restaurants', adminController.getRestaurants)

module.exports = router
